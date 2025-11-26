const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = process.env.URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {

    try {
        await client.connect();


        const IssueCollection = client.db('IssuesDb').collection('Issues');



        app.post('/issue', async (req, res) => {
            const newIssue = req.body;
            const result = await IssueCollection.insertOne(newIssue);
            res.send(result);
        });

        app.get('/issues', async (req, res) => {
            const result = await IssueCollection.find().toArray();
            res.send(result);
        });

        app.get('/issue/latest', async (req, res) => {
            const result = await IssueCollection
                .find()
                .sort({ _id: -1 })
                .limit(6)
                .toArray();

            res.send(result);
        });


        app.get('/issues/:id', async (req, res) => {
            const id = req.params.id;
            const result = await IssueCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.get("/myissue", async (req, res) => {
            const email = req.query.email;
            // console.log("User email:", email);

            const result = await IssueCollection.find({ email }).toArray();
            // console.log("Issues found:", result);

            res.send(result);
        });




        app.put('/issue/:id', async (req, res) => {
            const id = req.params.id;
            const updatedPlant = req.body;
            const result = await IssueCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedPlant }
            );
            res.send(result);

        });

        app.delete('/issue/:id', async (req, res) => {
            const id = req.params.id;
            const result = await IssueCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);

        });





        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


    }
    finally {

    }
}

run().catch(console.dir)


app.listen(port, () => console.log(`Server running on port ${port}`));
