const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

// added database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dpvinfz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("foodies").collection("services");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.get("/allServices", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.post("/allServices", async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });
    // service details api
    app.get("/allServices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("foodies review server is running");
});

app.listen(port, () => {
  console.log(`foodies review server is running on ${port}`);
});
