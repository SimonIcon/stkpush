const axios = require('axios')
let token;
const getToken = async (req, res, next) => {

    const authKey = new Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64')
    await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: {
            'Authorization': `Basic ${authKey}`
        }
    }
    ).then((response) => {
        token = response.data.access_token
        req.token = token
        next()
    }).catch((error) => {
        res.json(error.message)
    })

}
module.exports = { getToken }
