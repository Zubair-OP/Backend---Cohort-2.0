const express = require("express");

const app = express();

app.use(express.json())

const notes = [];


app.post('/notes', (req,res) =>{
    let data = req.body;
    notes.push(data)
    res.send('notes created')
})
app.get('/notes', (req,res) =>{
    res.send(notes)
})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

