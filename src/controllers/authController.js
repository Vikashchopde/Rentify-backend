import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js"

// register 
export const register =  async (req, res) => {
    try {
      const { name, email, password, role , phone} = req.body;
  
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role,
      });
  
      res.json({
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      });
  
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };

// login 
  export const login =  async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
  
      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  
    } catch (err) {
      res.status(500).json({ message: " login Server error" });
    }
  };

  // logout 
  export const logout = (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });
  
    res.json({ message: "Logged out" });
  };

 // me 
 export const me = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // ✅ RETURN USER DIRECTLY
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
