import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import db from '../config/database.js'

passport.use(
    new LocalStrategy({ usernameField: "account_id" }, async (account_id, password, done) => {
      try {
        const [rows] = await db.query("SELECT * FROM accounts WHERE account_id = ?", [account_id]);
        if (rows.length === 0) return done(null, false, { message: "User not found" });
  
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
  
        return isMatch ? done(null, user) : done(null, false, { message: "Incorrect password" });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.account_id); // Ensure this matches your DB column
});

passport.deserializeUser(async (account_id, done) => {
    try {
        const [rows] = await db.query("SELECT * FROM accounts WHERE account_id = ?", [account_id]);
        done(null, rows[0]);
    } catch (err) {
        done(err);
    }
});

  export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, allow access
    }
    res.status(401).json({ error: "Unauthorized: Please log in first" });
  }

  export  {passport};