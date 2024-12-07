const express = require("express");
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m594l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const allVisaDb = client.db("visaNavigator").collection('addVisa')
    const myVisaDb = client.db("visaNavigator").collection('myVisa')
    // ALL VISA DATA----------------------------------------------
    // getting all data from database (api)
    app.get('/addedVisaData', async (req, res) => {
      const cursor = allVisaDb.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    // getting limited data (6) from database (api)
    app.get('/latestVisaData', async (req, res) => {
      const cursor = allVisaDb
        .find()
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
        .limit(6); // Limit to 6 records
      const result = await cursor.toArray();
      res.send(result);
    })
    // getting a specific data from database (api)
    app.get('/addedVisaData/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await allVisaDb.findOne(query)
      res.send(result)
    })
    // getting a specific data(my added visa) from database (api)
    app.get('/addedVisaData/email/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }; // Use email directly in the query
      const result = await allVisaDb.find(query).toArray(); // Retrieve all applications for the email
      res.send(result)
    })
    // updating a specific data (my added visa) from database (api)
    app.put('/addedVisaData/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const formData = req.body
      const visaInfo = {
        $set: {
          countryImage: formData.countryImage,
          countryName: formData.countryName,
          visaType: formData.visaType,
          processingTime: formData.processingTime,
          requiredDocuments: formData.requiredDocuments,
          description: formData.description,
          ageRestriction: formData.ageRestriction,
          fee: formData.fee,
          validity: formData.validity,
          applicationMethod: formData.applicationMethod,
        }
      }
      const result = await allVisaDb.updateOne(filter, visaInfo, options)
      res.send(result)
    })
    // storing data in database
    app.post('/addedVisaData', async (req, res) => {
      const addedVisaData = req.body
      addedVisaData.createdAt = new Date()
      // console.log(addedVisaData)
      const result = await allVisaDb.insertOne(addedVisaData)
      res.send(result)
    })
    // deleting specific data from my visa data in database
    app.delete('/addedVisaData/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await allVisaDb.deleteOne(query)
      res.send(result)
    })

    // MY VISA DATA-------------------------------------------------
    // getting my visa data from database (api)
    app.get('/applicationData', async (req, res) => {
      const cursor = myVisaDb.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    // getting a specific data(my visa application) from my visa database (api)
    app.get('/applicationData/email/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }; // Use email directly in the query
      const result = await myVisaDb.find(query).toArray(); // Retrieve all applications for the email
      res.send(result)
    })
    // storing my visa data in database
    app.post('/applicationData', async (req, res) => {
      const addedVisaData = req.body
      addedVisaData.createdAt = new Date()
      // console.log(addedVisaData)
      const result = await myVisaDb.insertOne(addedVisaData)
      res.send(result)
    })
    // deleting specific data from my visa data in database
    app.delete('/applicationData/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await myVisaDb.deleteOne(query)
      res.send(result)
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






app.get('/', (req, res) => {
  res.send('Server is running...')
})


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})