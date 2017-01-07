
var tesseract = require('node-tesseract');
var multer  = require('multer');
var fs = require('fs');

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const pool = require('../server/db');
const ocr = require('../server/ocr');

var upload = multer(
        {
            dest: './.tmp/',
            inMemory: false
        }
    );

module.exports = function(app) {

    app.use(multer(
        {
            dest: './.tmp/',
            inMemory: false
        }
    ));

    app.post("/api/ocr",  process);

};

var options = {
    l: config("OCR_OPTIONS_lang") || 'deu',
    psm:  config("OCR_OPTIONS_psm") || 6
};

/**
 * Following steps done under this functions.
 *
 * 1. Uploads image under '.tmp' folder.
 * 2. Grab text from image using 'tesseract-ocr'.
 * 3. Delete image from hardisk.
 * 4. Return text in json format.
 *
 * @param req
 * @param res
 */
var process = function(req, res) {

    var path = req.files.file.path;

    // Recognize text of any language in any format
    tesseract.process(path, options, function(err, text) {
        if(err) {
            console.error(err);
        } else {
            fs.unlink(path, function (err) {
                if (err){
                    res.json(500, "Error while scanning image");
                }
                console.log('successfully deleted %s', path);
            });
            
            var client;
            try {
                    client = await(pool.connect());
                    await(ocr.saveResult(res, client, options, text));
                    await(client.release());
                } catch (error) {
                    console.log('Error: %s', error)
                    res.json(500, "Error while accessing db");
                    if (client !== undefined) {
                        await(client.release(true));
                    }
                    return;
            };
            console.log('result (text) %s', text);
            res.json(200, text);
                
        };
    });

};