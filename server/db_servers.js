const mysql = require('mysql');
const dotenv = require('dotenv');
const { resolve } = require('path');
const { rejects } = require('assert');
const { error } = require('console');
let instance = null;

dotenv.config();
const connection = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});
connection.connect((err) =>{
    if(err)
    {
        console.log(err.message);
    }
   //console.log('db ' + connection.state);
}); 

class DbService{
    static getDbServerInstance()
    {
        return instance?instance: new DbService();
    }
    async getAllData() {
        try{
            const response = await new Promise((resolve,reject) =>{ // getting all the data from the database
                const query = "select * From names ";
                connection.query(query,(err,results) => { // passing the query
                    if(err) reject(new Error(err,message));
                    resolve(results);
                });
            });
           //console.log(response);
           return response;
        }
        catch(error)
        {
            console.log(error);
        }
    }
    async insertNewName(name)
    {
        try{
            const dateAdded = new Date();
            const insertId = await new Promise((resolve,reject) =>{ // getting all the data from the database
                const query = "INSERT INTO  names (name,date_added) VALUES (?,?);";
                connection.query(query,[name,dateAdded],(err,result) => { // passing the query
                    if(err){
                         reject(new Error(err.message));
                    }
                    else
                    {resolve(result.insertId);}  
                });
            });
           
           return {
            id :  insertId,
            name : name,
            dateAdded : dateAdded
           };
        }
        catch(error){
            console.log(error);
        }
    }
    async deleteRowById(id)
    {

         try{
            id = parseInt(id,10);
            const response = await new Promise((resolve,reject) =>{ 
            const query = "DELETE FROM names WHERE id = ?";
            connection.query(query,[id],(err,result) => {
                if(err){
                     reject(new Error(err.message));
                }
                else
                    resolve(result.affectedRows);
            });

        });
        return response === 1 ? true : false;

    }catch(err)
    {
        console.log(error);
        return false;
    }
       
    }
    async updateNameById(id,name)
    {
        try{
            id = parseInt(id,10);
            const response = await new Promise((resolve,reject) =>{ 
            const query = "UPDATE names SET name = ? WHERE id = ?";
            connection.query(query,[name,id],(err,result) => {
                if(err){
                     reject(new Error(err.message));
                }
                resolve(result.affectedRows);
            });

        });
        return response === 1 ? true : false;

    }catch(error)
    {
        console.log(error);
        return false;
    }
    }
    async searchByname(name)
    {
        try{
            const response = await new Promise((resolve,reject) =>{ // getting all the data from the database
                const query = "select * From names where name = ?";
                connection.query(query,[name],(err,results) => { // passing the query
                    if(err) reject(new Error(err,message));
                    resolve(results);
                });
            });
          
           return response;
        }
        catch(error)
        {
            console.log(error);
        }
    }
}
module.exports = DbService;
