const express = require("express");
require("dotenv").config();
const cors = require('cors');
const connectDB = require('./src/config/database');
const User = require('./src/models/User');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./src/middlewares/auth');
const app = express();

app.use(cors(
  {
    origin: ['http://localhost:5173', 'https://de-view.vercel.app'],
    credentials: true,
  }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

connectDB().then(()=>{
    console.log("Database Connection Established");
    app.listen(process.env.PORT || 3000, ()=>{
        console.log("Server is listening");
    });
})
.catch((err)=>{
    console.error("Database Connection Failed", err);
});


app.get("/", (req, res) => {
    res.send("Hello this is backend"); 
});

//sign up
app.post('/signup', async (req, res) => { 
    const { email, username, password } = req.body;
    try {
      // Check for existing user
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send({ title: "User already exists" });
      }
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create and save new user
      const user = new User({ email, username, password: hashedPassword });
      await user.save();
      res.status(200).send({ message: "Signup successful" });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).send({ message: "Failed to create user" });
    } 
  });

  //login
  app.post('/login',async (req, res) => {
    const { username, password } = req.body
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).send({ title: "User not Found" });
      }
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send({ title: "Invalid Password" });
      }
      // Login successful, Adding JWT Authentication
  
      //1. Create JWT Token
      const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET);
  
      //2. Add the token to cookie and send the reponse back to the user
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });
      
      // req.session.user = user;
      res.send({ message: "Login successful" , teamCode:user.teamCode});
    } catch (error) {
      res.status(500).send({ message: "Failed to login" });
    }
   
  });

  //update team code for a user upon joining a team
  app.patch('/user/teamCode', userAuth, async (req, res) => {
  const { teamCode } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.teamCode = teamCode;
    await user.save();
    res.status(200).send({ message: "Team code updated successfully" });
  } catch (err) {
    console.error("Error updating team code:", err);
    res.status(500).send({ message: "Failed to update team code" });
  }
});


//log out
app.post('/logout', (req, res) => {
    res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });
  res.send({ message: "Logged out successfully" });
});
  


