import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://192.168.99.100:4466",
});

//prisma.query; prisma.mutation; prisma.subscription; prisma.exists

const createPotForUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({ id: authorId });

  if (!userExists) {
    throw new Error("User not found!");
  }

  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    },
    "{ author {id, name, email, posts {id, title, published}} }"
  );

  return post.author;
};

// createPotForUser("ckcy6ytdo004q0709qlknzt5a", {
//   title: "Great books to read",
//   body: "These are my recomended books to read... bla, bla, bla!",
//   published: true,
// })
//   .then((user) => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

const updatePostForUser = async (postId, data) => {
  const postExists = await prisma.exists.Post({ id: postId });

  if (!postExists) {
    throw new Error("Post Id not found!");
  }

  const post = await prisma.mutation.updatePost(
    {
      data: { ...data },
      where: {
        id: postId,
      },
    },
    " { author { id, name, email, posts{id, title, published} }} "
  );

  return post.author;
};

// updatePostForUser("ckd0e9ebp00080709du8x1at7", {
//   published: true,
// })
//   .then((author) => {
//     console.log(JSON.stringify(author, undefined, 2));
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });
