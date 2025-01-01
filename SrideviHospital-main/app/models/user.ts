
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
