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
    const dataRes = await data.find({});
    res.json(dataRes);
  } catch (e) {
    return res.status(400).json({ error: "Internal Server Error" });
  }
};

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

const generateRow = async (req, res) => {
  const rows = req.body;
  let i = 0;
  const result = await Promise.all(
    rows.map(async (row) => {
      const { date, category, location } = row;
      // console.log(parseInt(date));
      try {
        // console.log('here'+i )
        i++;
        console.log(date)
        const emission = await data.findOne({
          source: { $ne: "Bulk Upload" },
          date:date,
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
