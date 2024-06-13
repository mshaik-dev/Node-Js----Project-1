//calling the api by using json. what is middleware , routes, post,patch,get

const express = require("express");
const fs = require("fs")
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;
//---middleware plugin -- imp
app.use(express.urlencoded({ extended: false }));

// Routes user --- using in html we can get names in documents
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

// we can use different routes

app.route("/api/users/:id")
    .get((req, res) => {

        const id = req.params.id;
        const user = users.find((user) => user.id == id)
        return res.json(user);
    })
    .patch((req, res) => {
        res.json({ status: "pending" })
    })
    .delete((req, res) => {
        res.json({ status: "deleted" })
    });


// post

// app.post("/api/users", (req,res)=>{
//     return res.json({status :"post api started"})
// })

app.post("/api/users", (req, res) => {

    const body = req.body;
    console.log(body);
    if (!body ||
     !body.first_name ||
      !body.last_name || 
      !body.email|| 
      !body.gender ||
       !body.job_title) {
        return res.status(400).json("msg all fields are empty")
    }
    console.log("body" ,body)
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./Mock_DATA.json", JSON.stringify(users), (err, data) => {
        return res.status(201).json({ msg: "success" })
    })

});


app.listen(PORT, () => console.log(`server started at PORT ${PORT}`));

