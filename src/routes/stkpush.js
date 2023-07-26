const express = require('express')
const stkRoute = express()
const axios = require('axios')
const { getToken } = require('../middlewares/getToken')



stkRoute.post('/', getToken, async (req, res) => {
    const token = req.token;
    const phone = req.body.phone.substring(1)
    const amount = req.body.amount
    // generating timestamp
    const date = new Date()
    const timestamp = date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + (date.getDate() + 1)).slice(-2) +
        ("0" + (date.getHours() + 1)).slice(-2) +
        ("0" + (date.getMinutes() + 1)).slice(-2) +
        ("0" + (date.getSeconds() + 1)).slice(-2);


    // password is ussually a base64 url of shortcode,passkey and the timestamp
    const password = new Buffer.from(`${process.env.SHORT_CODE}${process.env.PASS_KEY}${timestamp}`).toString('base64')
    await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
        "BusinessShortCode": 174379,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": `254${phone}`,
        "PartyB": 174379,
        "PhoneNumber": `254${phone}`,
        "CallBackURL": `https://mydomain.com/${process.env.CALLBACK}`,
        "AccountReference": `254${phone}`,
        "TransactionDesc": "testing"
    }

        , {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            res.status(200).json(response.data)
        }).catch((error) => {
            console.log("error occured" + error)
            res.status(400).json(error)
        })

})
stkRoute.post(`/${process.env.CALLBACK}`, (req, res) => {
    const callbackData = req.body;
})

module.exports = { stkRoute }


