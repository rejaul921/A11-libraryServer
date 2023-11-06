// basic requirments for the serer

const express = require('express');
const cors = require('cors');
const app=express();
const port=process.env.PORT||5000;

// middle ware army

app.use(cors());
app.use(express.json());

// server atcions

app.get("/", (req, res)=>{
    res.send("Library server is running on a port,check it out")
});

app.listen(port,()=>{
    console.log("Library server is running now")
});