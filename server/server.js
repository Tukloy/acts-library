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
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Authentication failed", info });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: "Login successful", user: user.id });
    });
  })(req, res, next);
});

app.get("/api/me", ensureAuthenticated, (req, res) => {
  res.json({ user: req.user }); // You can return user info here
});

app.get("/api/logout", (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: "Logged out successfully" });
  });
});

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
