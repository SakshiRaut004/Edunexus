import Post from "../models/Post.js";

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const content = typeof body.content === "string" ? body.content.trim() : "";

    if (!content || content.length > 2000) {
      return res.status(400).json({ message: "Posts must be between 1 and 2,000 characters" });
    }

    const post = await Post.create({
      facultyId: req.user.id,
      content,
      file: req.file ? req.file.filename : null,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Post creation failed:", error.message);
    res.status(500).json({ message: "Unable to create post" });
  }
};

// GET ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("facultyId", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(posts);
  } catch (error) {
    console.error("Post lookup failed:", error.message);
    res.status(500).json({ message: "Unable to load posts" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.user.id
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.json(post);
  } catch (error) {
    console.error("Post like update failed:", error.message);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid post id" });
    }
    res.status(500).json({ message: "Unable to update like" });
  }
};

export const addComment = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text || text.length > 500) {
      return res.status(400).json({ message: "Comments must be between 1 and 500 characters" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user.id,
      text,
    });

    await post.save();

    res.json(post);
  } catch (error) {
    console.error("Post comment failed:", error.message);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid post id" });
    }
    res.status(500).json({ message: "Unable to add comment" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content || content.length > 2000) {
      return res.status(400).json({ message: "Posts must be between 1 and 2,000 characters" });
    }

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, facultyId: req.user.id },
      { $set: { content } },
      { new: true, runValidators: true }
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json(post);
  } catch (error) {
    console.error("Post update failed:", error.message);
    if (error.name === "CastError" || error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid post data" });
    }
    return res.status(500).json({ message: "Unable to update post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      facultyId: req.user.id,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Post deletion failed:", error.message);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid post id" });
    }
    return res.status(500).json({ message: "Unable to delete post" });
  }
};