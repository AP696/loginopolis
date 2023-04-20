const express = require('express');
const app = express();
const { User } = require('./db');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register'), async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPw = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPw });
    res.send(user, "Success");
  }
  catch (error) {
    console.error(error);
  }
}

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (user) {
      const hashedPw = user.password;
      const passwordsMatch = await bcrypt.compare((password, hashedPw));
      if (passwordsMatch) {
        res.send(user, "Success")
      }
    }
  } catch (error) {
    
  }
})

// we export the app, not listening in here, so that we can run tests
module.exports = app;
