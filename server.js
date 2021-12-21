const express = require("express");
const path = require ("path");
const fs = require("fs");
const notes = require ("./db/db.json");
const uuid = require("uuid");


const app = express();
var PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Getting the routes for the APIs, we want to save the notes and put them in the db.json file.
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"))
});

// using express to stringify the notes and put them into the db.json file.
app.post("/api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.json(notes);
});

// Targeting the right note to delete it from our database.
app.delete("/api/notes/:id", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id)
  fs.writeFileSync("./db/db.json", JSON.stringify(delNote));
  res.json(delNote);
})


//This calls the HTML
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//This calls the notes.html file
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// 
app.listen(PORT, function() {
    console.log(`App listening on PORT: ${PORT}` )
});