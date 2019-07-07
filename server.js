const express = require('express');
const layouts = require('express-ejs-layouts');
var db = require('./models');
//TODO remove fs and use sequelize instead
// const fs = require('fs');
const methodOverride = require('method-override');
const port = process.env.PORT || 3000;

const app = express();

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
    db.dinosaur.findAll().then(function(dinosaurs){
        res.render('dinos/index',{dinosaurs});
    })
});


// GET /dinosaurs/new - serve up our NEW dino form
app.get('/dinosaurs/new', function(req, res){
    res.render('dinos/new');
});

// GET /dinosaurs/edit - serve up our EDIT dino form
app.get('/dinosaurs/:id/edit', function(req, res){
    var id = req.params.id;
    db.dinosaur.findByPk(id)
        .then(function(dinosaur){
            res.render('dinos/edit', {dinosaur})
        })
});

// GET /dinosaurs/:id - show route - gets ONE dino
app.get('/dinosaurs/:id', function(req, res){ 
    var id = req.params.id;
    db.dinosaur.findByPk(id)
        .then(function(dinosaur){
            res.render('dinos/show', {dinosaur})
        })
   
    // res.render('dinos/show', {dinosaur: dinoData[id], id});
});

// POST /dinosaurs
app.post('/dinosaurs', function(req, res){
    
    db.dinosaur.create({
        type: req.body.dinosaurType,
        name: req.body.dinosaurName

    }).then(function(dinosaur){

        res.redirect('/dinosaurs');
    })
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
    var id = parseInt(req.params.id);

    db.dinosaur.update({
        type: req.body.dinosaurType,
        name: req.body.dinosaurName
    },
    {
        where: {id: id}
    }).then(function(dinosaur){

        res.redirect('/dinosaurs');
    })
})






app.listen(port, function() {
    console.log("we are listening on port:  🐘 😬 " + port);
});

