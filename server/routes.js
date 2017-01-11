
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

    // REST-API Endpoints

    app.post("/api/ocr", ocrengine);

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

/**
 * get all/specific product(s)
 */
var products = function (req, res) {
    var client;
    async(function (res) {
        try {
            client = await(pool.connect());
            var dbProducts = await(new Product().get(client, req.params.productid));
            var response = { products: dbProducts };
            res.json(response);
            console.log(response);
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
 * get all/specific receipt(s)
 */
var receipts = function (req, res) {
    var client;
    async(function (res) {
        try {
            client = await(pool.connect());
            var dbReceipts = await(new Receipt().get(client, req.params.receiptid));
            var response = { receipts: dbReceipts };
            res.json(response);
            console.log(response);
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

/**
 * get all/specific receiptitem(s)
 */
var receiptitems = function (req, res) {
    var client;
    async(function (res) {
        try {
            client = await(pool.connect());
            var dbReceiptItems = await(new ReceiptItem(req.params.receiptid, req.params.productid, null, null).get(client, req.params.receiptitemid));
            var response = { receiptitems: dbReceiptItems };
            res.json(response);
            console.log(response);
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
 * get all/specific ocrresult(s)
 */
var ocrresults = function (req, res) {
    var client;
    async(function (res) {
        try {
            client = await(pool.connect());
            var dbOCRResults = await(new OCRResult(null, req.params.receiptid).get(client, req.params.ocrresultid));
            var response = { ocrresults: dbOCRResults };
            res.json(response);
            console.log(response);
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
 * 2. Uploads image to cloud server (storage & transformation)
 * 3. Downloads transformed image from cloud server
 * 4. Grab text from image using 'tesseract-ocr'.
 * 5. Delete image from hardisk.
 * 6. Processes recognized text with prototype engine.
 * 7. Returns text and created/related records in json format.
 *
 * @param req
 * @param res
 */
var ocrengine = function (req, res) {

    //console.log(req)

    var filepathlocal = req.files.file.path;
    var filepathcloud;
    var result;

    // Upload image to cloud server
    let uploadcloud = superagent.post(CLOUDINARY_UPLOAD_URL)
        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        .field('file', fs.createReadStream(filepathlocal));


    uploadcloud.end((err, response) => {
        if (err) {
            console.error(err);
        } else {
            // delete image from local server
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

            //download transformed image from cloud server (only local images can be processed by tesseract)
            var writeFile = fs.createWriteStream(filepathlocal);

            request(filepathcloud).pipe(writeFile).on('close', function () {
                console.log(filepathcloud, 'saved to', filepathlocal)

                var ocr = new OCR();
                console.log(`tesseract.process(${filepathlocal}, ${ocr.options}`);

                // Recognize text by tesseract
                tesseract.process(filepathlocal, ocr.options, function (err, text) {
                    if (err) {
                        console.error(err);
                        res.json(500, "Error while processing tesseract");
                    } else {
                        
                        // delete transformed image from local server
                        fs.unlink(filepathlocal, function (err) {
                            if (err) {
                                res.json(500, "Error while deleting image");
                            }
                            console.log('successfully deleted %s', filepathlocal);

                            async(function (res, ocr, text) {
                                var client;
                                try {
                                    // db access
                                    client = await(pool.connect());

                                    // create & save dummy receipt (TODO: receipt information out of ocr result)
                                    var receipt = await(new Receipt(null, null, 0, new Date()));
                                    await(receipt.save(client));
                                    ocr.receipt = receipt.getId();
                                    
                                    // process image result in prototype engine
                                    result = ocr.process(client, text, filepathcloud);
                                    
                                    // submit to db
                                    await(client.release());

                                    console.log('result (text) %s', text);
                                    res.json(200, result);
                                } catch (error) {
                                    console.log('%s', error)
                                    res.json(500, "Error in ocr engine");
                                    if (client !== undefined) {
                                        await(client.release(true));
                                    }
                                };
                            })(res, ocr, text);

                            
                        });
                    };



                });

            });

        }

    })
};