import notificationsettings from "../models/notificationSettignsModel.js";
import { createNotification } from "../controllers/notificationcontroller.js";
export const handleSendNotif = async (message, req , res) => {
  try {
    const settings = await notificationsettings.findOne({ user: req.user._id });
    if (settings) {
      if (settings.push_notification) {
        console.log("heere");
        await createNotification({
          body: { status: "SENT", message: message, user: req.user },
          res,
        });
      }
    }
  } catch (e) {
    console.log(e)
  }
};
