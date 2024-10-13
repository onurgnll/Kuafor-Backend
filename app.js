require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./routers/index");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter); 

app.use(errorHandler); 

const PORT = process.env.PORT || 5005; 

app.listen(PORT,() => {
  console.log(`Server started on port ${PORT}`);
});
