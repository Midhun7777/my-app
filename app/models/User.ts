import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: [true, 'Department ID is required'],
    unique: true,
  },
  departmentName: {
    type: String,
    required: [true, 'Department Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 