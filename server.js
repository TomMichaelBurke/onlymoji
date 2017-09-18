var express = require('express');
var app = express();
console.log(__dirname);
app.use(express.static(__dirname));

app.listen(3000); //the port you want to use