const express = require('express');
const app = express();


app.get('/',(req,res) =>{
    res.send('This is Home page')
})

app.get('/about',(req,res) =>{
    res.send('This is About page')
})

app.get('/course',(req,res) =>{
    res.send('This is Course page')
})


app.listen(3000)