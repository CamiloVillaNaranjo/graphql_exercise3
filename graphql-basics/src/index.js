import { GraphQLServer } from "graphql-yoga";

//Scalar Types: String Boolean Int Float ID

// Type definitions (Schema)
const typeDefs = `
    type Query {
        id: ID!
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    id() {
      return "sc12weX09hfs";
    },
    title() {
      return "Programming GraphQL for beginners";
    },
    price() {
      return 8.99;
    },
    releaseYear() {
      return 2008;
    },
    rating() {
      return 3.5;
    },
    inStock() {
      return true;
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
