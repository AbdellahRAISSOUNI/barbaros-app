import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IClient extends Document {
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  dateCreated: Date;
  lastLogin?: Date;
  visitCount: number;
  rewardsEarned: number;
  rewardsRedeemed: number;
  accountActive: boolean;
  preferredServices: string[];
  qrCodeId?: string;
  qrCodeUrl?: string;
  lastVisit?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  fullName: string; // Virtual property
}

interface IClientModel extends Model<IClient> {
  findByEmail(email: string): Promise<IClient | null>;
}

const ClientSchema = new Schema<IClient>({
  clientId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  passwordHash: { type: String, required: true },
  dateCreated: { type: Date, required: true, default: Date.now },
  lastLogin: { type: Date },
  visitCount: { type: Number, default: 0 },
  rewardsEarned: { type: Number, default: 0 },
  rewardsRedeemed: { type: Number, default: 0 },
  accountActive: { type: Boolean, default: true },
  preferredServices: [{ type: String }],
  qrCodeId: { type: String },
  qrCodeUrl: { type: String },
  lastVisit: { type: Date }
});

// Virtual for client's full name
ClientSchema.virtual('fullName').get(function(this: IClient) {
  return `${this.firstName} ${this.lastName}`;
});

// Method to compare password
ClientSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  } catch (error) {
    return false;
  }
};

// Static method to find client by email
ClientSchema.statics.findByEmail = async function(email: string): Promise<IClient | null> {
  return this.findOne({ email });
};

// Check if the model exists before creating it
const Client = mongoose.models.Client as IClientModel || mongoose.model<IClient, IClientModel>('Client', ClientSchema);

export default Client; 