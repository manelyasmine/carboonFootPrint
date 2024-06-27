import csvParser from "csv-parser";
import data from "../models/dataModel.js";

const uploadFile = (req, res) => {
  const results = [];

  csvParser()
    .on("data", (data) => results.push(data))
    .on("end", () => {
      data.insertMany(results, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error uploading file");
        } else {
          res.send("File uploaded successfully");
        }
      });
    });

  req.file.pipe(csvParser());
};
const isEmpty = (obj) => {
  return (
    Object.keys(obj).length === 0 || Object.values(obj).every((value) => !value)
  );
};
const uploadBatch = async (req, res) => {
  //console.log(req.body[0]);
  const dataInput = req.body;
  try {
    // Filter out empty objects
    let filteredData = dataInput.filter((item) => !isEmpty(item));
    filteredData = filteredData.map((item) => {
      item["source"] = "Bulk Upload";
      return item;
    });
    await data.insertMany(filteredData);
    return res.status(200).json({ message: "Data added successfully" });
  } catch (e) {
    return res.status(401).json({ error: "Invalid data" + e });
  }
};

const createData = async (req, res) => {
  try {
    const newData = new data(req.body);
    await newData.save();
    res.json(newData);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error => " + error });
  }
};
 
 

const getData = async (req, res) => {
  try {
    const { startFullDate, endFullDate, page, limit, search, column, operator, value  } = req.query;
    console.log("startFullDate, endFullDate",startFullDate, endFullDate)
    const searchFilter = {
      ...(search && {
        $or: [
          { location: { $regex: search, $options: 'i' } }, // Case-insensitive partial match for location
          { category: { $regex: search, $options: 'i' } }, // Case-insensitive partial match for category
        ],
      }),
      ...(startFullDate && endFullDate && {
        date: {
          $gte: startFullDate, // Handle YYYY format
          $lte: endFullDate, // Handle ISO 8601 format
        },
      }),
    };
    if (column && operator && value) {
      const validColumns = ['location', 'category', 'quantity','emission_tracker','source','name'];
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

    console.log("datacontroller searchfilter", searchFilter);

    const total = await data.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);
    const pageMin = Math.min(Math.max(page, 1), totalPages);
    const skip = (page - 1) * limit;

    const dataemission = await data.find(searchFilter, {}) // Use searchFilter here
     // .skip(skip) // Uncomment if pagination is needed
      //.limit(limit); // Uncomment if pagination is needed

    res.json({ dataemission, total, pageMin, totalPages });
  } catch (e) {
    return res.status(400).json({ error: "Internal Server Error" + e });
  }
};

 

 

function convertISODateToEpoch(isoDate) {
  // Handle potential ISO 8601 parsing errors
  try {
    return new Date(isoDate).getTime();
  } catch (error) {
    console.error("Error parsing ISO 8601 date:", error);
    // Handle the error appropriately, potentially returning a default value
    return 0; // Or another suitable default
  }
}
 

const updateData = async (req, res) => {
  console.log("req.params.id" + req.params.id);
  try {
    //Using findByIdAndUpdate simplifies the code by combining searching and updating into one operation.
    const updatedData = await data.findOneAndUpdate(
      { _id: req.params.id },
      req.body // The new: true option ensures you always get the latest version of the target in the response.
    );

    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    }
    return res.status(200).json({ message: "Data updated successfuly" });
    //res.json(updateData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteData = async (req, res) => {
  console.log("here");
  try {
    const myData = await data.findById(req.params.id);
    //console.log("my Data", myData);
    if (myData) {
      //deletion of target consiste of deleting all tasks related to this target and checking if target was created by admin
      await data.deleteOne({ _id: myData._id });
      res.json({ message: "Data deleted" });
    } else {
      res.status(404);
      throw new Error("Data not found  ");
    }
  } catch (e) {
    return res.status(404).json({ error: "Data not found" });
  }
};

function convertDateToEpoch(date) {
  // Handle potential errors and different date formats
  console.log("ccc",date)
  try {
    if (/^\d{4}$/.test(date)) { // Check for YYYY format
      console.log("new Date(date, 0, 1).getTime()",new Date(date, 0, 1))
      const dateFomrat = new Date(date, 0, 1); 
      const year = dateFomrat.getFullYear();
  const month = String(dateFomrat.getMonth() + 1).padStart(2, '0'); // Pad month with leading zero if needed
  const day = String(dateFomrat.getDate()).padStart(2, '0'); // Pad day with leading zero if needed
 
  return `${year}-${month}-${day}`;
    }   else {
      throw new Error("Invalid date format. Expected YYYY or YYYY-MM-DD.");
    }
  } catch (error) {
    console.error("Error converting date to epoch:", error);
    // Handle the error appropriately, potentially returning a default value
    return 0; // Or another suitable default
  }
}

 

 const generateRow = async (req, res) => {
  const rows = req.body;
  let i = 0;
  
  const result = await Promise.all(
    rows.map(async (row) => {
      const { date, category, location } = row;
      // console.log(parseInt(date));
       // Ensure date is a string to avoid potential errors
       let formattedDate = null;
       if (date !== null) {
         formattedDate =  convertDateToEpoch((date));
       }else{
        formattedDate=NULL
       }
       console.log('formattedDate',formattedDate,new Date(formattedDate))
      try {
        // console.log('here'+i )
        i++;
        //console.log(date)
        const emission = await data.findOne({
          source: { $ne: "Bulk Upload" },
          date:formattedDate,
          category: category,
          location: location,
        });
        if (emission) {
          return {
            ...row,
            emission_tracker: emission.emission_tracker,
            scope1: emission.scope1,
            scope2: emission.scope2,
            scope3: emission.scope3,
          };
        } else {
          return {
            ...row,
            emission_tracker: 0,
            scope1: 0,
            scope2: 0,
            scope3: 0,
          };
        }
      } catch (error) {
        console.log("errot" + error);
        // res.status(500).send("Server error");
      }
    })
  );
  // console.log( result)
  res.status(200).json({ message: "success", data: result });
};    

 

const formatYearToISO = (year) => {
  // Create a Date object for January 1st of the given year
  const date = new Date(Date.UTC(year, 0, 1, 0, 0, 2, 15)); // Month is 0-indexed in JS, so 0 is January

  // Convert the Date object to ISO string format
  const isoString = date.toISOString();

  return isoString;
};

export {
  uploadFile,
  uploadBatch,
  createData,
  updateData,
  deleteData,
  getData,
  generateRow,
};