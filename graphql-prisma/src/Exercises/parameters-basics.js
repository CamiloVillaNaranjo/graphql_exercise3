//This file contains a very basic queries with params on the definition.
// Type definitions (Schema)
const typeDefs = `
    type Query {
      greeting(name: String, position: String): String!
      add(a:Float!, b:Float!): Float!
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
            return args.a + args.b
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