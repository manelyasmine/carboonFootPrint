import report from "../models/reportModel.js";
import emission from "../models/EmissionFactorModel.js";

const getEmissionFactor = async (req, res) => {
    try {
        const emissions = await emission.find({}, { Name: 1, Category: 1,Unit: 1, Source: 1,  Year: 1 }); // Select specific columns
        res.status(200).json(emissions);
      } catch (error) {
        console.error('Error fetching emissions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

export { getEmissionFactor };
