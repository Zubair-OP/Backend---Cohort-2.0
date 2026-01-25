const express = require("express");
const app = express();

app.use(express.json());

const notes = []

app.post('/notes', (req, res) => {
    n = req.body;
    notes.push(n);
    res.status(201).send({ message: 'Note created'});
});

app.get('/notes', (req, res) => {
    res.status(200).json({ notes });
})

app.delete('/notes/:id', (req, res) => {
    let id= parseInt(req.params.id)
    if (id >= 0 && id < notes.length) {
        notes.splice(id,1)
    res.status(204).json('Notes deleted Successfully.')
    } else {
        res.status(404).json('Note not found.');
    }
})

app.patch('/notes/:id',(req ,res) =>{
    const id = parseInt(req.params.id);
    const {Description} = req.body;
    if (id >= 0 && id < notes.length) {
        notes[id].Description = Description;
        res.status(200).json('Note updated successfully.');
    } else {
        res.status(404).json('Note not found.');
    }
})


module.exports = app;