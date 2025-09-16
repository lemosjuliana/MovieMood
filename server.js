const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port =process.env.PORT || 3003;

app.use(bodyParser.json());

// app.use('/', require('./routes/index')); for when we have data 



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});