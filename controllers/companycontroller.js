import company from "../models/companyModel.js";

const createCompany = async (req, res) => {
  try {
    const { name, email, website, logo } = req.body;
    if (!name) {
      res.json({ error: "name is required" });
    }
    const existingT = await company.findOne({ name });
    if (existingT) {
      return res.json({ error: "already exist" });
    }

    const mycompany = await new company({
      name,
      email,
      website,
      logo,
    }).save();

    res.json(mycompany);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

export { createCompany };
