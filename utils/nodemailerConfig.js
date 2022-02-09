module.exports = {
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
  tls: {
    secureProtocol: 'TLSv1_method',
  },
}
