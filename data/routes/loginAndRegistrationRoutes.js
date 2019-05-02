const express = require('express');
const bcrypt = require('bcryptjs');
const tokenService = require('../utilities/token-generator');

const router = express.Router();
router.use(express.json());

const users = require('../helpers/userHelpers');
// const sessions = require('../helpers/sessionHelpers');

// LOGIN
router.post('/login', (req, res) => {
  const password = req.body.password
  const email_address = req.body.email_address;
  // const username = req.body.email_address;
  
  if ((!req.body.username && !req.body.email_address) || !req.body.password) {
    return res.status(404).json({message: "Please provide either a 'username' or a 'email_address' and a 'password'"})
  }
  
  // Login with email is the default, since new sign-ups still have automatically-generated usernames
  if (email_address.includes('@') && email_address.includes('.')) {
    users.getUserByEmail(email_address)
      .then(user => {
      // SUCCESS CASE: CORRECT USERNAME & PASSWORD.
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = tokenService(user);
          // RETURNS A MESSAGE, A TOKEN, AND THE USER OBJECT
          return res.status(200).json({
            token,
            user
          });
        }
        // FAIL: INCORRECT PASSWORD
        if (user && !bcrypt.compareSync(password, user.password)) {
          return res.status(404).json({ message: 'Invalid password!' });
        }
        // FAIL: INCORRECT USERNAME (DEFAULT)
        else {
          return res.status(404).json({
            message: `There's no user with an 'email_address' of ${req.body.email_address}`
          });
        }
      })
      .catch(() => {
        return res.status(500).json({ message: "Something's gone wrong!"})
      })

  } else {
    // Login with Username
    users.getUser(username)
      .then(user => {
        // SUCCESS CASE: CORRECT USERNAME & PASSWORD.
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = tokenService(user);
          // RETURNS A MESSAGE, A TOKEN, AND THE USER OBJECT
          return res.status(200).json({
            token,
            user
          });
        }
        // FAIL: INCORRECT PASSWORD
        if (user && !bcrypt.compareSync(password, user.password)) {
          return res.status(404).json({ message: 'Invalid password!' });
        }
        // FAIL: INCORRECT USERNAME (DEFAULT)
        else {
          return res.status(404).json({
            message: `There's no user with an 'username' of ${req.body.username}`
          });
        }
      })
      .catch(() => {
        return res.status(500).json({ message: "Something's gone wrong!"})
      })
  }
})

// REGISTER
// Both username, email_address are required to be unique in the DB.
// Returns a token and a user object
router.post('/register', (req, res) => {
  const { email_address, password } = req.body;
  const username = `user-${email_address}`
  
  if (!username || !email_address || !password) {return res.status(404).json({message: "Make sure to pass a 'username', 'email_address', and 'password"})}
  if (!email_address.includes('@') || !email_address.includes('.')) {return res.status(404).json({message: "Make sure to pass a valid email address!"})}
  // >>> Check email address for special characters that we don't use in the DB
  
  users.addUser({"email_address": email_address, "password": password, "username": username})
    .then(user => {
      const token = tokenService(user);
      return res.status(200).json({
        token,
        user
      })
    })
    .catch(() => {
      return res.status(500).json({message: "Whoops!"})
    })
})

module.exports = router;