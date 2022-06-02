var express = require('express');
var app = express();
const bp = require('body-parser');
const fs = require('fs');
const path = require('path');
var nameF ;
// premiere partie du code html de chaque fichier html creer
var debut = '<!DOCTYPE html><html lang="en"><head> <link rel="stylesheet" href="style.css"><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><div class="contain">';
// titre de notre formulaire
var titre1 ='<h3>';
var titre2 ='</h3> </br>';
// code final de notre fichier htlm
var fin = '</form></div></body></html>' ;
// Code a inserer dans le fichier css
var codeCss = '/*Code css */.contain{padding: 50px;border: 4px aqua solid;text-align: center;float: center;border-radius: 10px;margin-left: 400px;margin-right: 400px;margin-top: 10px;}input{border-radius: 5px;margin: 5px;padding: 2px;}body{text-align: center;margin: 0;padding: 0;}';
// code a inserer dans le fichier JS
var debutJs = "var express = require('express'); var app = express(); const bp = require('body-parser'); app.use(bp.json()); app.use(bp.urlencoded({ extended: true }));" ;
var finJS = "app.listen(8081); console.log('Server is listening on port 8081');"
// creation du contenu du read-me file 
var readContent = " - Vous devez avoir Node installer dans votre ordinateur \n - ouvrir un terminal a la racine du projet creer \n - Taper la commande npm install \n - s'assurer que le port 8081 n'est pas occuper par une autre application "
// simple route
app.post('/', function(request, response){
  console.log(request.body.form);
});
// appel a graphDB
const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");

// Config
const GRAPHDB_BASE_URL = "http://localhost:7200",
    GRAPHDB_REPOSITORY = "AppBuilder",
    GRAPHDB_USERNAME = "admin",
    GRAPHDB_PASSWORD = "admin",
    GRAPHDB_CONTEXT_TEST = "http://www.semanticweb.org/vadeltsague/ontologies/2022/4/untitled-ontology-6";
const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS,
    EnapsoGraphDBClient.PREFIX_XSD,
    EnapsoGraphDBClient.PREFIX_PROTONS,
    {
        prefix: "App",
        iri: "http://www.semanticweb.org/vadeltsague/ontologies/2022/4/untitled-ontology-6#form",
    }
];

//Create an Endpoint.
let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
  baseURL: GRAPHDB_BASE_URL,
  repository: GRAPHDB_REPOSITORY,
  prefixes: DEFAULT_PREFIXES
});

//Authenticate (Optional)
graphDBEndpoint.login(GRAPHDB_USERNAME,GRAPHDB_PASSWORD)
.then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});
// insert
graphDBEndpoint
  .update(
    `insert data {
      graph <${GRAPHDB_CONTEXT_TEST}> {
      App:Form App:est_constitué_de App:Input }
  }`
         )
  .then((result) => {
    console.log("inserted a class :\n" + JSON.stringify(result, null, 2));
  })
  .catch((err) => {
    console.log(err);
  });
// fin du code liee au graph

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
  // ajout de l'action a mon formulaire creer 
  action = '<form method="POST" action= "http://localhost:8081/'+nameF + '">'
  // recuperation du code html du formulaire dans le post
  var formulaire = req.body.formulaire ;
  // creation d'un sous dossier dans le dossier Export
  //creation de la route post dans æe fichier Js generer
  var corpsJs = "app.post('/" +nameF +"', function(request, response){console.log(request.body);response.send('bonjour');});"; 
  readContent += "Taper la commande node " + nameF +'.js' + " pour lancer le serveur \n - puis ouvrir le fichier " + nameF + ".html";
  fs.mkdir(path.join(__dirname+'/Export/', nameF), (err) => {
      if (err) {
          return console.error(err);
      }
      console.log('Directory created successfully!');
  });
  // creation du fichier html dans le dossier creertitre1 +
  fs.writeFile(__dirname+'/Export/'+ nameF+ '/'+nameF+'.html', debut +action +titre1+nameF+titre2+ formulaire + fin, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
    // creation du fichier Js dans le dossier creer
  fs.writeFile(__dirname+'/Export/'+ nameF+ '/'+nameF+'.js', debutJs + corpsJs +finJS, function (err) {
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
  // creation du fichier read-me
  fs.writeFile(__dirname+'/Export/'+ nameF+ '/read-me.md', readContent, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

});

app.listen(8080);
console.log('Server is listening on port 8080');