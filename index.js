const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 2000;

app.use(cors({
    origin:[
        "https://scic-assignment-eight-job-task-mahfuz.surge.sh",
        "http://localhost:5173",
        "http://localhost:5174",
    ]
}));
app.use(express.json());

const uri =
  "mongodb+srv://TaskManager:v3gHBz1Ckrq3FYFL@cluster0.efkktro.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

    const taskCollection = client.db("taskDB").collection("task");

    // add task post
    app.post("/task", async (req, res) => {
      const newBrand = req.body;
      const result = await taskCollection.insertOne(newBrand);
      res.send(result);
    });
    // add task get all
    app.get("/task", async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    });
    // add task get specific id
    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    // update task
    app.patch("/task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatesTask = req.body;
      const product = {
        $set: {
          title: updatesTask.title,
          description: updatesTask.description,
          deadline: updatesTask.deadline,
          priority: updatesTask.priority,
        },
      };
      const result = await taskCollection.updateOne(filter, product, options);
      res.send(result);
    });
    // Deleting task data
    app.delete("/task/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
