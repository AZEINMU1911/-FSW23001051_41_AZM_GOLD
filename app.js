//Check installed packages using "npm ls"
const express = require('express');
const fs = require('fs')
const db = require('./db.js')
const fetch = require ('fetch')

//Server initialize
const port = 3000;
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//USING VIEW ENGINE EJS
app.set('view engine','ejs');

//GET - "/"" ROUTE
app.get('/',(req,res) => {
    res.render('index')
})

//GET - "/create-listing" ROUTE
app.get('/create-listing',(req,res) =>{
    res.render('create')
});

//GET - "/listing" ROUTE - DISPLAY DATA FROM DB
app.get('/listing', async (req, res) => {
    try {
        // Take data from "carForums" TABLE from "binar-app-db" DATABASE
        const listings = await db.select('*').from('carForums');
        
        // Render the 'listing' view and pass the data to it
        res.render('listing', { listings: listings });
    } catch (err) {
        res.status(500).json({ message: 'Error 500 - Error in getting data from database' });
    }
});

//GET - '/listing:id' ROUTE (for checking, might be implemented)
/*app.get('/listing/:id', async (req,res) =>{
    try {
        const id = req.params.id;
        const listing = await db('carForums').select('displayName').where({
            id:id})

        if(!listing || listing === 0){
            return res.status(404).json({error:'Listing not found'})
        } res.json({data:listing});
    } 
    catch (err){
        res.status(500).json({ message: 'Error 500 - Error in getting data from database' });
    }
});
*/

//GET - '/listing/:displayName (for editting entry HTML/EJS)
app.get('/listing/:displayName', async (req, res) => {
    try {
        const displayName = req.params.displayName;
        const listing = await db.select('*').from('carForums').where({ displayName });

        res.render('edit', { 
            displayName: displayName,
            carName: listing[0].carName,
            carModel: listing[0].carModel,
            additionalDetails: listing[0].additionalDetails
        });
    } catch (err) {
        res.status(500).json({ message: 'Error 500 - Internal Server' });
    }
});

//POST - CREATE LISTING
app.post('/create-listing',async(req,res) => { 
    const {displayName, carName, carModel, additionalDetails} = req.body;

    try {
        const [newListing] = await db('carForums').insert({
            displayName:displayName,
            carName:carName,
            carModel:carModel,
            additionalDetails:additionalDetails
        }).returning('id');

        res.redirect('listing')
        
    } catch(err){
        console.error('Error is creating new listing: ', err)
        res.status(500).json({
            message: 'Error 500 - Internal Server'
        })
    }
});

//DELETE
app.delete('/listing/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await db('carForums').where({ id: id }).del();
        res.sendStatus(200);
    } catch (err) {
        console.error('Error deleting listing:', err);
        res.status(500).json({ message: 'Error 500 - Internal Server' });
    }
});

//PATCH - Editting
app.patch('/listing/:displayName', async (req, res) => {
    const displayName = req.params.displayName;
    const { additionalDetails } = req.body;

    try {
        await db('carForums')
            .where({ displayName: displayName })
            .update({ additionalDetails: additionalDetails });

        res.status(200).json({ message: 'Additional details updated successfully' });
    } catch (err) {
        console.error('Error updating additional details:', err);
        res.status(500).json({ message: 'Error 500 - Internal Server' });
    }
});

//APP LISTENING @ PORT
app.listen (port,() => {
    console.log('server is up on port 3000')
}) 