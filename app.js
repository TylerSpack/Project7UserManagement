const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT; //config.PORT
const DB = process.env.DATABASE_URL; //config.DB
const repository = require('./repositories/userRepository');

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let userBeingEditedID;
let header = [
    {
        id: 'first',
        title: 'First',
        value: '',
        type: 'text'
    },
    {
        id: 'last',
        title: 'Last',
        value: '',
        type: 'text'
    },
    {
        id: 'email',
        title: 'Email',
        value: '',
        type: 'email'
    },
    {
        id: 'age',
        title: 'Age',
        value: '',
        type: 'number'
    }
];

app.post('/newUser', (req, res) => {
    const {first, last, email, age} = req.body;
    repository.create(first, last, email, age).then(() => {
        res.redirect('/userListing');
    });
});
app.get('/', (req, res) =>{
    res.render('homePage');
});
app.get('/createUser', (req, res) => {
    res.render('newUser', {inputs: header});
});
app.get('/userListing', (req,res) => {
    repository.findAll().then(users => {
        if (users.length === 0) {
            res.redirect('/createUser');
        }
        console.log('first user', users[0]);
        res.render('userListing', {inputs: header, users: users});
    });


});
app.get('/edit/:id', (req, res) => {
    userBeingEditedID = req.params.id;
    let editHeader = JSON.parse(JSON.stringify(header));
    repository.findAll().then(users => {
        console.log(users);
        let user = users.find(u => u.id === req.params.id);
        if (user !== undefined){
            for (let i = 0; i < editHeader.length; i++){
                console.log('value before ', editHeader[i].value);
                editHeader[i].value = user[editHeader[i].id];
                console.log('value after ', editHeader[i].value);
            }
            console.log(editHeader);
            res.render('userEdit', {user: user, inputs: editHeader});
        }
        else{
            res.redirect('/userListing');
        }
    });
});

app.get('/remove/:id', (req, res) => {
    repository.deleteById(req.params.id).then(() => {
        res.redirect('/userListing')
    });
});

app.post('/lookup', (req, res) => {
    //redirect to userlisting with users being filtered by first or last name
    let isFirstName = req.body.userProperty === 'First';
    repository.findByName(req.body.lookupField, isFirstName).then(users => {
        res.render('userListing', {inputs: header, users: users});
    });
});
app.post('/sort', (req, res) => {
    let colName = req.body.userProperty.toLowerCase();
    let isAscending = req.body.sortDirection === 'Ascending';
    console.log('colName', colName, '\nisAscending', isAscending);
    repository.sortByColumn(colName, isAscending).then(users => {
        res.render('userListing', {inputs: header, users: users});
    });
});
app.post('/updateUser', (req, res) => {
    let obj = {};
    for (let i = 0; i < header.length; i++){
        console.log('header[i].id', header[i].id);
        console.log('req.body[header[i].id]', req.body[header[i].id]);
        obj[header[i].id] = req.body[header[i].id];
    }
    repository.updateByID(userBeingEditedID, obj).then(() => {
        res.redirect('/userListing');
    });
});

app.get('/addInitialUsers', (req, res) => {
    repository.create('Alexandra', 'Smith', 'anemail@email.com', 18);
    repository.create('Donna', 'Johnson', 'anemail@email.com', 18);
    repository.create('Felicity', 'Williams', 'anemail@email.com', 18);
    repository.create('Grace', 'Brown', 'anemail@email.com', 18);
    repository.create('Jan', 'Davis', 'anemail@email.com', 18);
    repository.create('Benjamin', 'Wilson', 'anemail@email.com', 18);
    repository.create('Cameron', 'Lee', 'anemail@email.com', 18);
    repository.create('Dylan', 'White', 'anemail@email.com', 18);
    repository.create('Jacob', 'Clark', 'anemail@email.com', 18);
    repository.create('Matt', 'Scott', 'anemail@email.com', 18);
    res.redirect('/userListing');
});

app.listen(PORT, ()=>{
    console.log(`app server is listening on port: ${PORT}`);
});
