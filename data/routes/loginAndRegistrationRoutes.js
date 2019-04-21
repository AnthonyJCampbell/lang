const express = require('express');
const bcrypt = require('bcryptjs');
const tokenService = require('../utilities/token-generator');

const router = express.Router();
router.use(express.json());

const users = require('../helpers/userHelpers');

// LOGIN
router.post('/login', (req, res) => {
  const { password } = req.body
  const email_address = req.body.email_address;
  const username = req.body.email_address;
  
  if (!req.body.username || !req.body.email_address || !password) {
    return res.status(404).json({message: "Please provide either a 'username' or a 'email_address' and a 'password'"})
  }

  // Login with email is the default, since new sign-ups still have automatically-generated usernames
  if (req.body.email_address && req.body.email_address.includes('@') && identifier.includes('.')) {
    
    // LOGIN WITH EMAIL 
    // getUser(identifier)
    // Evaluate hashed password to provided hashed password
    // If matching, 
      // create newSession
      // set token to LocalStorage
      // res.status(200)
    // If not matching
      // Send back error saying invalid credentials

  // Login with Username
  } else {
    
    // Check email address for special characters that we don't use in the DB
    
    // LOGIN WITH USERNAME
    // getUser(identifier)
    // Evaluate hashed password to provided hashed password
    // If matching, 
      // create newSession
      // set token to LocalStorage
      // res.status(200)
    // If not matching
      // Send back error saying invalid credentials
  }
})

// REGISTER
// Both username, email_address are required to be unique in the DB.
router.post('/register', async (req, res) => {
  const { email_address, password } = req.body;
  const username = `user-${email_address}`
  
  if (!username || !email_address || !password) {return res.status(404).json({message: "Make sure to pass a 'username', 'email_address', and 'password"})}
  if (!email_address.includes('@') || !email_address.includes('.')) {return res.status(404).json({message: "Make sure to pass a valid email address!"})}
  // Check email address for special characters that we don't use in the DB
  
  await users.addUser({"email_address": email_address, "password": password, "username": username})
    .then(data => {
      res.status(200).json(data)
    })
    .catch(() => {
      res.status(500).json({message: "Whoops!"})
    })
  // Hash password
  // const newUser = { username, email, password: hashedPassword}
  // createUser(newUser)
  // 'LOGIN' PROCEDURE
  // create newSession
  // set token to LocalStrorage
  // res.status(201)
  // push to '/' -> Done on client
})

module.exports = router;