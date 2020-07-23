//Scalar Types: String Boolean Int Float ID
//Demo Users
const users = [{
    id: '1',
    name: 'Camilo',
    email: 'camilo@example.com',
    age: 43
}, {
    id: '2',
    name: 'Margarita',
    email: 'margarita@example.com'
}, {
    id: '3',
    name: 'Emmanuel',
    email: 'shakadevirgo@example.com',
    age: 17
}]

//Demo posts
const posts = [{
    id: "p1",
    title: "GraphQL for beginners",
    body: "",
    published: false
}, {
    id: "p2",
    title: ".NET Core from Zero to Expert!",
    body: "In this post we are going to learn about .NET Core...",
    published: true
}, {
    id: "p3",
    title: "GraphQL. Why you should Learn it?",
    body: "In this post I will express my point of view.",
    published: true
}]

// Type definitions (Schema)
const typeDefs = `
      type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
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
                return post.body.toLowerCase().includes(args.query.toLowerCase()) || post.title.toLowerCase().includes(args.query.toLowerCase());
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
    },
};