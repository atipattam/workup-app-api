const crypto = require('crypto')
const { StringDecoder } = require('string_decoder')

const hashString = (string)=>{
  crypto.createHash('md5').update(string).digest('hex')
}
module.exports = hashString