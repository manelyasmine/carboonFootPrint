import notification from "../models/notificationModel.js";
import { io } from "../index.js";
import user from "../models/userModel.js";
import notificationsettings from "../models/notificationSettignsModel.js";

export const createNotificationSettings = async (req, res) => {
  try {
    const currentUser = await user.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const newSettings = new notificationsettings({
      ...req.body,
      user: currentUser,
    });
    const savedSettings = await newSettings.save();
    res.status(201).json(savedSettings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ ALL
export const getAllNotificationSettings = async (req, res) => {
  try {
    const settings = await notificationsettings.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ONE
export const getOneNotificationSettings = async (req, res) => {
  console.log('why is it here')
  try {
    const settings = await notificationsettings.findById(req.params.id);
    if (!settings) return res.status(404).json({ error: "Settings not found" });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOneByUserNotificationSettings = async (req, res) => {
  try {
    console.log('jere')
    const currentUser = await user.findById(req.user._id);
    const settings = await notificationsettings.find({ user: req.user._id });
    if (!settings) return res.status(404).json({ error: "Settings not found" });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// UPDATE
export const updateNotificationSettings = async (req, res) => {
  try {
    const updatedSettings = await notificationsettings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSettings)
      return res.status(404).json({ error: "Settings not found" });
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
export const deleteNotificationSettings = async (req, res) => {
  try {
    const deletedSettings = await notificationsettings.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSettings)
      return res.status(404).json({ message: "Settings not found" });
    res.json({ message: "Settings deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
