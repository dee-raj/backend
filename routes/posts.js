const router = require("express").Router();
const Post = require('../model/Post');
const User = require("../model/user");

//create a post
router.post("/", async (req, res) => {
   if (!req.body.userId) {
      res.status(403).json({ ValidationError: "`userId` is required." });
   }
   const newPost = new Post(req.body);
   try {
      const savePost = await newPost.save();
      res.send(savePost);
      res.status(200).json("New post created.");
   } catch (err) {
      res.status(500).json("Error... to save Post");
   }
});

//update the post
router.put('/:id', async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
         await post.updateOne({ $set: req.body });
         res.status(200).json("Post has been updated");
      } else {
         res.status(403).json("You can only update your own posts");
      }
   } catch (err) {
      res.status(500).json("There is some error to find posts")
   }
});


//delete a post
router.delete('/:id/delete', async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
         await post.deleteOne();
         res.status(200).json("Post has been deleted");
      } else {
         res.status(403).json("You can only delete your own posts");
      }
   } catch (err) {
      res.status(500).json("There is some error to find posts")
   }
});


//likes or unlikes a post
router.put('/:id/like', async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
         await post.updateOne({ $push: { likes: req.body.userId } });
         res.status(200).json("The Post has been liked");
      } else {
         await post.updateOne({ $pull: { likes: req.body.userId } });
         res.status(200).json("The Post successfully unlike.");
      }
   } catch (err) {
      res.status(403).json("Some error to find the post using this id");
   }
});



//put a connenct to a post
//get a post
router.get('/:id', async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
   } catch (err) {
      res.status(500).json("Error...to get post")
   }
});


//get timeline a posts
router.get('/timeline/all', async (req, res) => {
   try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
         currentUser.followings.map((friend) => {
            return Post.find({ userId: friend });
         })
      );
      res.json(userPosts.concat(...friendPosts));
   } catch (err) {
      res.status(500).json("Some error to find user or post");
   }
})

// router.get('/658f98cbc6ecff3b895e5bf3', (req, res)=>{
//    res.send("Your posts are here...!")
// });
module.exports = router