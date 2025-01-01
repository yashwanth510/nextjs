import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  available: { type: Boolean, default: true }
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
