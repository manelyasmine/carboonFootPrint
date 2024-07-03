import mongoose from "mongoose";

const NotificationSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Replace with your User model reference
  },
  email_notification: {
    type: Boolean,
    required: true,
    default:false
  },
  push_notification: {
    type: Boolean,
    required: true,
    default:false
  },
  target_progress:{
    type: Boolean,
    required: true,
    default:false
  },
  reduction_tips:{
    type: Boolean,
    required: true,
    default:false
  },
  high_emission_activity:{
    type: Boolean,
    required: true,
    default:false
  },
  reach_target:{
    type: Boolean,
    required: true,
    default:false
  },
  sms_notification:{
    type: Boolean,
    required: true,
    default:false
  },
  push_rem:{
    type: Boolean,
    required: true,
    default:false
  },
  email_rem:{
    type: Boolean,
    required: true,
    default:false
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  }
});

const notificationsettings = mongoose.model("notificationsettings", NotificationSettingsSchema);

export default notificationsettings;
