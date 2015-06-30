// var express = require('express')
// var app = express()
// 
// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })
// 
// var server = app.listen(5000, function () {
// 
//   var host = server.address().address
//   var port = server.address().port
// 
//   console.log('Example app listening at http://%s:%s', host, port)
// 
// })

var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: '5zLQG35QzfZp8KCrgcHoMKxhH',
  consumer_secret: 'O7llcLCmEYaoEWY7VOWdH0IagmCLbU1cfuOSDuBdMIBEeNEl95',
  access_token_key: '128040954-qcv4RhxSzkPWWghtQOUt2FpjjbQ6a2OdiiBTa2PG',
  access_token_secret: 'tW9RC2m56ZXfLGNQBLxSnIcuDGMrffEEgF7pJS0vyjzR9'
});
 
var params = {screen_name: 'thedemigs', trim_user: true};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    // console.log(tweets);
    console.log(tweets.length);
  }
});