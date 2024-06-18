import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import user from "../models/userModel.js";

import { check, validationResult } from 'express-validator';
import createError from 'http-errors';
import multer from "multer"

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

/* const getalluser = async (req, res) => {
  const users = await user.find({});
  res.json(users);
}; */

const getalluser = async (req, res) => {
  try {
    // Fetch all users and populate the 'roles' field with role details
    const users = await user.find({}).populate('role');

    // Respond with the users including their role details
    res.json(users);
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ message: error.message });
  }
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

const updateUserStatus=async(req,res)=>{
  const myuser = req.params.id
  ? await user.findById(req.params.id)
  : await user.findById(req.user._id);
  //const myuser = await user.findById(req.params.id);
  if (myuser  ) {
    myuser.status =  myuser.status=="active" ?  myuser.status="desactive" :myuser.status="active"  
     
    
 
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
      status:updateUser.status,
    });
  } else {
    res.status(404);
    throw new Error("user not found ");
  }
  
}

const updateUser = async (req, res) => {
  console.log("updateUser")
  const myuser = req.body.id
    ? await user.findById(req.body.id)
    : await user.findById(req.body._id);
  //const myuser = await user.findById(req.params.id);
  if (myuser) {
    myuser.username = req.body.username || myuser.username;
    /* myuser.email = req.body.email || myuser.email;
    myuser.firstname = req.body.firstname || myuser.firstname;
    myuser.lastname = req.body.lastname || myuser.lastname;
    myuser.phone = req.body.phone || myuser.phone;
    myuser.city = req.body.city || myuser.city;
    myuser.country = req.body.country || myuser.country;
    myuser.timezone = req.body.timezone || myuser.timezone;
 */
    if (req.body.password) {
      const passvalid = await bcrypt.compare(req.body.currentpassword, myuser.password);
      if(passvalid){ 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        myuser.password = hashedPassword;
      }else{
        return res.status(401).json({ error: "Invalid password" });
      }
    }
    const updated = await myuser.save();
    res.json({
      _id: updated._id,
      username: updated.username,
     /*  email: updated.email,
      firstname: updated.firstname,
      lastname: updated.lastname,
      phone: updated.phone,
      city: updated.city,
      country: updated.country,
      timezone: updated.timezone, */
    });
  } else {
    res.status(404);
    throw new Error("user not found ");
  }
};

// Improved uploadImage function with proper error handling and user ID check
const uploadImage = async (req, res, next) => {
  try {
    const userId = req.body.id || req.params.userId; // Check for ID in body or params
console.log("req backend",req)
      if (req.is('json')) {
        console.log("if")
      } else if (req.is('multipart/form-data')) {
        const userId = req.headers['userid'];
        console.log("else",userId)
      
    if (!userId) {
      return res.status(400).json({ message: 'Missing user ID in request body or URL' });
    }

    const userUpdate = await user.findById(userId);
    if (!userUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }
    const storage = multer.diskStorage({
      destination: './uploads/', // Change this to your desired upload directory
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
    });

    const upload = multer({ storage: storage });

    // Handle image upload using Multer
    upload.single('imageCover')(req, async (err, uploadResult) => {
      if (err) {
        console.error('Error uploading image:', err);
        return next(err); // Propagate error to next middleware
      }

      // Image upload successful, proceed with processing
      const imageUrl = uploadResult.path; // Or use cloud storage service URL

      userUpdate.profileImage = imageUrl; // Update user's profile image URL
      await userUpdate.save();

      res.json({ message: 'Profile cover image uploaded successfully!' });
    });
  }
  } catch (error) {
    console.error('Backend error:', error);
    res.status(500).json({ message: 'Internal server error' }); // Generic error message for security
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
  console.log("updateUserById")
  const myuser = await user.findById(req.params.id);
  console.log("myuser",myuser)
  /* const {username,phone,roles}=req.body; */
/*   if (myuser) {
    myuser.username = data.username || myuser.username;
  
    myuser.status=username || myuser.status;
    myuser.phone=phone || myuser.phone;
    myuser.roles=roles || myuser.roles;
    

    const updateduser = await myuser.save();
    res.json({
      _id: updateduser._id,
      username: updateduser.username,
      //email: updateduser.email,
      isAdmin: updateduser.isAdmin,
      phone:updateduser.phone,
      status:updateduser.status,
      roles:updateduser.role,


    });
  } else {
    res.status(404);
    throw new Error("user not found  ");
  } */
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
  updateUserStatus,
  uploadImage,
}; // Export as a named export
