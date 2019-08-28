const prom = require('prom-client')
Register = require('prom-client').register

const collectDefaultMetrics = prom.collectDefaultMetrics

collectDefaultMetrics({ timeout: 5000 })

var express = require('express');
var app = express();

var timer_http_request = new prom.Summary({
  name: 'timer_http_request',
  help: 'Time http request',
  maxAgeSeconds: 600,
  ageBuckets: 10,
  labelNames: ['app', 'host', 'path']
})

app.get('/', function (req, res) {
  this.start = new Date();
  res.send('Hello World!');
  opts = {}
  opts.app = 'testsummary'
  opts.host = require('os').hostname()
  opts.path = req.path
  timeSpan = new Date - this.start
  timer_http_request.observe(opts, timeSpan);
});

app.get('/metrics', function (req, res) {
  res.set('Content-Type', Register.contentType)
  res.end(Register.metrics())
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
