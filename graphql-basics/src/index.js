import {
  GraphQLServer
} from "graphql-yoga";

import {
  v4 as uuidv4
} from "uuid";

import {
  posts,
  users,
  comments
} from "./Demo-Data/demopost";

// Type definitions (Schema)
const typeDefs = `
    type Query {
      users(query: String): [User!]!
      posts(query: String): [Post!]!
      comments(query: String): [Comment!]!
      me: User!
      post: Post!
    }

    type Mutation {
      createUser(data: CreateUserInput): User!
      createPost(data: CreatePostInput): Post!
      createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput{
      name: String!, 
      email: String!, 
      age: Int
    }

    input CreatePostInput{
      title: String!,
      body: String!,
      published: Boolean!,
      authorId: ID!
    }

    input CreateCommentInput{
      text: String!,
      authorId: ID!,
      postId: ID!
    }

    type User {
      id:ID!
      name: String!
      email: String!
      age: Int
      posts:[Post!]!
      comments:[Comment!]!
    }

    type Post{
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comments:[Comment!]!
    }

    type Comment{
      id: ID!
      text: String!
      author: User!
      post: Post!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter((post) => {
        return (
          post.body.toLowerCase().includes(args.query.toLowerCase()) ||
          post.title.toLowerCase().includes(args.query.toLowerCase())
        );
      });
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
    comments(parent, args, ctx, info) {
      if (!args.query) {
        return comments;
      }

      return comments.filter((comment) => {
        return comment.text.toLowerCase().includes(args.query.toLowerCase());
      });
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email submited already exist in our records.");
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.authorId);

      if (!userExists) return new Error("User not found!");

      const post = {
        id: uuidv4(),
        ...args.data
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.authorId);
      const postIsPublished = posts.some(
        (post) => post.id === args.data.postId && post.published
      );

      if (!userExists || !postIsPublished)
        return new Error("Unable to found user and post");

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      comments.push(comment);

      return comment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is Up!");
});