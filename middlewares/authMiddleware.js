import jwt from "jsonwebtoken";
import user from "../models/userModel.js";
import Role from "../models/roleModel.js";

/**
 * @DESC Verify JWT from authorization header Middleware
 */
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




/**
 * @DESC Check Role Middleware
 */
const checkRole = (roles) => async (req, res, next) => {
  let { email } = req.body;

  //retrieve employee info from DB
  const employee = await user.findOne({ email });
  !roles.includes(employee.role)
    ? res.status(401).json("Sorry you do not have access to this route")
    : next();
};


/**
 * 
 * @DESC check permissions middleware
 */

const checkPermissions = (permissions) => { 
  return async(req, res, next) => {
    try { 
    const user = req.user;  
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const permission_user = await Role.findById(user.role);
    const hasPermission = permissions.every(permission => permission_user.permissions.includes(permission));
    console.log("hasPermission",hasPermission)
    if (!hasPermission || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }
   

    next();
  } catch (error) {
    console.error('Error checking permissions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  };
};





export { authenticate, authorizedAsAdmin,checkPermissions };
