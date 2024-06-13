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
      item['source'] = 'Bulk Upload';
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
    return res.status(500).json({ error: "Internal Server Error => " + e });
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
  try {
    //Using findByIdAndUpdate simplifies the code by combining searching and updating into one operation.
    const updatedData = await data.findOneAndUpdate(
      { id: req.params.id },
      req.body // The new: true option ensures you always get the latest version of the target in the response.
    );

    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json(updateData);
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
// ///tasks/:id
// const detailsTarget = async (req, res) => {};

export { uploadFile, uploadBatch, createData, updateData, deleteData, getData };
