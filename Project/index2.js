//connected mongoose (mongodb) created database in mongodb using express ,schema module, added using async post.

const express = require("express");
const fs = require("fs")

const app = express();
const PORT = 8000;

const mongoose = require("mongoose")

//---middleware plugin -- imp
app.use(express.urlencoded({ extended: false }));


mongoose.connect("mongodb://127.0.0.1:27017/yaseen")
    .then(() => console.log("mongoDb connected"))
    .catch((err) => console.log("Mongo Error", err));

// schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    },
    gender: {
        type: String
    },
}, { timestamps: true })

//model schema
const User = mongoose.model('user', userSchema);


// Routes user --- using in html we can get names in documents

app.get("/users", async (req, res) => {

    const allDbUsers = await User.find({});

    const html = `<ul>
    ${allDbUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `
    res.send(html)
});

// routes apis

// app.get("/users", (req, res) => {

//     return res.json(users);
// })

// we can use different routes

// app.route("/api/users/:id")
//     .get((req, res) => {

//         const id = req.params.id;
//         const user = users.find((user) => user.id == id)
//         return res.json(user);
//     })
//     .patch((req, res) => {
//         res.json({ status: "pending" })
//     })
//     .delete((req, res) => {
//         res.json({ status: "deleted" })
//     });


// post

// app.post("/api/users", (req,res)=>{
//     return res.json({status :"post api started"})
// })

app.post("/users", async(req, res) => {

    if (
        !req.body ||
        !req.body.first_name ||
        !req.body.last_name ||
        !req.body.email ||
        !req.body.gender||
        !req.body.job_title
    ) {

        return res.status(400).json({ msg: "All fields are req..." });
    }

    const result = await User.create({
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender,
        jobTitle: req.body.job_title,
    })
    console.log("result:", result)
    return res.status(201).json({ msg: "success" })
});




app.listen(PORT, () => console.log(`server started at PORT ${PORT}`));

