// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { handleError } from "../helpers/handleError.js";

export const authenticate = (req, res, next) => {
  try {
    
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.access_token;

     console.log("🔎 Incoming Authorization:", req.headers["authorization"]);
  console.log("🔑 Extracted token:", token);


    if (!token) {
      return next(handleError(403, "Unauthorized. Token missing."));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(handleError(401, "Token has expired. Please login again."));
    }
    if (error.name === "JsonWebTokenError") {
      return next(handleError(401, "Invalid token. Unauthorized."));
    }
    next(handleError(500, error.message));
  }
};
