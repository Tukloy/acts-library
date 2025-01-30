import express from 'express'
import 'dotenv/config.js'
import accounts from './routes/accounts.js'
import academicPapers from './routes/academicPapers.js'
import activities from './routes/activities.js'
import books from './routes/books.js'
import transactions from './routes/transactions.js'
import error from './middleware/error.js'
import notfound from './middleware/notfound.js'

const app = express()
const port = process.env.PORT || 5000


// Body Parserer
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Routes
app.use('/api/accounts', accounts)
app.use('/api/academic-papers', academicPapers)
app.use('/api/activities', activities)
app.use('/api/books', books)
app.use('/api/transactions', transactions)


// Error Handling
app.use(notfound)
app.use(error)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})