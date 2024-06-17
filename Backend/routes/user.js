
const express = require('express');
const UserRouter = express.Router();
const app = express()
app.use(express.json());

const jwt = require('jsonwebtoken');

const { User,Accounts } = require('../db.js')
const { UserSignUp , UserSignIn , updateBody } = require('../zod.js');
const { JWT_SECRET } = require('../config.js');
const AuthMiddleware = require('./middleware.js');


UserRouter.get('/signup', async (req, res) => {
  res.send("This is signin Page");
})

UserRouter.get('/bulk', async (req, res) => {

  const filter=req.query.filter || "";
  let user = await User.find({ $or:[ {firstname: {"$regex": filter}}, {lastname: {"$regex": filter}}]}).exec();

  if(user!=null)
    res.json({
      user: user.map(user => ({
          username: user.username,
          firstName: user.firstname,
          lastName: user.lastname,
          _id: user._id
      }))
    })
  else
    res.status(404).send("No user found");
})


UserRouter.post('/signup', async (req, res) => {
  const person = req.body;
  let userFound = await User.findOne({ username: person.username}).exec();

  if (userFound!=null) // way to check if user is empty or not[]
      res.status(404).send('User already exist');
  else
     {
      try {
        UserSignUp.parse(person);

        const user = await User.create(person);
        await Accounts.create({
          userId : user._id,
          balance: 1 + Math.random() * 10000
        })
        
        const token = jwt.sign(user._id.toJSON(), JWT_SECRET);

        res.status(200).send({
          "message" : "New user added",
          "Token" : token
        });
      }
      catch(err) {
        res.status(404).send(err);
        }
     }
})


UserRouter.post('/signin', async (req, res) => {
  const person = req.body;
  let userFound = await User.findOne({ username: person.username , password: person.password}).exec();

  if(userFound!=null)
     {
      try {
        UserSignIn.parse(person);

        const token = jwt.sign(userFound._id.toJSON(), JWT_SECRET);
        res.status(200).send({
          "Token" : token
      });
        }
      catch(err) {
        res.status(404).send('Err while log in');
        }
     }
    else
      res.status(404).send('Err while Signing in');
})

UserRouter.put('/', AuthMiddleware, async (req, res) => {
  const person = req.body;

  try {
    updateBody.parse(person);

    const filter = { _id: req.userId };
    const update = { password: person.password , firstname: person.firstname , lastname: person.lastname };
    await User.findOneAndUpdate(filter, update);
    res.status(200).send("Updated successfully");
    }
  catch(err) {
    res.status(404).send('Err while Updating');
    }
})


module.exports = UserRouter;