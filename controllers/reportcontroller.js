import report from "../models/reportModel.js";
import user from "../models/userModel.js";

const createReport = async (req, res) => {
  try {
    const newReport = new report({
      name: req.body.name,
      period: req.body.period,
      createdBy: req.body.createdBy,
      createdAt:new Date(),
      status:req.body.status,
      
    });

    const savedReport = await newReport.save();

    // Logic to generate and store the PDF file (replace with your implementation)
    const pdfPath = "/public/report/" + savedReport._id + ".pdf";

    savedReport.downloadURL = pdfPath;
    await savedReport.save(); // Update report with download URL

    res.status(201).json(savedReport); // Report created successfully
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating report" });
  }
};

export { createReport };
