import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],

    // For device specific token generation
    /* tokens: [
      {
        token: {
          type: String,
          required: true,
        },
        deviceId: {
          type: String,
          required: true
        },
        deviceName: String,
        lastUsed: {
          type: Date,
          default: Date.now
        }
      },
    ], */

  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateToken = async function () {
  try {
    let userToken = jwt.sign({ _id: this._id }, JWT_SECRET);
    this.tokens = this.tokens.concat({ token: userToken });
    await this.save();
    return userToken;
  } catch (err) {
    // throw new Error(`Failed to generate token: ${err.message}`);
    throw new Error('Failed to generate token because:', { cause: err });
  }
};

// Modified User model method for device specific token generation
/* userSchema.methods.generateDeviceToken = async function(deviceId) {
  try {
    // Find existing token for this device
    let existingTokenIndex = this.tokens.findIndex(t => 
      t.deviceId && t.deviceId === deviceId //Optimize this part related to checking if the token object has device field
    );
    
    // Generate new token with device info
    let userToken = jwt.sign({ 
      _id: this._id,
      deviceId: deviceId 
    }, JWT_SECRET);
    
    if (existingTokenIndex >= 0) {
      // Update existing token for this device
      this.tokens[existingTokenIndex].token = userToken;
    } else {
      // Add new token with device info
      this.tokens.push({ 
        token: userToken,
        deviceId: deviceId,
        lastUsed: new Date()
      });
    }
    
    await this.save();
    return userToken;
  } catch (err) {
    throw new Error('Failed to generate token');
  }
}; */

export default mongoose.model("User", userSchema);
