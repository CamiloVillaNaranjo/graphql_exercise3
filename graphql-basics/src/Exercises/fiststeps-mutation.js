import db from "./Data/dbPosts";

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, {
            db
        }, info) {
            if (!args.query) {
                return db.Users;
            }

            return db.Users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        posts(parent, args, {
            db
        }, info) {
            if (!args.query) {
                return db.Posts;
            }

            return db.Posts.filter((post) => {
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
        comments(parent, args, {
            db
        }, info) {
            if (!args.query) {
                return db.Comments;
            }

            return db.Comments.filter((comment) => {
                return comment.text.toLowerCase().includes(args.query.toLowerCase());
            });
        },
    },
    Mutation: {
        createUser(parent, args, {
            db
        }, info) {
            const emailTaken = db.Users.some((user) => user.email === args.data.email);
            if (emailTaken) {
                throw new Error("Email submited already exist in our records.");
            }

            const user = {
                id: uuidv4(),
                ...args.data
            };

            db.Users.push(user);
            return user;
        },
        deleteUser(parent, args, {
            db
        }, info) {
            const userIndex = db.Users.findIndex((user) => user.id === args.id)

            if (userIndex === -1) {
                throw Error('User not found');
            }

            const deletedUsers = db.Users.splice(userIndex, 1);

            db.Posts = db.Posts.filter((post) => {
                const match = post.author === args.id

                if (match) {
                    db.Comments = db.Comments.filter((comment) => comment.post !== post.id)
                }

                return !match
            });

            db.Comments = db.Comments.filter((comment) => comment.author !== args.id)

            return deletedUsers[0]
        },
        createPost(parent, args, {
            db
        }, info) {
            const userExists = db.Users.some((user) => user.id === args.data.author);

            if (!userExists) return new Error("User not found!");

            const post = {
                id: uuidv4(),
                ...args.data
            };

            db.Posts.push(post);

            return post;
        },
        deletePost(parent, args, {
            db
        }, info) {
            const postIndex = db.Posts.findIndex((post) => post.id === args.id);

            if (postIndex === -1) throw Error('Post not found');

            const deletedPost = db.Posts.splice(postIndex, 1);

            db.Comments = db.Comments.filter((comment) => comment.post !== args.id);

            return deletedPost[0];
        },
        createComment(parent, args, {
            db
        }, info) {
            const userExists = db.Users.some((user) => user.id === args.data.author);
            const postIsPublished = db.Posts.some(
                (post) => post.id === args.data.post && post.published
            );

            if (!userExists || !postIsPublished)
                return new Error("Unable to found user and post");

            const comment = {
                id: uuidv4(),
                ...args.data
            };

            db.Comments.push(comment);

            return comment;
        },
        deleteComment(parent, args, {
            db
        }, info) {
            const commentIndex = db.Comments.findIndex((comment) => comment.id === args.id);

            if (commentIndex === -1) throw Error('Comment not found');

            var deletedComments = db.Comments.splice(commentIndex, 1);

            return deletedComments[0];
        },
    },
    Post: {
        author(parent, args, {
            db
        }, info) {
            return db.Users.find((user) => user.id === parent.author);
        },
        comments(parent, args, {
            db
        }, info) {
            return db.Comments.filter((comment) => comment.post === parent.id);
        },
    },
    Comment: {
        author(parent, args, {
            db
        }, info) {
            return db.Users.find((user) => user.id === parent.author);
        },
        post(parent, args, {
            db
        }, info) {
            return db.Posts.find((post) => post.id === parent.post);
        },
    },
    User: {
        posts(parent, args, {
            db
        }, info) {
            return db.Posts.filter((post) => post.author === parent.id);
        },
        comments(parent, args, {
            db
        }, info) {
            return db.Comments.filter((comment) => comment.author === parent.id);
        },
    },
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
});