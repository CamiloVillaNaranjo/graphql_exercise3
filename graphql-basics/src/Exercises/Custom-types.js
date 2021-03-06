//this file contains excercises related to use Custom Type on GraphQL.
// Type definitions (Schema)
const typeDefs = `
    type Query {
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