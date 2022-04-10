// Require Express.js
const express = require('express');
const app = express();
const { argv } = require('process');
const morgan = require('morgan')
const fs = require('fs')

// Get Port
const args = require("minimist")(process.argv.slice(2));
var port = args.port || 5000;

// Start an app server
const server = app.listen(port, () => {
  console.log('App listening on port %PORT%'.replace('%PORT%',port));
});


args["debug"]
const debug = args.debug
args["log"]
const log = args.log
args["help"]

// Documentation
if (args.help === true) {
  console.log('server.js [options]\
  \n--port	Set the port number for the server to listen on. Must be an integer between 1 and 65535.\
  \n--debug	If set to `true`, creates endlpoints /app/log/access/ which returns a JSON access log from the database and /app/error which throws an error with the message "Error test successful." Defaults to `false`.\
  \n--log		If set to false, no log files are written. Defaults to true. Logs are always written to database.\
  \n--help  Return this message and exit.')
  process.exit(0)
}

if (debug === true) {
  // Access log endpoint
  app.get('/app/logs/access', (req,res) => {
    // return all records in accesslog table
  })

  // Error endpoint
  app.get('/app/error', (req,res) => {
    throw new Error('Error test successful')
  })
}

if (log === true) {
  // Use morgan for logging to files
  // Create a write stream to append (flags: 'a') to a file
  const WRITESTREAM = fs.createWriteStream('FILE', { flags: 'a' })
  // Set up the access logging middleware
  app.use(morgan('FORMAT', { stream: WRITESTREAM }))
}

function coinFlip() {
    let flip = Math.floor(Math.random() * 2);
    if (flip < 1) {
      return "tails";
    }
    else if (flip >= 1) {
      return "heads";
    }
}

function coinFlips(flips) {
    var results = [flips];
    for (let i = 0; i < flips; i++) {
        results[i] = coinFlip();
    }
    return results;
}

function countFlips(array) {
    let heads_num = 0;
    let tails_num = 0;
    if(array.length > 1) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] == 'tails') {
          tails_num += 1;
        }
        else if (array[i] == 'heads') {
          heads_num += 1;
        }
      }
    }
    else if (array.length == 1) {
      if (array[0] == 'tails') tails_num += 1;
      else if (array[0] == 'heads') heads_num += 1;
    }
    if (heads_num == 0) return {tails: tails_num};
    else if (tails_num == 0) return {heads: heads_num};
    else return {heads: heads_num, tails: tails_num};
}

function flipACoin(call) {
    let toss = coinFlip();
    if (toss.toUpperCase() == call.toUpperCase()) return {call: call, flip: toss, result: "win"};
    else return {call: call, flip: toss, result: "lose"} ;
}

app.get('/app/', (req,res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead(res.statusCode, {'Content-Type' : 'text/plain'});
        res.end(res.statusCode+ ' ' +res.statusMessage);
});

// Endpoint definitions
app.get('/app/flip', (req,res) => {
    res.contentType('text/json');
    res.status(200).json({'flip' : coinFlip()});
});

app.get('/app/flips/:number', (req, res) => {
    res.contentType('text/json');
    const flips = coinFlips(req.params.number);
    const count = countFlips(flips);
    res.status(200).json({'raw':flips,'summary' : count});
});

app.get('/app/flip/call/heads', (req,res) => {
    res.contentType('text/json');
    res.status(200).json(flipACoin('heads'));
});

app.get('/app/flip/call/tails', (req,res) => {
    res.contentType('text/json');
    res.status(200).json(flipACoin('tails'));
});

app.use(function(req,res) {
    res.status(404).end('Endpoint does not exist');
    res.type('text/plain');
});

// Default response for any other request
app.use(function(req,res){
    res.status(404).send('404 NOT FOUND');
});