import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  symptoms: { type: String, required: true },
  status: { type: String, default: 'pending' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
});


export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);