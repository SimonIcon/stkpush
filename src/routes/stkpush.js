const express = require('express')
const stkRoute = express()
const axios = require('axios')
const { getToken } = require('../middlewares/getToken')
const { stkpush } = require('../config/env')
const PaymentModel = require('../models.js/paymentModel')



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
        "CallBackURL": `https://ec3c-102-215-13-137.ngrok-free.app/callback`,
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
stkRoute.post("/callback", async (req, res) => {
    const callbackData = req.body;
    if (!callbackData.Body.stkCallback.callbackMetadata) {
        console.log(callbackData.Body)
        return res.json('ok')
    } else {
        const phonenumber = callbackData.Body.stkCallback.callbackMetadata.item[4].Value
        const transactionId = callbackData.Body.stkCallback.callbackMetadata.item[1].Value
        const amount = callbackData.Body.stkCallback.callbackMetadata.item[0].Value
        // ppopulating mongoDB
        await PaymentModel.create({
            phonenumber,
            transactionId,
            amount
        }).then((data) => {
            res.status(200).json({ message: "database updated with payement details", data: data })
        }).catch((err) => {
            res.status(400).json(err)
            console.log("error while updating database")
        })
    }

})

module.exports = { stkRoute }


