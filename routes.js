var express = require('express');
var router = express.Router();
const url = require('url');    

var config = require('./config');
var Call = require('./call');

// Create a new Call instance, and redirect
router.get('/new', function(req, res) {
  console.log('creating new call');
  var call = Call.create();
  console.log(call);
  res.redirect('/' + call.id);
});

router.get('/oca/new/:id', function(req, res) {
  console.log('creating NEW OCA call');
  var call = Call.create(req.param('id'));
  console.log(call);
  res.send(call);
});

// Add PeerJS ID to Call instance when someone opens the page
router.post('/:id/addpeer/:peerid', function(req, res) {
  var call = Call.get(req.param('id'));
  if (!call) return res.status(404).send('Call not found');
  call.addPeer(req.param('peerid'));
  console.log('peer added');
  res.json(call.toJSON());
});

// Remove PeerJS ID when someone leaves the page
router.post('/:id/removepeer/:peerid', function(req, res) {
  var call = Call.get(req.param('id'));
  if (!call) return res.status(404).send('Call not found');
  call.removePeer(req.param('peerid'));
  res.json(call.toJSON());
});

// Return JSON representation of a Call
router.get('/:id.json', function(req, res) {
  var call = Call.get(req.param('id'));
  if (!call) return res.status(404).send('Call not found');
  res.json(call.toJSON());
});

// Render call page
router.get('/:id', function(req, res) {
  var call = Call.get(req.param('id'));
  if (!call) return res.redirect('/new');

  res.render('call', {
    apiKey: config.peerjs.key,
    call: call.toJSON()
  });
});

router.get('/oca/:id', function(req, res) {
  var call = Call.get(req.param('id'));
  if (!call) return res.redirect('/new');

  res.send({
    apiKey: config.peerjs.key,
    call: call.toJSON()
  });
});



// Landing page
router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;