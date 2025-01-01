import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';
import { sendNotification } from '../../../utils/notifications';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid appointment ID' });
  }

  try {
    await dbConnect();

    if (req.method === 'PUT') {
      const { status } = req.body;
      
      if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
      }

      const appointment = await Patient.findById(id);
      if (!appointment) {
        return res.status(404).json({ success: false, error: 'Appointment not found' });
      }

      const updatedAppointment = await Patient.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      ).populate('doctorId');

      if (status === 'accepted') {
        const notificationPromises = [
          sendNotification({
            to: updatedAppointment.email,
            subject: 'Appointment Accepted',
            text: `Your appointment has been accepted for ${new Date(updatedAppointment.appointmentDate).toLocaleString()}`
          }),
          sendNotification({
            to: updatedAppointment.doctorId.email,
            subject: 'New Patient Assigned',
            text: `You have a new patient appointment on ${new Date(updatedAppointment.appointmentDate).toLocaleString()}`
          })
        ];

        await Promise.all(notificationPromises);
      }

      res.status(200).json({ success: true, data: updatedAppointment });
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Appointment update error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}