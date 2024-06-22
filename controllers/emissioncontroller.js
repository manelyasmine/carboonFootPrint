import report from "../models/reportModel.js";
import emission from "../models/EmissionFactorModel.js";

const getEmissionFactor = async (req, res) => {
  console.log("get all getEmissionFactor");
  try {
    const { page , limit  , search } = req.query;

    console.log("get all getEmissionFactor===>", search);
    const searchFilter = search
      ? {
        $or: [
          { Name: search   }, // Case-insensitive partial match for Name
          { Category: search }, // Case-insensitive partial match for Category
          { Unit:   search }, // Case-insensitive partial match for Unit
          { Source: search }, // Case-insensitive partial match for Source
          { Year: search }, // Exact match for Year (assuming Year is a string)
        ]
      }
      : {};
    // Get the total count of matching documents (considering search)
    const total = await emission.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);

    // Ensure page stays within valid range
    const pageMin = Math.min(Math.max(page, 1), totalPages); // Clamp page between 1 and total pages

    const skip = (page - 1) * limit;

    const emissions = await emission.find(searchFilter, {
      ID:1,
      Name: 1,
      Category: 1,
      Unit: 1,
      Source: 1,
      Year: 1
    })
      .skip(skip)
      .limit(limit);
      console.log("emissions",emissions,pageMin,total,totalPages)
      res.json( { emissions:emissions, total:total, pageMin:pageMin, totalPages:totalPages}   );
     /*  res.json({ emissions, total, pageMin, totalPages }); */
  } catch (error) {
    console.error('Error fetching emissions:', error);
    let errorMessage = 'Internal Server Error';
    if (error.message.includes('validation')) {
      errorMessage = 'Invalid search term'; // Example for specific error handling
    }
  }
};


export { getEmissionFactor };
