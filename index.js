// basic requirments for the serer

const express = require('express');
const cors = require('cors');
const app=express();
const port=process.env.PORT||5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// requiring env
require('dotenv').config();
// console.log(process.env.MGDB_USER)
// console.log(process.env.MGDB_PASS)

// middle ware army

app.use(cors());
app.use(express.json());

// mongodb server actions



const uri = `mongodb+srv://${process.env.MGDB_USER}:${process.env.MGDB_PASS}@cluster0.skku3ga.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// server atcions

app.get("/", (req, res)=>{
    res.send("Library server is running on a port,check it out")
});

app.listen(port,()=>{
    console.log("Library server is running now")
});