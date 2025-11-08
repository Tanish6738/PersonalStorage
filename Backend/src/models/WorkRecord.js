import mongoose from 'mongoose';

const workRecordSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [3, 'Description must be at least 3 characters long']
  },
  billAmount: {
    type: Number,
    required: [true, 'Bill amount is required'],
    min: [0, 'Bill amount must be a positive number']
  },
  imageUrls: {
    type: [String],
    required: [true, 'At least one image is required'],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  cloudinaryPublicIds: {
    type: [String],
    default: []
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
workRecordSchema.index({ createdAt: -1 });
workRecordSchema.index({ billAmount: 1 });
workRecordSchema.index({ title: 'text', description: 'text' }); // Text index for search

// Virtual for formatted date
workRecordSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Ensure virtuals are included in JSON output
workRecordSchema.set('toJSON', { virtuals: true });
workRecordSchema.set('toObject', { virtuals: true });

const WorkRecord = mongoose.model('WorkRecord', workRecordSchema);

export { WorkRecord };
