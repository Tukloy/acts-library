import { ensureAuthenticated, passport } from "../middleware/auth.js";
import express from 'express'

const router = express.Router()

router.post("/login", (req, res, next) => {
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
        return res.status(200).json({ message: "Login successful", user: user.id, name: user.name, type: user.account_type });
      });
    })(req, res, next);
  });
  
  router.get("/me", ensureAuthenticated, (req, res) => {
    res.json({ user: req.user });
  });
  
  router.get("/logout", (req, res) => {
    req.logout(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  export default router;
