//const { response } = require("express");

//const { response } = require("express");

//const { table } = require("console");

document.addEventListener('DOMContentLoaded',function(){
    fetch('http://localhost:5000/getAll') 
    .then(response => response.json()) // recieves the response object from the backend and converts it to json 
    .then(data =>  loadHTMLTable(data['data']));// the json() stores the parsed data in 'data'
                                    //so we get the data from the server
   
});


//deleting

document.querySelector('table tbody').addEventListener('click', function(event){
   if(event.target.className === 'delete-row-btn')
   {
        deleteRowById(event.target.dataset.id);

   }
   if(event.target.className === 'edit-row-btn')
   {
        handleEditRowById(event.target.dataset.id);
   }

} );
function deleteRowById(id) 
{
    fetch('http://localhost:5000/delete/'+id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        if(data.Success)
        {
            location.reload();
            
        }
        
    }); 
}
//search
const searchBtn = document.querySelector('#search-btn');
searchBtn.onclick = function(){
    const searchValue = document.querySelector('#search-input').value;
    fetch('http://localhost:5000/search/'+ searchValue) 
    .then(response => response.json()) 
    .then(data =>  loadHTMLTable(data['data']));
                                   
}
//update
const updateBtn = document.querySelector('#update-row-btn');
function handleEditRowById(id)
{
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-name-input').dataset.id = id;

}
updateBtn.onclick = function()
{
    const updatedName = document.querySelector('#update-name-input');
    fetch('http://localhost:5000/update',{
        method : 'PATCH',
        headers:{
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id : updatedName.dataset.id,
            name : updatedName.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.Success)
        {
            location.reload();
        }
    })
}


//inserting data

const addbtn = document.querySelector('#add-name-btn');


addbtn.onclick = function () {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";
    fetch('http://localhost:5000/insert', {
    headers: {
        'content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({name:name})
})
.then(response => response.json())
.then(data => insertRowIntTable(data)); 


}
function insertRowIntTable(data)
{
   const table = document.querySelector('table tbody');
   const isTableData = table.querySelector('.no-data');
    let tableHTML = "<tr>";
    for(var key in data )
    {
        if(data.hasOwnProperty(key))
        {
            if(key === 'dateAdded')
            {
                data[key] = new Date(data[key]).toLocaleString();
            }
        }
        tableHTML += `<td>${data[key]} </td>`;

    }
    tableHTML +=   `<td> <button class = "delete-row-btn" data-id=${data.id}> Delete </td>`;
    tableHTML +=   `<td> <button class = "edit-row-btn" data-id=${data.id}> Edit </td>`;
    
    tableHTML += "</tr>";

    if(isTableData)
        {
            table.innerHTML = tableHTML;

        }
    else
    {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHTML;

    }
    location.reload();
}




function loadHTMLTable(data)
{
    const table = document.querySelector('table tbody');
   
    
    if(data.length === 0)
    {
        table.innerHTML = "<tr> <td class = 'no-data' colspan = '5'> No data </td></tr>" ;
        return;
    }
    let tableHTML = "";

    data.forEach(function({id,name,date_added}){
        tableHTML += "<tr>";
        tableHTML +=   `<td> ${id} </td>`;
        tableHTML +=   `<td> ${name} </td>`;
        tableHTML +=   `<td> ${new Date(date_added).toLocaleString()} </td>`;
        tableHTML +=   `<td> <button class = "delete-row-btn" data-id=${id}> Delete </td>`;
        tableHTML +=   `<td> <button class = "edit-row-btn" data-id=${id}> Edit </td>`;

        tableHTML += "</tr>";

    });
    table.innerHTML = tableHTML;

}