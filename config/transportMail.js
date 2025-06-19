const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({

    service: process.env.EMAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,

    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASS
    }
})

module.exports = transporter