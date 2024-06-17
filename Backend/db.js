const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://Sayan:7LCn8k9l7b4WbbZW@cluster0.g56ejl5.mongodb.net/');
}

const User_Schema = new mongoose.Schema({  // Just a Schema to tell what type of data to be stored
  username : String,
  firstname: String,
  lastname : String,
  password : String
});

const Accounts_Schema = new mongoose.Schema({  // Just a Schema to tell what type of data to be stored
  userId: [{ type: mongoose.Schema.Types.ObjectId , ref: "User"}],
  balance: mongoose.Decimal128
});

const User = mongoose.model('User', User_Schema);  // Acts as an constructor to call schema
const Accounts = mongoose.model('Accounts', Accounts_Schema);

module.exports = { User,Accounts };