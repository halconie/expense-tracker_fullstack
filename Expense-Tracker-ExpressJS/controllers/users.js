import User from "../models/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/* export const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      next(err);
    });
}; */

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/* export const getUser = (req, res, next) => {
  const mobile = req.params.mobile;
  const password = req.params.password;
  User.findOne({ mobile: mobile, password: password })
    .then((user) => {
      if (!user) {
        const error = new Error(
          "User not found (Why tf is this error being thrown?)"
        );
        error.status = 404;
        throw error;
      }
      const token = jwt.sign(
        {
          mobile: user.mobile,
          name: user.name,
        },
        "secret123"
      );
      res.json({ user, token });
    })
    .catch((err) => {
      next(err);
    });
}; */

export const getUser = async (req, res, next) => {
  try {
    const { email, password } = req.body; // Use body instead of params

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

export const profile = async (req, res, next) => {
  try {
    const userValidation = await User.findOne({ _id: req.userid });
    return res.json({ status: "success", userValidation });
  } catch (error) {
    return res.json({ status: "error", error: error });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch && email === user.email) {
          const token = await user.generateToken();
          return res.json({
            status: "success",
            message: "Login successful!",
            token: token,
            user,
          });
        } else {
          return res.json({ status: "failed", message: "Incorrect password" });
        }
      } else {
        return res.json({
          status: "failed",
          message: "Incorrect credentials!",
        });
      }
    } else {
      return res.json({ status: "failed", message: "All fields are required" });
    }
  } catch (err) {
    return res.status(500).json({ status: "failed", message: "Server error", error: err.message });
  }
};

// Modified loginUser function for device specific token generation
/* export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const deviceId = req.headers['device-id'] || req.body.deviceId;  // Device identifier
    
    if (email && password) {
      const user = await User.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch && email === user.email) {
          // Check if token for this device already exists
          const token = await user.generateDeviceToken(deviceId);
          return res.json({
            status: "success",
            message: "Login successful!",
            token: token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email
            }
          });
        } else {
          return res.json({ status: "failed", message: "Incorrect password" });
        }
      } else {
        return res.json({ status: "failed", message: "Incorrect credentials!" });
      }
    } else {
      return res.json({ status: "failed", message: "All fields are required" });
    }
  } catch (err) {
    return res.status(500).json({ 
      status: "failed", 
      message: "Server error", 
      error: err.message 
    });
  }
}; */

export const registerUser = async (req, res, next) => {
  const { name, mobile, email, password, confirmPassword } = req.body;
  console.log(email);
  const user = await User.findOne({ email: email });
  console.log(mobile);
  if (user) {
    return res.json({ status: "failed", message: "User already exists" });
  } else {
    if (name !== "" && mobile !== "" && email !== "" && password !== "") {
      if (password !== confirmPassword) {
        return res.json({
          status: "failed",
          message: "Passwords do not match",
        });
      } else {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          const newUser = new User({
            name,
            mobile,
            email,
            password: hashPassword,
          });
          await newUser
            .save()
            .then((user) => {
              const token = jwt.sign({ userID: user._id }, JWT_SECRET, {
                expiresIn: "15m",
              });
              return res.json({
                status: "success",
                message: "User registered",
                token: token,
              });
            })
            .catch((err) => {
              console.log(err);
              return res.json({ status: "failed", message: err.message });
            });
        } catch (error) {
          console.log(error);
          res.json({ status: "failed", message: "Unable to register" });
        }
      }
    } else {
      return res.json({
        status: "failed",
        message: "All fields are mandatory!",
      });
    }
  }
};

export const updateUser = (req, res, next) => {
  const userId = req.params.id;
  User.findByIdAndUpdate(userId, req.body, { new: true })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
};

export const deleteUser = (req, res, next) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
      res.json("User deleted");
    })
    .catch((err) => {
      next(err);
    });
};
