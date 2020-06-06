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
            return 'sc12weX09hfs'
        },
        title() {
            return 'Programming GraphQL for beginners'
        },
        price() {
            return 8.99
        },
        releaseYear() {
            return 2019
        },
        rating() {
            return null
        },
        inStock() {
            return true
        }
    },
};