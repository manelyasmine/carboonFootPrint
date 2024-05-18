import target from "../models/targetModel.js";

const createTarget = async (req, res) => {
  try {
    const { name, type,emissionReduction,baseYear,targetYear } = req.body;
    if (!name) {
     // res.json({ error: "name is required" });
     return res.status(400).json({ error: "Name is required" }); // 400 for Bad Request

    }
    const existingT = await target.findOne({ name });
    if (existingT) {
      return res.status(409).json({ error: "Target with this name already exists" }); //409 for existing resource
      
    }
    if (baseYear >= targetYear) {
      return res.status(400).json({ error: "Base year must be less than target year" });
    }


    const newTarget = new target({
      name,
      type,
      emissionReduction,
      baseYear,
      targetYear
    });

    await newTarget.save();
    res.json(newTarget);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({ error: validationErrors });
    } else {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const updateTarget = async (req, res) => {
  try {
    const { name, emissionReduction, type, baseYear, targetYear } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
//Using findByIdAndUpdate simplifies the code by combining searching and updating into one operation.
    const updatedTarget = await target.findOneAndUpdate(
      { name },
      {
        emissionReduction: emissionReduction,
        type:type,
        baseYear:baseYear,
        targetYear:targetYear,
        updatedAt:new Date(),
      },
      { new: true } // The new: true option ensures you always get the latest version of the target in the response.
    );

    if (!updatedTarget) {
      return res.status(404).json({ error: "Target not found" });
    }

    res.json({
      _id: updatedTarget._id,
      type: updatedTarget.type,
      emissionReduction:emissionReduction,
      baseYear: updatedTarget.baseYear,
      targetYear: updatedTarget.targetYear,
      updatedAt:updatedTarget.updatedAt,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTarget = async (req, res) => {
  const myTarget = await target.findById(req.params.id);
  console.log("my myTarget",myTarget)
  if (myTarget) {
    //deletion of target consiste of deleting all tasks related to this target and checking if target was created by admin
    await target.deleteOne({ _id: myTarget._id });
    res.json({ message: "Target deleted" });
  } else {
    res.status(404);
    throw new Error("Target not found  ");
  }
};
///tasks/:id
const detailsTarget=async (req,res)=>{

}
export { createTarget, updateTarget,deleteTarget,detailsTarget };
