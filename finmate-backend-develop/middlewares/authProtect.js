const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      //* Setting token from Bearer token in header
      token = req.headers.authorization.split(" ")[1];
    }
    //* Checking token exists
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Not authorized to access this route" });
    }
    //* Verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      status: "FAILURE",
      error: [{ msg: "Invalid token" }],
    });
  }
};
