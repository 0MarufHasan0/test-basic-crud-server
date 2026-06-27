const express = require('express'); 
const cors = require('cors');
require('dotenv').config()
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;



// 
// 
// app.get('/products', (req,res)=>{

//  res.send('Hello World!');
// })



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.DB_URI;
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
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

 const db = client.db("test-e-commerce"); // Database name
 const productCollection = db.collection("products"); // Collection name



// find all products from database and send to client

app.get("/products" , async (req,res)=>{
  const cursor= productCollection.find(); // main pawar jonnno cursor make kori
  const result = await cursor.toArray(); // cursor ke array te convert kori
  // console.log(result);
  res.send(result);
})


// find single product by id

app.get("/products/:productId" , async (req,res)=>{
  // console.log(req.params.productId);
  const productId = req.params.productId;   //parameter theke productId ke variable e rakhlam
  const query = { _id: new ObjectId(productId) };   // query banalam jate productId er sathe mil thake
  // console.log(query);
  const result = await productCollection.findOne(query);   // findOne() method use kore single data fetch kora hoy
//  console.log(result);
  res.send(result);
})


// post method use kore product add kora hoy

app.post("/products", async(req,res)=>{

  // console.log(req.body); body theke data receive kora hoy

const newProduct = req.body;  // body theke data ke newProduct variable e rakhlam
const result = await productCollection.insertOne(newProduct);  // insertOne() method use kore data insert kora hoy
// console.log(result);
res.send(result);  // result ke client e send kora hoy

// console.log(result);


})
 

// delete method use kore product delete kora hoy

app.delete("/products/:productId", async (req, res)=> {

   const productId = req.params.productId; 

  //  console.log(productId);
   const query = { _id: new ObjectId(productId) };
   const result = await productCollection.deleteOne(query);  // deleteOne() method use kore data delete kora hoy
   // console.log(result);
   res.send(result);  // result ke client e send kora hoy



 })


 app.patch("/products/:productId", async (req, res)=> {

const {productId}= req.params ;
const UpdatedData= req.body

const filter = {_id: new ObjectId(productId)} ;

const updatedDoc = {

$set : {

  ...UpdatedData,
}


}

const result = await productCollection.updateOne (filter, updatedDoc)

res.send (result);

 })




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});