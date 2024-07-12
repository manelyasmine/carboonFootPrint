import report from "../models/reportModel.js";
import user from "../models/userModel.js";

const createReport = async (req, res) => {
  const filePath = req.file.path;
  console.log(filePath);

  try {
    const newReport = new report({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      createdBy: req.body.createdBy,
      createdAt: new Date(),
      status: req.body.status || "failed",
      downloadURL: filePath,
    });

    const savedReport = await newReport.save();

    // Assuming "pdfData" field in the request body contains the base64 encoded PDF data
    if (req.body.pdfData) {
      const pdfBuffer = Buffer.from(req.body.pdfData, "base64");
      const pdfPath = "/path/to/store/pdfs/" + savedReport._id + ".pdf";

      // Save the PDF to the file system (replace with your storage logic)
      await fs.promises.writeFile(pdfPath, pdfBuffer);

      // Update report with a flag indicating PDF is available, not a download URL
      savedReport.hasPdf = true;
      await savedReport.save();
    }

    res.status(201).json(savedReport); // Report created successfully
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating report" }); // More specific error message later
  }
};

/* const getReports = async (req, res) => {
  console.log("calling getReports");

  try {
    const reportRoles = await report.find({});
    console.log("repo", reportRoles);
    res.json(reportRoles);
  } catch (e) {
    return res.status(400).json({ error: "Internal Server Error" });
  }
}; */
/* const getReports = async (req, res) => {
  console.log("calling getReports");

  try { 
    const reportRoles = await report.find({}).populate('createdBy', { profileImage: 1 });

    res.json(reportRoles);
  } catch (e) {
    return res.status(400).json({ error: "Internal Server Error" });
  }
};
 */

const getReports = async (req, res) => {
  try {
    const { start, end, page = 1, limit = 8, search, column, operator, value } = req.query;

    const searchFilter = {};
    
    if (search) {
      searchFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    if (start && end) {
      searchFilter.startDate = { $gte: new Date(start).toISOString().split('T')[0] };
      searchFilter.endDate = { $lte: new Date(end).toISOString().split('T')[0] };
    }

    if (column && operator && value) {
      if (column !== 'createdBy') {
        const validColumns = ['name', 'status'];
        if (!validColumns.includes(column)) {
          return res.status(400).json({ error: `Invalid column name: ${column}` });
        }

        const validOperators = ['equals', 'startsWith', 'endsWith', 'contains', 'greaterThan', 'lessThan'];
        if (!validOperators.includes(operator)) {
          return res.status(400).json({ error: `Invalid operator: ${operator}` });
        }

        let filterExpression;
        switch (operator) {
          case 'equals':
            filterExpression = { [column]: value };
            break;
          case 'startsWith':
            filterExpression = { [column]: { $regex: new RegExp(`^${value}`, "i") } };
            break;
          case 'endsWith':
            filterExpression = { [column]: { $regex: new RegExp(`${value}$`, "i") } };
            break;
          case 'contains':
            filterExpression = { [column]: { $regex: new RegExp(value, "i") } };
            break;
          case 'greaterThan':
            filterExpression = { [column]: { $gt: value } };
            break;
          case 'lessThan':
            filterExpression = { [column]: { $lt: value } };
            break;
          default:
            // Handle unsupported operators (if applicable)
            break;
        }

        searchFilter.$and = searchFilter.$and || [];
        searchFilter.$and.push(filterExpression);
      } 
    }

    // Count total matching documents
    const total = await report.countDocuments(searchFilter);

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);
    const pageMin = Math.min(Math.max(page, 1), totalPages);
    const skip = (pageMin - 1) * limit;

    // Query with population
    let reportQuery = report.find(searchFilter, {})
                            .populate({
                              path: 'createdBy',
                              select: 'profileImage username',
                            });

    // Apply pagination
    if (skip >= 0) {
      reportQuery = reportQuery.skip(skip).limit(limit);
    }

    // Execute query
    const reportRoles = await reportQuery;

    // Post-filtering based on createdBy.username
    if (column === 'createdBy' && operator && value) {
      console.log("post filetering",operator,value,reportRoles)
      const filteredReports = reportRoles.filter(report => {
        console.log("report",report)
        const username = report.createdBy && report.createdBy.username;
        console.log("username",username)
        if (!username) return false;

        switch (operator) {
          case 'equals':
            return username.toLowerCase() === value.toLowerCase();
          case 'startsWith':
            return username.toLowerCase().startsWith(value.toLowerCase());
          case 'endsWith':
            return username.toLowerCase().endsWith(value.toLowerCase());
          case 'contains':
            return username.toLowerCase().includes(value.toLowerCase());
          default:
            return true;
        }
      });

      res.json({ reportRoles: filteredReports, total, pageMin, totalPages });
    } else {
      res.json({ reportRoles, total, pageMin, totalPages });
    }
  } catch (e) {
    console.error("Error fetching reports:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const uploadImage = async (req, res, next) => {
  try {
    const reportId = req.params.id; // Check for ID in body or params

    if (!reportId) {
      return res
        .status(400)
        .json({ message: "Missing reportId ID in request" });
    }
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "report not found" });
    }

    if (req.is("multipart/form-data")) {
      saveImage(req, report, next);
      await handleSendNotif("uploaded new image for the report", req, res);
      res.status(200).json({ message: "Image Uploaded" });
    }
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ message: "Internal server error" }); // Generic error message for security
  }
};

const saveImage = async (req, report, next) => {
  let imageName = "report" + "-" + Date.now();
  const storage = multer.diskStorage({
    destination: process.env.IMAGES_PATH, // Change this to your desired upload directory
    filename: function (req, file, cb) {
      imageName += path.extname(file.originalname);
      report.downloadUrl = process.env.IMAGES_PATH + imageName;
      cb(null, imageName);
    },
  });

  const upload = multer({ storage: storage });
  // Handle image upload using Multer
  upload.single("image")(req, next, async () => {});
  await report.save();

  return { success: true, result: { message: "Image Added successfuly " } };
};

/* const createReport = async (req, res) => {
  console.log("reposrtt",req)
  try {
    const newReport = new report({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate:req.body.endDate,
      createdBy: req.body.createdBy,
      createdAt:new Date(),
      status:req.body.status || 'failed',
      
    });
    console.log("newReport",newReport)
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
}; */

const deleteReport = async (req, res) => {
  const roleId = req.params.id;
  console.log("report delete", roleId);
  try {
    const deletedRole = await report.deleteOne({ _id: roleId });

    res.json({ message: "report deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting role", error: error });
  }
};

export { createReport, uploadImage, getReports, deleteReport };
