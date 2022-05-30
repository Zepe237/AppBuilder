var express = require('express');
var app = express();
const bp = require('body-parser');
const fs = require('fs');
const path = require('path');
var nameF ;
// premiere partie du code html de chaque fichier html creer
var debut = '<!DOCTYPE html><html lang="en"><head> <link rel="stylesheet" href="style.css"><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><div class="contain"><form method="post">';
// titre de notre formulaire
var titre1 ='<h3>';
var titre2 ='</h3> </br>';
// code final de notre fichier htlm
var fin = '</form></div></body></html>' ;
// Code a inserer dans le fichier css
var codeCss = '/*Code css */.contain{padding: 50px;border: 4px aqua solid;text-align: center;float: center;border-radius: 10px;margin-left: 400px;margin-right: 400px;margin-top: 10px;}input{border-radius: 5px;margin: 5px;padding: 2px;}body{text-align: center;margin: 0;padding: 0;}';
// simple route
app.post('/', function(request, response){
  console.log(request.body.form);
});


// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static("public"));

// use res.render to load up an ejs view file
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// description page
app.get('/description', function(req, res) {
  res.render('pages/description');
});
// Build page
app.get('/build', function(req, res) {
  res.render('pages/build');
});
// arriver a la page build en provenant de description
app.post('/build', function(request, res){
  console.log("I receave data");
  console.log(request.body);
  if(typeof request.body !== 'undefined'){
    console.log(request.body.nameF);
    console.log(request.body.pic);
    nameF = request.body.nameF ;
  }
  res.render('pages/build');

});
// arriver a la page download en provenant de build
app.post('/download', function(req, res){
  console.log('Je suis appele')
  // recuperation du code html du formulaire dans le post
  var formulaire = req.body.formulaire ;
  // creation d'un sous dossier dans le dossier Export 
  fs.mkdir(path.join(__dirname+'/Export/', nameF), (err) => {
      if (err) {
          return console.error(err);
      }
      console.log('Directory created successfully!');
  });
  // creation du fichier html dans le dossier creer
  fs.writeFile(__dirname+'/Export/'+ nameF+ '/'+nameF+'.html', debut +titre1+nameF+titre2+ formulaire + fin, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
    // creation du fichier Js dans le dossier creer
  fs.writeFile(__dirname+'/Export/'+ nameF+ '/'+nameF+'.js', 'Code Js', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
    // creation du fichier SQL dans le dossier creer
  fs.writeFile(__dirname+'/Export/'+ nameF+ '/'+nameF+'.sql', 'Code SQL', function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
    // creation du fichier css dans le dossier creer
  fs.writeFile(__dirname+'/Export/'+ nameF+ '/style.css', codeCss, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
});

app.listen(8080);
console.log('Server is listening on port 8080');