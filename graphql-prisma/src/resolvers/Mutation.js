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
  async deletePost(parent, args, { prisma }, info) {
    const postExists = await prisma.exists.Post({ id: args.id });

    if (!postExists) throw Error("Post not found");

    return await prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },
  async updatePost(parent, args, { prisma }, info) {
    const postExists = await prisma.exists.Post({ id: args.id });

    if (!postExists) throw Error("Post not found");

    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
  async createComment(parent, args, { prisma }, info) {
    const userExists = prisma.exists.User({ id: args.data.author });

    if (!userExists) return new Error("Unable to found user and post");

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author,
            },
          },
          post: {
            connect: {
              id: args.data.post,
            },
          },
        },
      },
      info
    );
  },
  async deleteComment(parent, args, { prisma }, info) {
    return await prisma.mutation.deleteComment(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async updateComment(parent, args, { prisma }, info) {
    return await prisma.mutation.updateComment(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
};

export { Mutation as default };
