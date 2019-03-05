const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');


app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'));
app.use('/src', express.static(__dirname + "/src"));

app.listen(process.env.PORT);