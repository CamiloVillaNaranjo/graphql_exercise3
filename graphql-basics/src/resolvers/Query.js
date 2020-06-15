const Query = {
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
    }
};

export {
    Query as
    default
}