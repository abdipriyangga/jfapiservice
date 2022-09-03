require('dotenv').config();
const secret = process.env.WEBHOOK_SECRET;
const repo = "~/home/jfservice/JFAPI-SERVICE/";

const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

http.createServer(function (req, res) {
  req.on('data', function (chunk) {
    let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

    if (req.headers['x-hub-signature'] == sig) {
      exec('cd ' + repo + ' && git pull');
    }
  });

  res.end();
}).listen(3450);