const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
   {
      userId: {
         type: String,
         required: true
      },
      desc: {
         type: String,
         max: 500,
         default: "new post...!"
      },
      img: {
         type: String,
      },
      likes: {
         type: Array,
         default: [],
      },
      comment: {
         type: String,
         default: "more love..."
      }
   },
   { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);