
var tesseract = require('node-tesseract');
var multer  = require('multer');
var fs = require('fs');

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const pool = require('../server/db');
const ocr = require('../libs/ocr');
var Product = require('../libs/classProduct');
var Receipt = require('../libs/classReceipt');
var ReceiptItem = require('../libs/classReceiptItem');

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

    app.post("/api/ocr", process);

    app.get("/api/receipts", receipts);
    app.get("/api/receipts/:id", receipts);

    app.get("/api/products", products);
    app.get("/api/products/:id", products);

    app.get("/api/receiptitems", receiptitems);
    app.get("/api/receiptitems/:id", receiptitems);

};

var products = function (req, res) {
        var client;
        async(function (res) {
            try {
                client = await(pool.connect());
                var dbProducts = await(new Product().get(client, req.params.id));

                var dbReceiptItems;
                if (req.params.id){
                    console.log(dbProducts);
                    dbReceiptItems = await(new ReceiptItem(null,req.params.id,null,null).get(client));
                    console.log(dbReceiptItems);
                }

                res.json({
                        products: dbProducts,
                        receiptitems: dbReceiptItems
                    });

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
                var dbReceipts = await(new Receipt().get(client, req.params.id));
                res.json({receipts: dbReceipts});
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
                var dbReceiptItems = await(new ReceiptItem().get(client, req.params.id));
                res.json({receiptitems: dbReceiptItems});
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
var process = function(req, res) {

    var path = req.files.file.path;

    // Recognize text of any language in any format
    tesseract.process(path, ocr.getOptions(), function(err, text) {
        if(err) {
            console.error(err);
        } else {
            fs.unlink(path, function (err) {
                if (err){
                    res.json(500, "Error while scanning image");
                }
                console.log('successfully deleted %s', path);
            });
            async(function (res, text) {
                var client;
                try {
                        client = await(pool.connect());
                        await(ocr.saveResult(res, client, text));
                        await(client.release());
                    } catch (error) {
                        console.log('%s', error)
                        res.json(500, "Error while accessing db");
                        if (client !== undefined) {
                            await(client.release(true));
                        }
                };
            })(res, text);
            console.log('result (text) %s', text);
            res.json(200, text);
                
        };
    });

};