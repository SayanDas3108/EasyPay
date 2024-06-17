
const express = require('express');


const router = express.Router();

const app = express()
app.use(express.json());

const UserRouter = require('./user.js');
const AccountsRouter = require('./account.js');

router.use("/user" , UserRouter);
router.use("/account" , AccountsRouter);

module.exports = router;