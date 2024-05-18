import report from "../models/reportModel.js";
import user from "../models/userModel.js";

const createReport = async (req, res) => {
  try {
    const { name } = req.body;
    const myuser = await user.findById(req.user._id);

    const myreport = await new report({
      name,
      createdBy: myuser._id,
    }).save();

    res.json(myreport);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export { createReport };
