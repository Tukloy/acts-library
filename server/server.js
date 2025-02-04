import express from "express";
import "dotenv/config.js";
import session from "express-session";
import { ensureAuthenticated, passport } from "./middleware/auth.js";

// Routes
import accounts from "./routes/accounts.js";
import academicPapers from "./routes/academicPapers.js";
import activities from "./routes/activities.js";
import books from "./routes/books.js";
import transactions from "./routes/transactions.js";
import search from "./routes/search.js";
import login from "./routes/login.js";

// Middleware
import error from "./middleware/error.js";
import notfound from "./middleware/notfound.js";

const app = express();
const port = process.env.PORT || 5000;

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: process.env.NODE_ENV === "production",
      httpOnly: true, // Helps prevent XSS attacks
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Public Routes
app.use('/api/', login)

// Protected Routes
app.use("/api/accounts", ensureAuthenticated, accounts);
app.use("/api/academic-papers", ensureAuthenticated, academicPapers);
app.use("/api/activities", ensureAuthenticated, activities);
app.use("/api/books", ensureAuthenticated, books);
app.use("/api/transactions", ensureAuthenticated, transactions);
app.use("/api/search", ensureAuthenticated, search);

// Error Handling
app.use(notfound);
app.use(error);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
