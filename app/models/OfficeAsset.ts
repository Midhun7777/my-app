import mongoose from 'mongoose';

const officeAssetSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['system', 'table', 'chair', 'employee']
  },
  assetNumber: {
    type: String,
    required: true,
    unique: true
  },
  model: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  certificateUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'in-use', 'maintenance', 'retired'],
    default: 'available'
  },
  location: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  lastMaintenance: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
officeAssetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const OfficeAsset = mongoose.models.OfficeAsset || mongoose.model('OfficeAsset', officeAssetSchema);

export default OfficeAsset; 