// middlewares/onlyadmin.middleware.js
import jwt from "jsonwebtoken";
import { handleError } from "../helpers/handleError.js";

export const onlyAdmin = (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token =
      req.cookies?.access_token ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return next(handleError(403, "Unauthorized. Token missing."));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check role
    if (decoded.role !== "admin") {
      return next(handleError(403, "Access denied. Admins only."));
    }

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
