
var requ = require('request');  /* npm install request */
var fs = require('fs');

module.exports = function (request, response) {

var file_path = './assets/8.jpg';

if (! (process.env.OCRESTFUL_BASE_URL && process.env.OCRESTFUL_API_SECRET)) {
  console.log("ERROR: you must import the OCRestful environment variables OCRESTFUL_BASE_URL and OCRESTFUL_API_SECRET");
} else {
  fs.createReadStream(file_path).pipe(
    /* always post to '/res' to get your document run through OCR */
    requ.post({ url: process.env.OCRESTFUL_BASE_URL + 'res', headers: {secret: process.env.OCRESTFUL_API_SECRET} }, function(postErr, postResp, postBody) {
      if (!postErr) {
        /* You'll find links to different representations in the "links" member of the response. You could also just grab the url from res.headers.location, which will be the same URL as links.self */
        postBody_parsed = JSON.parse(postBody);

        /* wait a bit and then retrieve our OCR results */
        console.log("just a sec while the squirrels do their work...");
        setTimeout(function() {
          requ.get({url: postBody_parsed.links.json.href, headers: {secret: process.env.OCRESTFUL_API_SECRET} }, function(getErr, getResp, getBody) {
            if (!getErr) {
              var results = recurse_through_results(JSON.parse(getBody));
              console.log(JSON.stringify(results));
              response.send(results);
            }
          });
        }, postBody_parsed.eta);
      }
    })
  );
}

var recurse_through_results = function(ocrResults) {
  var handle_node = function(node) { /* inner recursive function to work through each node */
    switch (node.type) {
      case 'content':
        if (node.css_class === 'ocrx_word' && node.textContent) {
          all_results[node.textContent] = all_results[node.textContent] || 0;
          all_results[node.textContent] = all_results[node.textContent] + 1
        }
        break;
      default:
        if (node.children) {
          for (var i = 0; i < node.children.length; i++) {
            handle_node(node.children[i]);
          }
        }
        break;
    }
  }; /* end handle_node */

  var all_results = {}; /* set up a data structure for word counts */
  handle_node(ocrResults); /* kick it off by sending the head node into the recursive handler */
  /* now do something interesting with all the words--find the first ten words alphabetically and their frequency */
  var sorted = Object.keys(all_results).sort();
  var first_ten_results = {};
  for (var i = 0; i < 10; i++) {
    word = sorted[i];
    first_ten_results[word] = all_results[word];
  }
  return first_ten_results;
}; /* end recurse_through_results */
}