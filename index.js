const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const db = new sqlite3.Database('./db/shoutbox.db');
const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  console.log('GET /');
  const pageTitle = 'This is a title';
  db.all('SELECT * FROM shouts', (err, rows) => {
    res.render('pages/index', {
      title: pageTitle,
      data: rows
    });
  })
});

app.get('/add-entry', function (req, res) {
  console.log('GET /add-entry');
  res.render('pages/add-entry');
});

app.post('/add-entry', function (req, res) {
  console.log('POST /add-entry');
  console.log(req.body);
  db.run('INSERT INTO shouts(username, message) VALUES (?, ?);',
    [req.body.username, req.body.message],
    (err) => {
      if (err) {
        console.log(err);
        res.render('pages/add-entry');
      } else {
        res.redirect('/');
      }
    })
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}…`)
});

module.exports = server;
