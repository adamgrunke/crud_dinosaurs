const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
const fs = require('fs');
const methodOverride = require('method-override');
const port = 8000;

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'));

app.get('/', function(req, res) {
    res.render("index")
});



// GET /dinosaurs - index route - gets ALL dinos
app.get('/dinosaurs', function(req, res){
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    let dinoData = JSON.parse(dinosaurs);
    console.log(dinoData);
    res.render('dinos/index.ejs',{dinosaurs: dinoData})
});


// GET /dinosaurs/new - serve up our NEW dino form
app.get('/dinosaurs/new', function(req, res){
    res.render('dinos/new');
});

// GET /dinosaurs/edit - serve up our EDIT dino form
app.get('/dinosaurs/:id/edit', function(req, res){
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    let dinoData = JSON.parse(dinosaurs);
    let id = parseInt(req.params.id);
    res.render('dinos/edit',{dinoData: dinoData[id], id});
});

// GET /dinosaurs/:id - show route - gets ONE dino
app.get('/dinosaurs/:id', function(req, res){ 
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    let dinoData = JSON.parse(dinosaurs);

    let id = parseInt(req.params.id);
    res.render('dinos/show', {dinosaur: dinoData[id], id});
});

// POST /dinosaurs
app.post('/dinosaurs', function(req, res){
    // read in our JSON file
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    // convert it to an array
    let dinoData = JSON.parse(dinosaurs);
    // push our new data into the array
    let newDino = {
        type: req.body.dinosaurType,
        name: req.body.dinosaurName
    };
    dinoData.push(newDino);
    // write the array back to the file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData));    
    
    res.redirect('/dinosaurs');
});




app.delete('/dinosaurs/:id', function(req, res) {
    //read the data from the file 
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    //parse the data into an object
    var dinoData = JSON.parse(dinosaurs);
    // splice out the item at the specified index
    var id= parseInt(req.params.id);
    dinoData.splice(id, 1);
    //stringify rthe object
    var dinoString = JSON.stringify(dinoData);
    // write the object back to the file
    fs.writeFileSync('./dinosaurs.json', dinoString);
    res.redirect('/dinosaurs');
});

app.put('/dinosaurs/:id', function(req, res){
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    let dinoData = JSON.parse(dinosaurs);
    var id = parseInt(req.params.id);

    dinoData[id].name = req.body.dinosaurName;
    dinoData[id].type = req.body.dinosaurType;

    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData));
    res.redirect('/dinosaurs/' + id);
    
})






app.listen(port, function() {
    console.log("we are listening on port:  🐘 😬 " + port);
});

