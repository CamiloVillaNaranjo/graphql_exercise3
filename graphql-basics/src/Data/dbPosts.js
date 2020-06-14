//Demo Users
const Users = [{
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
const Posts = [{
    id: "11",
    title: "GraphQL for beginners",
    body: "",
    published: false,
    author: "1"
}, {
    id: "12",
    title: ".NET Core from Zero to Expert!",
    body: "In this post we are going to learn about .NET Core...",
    published: true,
    author: "1"
}, {
    id: "13",
    title: "GraphQL. Why you should Learn it?",
    body: "In this post I will express my point of view.",
    published: true,
    author: "3"
}]

const Comments = [{
    id: "101",
    text: "It is amaze post, thanks",
    author: "2",
    post: "12"
}, {
    id: "102",
    text: "Nice, I hope you enjoy the rest of them!",
    author: "1",
    post: "12"
}, {
    id: "103",
    text: "Could you please provide more details on how to's? thanks",
    author: "2",
    post: "13"
}, {
    id: "104",
    text: "Nevermind, I'll correct it.",
    author: "3",
    post: "13"
}]

const db = {
    Posts,
    Users,
    Comments
};

export {
    db as
    default
}