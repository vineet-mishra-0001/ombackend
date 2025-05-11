import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, required: true },
    siteUrl: { type: String, required: true },
    logo: { type: String },
    copyrightText: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    socialMedia: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String }
    },
    seoSettings: {
      metaTitle: { type: String, required: true },
      metaDescription: { type: String, required: true },
      keywords: { type: String }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema); 