const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const PORT = 5000;

//
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://start-with-next-js-frontend.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());

// uri
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.sugbz4l.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db('emerald');
  return db;
}

// 
app.get('/items', async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.collection('items').find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get('/items/:id', async (req, res) => {
  try {
    const database = await connectDB();
    const query = { _id: new ObjectId(req.params.id) };
    const result = await database.collection('items').findOne(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    const database = await connectDB();
    const result = await database.collection('items').insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//
app.get('/', (req, res) => {
  res.send('Emerald Server is Running');
});



  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });


module.exports = app;
