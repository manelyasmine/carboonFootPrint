import csvParser from "csv-parser";
import data from "../models/dataModel.js";
import task from "../models/tasksModel.js";
import target from "../models/targetModel.js";

 
 
 

const searchAll = async (req, res) => {
    const { query, fields } = req.query; // Get search query and optional fields to search
  
    try {
      // Create empty results object
      const results = { targets: [], tasks: [], data: [] };
  
      // Search across models with text score (optional field filtering)
      const targetResults = await target.find({
        $text: { $search: query, $caseSensitive: false }, // Text search with case-insensitivity
      }, fields ? { projection: fields } : undefined)
        .sort({ score: { $meta: "textScore" } }) // Sort by relevance (text score)
        .catch(error => []);
    const taskResults = await task.find({
                $text: { $search: query, $caseSensitive: false }, // Text search with case-insensitivity
              }, fields ? { projection: fields } : undefined)
                .sort({ score: { $meta: "textScore" } }) // Sort by relevance (text score)
                .catch(error => []);
      console.log("taskResults",query,taskResults)
 



      const dataResults = await data.find({
        $text: { $search: query, $caseSensitive: false }, // Text search with case-insensitivity
      }, fields ? { projection: fields } : undefined)
        .sort({ score: { $meta: "textScore" } }) // Sort by relevance (text score)
        .catch(error => []);
  
      results.targets = targetResults;
      results.tasks = taskResults;
      results.data = dataResults;
  
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
}
  
 

export {
    searchAll
};