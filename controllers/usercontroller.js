import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import user from "../models/userModel.js";

const createUser = async (req, res) => {
  const { username, firstname, lastname, phone, email, password } = req.body;
  if (!username || !email || !password) {
    throw new Error("please fill all the inputs ");
  }
  const userexist = await user.findOne({ email });
  if (userexist) res.status(400).send("user already exist");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newuser = new user({
    username,
    email,
    firstname,
    lastname,
    phone,
    password: hashedPassword,
  });
  try {
    await newuser.save();
    createToken(res, newuser._id);
    res.status(201).json({
      _id: newuser._id,
      username: newuser.username,
      firstname:newuser.firstname,
      lastname:newuser.lastname,
      email: newuser.email,
      isAdmin: newuser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("invalid user data");
  }
};

const loginUser = async (req, res) => {
  //console.log("login user", req, res);
  const { email, password } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      const passvalid = await bcrypt.compare(password, existingUser.password);
      if (passvalid) {
        createToken(res, existingUser._id);
        res.status(201).json({
          _id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          firstname: existingUser.firstname,
          lastname: existingUser.lastname,
          phone: existingUser.phone,
          isAdmin: existingUser.isAdmin,
        });
      } else {
        return res.status(401).json({ error: "Invalid email or password" });
      }
    }else{
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (e) {
    return res.status(401).json({ error: "Error Occured" });
  }
  

  //return res.status(401).json({ error: "Invalid email or password" });
};

const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "logout successfully" });
};

const getalluser = async (req, res) => {
  const users = await user.find({});
  res.json(users);
};

const getprofile = async (req, res) => {
  console.log(req);
  const myuser = await user.findById(req.user._id);
  if (myuser) {
    res.json({
      _id: myuser._id,
      username: myuser.username,
      email: myuser.email,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
};

const updateUser = async (req, res) => {
  const myuser = req.params.id
    ? await user.findById(req.params.id)
    : await user.findById(req.user._id);
  //const myuser = await user.findById(req.params.id);
  if (myuser) {
    myuser.username = req.body.username || myuser.username;
    myuser.email = req.body.email || myuser.email;
    myuser.firstname = req.body.firstname || myuser.firstname;
    myuser.lastname = req.body.lastname || myuser.lastname;
    myuser.phone = req.body.phone || myuser.phone;
    myuser.city = req.body.city || myuser.city;
    myuser.country = req.body.country || myuser.country;
    myuser.timezone = req.body.timezone || myuser.timezone;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      myuser.password = hashedPassword;
    }
    const updated = await myuser.save();
    res.json({
      _id: updated._id,
      username: updated.username,
      email: updated.email,
      firstname: updated.firstname,
      lastname: updated.lastname,
      phone: updated.phone,
      city: updated.city,
      country: updated.country,
      timezone: updated.timezone,
    });
  } else {
    res.status(404);
    throw new Error("user not found ");
  }
};

const deleteUser = async (req, res) => {
  const myuser = await user.findById(req.params.id);
  console.log("my user", myuser);
  if (myuser) {
    if (myuser.isAdmin) {
      res.status(400);
      throw new Error("cant delete admin");
    }
    await user.deleteOne({ _id: myuser._id });
    res.json({ message: "user deleted" });
  } else {
    res.status(404);
    throw new Error("user not found  ");
  }
};

const getuserById = async (req, res) => {
  const myuser = await user.findById(req.params.id).select("-password");
  if (myuser) {
    res.json(myuser);
  } else {
    res.status(404);
    throw new Error("user not found  ");
  }
};
const updateUserById = async (req, res) => {
  const myuser = await user.findById(req.params.id);
  if (myuser) {
    myuser.username = req.body.username || myuser.username;
    myuser.email = req.body.email || myuser.email;
    myuser.isAdmin = Boolean(req.body.isAdmin);
    const updateduser = await myuser.save();
    res.json({
      _id: updateduser._id,
      username: updateduser.username,
      email: updateduser.email,
    });
  } else {
    res.status(404);
    throw new Error("user not found  ");
  }
};
export {
  createUser,
  loginUser,
  logoutUser,
  getalluser,
  getprofile,
  updateUser,
  deleteUser,
  getuserById,
  updateUserById,
}; // Export as a named export
