const db = require('../models')
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit');
exports.getFile = async (req, res) => {
    try {
        const filename = req.params.filename
        console.log(req.params)
        res.download(path.resolve('uploads', filename),'utf-8')
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message })
    }
}