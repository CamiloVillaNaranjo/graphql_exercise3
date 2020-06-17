import {
    v4 as uuidv4
} from "uuid";

const Mutation = {
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
    updateUser(parent, args, {
        db
    }, info) {
        const {
            id,
            data
        } = args;
        const user = db.Users.find((user) => user.id === id);

        if (!user) throw new Error('User not found');

        if (typeof data.email === 'string') {
            const emailTaken = db.Users.some((user) => user.email === data.email);

            if (emailTaken) {
                throw new Error("Email submited already exist.");
            }

            user.email = data.email;
        }

        if (typeof data.name === 'string') {
            user.name = data.name;
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age;
        }

        return user;
    },
    createPost(parent, args, {
        db,
        pubsub
    }, info) {
        const userExists = db.Users.some((user) => user.id === args.data.author);

        if (!userExists) return new Error("User not found!");

        const post = {
            id: uuidv4(),
            ...args.data
        };

        db.Posts.push(post);

        if (args.data.published) pubsub.publish('post', {
            post: {
                mutation: "CREATED",
                data: post
            }
        });

        return post;
    },
    deletePost(parent, args, {
        db,
        pubsub
    }, info) {
        const postIndex = db.Posts.findIndex((post) => post.id === args.id);

        if (postIndex === -1) throw Error('Post not found');

        const [post] = db.Posts.splice(postIndex, 1);

        db.Comments = db.Comments.filter((comment) => comment.post !== args.id);

        if (post.published) pubsub.publish('post', {
            post: {
                mutation: "DELETED",
                data: post
            }
        });

        return post;
    },
    updatePost(parent, args, {
        db,
        pubsub
    }, info) {
        const {
            id,
            data
        } = args;
        const post = db.Posts.find((post) => post.id === id);
        const originalPost = {
            ...post
        };

        if (!post) throw new Error('Post not found')

        if (typeof data.title === 'string') {
            post.title = data.title;
        }

        if (typeof data.body === 'string') {
            post.body = data.body;
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published;

            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: "DELETED",
                        data: originalPost
                    }
                });
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: "CREATED",
                        data: post
                    }
                });
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: "UPDATED",
                    data: post
                }
            });
        }

        return post;
    },
    createComment(parent, args, {
        db,
        pubsub
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

        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: "CREATED",
                data: comment
            }
        });

        return comment;
    },
    deleteComment(parent, args, {
        db,
        pubsub
    }, info) {
        const commentIndex = db.Comments.findIndex((comment) => comment.id === args.id);

        if (commentIndex === -1) throw Error('Comment not found');

        var [deletedComment] = db.Comments.splice(commentIndex, 1);

        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: "DELETED",
                data: deletedComment
            }
        })

        return deletedComment;
    },
    updateComment(parent, args, {
        db,
        pubsub
    }, info) {
        const {
            id,
            data
        } = args;
        const comment = db.Comments.find((comment) => comment.id === id);

        if (!comment) throw new Error('Comment not found.');

        if (typeof data.text === 'string') {
            comment.text = data.text;
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: "UPDATED",
                data: comment
            }
        })

        return comment;
    }
};

export {
    Mutation as
    default
}