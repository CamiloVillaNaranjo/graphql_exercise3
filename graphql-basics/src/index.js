import {
  GraphQLServer
} from "graphql-yoga";

import {
  v4 as uuidv4
} from "uuid";

import {
  comments as Commnets,
  posts as Posts,
  users as Users
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
      createUser(data: CreateUserInput!): User!
      deleteUser(id: ID!): User!
      createPost(data: CreatePostInput!): Post!
      createComment(data: CreateCommentInput!): Comment!
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
      author: ID!
    }

    input CreateCommentInput{
      text: String!,
      author: ID!,
      post: ID!
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
        return Users;
      }

      return Users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return Posts;
      }

      return Posts.filter((post) => {
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
      const emailTaken = Users.some((user) => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email submited already exist in our records.");
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      Users.push(user);
      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = Users.findIndex((user) => user.id === args.id)

      if (userIndex === -1) {
        throw Error('User not found');
      }

      const deletedUsers = Users.splice(userIndex, 1);

      Posts = Posts.filter((post) => {
        const match = post.author === args.id

        if (match) {
          Comments = Comments.filter((comment) => comment.post !== post.id)
        }

        return !match
      });

      Comments = Comments.filter((comment) => comment.author !== args.id)

      return deletedUsers[0]
    },
    createPost(parent, args, ctx, info) {
      const userExists = Users.some((user) => user.id === args.data.author);

      if (!userExists) return new Error("User not found!");

      const post = {
        id: uuidv4(),
        ...args.data
      };

      Posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = Users.some((user) => user.id === args.data.author);
      const postIsPublished = Posts.some(
        (post) => post.id === args.data.post && post.published
      );

      if (!userExists || !postIsPublished)
        return new Error("Unable to found user and post");

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      Comments.push(comment);

      return comment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return Users.find((user) => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return Comments.filter((comment) => comment.post === parent.id);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return Users.find((user) => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return Posts.find((post) => post.id === parent.post);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return Posts.filter((post) => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return Comments.filter((comment) => comment.author === parent.id);
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