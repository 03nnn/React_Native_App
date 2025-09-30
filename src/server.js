// const express = require("express"); old syntax
import express from "express";
import  dotenv from "dotenv";
import {initDB} from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRouter from "./routes/transactionsRoute.js";

dotenv.config();
const app=express();
const PORT= process.env.PORT;

// Trust proxy for accurate IP detection (important for rate limiting)
app.set('trust proxy', true);

//middleware- func that runs in middle between request and the response
app.use(rateLimiter);

app.use(express.json());
//our custom simple middleware
app.use((req,res,next)=>{
    console.log("Hey we hit a req, the method is,", req.method);
    next(); // dont forget as it will hang without this
});

//middleware for routes,
app.use("/api/transactions", transactionsRouter);
//app.use("/api/products ",productRouters) , add modularity to the server.js


/*
app.get("/health-check",(req,res)=>{
    res.send("It's is working ");
});
*/



initDB().then(()=> {
    app.listen(PORT,()=>{
    console.log("Server is up and running on PORT: ",PORT);
 });

});


  