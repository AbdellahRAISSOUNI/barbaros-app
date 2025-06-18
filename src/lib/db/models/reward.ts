import mongoose, { Document, Schema } from 'mongoose';

export interface IReward extends Document {
  name: string;
  description: string;
  visitsRequired: number;
  isActive: boolean;
  applicableServices: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const RewardSchema = new Schema<IReward>(
  {
    name: {
      type: String,
      required: [true, 'Reward name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    visitsRequired: {
      type: Number,
      required: [true, 'Visits required is required'],
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableServices: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
RewardSchema.index({ visitsRequired: 1 });
RewardSchema.index({ isActive: 1 });

// Check if model already exists to prevent OverwriteModelError during hot reloads
const Reward = mongoose.models.Reward || mongoose.model<IReward>('Reward', RewardSchema);

export default Reward; 