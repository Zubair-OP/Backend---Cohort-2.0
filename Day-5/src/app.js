const express = require('express');
const app = express();
const NotesModel = require('./model/notes.models');

app.use(express.json())

app.post('/notes',async (req, res) => {
    const { title, description } = req.body;
    const note =await NotesModel.create(
        { title, description }
    );

    res.status(201).json({
        message: "Note created successfully",
        note
    });
})


app.get('/notes',async (req, res) => {
    const notes =await NotesModel.find();
    res.status(200).json({
        message: "Notes fetched successfully",
        notes
    });
})



module.exports = app;