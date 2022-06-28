
require('dotenv').config()
const PORT = 8000
const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectString = process.env.DB_STRING




MongoClient.connect(connectString, {useUnifiedTopology: true}, (err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
  const db = client.db('SLANG')
  const quotesCollection = db.collection('slangdb')

  app.use(express.static(__dirname + '/public'))
  app.use('/css', express.static(__dirname + 'public/css'))
  app.use('/js', express.static(__dirname + 'public/js'))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.set('view engine', 'ejs')

  app.get('/', (req, res) => {
    db.collection('slangdb').find().toArray()
      .then(results => {
        res.render('index.ejs', {slangdb: results})
      })
      .catch(error => console.error(error))
      
  })
  

  app.post('/slang', (req, res) => {
    quotesCollection.insertOne(req.body)
    .then(result =>{
      res.redirect('/')
    })
   .catch(error => console.log(error))
  })

app.listen(process.env.PORT || PORT, function() {
    console.log('listening on 8000')
  })
})

