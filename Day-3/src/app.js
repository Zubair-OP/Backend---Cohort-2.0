const express = require("express");
const app = express();

app.use(express.json());

const notes = []

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/notes", (req, res) => {
    const note = req.body;
    notes.push(note);
    res.send('notes created');
});

app.get('/notes', (req, res) => {
    res.send(notes)
})

app.delete('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0 && id < notes.length) {
        notes.splice(id, 1);
        res.send('notes deleted');
    } else {
        res.status(404).send('Note not found');
    }
})

app.put('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0 && id < notes.length) {
        notes[id] = req.body;
        res.send('notes updated');
    } else {
        res.status(404).send('Note not found');
    }
})

app.patch('/notes/:id', (req, res) => {
    notes[ req.params.id ].description = req.body.description
    res.send("Note patched successfully")
})



module.exports = app;