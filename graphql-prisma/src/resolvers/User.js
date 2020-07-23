const User = {
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
};

export {
    User as
    default
}