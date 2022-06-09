var express = require('express'); 
 var app = express(); 
 const bp = require('body-parser'); 
 app.use(bp.json()); 
 app.use(bp.urlencoded({ extended: true })); 
app.post('/Desktop', function(request, response){ 
 console.log(request.body); 
 response.send(request.body); 
 });app.listen(8081); 
 console.log('Server is listening on port 8081'); 
