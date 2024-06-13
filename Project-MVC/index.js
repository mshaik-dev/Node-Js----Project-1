//calling the api by using json. what is middleware , routes, post,patch,get

const express = require("express");
const {connectMongoDb} = require("./connection")

const {logReqRes} = require("./middleware")

const userRouter = require("./routes/user")

const App = express();
const PORT = 8000;

//connection
connectMongoDb("mongodb://127.0.0.1:27017/yaseen").then(()=>{console.log("mongoDb connected")})

//---middleware plugin -- imp
App.use(express.urlencoded({ extended: false }));
App.use(logReqRes("log.txt"))

//Routes
App.use("/api/users",userRouter);

App.listen(PORT, () => console.log(`server started at PORT ${PORT}`));

