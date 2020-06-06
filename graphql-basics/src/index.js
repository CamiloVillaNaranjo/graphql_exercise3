import { GraphQLServer } from "graphql-yoga";

// Type definitions (Schema)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return "Este es mi primer query con GraphQL";
    },
    name() {
      return "Camilo Villa Naranjo";
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
