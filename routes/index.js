const { request } = require('express');
var express = require('express');
var router = express.Router();
var session;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/like', function(req, res, next){
  var url = req.query.url;
  var likes = req.query.likes;
  session=req.session;
  console.log(url+' ; '+likes);
  if (typeof session.likedata==='undefined'){
    session.likedata = [];
    console.log('new maps');
  }
  if(likes==='true'){
    session.likedata.push(url);
    console.log(session.likedata);
  }
  else{
    var index = session.likedata.indexOf(url);
    session.likedata.splice(index,1);
  }
  
  res.send('ok');
});

router.get('/likecheck', function(req, res, next){
  session=req.session;
  if (typeof session.likedata==='undefined'){
    res.json([]);
  }
  else{
    res.json(session.likedata);
  }
});

module.exports = router;
