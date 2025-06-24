import mongoose from 'mongoose';
const MONGODB_URI = "mongodb://localhost:27017/users";


const userSchema = new mongoose.Schema({
  email : String,
  basic: {
    profilePhoto: String,
    accessToReadPost: { type: Boolean, default: false },
    email: { type: String, required: true },
    name: { type: String, required: true }
  },
  personal: {
    phoneNumber: String,
    physicalAddress: String,
    mailingAddress: String,
    dateOfBirth: Date,
    gender: String
  },
  business: {
    businessName: String,
    businessEmail: String,
    businessPhoneNumber: String,
    numberOfEmployees: Number,
    dateOfFoundation: Date
  },
  permissions: {
    basic: [String],
    personal: [String], 
    business: [String]
  },
  digitalId: String
}, { 
  timestamps: true,
  collection: 'user_profiles' // This ensures it uses the users_info collection
});

export default mongoose.model('UserInfo', userSchema);