const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const PDFDoc = require('pdfkit')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const _isEmpty = require('lodash/isEmpty')

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

const uploadPDF = async (req,res) =>{
  const pdfReq = req.files.file
  const myArr = []

  const result = await cloudinary.uploader.upload(
    pdfReq.tempFilePath,
    {
      use_filename: true,
      folder: 'workup-upload-pdf',
    }
  )
  fs.unlinkSync(req.files.file.tempFilePath)
  return res.status(StatusCodes.OK).json({ file: { src: result.secure_url } })
}
  // if(_isEmpty(pdfReq)){
  //   throw new CustomError.BadRequestError('Please Upload PDF FILE')
  // }
  // for(let data of pdfReq){
  //    const result = await cloudinary.uploader.upload(
  //    data.tempFilePath,
  //     {
  //       use_filename: true,
  //       folder: 'workup-upload-pdf',
  //     }
  //   )
  //   fs.unlinkSync(data.tempFilePath)
  //     myArr.push(result.secure_url)
  // }

  // return res.status(StatusCodes.OK).json({ file: myArr})
// }

module.exports = { uploadImage, uploadPDF }
