// Dependencies
//=====================================

var express = require('express');
var path = require('path');
var fs = require('fs');
var uniqid = require('uniqid');

// Set up express app
//======================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', express.static('public'));


// Loads the home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

// Sends the notes.html page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

// Sends the JSON data present in db.json
app.get("/api/notes", (req, res) => {
    fs.readFile(__dirname + "/db/db.json", (err, data) =>{
        if(err){
            throw err;
        }
        res.json(JSON.parse(data));

    })
});

//write the newly created note to the db and send it back to the client
app.post("/api/notes", (req, res) => {
    var newNote = req.body;
    //newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase();
    let prefix = newNote.title.replace(/\s+/g, "").toLowerCase();
    newNote.id = uniqid(prefix);
    
    fs.readFile(__dirname + "/db/db.json", (err, data) => {
        if(err){
            throw err;
        }
        let json = JSON.parse(data);
        json.push(newNote);

        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(json), (err) => {
            if(err){
                throw err;
            }
            res.json(newNote);
        })
    
    })
});

//delete the particular note

app.delete("/api/notes/:id", (req, res) => {
    let chosenNoteToDelete = req.params.id;

    fs.readFile(__dirname + "/db/db.json", (err, data) => {
        if(err){
            throw err;
        }
        let json = JSON.parse(data);
        
        for(let i=0; i<json.length; i++){
            if(json[i].id === chosenNoteToDelete){
                json.splice(i,1);
            }
        }

        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(json), (err) => {
            if(err){
                throw err;
            }
            res.send("Successfully deleted");
        })
    
    })

});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on port " + PORT);
});