
var tesseract = require('node-tesseract');
var multer = require('multer');
var fs = require('fs');

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const pool = require('../server/db');
const OCR = require('../libs/ocr');
var OCRResult = require('../libs/classOCRResult')
var Product = require('../libs/classProduct');
var Receipt = require('../libs/classReceipt');
var ReceiptItem = require('../libs/classReceiptItem');

var superagent = require('superagent');
var request = require('request')

const CLOUDINARY_UPLOAD_PRESET = config("CLOUDINARY_UPLOAD_PRESET") || 'o5dy6l5w';
const CLOUDINARY_UPLOAD_URL = config("CLOUDINARY_UPLOAD_URL") || 'https://api.cloudinary.com/v1_1/hdvhoxcbj/image/upload';

var upload = multer(
    {
        dest: './.tmp/',
        inMemory: false
    }
);

module.exports = function (app) {

    app.use(multer(
        {
            dest: './.tmp/',
            inMemory: false
        }
    ));

    app.post("/api/ocr", process);

    app.get("/api/ocrresults", ocrresults);
    app.get("/api/ocrresults/:ocrresultid", ocrresults);

    app.get("/api/receipts", receipts);
    app.get("/api/receipts/:receiptid", receipts);
    app.get("/api/receipts/:receiptid/ocrresults", ocrresults);
    app.get("/api/receipts/:receiptid/receiptitems", receiptitems);

    app.get("/api/receiptitems", receiptitems);
    app.get("/api/receiptitems/:receiptitemid", receiptitems);

    app.get("/api/products", products);
    app.get("/api/products/:productid", products);
    app.get("/api/products/:productid/receiptitems", receiptitems);

};

var products = function (req, res) {
    var client;
    async(function (res) {
        try {
            client = await(pool.connect());
            var dbProducts = await(new Product().get(client, req.params.productid));
            res.json({ products: dbProducts });

            if (client !== undefined) {
                client.release(true);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send();
            if (client !== undefined) {
                client.release(true);
            }
        }
    })(res);
}

var receipts = function (req, res) {
    var client;
    async(function (res) {
        try {
            client = await(pool.connect());
            var dbReceipts = await(new Receipt().get(client, req.params.receiptid));

            res.json({ receipts: dbReceipts });
            if (client !== undefined) {
                client.release(true);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send();
            if (client !== undefined) {
                client.release(true);
            }
        }
    })(res);
};

var receiptitems = function (req, res) {
    var client;
    async(function (res) {
        try {
            client = await(pool.connect());
            var dbReceiptItems = await(new ReceiptItem(req.params.receiptid, req.params.productid, null, null).get(client, req.params.receiptitemid));
            res.json({ receiptitems: dbReceiptItems });
            if (client !== undefined) {
                client.release(true);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send();
            if (client !== undefined) {
                client.release(true);
            }
        }
    })(res);
}

var ocrresults = function (req, res) {
    var client;
    async(function (res) {
        try {
            client = await(pool.connect());
            var dbOCRResults = await(new OCRResult(null, req.params.receiptid).get(client, req.params.ocrresultid));
            res.json(dbOCRResults);
            if (client !== undefined) {
                client.release(true);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send();
            if (client !== undefined) {
                client.release(true);
            }
        }
    })(res);
}

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
var process = function (req, res) {

    //console.log(req)

    var filepathlocal = req.files.file.path;
    var filepathcloud;
    var result;

    // ####################
    let uploadcloud = superagent.post(CLOUDINARY_UPLOAD_URL)
        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        .field('file', fs.createReadStream(filepathlocal));


    uploadcloud.end((err, response) => {
        if (err) {
            console.error(err);
        } else {
            fs.unlink(filepathlocal, function (err) {
                if (err) {
                    res.json(500, "Error while deleting image");
                }
                console.log('successfully deleted %s', filepathlocal);
            });
        }

        if (response.body.secure_url !== '') {
            filepathcloud = response.body.secure_url;
            console.log("filepathcloud:", filepathcloud);

            // ###########################

            var writeFile = fs.createWriteStream(filepathlocal);

            request(filepathcloud).pipe(writeFile).on('close', function () {
                console.log(filepathcloud, 'saved to', filepathlocal)

                var ocr = new OCR();

                console.log(`tesseract.process(${filepathlocal}, ${ocr.options}`);

                // Recognize text of any language in any format
                tesseract.process(filepathlocal, ocr.options, function (err, text) {
                    if (err) {
                        console.error(err);
                        res.json(500, "Error while processing tesseract");
                    } else {

                        fs.unlink(filepathlocal, function (err) {
                            if (err) {
                                res.json(500, "Error while deleting image");
                            }
                            console.log('successfully deleted %s', filepathlocal);

                            async(function (res, ocr, text) {
                                var client;
                                try {
                                    client = await(pool.connect());

                                    var receipt = await(new Receipt(null, null, 0, new Date()));
                                    await(receipt.save(client));
                                    ocr.receipt = receipt.getId();

                                    result = ocr.process(client, text, filepathcloud);
                                    await(client.release());
                                } catch (error) {
                                    console.log('%s', error)
                                    res.json(500, "Error while accessing db");
                                    if (client !== undefined) {
                                        await(client.release(true));
                                    }
                                };
                            })(res, ocr, text);

                            console.log('result (text) %s', text);
                            res.json(200, result);
                        });
                    };



                });

            });

        }

    })
};