import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    // Block Login if Not Verified
    if (!user.isVerified) {
      return res.json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    } else {
      const token = createToken(user._id);
      res.json({ success: true, token });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exist or not (through email)
    const exist = await User.findOne({ email });
    if (exist) {
      if (!exist.isVerified) {
        // Resend OTP if user is not verified
        const otp = generateOTP();
        exist.otp = otp;
        exist.otpExpire = Date.now() + 5 * 60 * 1000;
        
        // Re-hash password if they changed it during re-registration
        const salt = await bcrypt.genSalt(10);
        exist.password = await bcrypt.hash(password, salt);
        exist.name = name;
        
        await exist.save();
        await sendEmail(email, "Verify Your Email", `Your OTP is: ${otp}`);
        
        return res.json({
          success: true,
          message: "OTP sent to your email",
        });
      }

      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // validating email format and strong password
    if (!email || !validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (!password || password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    // hasing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();

    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      otp,
      otpExpire: Date.now() + 5 * 60 * 1000, // 5 min
    });

    const user = await newUser.save();

    await sendEmail(email, "Verify Your Email", `Your OTP is: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent to your email",
    });

    // removed token generation since it should happen after verification
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// vertify otp api
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      message: "Email verified successfully",
      token
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // expiresIn always required object not string
      const token = jwt.sign({ email, password }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });
      res.json({ success: true, token });
    } else {
      res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, verifyOTP, getUserProfile };
