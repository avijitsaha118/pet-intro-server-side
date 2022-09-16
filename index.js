const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jhuifu9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const informationCollection = client.db('petIntro').collection('information');

        app.get('/information', async (req, res) => {
            const query = {};
            const cursor = informationCollection.find(query);
            const informations = await cursor.toArray();
            res.send(informations);
        });

        app.post('/information', async (req, res) => {
            const newInformation = req.body;
            const result = await informationCollection.insertOne(newInformation);
            res.send(result);
        });

        app.delete('/information/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await informationCollection.deleteOne(query);
            res.send(result);
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running pet intro server')
});

app.listen(port, () => {
    console.log('listening to port 5000', port);
})