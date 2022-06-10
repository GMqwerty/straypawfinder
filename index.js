const express = require('express');
const app = express();
const pug = require('pug')
const {client} = require('/app/db/db.js');
const multer = require('multer');
const upload = multer();

app.listen(process.env.PORT || 80)

app.use('/styles', express.static(__dirname + '/styles'));
app.use('/images', express.static(__dirname + '/images'))
app.set('views', 'views');
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/socials', (req, res) => {
    res.render('socials')
});

app.get('/strays', (req, res) => {
    client.query('SELECT * FROM strays', (err, data) => {
        if (err) throw err;
        res.render('gallery', {strays: data.rows})
    });
});

app.get('/strays/add', (req, res) => {
    res.render('addstray')
});

app.get('/stray/:id', (req, res) => {
    client.query('SELECT * FROM strays WHERE id = $1', [req.params.id], (err, data) => {
        if (err) throw err;
        res.render('viewer', {stray: data.rows[0]})
    });
});

app.get('/strays/:category', (req, res) => {
    client.query('SELECT * FROM strays WHERE category = $1', [req.params.category],(err, data) => {
        if (err) throw err;
        res.render('gallery', {strays: data.rows})
    })
});

app.post('/strays/add', upload.single('photo'), (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const desc = req.body.desc;
    const category = req.body.category
    const contact = req.body.contact
    const id = require('crypto').randomUUID();

    client.query('INSERT INTO STRAYS VALUES($1,$2,$3,$4,$5,$6,$7)', [id, name, age, desc, `data:${req.file.mimetype};base64,${Buffer.from(req.file.buffer).toString('base64')}`, category, contact], (err) => {
        if (err) throw err;
        res.redirect(`/stray/${id}`);
    })
})