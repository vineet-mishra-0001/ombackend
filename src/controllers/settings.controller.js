import settingsModel from '../models/settings.model.js';
import fs from 'fs';
import path from 'path';

// Get settings
export const getSettings = async (req, res) => {
  try {
    const settings = await settingsModel.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const {
      siteName,
      siteUrl,
      copyrightText,
      logo,
      email,
      phone,
      address,
      socialMedia,
      seoSettings
    } = req.body;

    let settings = await settingsModel.findOne();
    
    if (!settings) {
      // Create new settings if none exist
      settings = new settingsModel({
        siteName,
        siteUrl,
        copyrightText,
        email,
        phone,
        address,
        logo,
        socialMedia,
        seoSettings
      });
    } else {
      // Update existing settings
      settings.siteName = siteName;
      settings.siteUrl = siteUrl;
      settings.copyrightText = copyrightText;
      settings.email = email;
      settings.phone = phone;
      settings.address = address;
      settings.logo = logo;
      settings.socialMedia = socialMedia;
      settings.seoSettings = seoSettings;
    }

    const updatedSettings = await settings.save();
    res.status(200).json(updatedSettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload logo
export const uploadLogo = async (req, res) => {
  try {
    const { logo } = req.body;
    if (!logo) {
      return res.status(400).json({ message: 'No logo provided' });
    }

    let settings = await settingsModel.findOne();
    
    if (!settings) {
      settings = new settingsModel({ logo });
    } else {
      // Delete old logo if exists
      if (settings.logo) {
        const oldLogoPath = path.join(process.cwd(), 'uploads', path.basename(settings.logo));
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      settings.logo = logo;
    }

    const updatedSettings = await settings.save();
    res.status(200).json({ url: updatedSettings.logo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 