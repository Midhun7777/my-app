import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  departmentName: {
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
  sectionName: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
departmentSchema.index({ departmentId: 1 });
departmentSchema.index({ email: 1 });

const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);

export default Department; 