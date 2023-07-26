const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    phonenumber: {
        type: String,
        require: true
    },
    transactionId: {
        type: String,
        require: true
    },
    amount: {
        type: String,
        require: true
    }
},
    { timestamp: true })

const PaymentModel = mongoose.model('payments', paymentSchema)
module.exports = PaymentModel