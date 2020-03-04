var express = require('express');
var router = express.Router();
var ffmpeg = require('fluent-ffmpeg');
const formidable = require("formidable");
const path = require("path");
const fs = require('fs');
const { promisify } = require('util')

const form = new formidable.IncomingForm();
const formParse = promisify(form.parse)
const formatFile = (command, filePath, fileName) => {
    return new Promise((resolve, reject) => {
        command
            .on('end', () => {
                console.log('end')
                    // fs.unlinkSync(filePath);
                fs.renameSync(filePath, fileName + '.m4a')
                resolve(fileName)

            })
            .on('error', (err) => {
                console.log('errro')
                console.log(err.message)
                reject(err)
            })
            .save(`${fileName}.mp3`);

    })

}

const saveFile = async(req) => {

    const filePath = req.files.file.path;
    console.log(req.files.file)
        // let fileName = filePath.split('.')[0];
    let fileName = (filePath.substr(0, filePath.indexOf("upload_")) + req.files.file.name).split('.')[0];
    console.log(fileName)
    const command = ffmpeg(filePath);
    await formatFile(command, filePath, fileName)
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', ['*'])

    res.json({ name: 'liu' })
});
router.get('/download', (req, res, next) => {
    const { fileName } = req.query
    console.log(fileName)
    console.log(decodeURI(fileName))
    res.header('Access-Control-Allow-Origin', ['*'])
        // res.download(`${fileName}.mp3`)
    res.download(`${decodeURI(fileName)}.mp3`)
        // var size = fs.statSync(`${fileName}.mp3`).size;
        // var f = fs.createReadStream(`${fileName}.mp3`);
        // res.writeHead(200, {
        //     'Content-Type': 'application/octet-stream',
        //     'Content-Disposition': 'attachment; filename=' + fileName,
        //     'Content-Length': size
        // });
        // f.pipe(res);
})
router.post('/upload', (req, res, next) => {
    (async() => {
        const filePath = req.files.file.path;
        let fileName = filePath.substr(0, filePath.indexOf("upload_")).split('.')[0];

        const r = await saveFile(req)
        return {
            fileName,
            status: "done",
            name: req.files.file.name.split('.')[0]
        }

    })().then(r => {
        res.header('Access-Control-Allow-Origin', ['*'])
        console.log('r')
        const { fileName } = r
        console.log(fileName)
        res.json(r)

        // const filePath = fileName.substr(fileName.indexOf('upload_')) + '.mp3'
        // console.log(filePath)

        // var size = fs.statSync(`${fileName}.mp3`).size;
        // var f = fs.createReadStream(`${fileName}.mp3`);
        // res.writeHead(200, {
        //     'Content-Type': 'application/force-download',
        //     'Content-Disposition': 'attachment; filename=' + fileName,
        //     'Content-Length': size
        // });
        // f.pipe(res);
        // res.download(`${fileName}.mp3`)
    }).catch(e => {
        next(e)
    })
});

module.exports = router;