import { v4 as uuidv4 } from "uuid";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error("Email submited already exist in our records.");
    }

    return await prisma.mutation.createUser({ data: args.data }, info);
  },
  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) {
      throw Error("User not found");
    }

    return await prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  async updateUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) {
      throw Error("User not found");
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
  async createPost(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) {
      throw Error("User not found");
    }

    return prisma.mutation.createPost(
      {
        data: {
          ...args.data,
          author: {
            connect: {
              id: args.data.author,
            },
          },
        },
      },
      info
    );
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.Posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) throw Error("Post not found");

    const [post] = db.Posts.splice(postIndex, 1);

    db.Comments = db.Comments.filter((comment) => comment.post !== args.id);

    if (post.published)
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });

    return post;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.Posts.find((post) => post.id === id);
    const originalPost = {
      ...post,
    };

    if (!post) throw new Error("Post not found");

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }
    } else if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.Users.some((user) => user.id === args.data.author);
    const postIsPublished = db.Posts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!userExists || !postIsPublished)
      return new Error("Unable to found user and post");

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.Comments.push(comment);

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.Comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) throw Error("Comment not found");

    var [deletedComment] = db.Comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });

    return deletedComment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.Comments.find((comment) => comment.id === id);

    if (!comment) throw new Error("Comment not found.");

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
};

export { Mutation as default };
