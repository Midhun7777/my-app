import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Create indexes
adminSchema.index({ adminId: 1 });
adminSchema.index({ email: 1 });

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin; 