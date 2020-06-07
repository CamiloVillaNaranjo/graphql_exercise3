import {
  GraphQLServer
} from "graphql-yoga";

const reducer = (acummulator, currentValue) => acummulator + currentValue

//Scalar Types: String Boolean Int Float ID

// Type definitions (Schema)
const typeDefs = `
    type Query {
      greeting(name: String, position: String): String!
      add(numbers: [Float!]!): Float!
      grades:[Int!]!
      me: User!
      post: Post!
    }

    type User {
      id:ID!
      name: String!
      email: String!
      age: Int
    }

    type Post{
      id: ID!
      title: String!
      body: String!
      published: Boolean!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `Hello, ${args.name} you are my favorite ${args.position}!`
      } else {
        return 'Hello!'
      }
    },
    add(parent, args, cts, info) {
      if (args.numbers.length === 0) {
        return 0;
      }

      return args.numbers.reduce(reducer);
    },
    grades(parent, args, cts, info) {
      return [12, 33, 55]
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
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is Up!");
});