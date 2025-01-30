import express from 'express'
import 'dotenv/config.js'
import accounts from './routes/accounts.js'
import error from './middleware/error.js'
import notfound from './middleware/notfound.js'

const app = express()
const port = process.env.PORT || 5000


// Body Parserer
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Routes
app.use('/api/accounts', accounts)


// Error Handling
app.use(notfound)
app.use(error)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})