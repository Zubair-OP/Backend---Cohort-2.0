const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { email, username, password , role = 'user' } = req.body;

  try {
    if (!email || !username || !password) {
       return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({
        $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
        return res.status(400).json({ message: "Email or User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      email: email,
      username: username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token );

    res.status(201).json({
      message: "User registered Successfully",
      newUser: {
        username: newUser.username,
        email: newUser.email,
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if(!email || !password) {
      return res.status(400).json({
      message : "All fields are required"
      })
    }

    const user = await UserModel.findOne({
      $or: [
        { email: email },
        ],
    })

    if(!user){
      return res.status(401).json({
        message : "Invalid Credentials"
        })
    }

    const IsPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!IsPasswordCorrect){
      return res.status(401).json({
        message : "Invalid Credentials"
        })
    }

    const token = jwt.sign({
      id: user._id,
    },
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
    );

    res.cookie("token", token );

    res.status(200).json({
      message: "User logged in Successfully",
      user: {
        username: user.username,
        email: user.email,
      }
    });



  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
}


module.exports = {register, login , logout};
