const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('I believe that hard work pays off');
})

app.listen(port , () => {
    console.log(`job seeker server is running on port ${port}`);
})