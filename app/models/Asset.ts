import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: [true, 'Department ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Asset name is required'],
  },
  category: {
    type: String,
    required: [true, 'Asset category is required'],
    enum: ['furniture', 'electronics', 'office-supplies', 'other'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Asset || mongoose.model('Asset', AssetSchema); 