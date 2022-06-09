const express = require('express');
console.log(process.env.DATABASE_URL)
const app = express();
const pug = require('pug')
const {Client} = require('/db/db.js');
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

app.get('/strays', (req, res) => {
    db.query('SELECT * FROM strays', (err, res) => {
        if (err) throw err;
        res.render('gallery', {strays: res.rows})
    });
});

app.get('/strays/add', (req, res) => {
    res.render('addstray')
});

app.post('/strays/add', upload.single('photo'), (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const desc = req.body.desc;
    const id = require('crypto').randomUUID();

    db.run('INSERT INTO STRAYS VALUES(?,?,?,?, ?)', [id, name, age, desc, `data:${req.file.mimetype};base64,${Buffer.from(req.file.buffer).toString('base64')}`], function(err) {
        if (err) throw err;
        res.redirect(`/strays/${id}`);
    })
})

app.get('/strays/:id', (req, res) => {
    db.all('SELECT * FROM strays WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) throw err;
        res.render('viewer', {stray: rows[0]})
    });
});