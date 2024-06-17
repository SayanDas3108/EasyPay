
const express = require('express');
const mongoose = require('mongoose');
const AccountsRouter = express.Router();
const app = express()

const {User , Accounts} = require('../db.js')
const AuthMiddleware = require('./middleware.js');


AccountsRouter.get('/balance', AuthMiddleware , async (req, res) => {
    let userFound = await Accounts.findOne({ userId: req.userId}).exec();
    res.send(userFound.balance);
})


AccountsRouter.post('/transfer', AuthMiddleware , async (req, res) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  const trans = req.body;

  let Sender = await Accounts.findOne({ userId: req.userId}).session(session);
  let Reciver = await User.findOne({ _id: trans.to}).session(session);
  let amount = parseInt(trans.amount);

  if (Reciver==null)
      {
      await session.abortTransaction();
      res.status(404).send("Invalid account");
      }
  
  if (amount>Sender.balance)
    {
      await session.abortTransaction();
      res.status(404).send("Insufficient balance");
    }

  await Accounts.updateOne({ _id: Reciver._id }, { $inc: { balance: amount } }).session(session);
  await Accounts.updateOne({ _id: req.userId }, { $inc: { balance: -amount } }).session(session);
  
  await session.commitTransaction();

  res.status(200).send("Transfer successful");
})


module.exports = AccountsRouter;