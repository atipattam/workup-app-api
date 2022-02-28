const { StatusCodes } = require('http-status-codes')
const path = require('path')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'workup-upload',
    }
  )
  fs.unlinkSync(req.files.image.tempFilePath)
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}

module.exports = { uploadImage }
