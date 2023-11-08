// basic requirments for the serer

const express = require('express');
const cors = require('cors');
const app=express();
const port=process.env.PORT||5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// requiring env
require('dotenv').config();
// console.log(process.env.MGDB_USER)
// console.log(process.env.MGDB_PASS)

// middle ware army

app.use(cors());
app.use(express.json());

const categories=[
  {id:1, name:"SelfHelp", img:"https://i.ibb.co/CtQXv2Y/self-help1.jpg"},
  {id:2, name:"Business", img:"https://i.ibb.co/p34QBk4/business1.jpg"},
  {id:3, name:"Psychology", img:"https://i.ibb.co/NS7tFjz/psychology4.jpg"},
  {id:4,  name:"Cookbooks", img:"https://i.ibb.co/cxjytsH/recepe1.jpg"},
]

app.get('/categories',(req,res)=>{
  res.send(categories)
 })

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
    await client.connect();
    // creating Database
    const database = client.db("booksDB");
    const allBooks = database.collection("allBooks");

    // post method to add book in database
    app.post('/addbook', async(req,res)=>{
      const book=req.body;
      console.log(book)
      const result = await allBooks.insertOne(book);
      res.send(result);
    });
    // using get method to loading allbooks from Database send to clientside
    app.get('/allbook', async(req,res)=>{
      const cursor=allBooks.find()
      const allbook= await cursor.toArray();
      res.send(allbook);
    })
// using get method to load data for category book
    app.get('/categories/:name', async(req,res)=>{
      const categoryName=req.params.name
      const query={category:categoryName}
      const booksInCategory=await allBooks.find(query).toArray()
      res.send(booksInCategory);
    })
    // single data loading for book update
    app.get('/updatebook/:_id', async(req,res)=>{
      const id=req.params._id
      const query={_id:new ObjectId(id)};
      const book=await allBooks.findOne(query);
      res.send(book);
    })
    // for bookdetails loading single book data from database
    app.get('/bookdetails/:_id', async(req, res)=>{
      const id=req.params._id
      const query = { _id: new ObjectId(id) };
      const book= await allBooks.findOne(query)
      res.send(book);
    })

    // adding data to database for borrowed books
    const borrowedBooks=database.collection("borrowedBooks");
    app.post('/addBorrowedBook', async(req,res)=>{
      const book=req.body;
      console.log(book)
      const result = await borrowedBooks.insertOne(book);
      res.send(result);
    });
    // updating allBooks after borrowed a book
    app.put('/updatebook/:_id',async(req,res)=>{
      const id=req.params._id;
      const updatebook=req.body;
      // console.log(updatebook);
      const query={_id:new ObjectId(id)};
      const options = { upsert: true };
      const updatedBook={
        $set:{
          // name, photo, authorname, category, quantity, description, rating
          name:updatebook.name,
          photo:updatebook.photo,
          authorname:updatebook.authorname,
          category:updatebook.category,
          quantity:updatebook.quantity,
          description:updatebook.description,
          rating:updatebook.rating
        }
      }
      const result= await allBooks.updateOne(query,updatedBook,options);
      res.send(result);

    })
    // reading borrowed books and sending to client
    app.get('/borrowed',async(req,res)=>{
      const cursor = borrowedBooks.find();
      const books = await cursor.toArray();
      res.send(books);
    })
    // deleting book from borrowedBooks
    app.delete('/myBorrowed/:id', async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result= await borrowedBooks.deleteOne(query);
      res.send(result);
    })
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