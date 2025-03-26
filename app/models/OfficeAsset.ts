import mongoose from 'mongoose';

const officeAssetSchema = new mongoose.Schema({
  assetId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  assetName: {
    type: String,
    required: true,
    trim: true,
  },
  assetType: {
    type: String,
    required: true,
    trim: true,
  },
  assignedTo: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'In Use', 'Under Maintenance', 'Retired'],
    default: 'Available',
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  lastMaintenance: {
    type: Date,
    default: null,
  },
  nextMaintenance: {
    type: Date,
    default: null,
  },
  condition: {
    type: String,
    required: true,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good',
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
officeAssetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const OfficeAsset = mongoose.models.OfficeAsset || mongoose.model('OfficeAsset', officeAssetSchema);

export default OfficeAsset; 