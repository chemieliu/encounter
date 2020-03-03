var express = require('express');
var router = express.Router();
var ffmpeg = require('fluent-ffmpeg');
const formidable = require("formidable");
const path = require("path");
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.json({ name: 'liu' })
});
router.post('/upload', function(req, res) {
    // console.log(req.files)
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;
    console.log(form.type);
    form.uploadDir = path.join(__dirname, "upload");
    form.parse(req, function(err, fields, files) {
        console.log(files)
        console.log(files.file.path)
        const fileName = files.file.path.split('.')[0]
        console.log(fileName)

        var command = ffmpeg(files.file.path)
            .on('end', () => {
                console.log('end')
                fs.unlink(files.file.path, () => {
                    console.log('delete')
                });

            })
            .on('error', (err) => {
                console.log('errro')
                console.log(err.message)
            }).save(`${fileName}.mp3`);
        res.end(JSON.stringify({ fields, files }))
    })

    res.json({ status: 'ok' })
});

module.exports = router;