const express = require('express');
const app = express();
const pug = require('pug')
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./db/db.sqlite');
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
    db.all('SELECT * FROM strays', (err, rows) => {
        if (err) throw err;
        const strays = rows
        db.all('SELECT id, min(image) AS image FROM images GROUP BY id', (err, rows) => {
            if (err) throw err;
            res.render('gallery', {strays: strays, images: rows})
        })
    });
});

app.get('/strays/add', (req, res) => {
    res.render('addstray')
});

app.post('/strays/add', upload.array('photo'), (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const desc = req.body.desc;
    const id = require('crypto').randomUUID();

    for(let i=0; i<req.files.length; i++) {
        db.run('INSERT INTO IMAGES VALUES(?, ?)', [id, `data:${req.files[i].mimetype};base64,${Buffer.from(req.files[i].buffer).toString('base64')}`])
    }

    db.run('INSERT INTO STRAYS (id, name, age, desc) VALUES(?,?,?,?)', [id, name, age, desc], function(err) {
        if (err) throw err;
        res.redirect(`/strays/${id}`);
    })
})

app.get('/strays/:id', (req, res) => {
    db.all('SELECT * FROM strays WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) throw err;
        strayData = rows[0];
        db.all('SELECT image FROM IMAGES WHERE id= ?', [req.params.id], (err, images) => {
            if (err) throw err;
            const strayImg = images.map((images) => {return images.image;});
            res.render('viewer', {stray: strayData, photos: strayImg})
        })
    });
});