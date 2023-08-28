const express = require('express');
const app = express();//calling the express function

const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();//access the config data(port ,database info etc)

const dbServers = require('./db_servers');// get db Connection
const DbService = require('./db_servers');

app.use(cors());// helps to call the apis
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//handle create reqs
app.post('/insert', (request,response) => {
    const {name} = request.body;
    const  db = DbService.getDbServerInstance();

    const result = db. insertNewName(name);
    result
    .then(data => response.json({data : data }))
    .catch(err => console.log(err));
});


//read
app.get('/getAll', (request,response) => {
    const  db = DbService.getDbServerInstance();
    const result = db.getAllData();
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));


})

//update
app.patch('/update', (req,res) =>{
    const {id, name} = req.body;
    const  db = DbService.getDbServerInstance();
    const result = db.updateNameById(id,name);
    result
    .then(data => res.json({Success: data}))
    .catch(err => console.log(err));
})

//delete
app.delete('/delete/:id', (req,res)=>{
    const {id} = req.params;
    const  db = DbService.getDbServerInstance();

    const result = db.deleteRowById(id);
    result
    .then(data => res.json({Success: data}))
    .catch(err => console.log(err));
});
app.get('/search/:name',(req,res)=>{
    const {name} = req.params;
    const  db = DbService.getDbServerInstance();
    const result = db.searchByname(name);
    result
    .then(data => res.json({data: data}))
    .catch(err => console.log(err));

})


app.listen(process.env.PORT, () => console.log('app is running') );