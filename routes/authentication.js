const router = require('express').Router();
const User = require("../model/user");
const bcrypt = require('bcrypt');

// REGISTER
router.post("/register", async (req, res) => {
   try {
      //generate new password
      const salt = await bcrypt.genSalt(10);
      const hasedPassword = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = new User({
         userName: req.body.userName,
         email: req.body.email,
         password: hasedPassword
      });
      //save user and respond
      const user = await newUser.save();
      res.status(200).json(user);
   } catch (error) {
      console.log(`There is an erro to make post request or to save: ${error}`);
      res.status(500).json("Error...");
   }
});

//LOGIN
router.post("/login", async (req, res) => {
   try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
         res.status(404).send('User not found! ');
         return;
      }

      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) {
         res.status(400).json("wrong password");
         return;
      }
      console.log("Login successful !");
      res.status(200).json(user);
   } catch (err) {
      console.log(`Error to find user from post man: ${err}`);
      res.status(500).json(err);
   }

})

// router.get("/register", (req, res)=>{
//    res.send('hey its auth/register routes');
// });
module.exports = router