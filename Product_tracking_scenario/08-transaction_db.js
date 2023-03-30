const mongoose = require("mongoose");

const TransactionModel = require('../models/transaction');

const dbURI = "mongodb://127.0.0.1:5000/DemoDB";

mongoose.connect(dbURI);

TransactionModel.find({product_id:'1234'},function (err, transaction) {
    if (err) return console.error(err);
    console.log(transaction);
  })
//console.log(res);