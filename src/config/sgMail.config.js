const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_CLIENT_API)

module.exports = sgMail