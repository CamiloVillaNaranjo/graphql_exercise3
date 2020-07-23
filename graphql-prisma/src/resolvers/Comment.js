const Comment = {
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
};

export {
    Comment as
    default
}