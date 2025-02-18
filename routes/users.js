const User = require('../model/user');
const router = require('express').Router();
const bcrypt = require('bcrypt');

//Update user
router.put('/:id', async (req, res) => {
   if (req.body.userId == req.params.id || req.body.isAdmin) {
      //to update password
      if (req.body.password) {
         try {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
         } catch (err) {
            return res.status(500).json("Error...");
         }
      }
      //to update any other things
      try {
         const user = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
         });
         res.status(200).json("Account has been updated!");
      } catch (err) {
         return res.status(200).json("Error...");
      }
   } else {
      return res.status(403).json("You can update only your account!");
   }
});

//delete user
router.delete('/:id', async (req, res) => {
   if (req.body.userId == req.params.id || req.body.isAdmin) {
      //to delete user
      try {
         const user = await User.findByIdAndDelete(req.params.id);
         res.status(200).send(`Deleted user: \n${user}`);
      } catch (err) {
         return res.status(200).send(`Error...in ${err}`);
      }
   } else {
      return res.status(403).json("You can delete only your account!");
   }
});


//get user
router.get('/:id', async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      const { password, updatedAt, ...other } = user._doc //to avoid printing password & updatedAt

      res.status(200).json(other);
   } catch (err) {
      res.status(500).json("Error...");
   }
})

//follow user
router.put("/:id/follow", async (req, res) => {
   if (req.body.userId !== req.params.id) {
      try {
         const user = await User.findById(req.params.id);
         const currentUser = await User.findById(req.body.userId);
         if (!user.followings.includes(req.body.userId)) {
            await user.updateOne({ $push: { followings: req.body.userId } });
            await currentUser.updateOne({ $push: { followers: req.params.id } });
            res.status(200).json(`User has been followed.`);
         } else {
            res.status(403).json('You already follow this user!');
         }
      } catch (err) {
         res.status(500).json("userId is not matched");
      }
   } else {
      res.status(403).json('You can not follow yourself');
   }
});


//unfollow user
router.put("/:id/unfollow", async (req, res) => {
   if (req.body.userId !== req.params.id) {
      try {
         const user = await User.findById(req.params.id);
         const currentUser = await User.findById(req.body.userId);
         if (user.followings.includes(req.body.userId)) {
            await user.updateOne({ $pull: { followings: req.body.userId } });
            await currentUser.updateOne({ $pull: { followers: req.params.id } });
            res.status(200).json(`User has been followed.`);
         } else {
            res.status(403).json("You don't follow this user!");
         }
      } catch (err) {
         res.status(500).json("userId is not matched");
      }
   } else {
      res.status(403).json('You can not unfollow yourself');
   }
});

// router.get('/658ed4cee29b889df0b1bb1b', (req, res)=>{
//    res.send('found id for this');
// });

module.exports = router;