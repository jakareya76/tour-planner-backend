const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8bmhkpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const tourCollections = client.db("tours").collection("allTours");

    app.get("/tour/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await tourCollections.findOne(query);

      res.send(result);
    });

    app.get("/all-tour", async (req, res) => {
      const cursur = tourCollections.find();
      const result = await cursur.toArray();

      res.send(result);
    });

    app.get("/my-tour/:query", async (req, res) => {
      const email = req.params.query;

      const result = await tourCollections.find({ email: email }).toArray();

      res.send(result);
    });

    app.post("/add-tour", async (req, res) => {
      const tour = req.body;

      const result = tourCollections.insertOne(tour);

      res.send(result);
    });

    app.delete("/delete-tour/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await tourCollections.deleteOne(query);

      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
