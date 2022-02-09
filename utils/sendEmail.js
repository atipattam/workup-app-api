const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodemailerConfig')

const sendEmail = async ({ to, subject, html }) => {
  // let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig)

  return transporter.sendMail(
    {
      from: '"workup" <workupapp.test@gmail.com>', // sender address
      to,
      subject,
      html,
    },
    function (err, data) {
      if (err) {
        console.log(err)
      }
    }
  )
}

module.exports = sendEmail
