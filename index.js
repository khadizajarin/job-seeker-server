const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzj0eku.mongodb.net/?retryWrites=true&w=majority`;

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


    const jobCollection = client.db('jobQuest').collection('allJobs')
    const appliedCollection = client.db('jobQuest').collection('application')

    //CRUB operation for adding jobs and all jobs
    app.get('/Jobs', async(req, res) => {
      const cursor = jobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/Jobs/:id', async(req, res) => {
      const id = parseInt(req.params.id);
      const query = {_id : id}
      const result = await jobCollection.findOne(query);
      res.send(result);
    })  

    app.post ('/Jobs', async(req, res) => {
      const newJob = req.body;
      const result = await jobCollection.insertOne(newJob);
      res.send(result);
  })

  app.delete('/Jobs/:id', async (req,res) => {
    const id = (req.params.id);
    console.log(id);
    const query = {_id : new ObjectId(id)}
    const result = await jobCollection.deleteOne(query);
    res.send(result);
  })


  app.put('/Jobs/:id', async(req, res) =>{
    const id = parseInt(req.params.id);
    const filter = { _id : id}
    console.log(filter);
    const options = {upsert:true};
    const updatedJob = req.body;
    console.log(updatedJob);
    const job = {
      $set : {
        Employer_Name : updatedJob.employer, 
        Job_Title : updatedJob.title, 
        Job_Posting_Date : updatedJob.postdate, 
        Job_Category : updatedJob.jobCategory, 
        Picture_URL : updatedJob.jobPhoto, 
        Job_Description : updatedJob.description, 
        Application_Deadline : updatedJob.deadline,  
        Salary_Range : updatedJob.salaryRange, 
        Job_Applicants_Number : updatedJob.applicantsNumber 
      }
    }
    const result = await jobCollection.updateOne(filter, job, options )
    res.send(result);
  })

  //CRUD operation for applied Jobs
    app.get('/applied', async(req, res) => {
      const cursor = appliedCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/applied', async(req,res) => {
      const applied = req.body;
      const result =  await appliedCollection.insertOne(applied);
      res.send(result);
    })

    app.delete('/applied/:id', async (req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await appliedCollection.deleteOne(query);
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


app.get('/', (req, res) => {
    res.send('I believe that hard work pays off');
})

app.listen(port , () => {
    console.log(`job seeker server is running on port ${port}`);
})