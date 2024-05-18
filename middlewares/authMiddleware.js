import jwt from "jsonwebtoken";
import user from "../models/userModel.js";
const authenticate = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await user.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("not authorized , token faled");
    }
  } else {
    res.status(401);
    throw new Error("not authorized , no token ");
  }
};

const authorizedAsAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("not authorized as admin");
  }
};

export { authenticate, authorizedAsAdmin };
