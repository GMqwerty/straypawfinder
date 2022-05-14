const express = require('express');
const app = express();
const pug = require('pug')
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./db/db.sqlite')

app.listen(80)

app.set('views', 'views');
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    db.all('SELECT * FROM strays', (err, rows) => {
        if (err) throw err;
        res.render('strays', {strays: rows})
    });
});