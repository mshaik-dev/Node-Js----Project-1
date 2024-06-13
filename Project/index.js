//connected mongodb , used async and await to post into the mongodb.

const express = require("express");
const fs = require("fs")
const users = require("./MOCK_DATA.json");
const { default: mongoose } = require("mongoose");

const app = express();
const PORT = 8000;

//connection
mongoose
    .connect("mongodb://127.0.0.1:27017/yaseen")
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


//---middleware plugin -- imp
app.use(express.urlencoded({ extended: false }));

// middleware handlerrs - it will hold the request until it gives response or next call permission to access.
app.use((req,res,next)=>{
console.log("hello from middleware 1")
next();
})
// how to append to txt

app.use((req,res,next)=>{

    const now = new Date();

fs.appendFile('log.txt',`\n ${now.getHours()}Hr:${now.getMinutes()}MIN:${now.getSeconds()}SEC - ${req.method}: ${req.path}`, (
    err,data)=>{
    next();
})
})

// Routes user

app.get("/users", (req, res) => {

    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html)
});

// routes apis

app.get("/api/users", (req, res) => {

    return res.json(users);
})

app.get("/api/users/:id", (req, res) => {

    const id = req.params.id;
    const user = users.find((user) => user.id == id)
    return res.json(user);
});

//get using ids in async

app.get("/api/users/:id", async (req, res) => {
const user = await User.findById(req.params.id);
if(!user) return res.status(404).json({error: "user not found"});
return res.json(user)
});

// patch

app.patch("/api/users/id",async(req,res)=>{
    await User.findByIdAndUpdate(req.params.id, {last_name: "Dhoni"});
    return res.json({status:"success"})
})


// post

app.post("/api/users/", async(req, res) => {

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

