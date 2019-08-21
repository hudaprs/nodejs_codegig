const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const db = require('./config/database')
const app = express()

// Test Database
db.authenticate()
  .then(() => console.log('Database Connected...'))
    .catch(err => console.log(err))

// Handle bars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))

// Express Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Index Route
app.get('/', (req, res) => {
 res.render('index', { layout: 'landing'})
})

// Gig Route
app.use('/gigs', require('./routes/gigs'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))