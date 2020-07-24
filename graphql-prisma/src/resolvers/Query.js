const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }],
      };
    }

    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const postArgs = {};

    if (args.query) {
      postArgs.where = {
        OR: [{ body_contains: args.query }, { title_contains: args.query }],
      };
    }

    return prisma.query.posts(postArgs, info);
  },
  me() {
    return {
      id: "sc12weX09hfs",
      name: "Camilo Villa",
      email: "camilo@example.com",
    };
  },
  post() {
    return {
      id: "qw123fgh",
      title: "GraphQL for beginners",
      body: "",
      published: false,
    };
  },
  comments(parent, args, { prisma }, info) {
    const commentArgs = {};

    if (args.query) {
      commentArgs.where = {
        text_contains: args.query,
      };
    }
    return prisma.query.comments(commentArgs, info);
  },
};

export { Query as default };
