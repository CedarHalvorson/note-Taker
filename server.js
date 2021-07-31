const express = require('express');
const path = require('path');
const fs = require('fs');

const uuid = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}



const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));



// GET Route for feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(JSON.parse(fs.readFileSync('./db/db.json', (err, data) => {
        if(err){
            throw new Error(err)}
        else {
            return data;
        }})));
});

app.post('/api/notes', (req, res) => {
    const postRequest = req.body;
    postRequest.id = uuid();

    const dbArray = (JSON.parse(fs.readFileSync('./db/db.json', (err, data) => {
        if(err){
            throw new Error(err)}
        else {
            return data;
        }})));
    
    dbArray.push(postRequest);
    fs.writeFileSync('./db/db.json', JSON.stringify(dbArray), (err) => {throw new Error(err)})  
 res.send("Success")
});

app.delete('/api/notes/:id', (req, res) => {
    const deleteId = req.params.id;

    const dbArray = (JSON.parse(fs.readFileSync('./db/db.json', (err, data) => {
        if(err){
            throw new Error(err)}
        else {
            return data;
        }})));


    for(let i = 0; i < dbArray.length; i++) {
        if(dbArray[i].id === deleteId) {
            dbArray.splice(i, 1);
        }
    }

    fs.writeFileSync('./db/db.json', JSON.stringify(dbArray), (err) => {throw new Error(err)})  
 res.send("Success")
});

app.get('/*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);



// api routes
// node fs package 
// 