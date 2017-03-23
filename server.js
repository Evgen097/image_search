var express = require('express')
var app = express()
var bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
var request = require('request');
const MongoClient    = require('mongodb').MongoClient;
const db             = require('./config/db');




app.use(bodyParser.urlencoded({ extended: true }));

var myJSONObject = { 
    "Host": "api.cognitive.microsoft.com",
    "Ocp-Apim-Subscription-Key": "b2719d54a3ac423d85b138cfac4d1809"
}; 

function search_result_obj(body){
    var arr = body.value;
    var result_arr = [];
    //console.log(body.queryExpansions[0])
    for (var i = 0; i < arr.length; i++){
        //console.log(arr[i].name)
        var obj =
            {
                url: arr[i].contentUrl,
                snippet: arr[i].name,
                thumbnail: arr[i].thumbnailUrl,
                context: arr[i].hostPageDisplayUrl
            };
        result_arr.push(obj);
    }
    return result_arr;
}


app.get('/latest', function (req, res, next) {
    console.log("  Hello, please use path:  'https://myimagesearch.herokuapp.com/latest/imagesearch'  or   'https://myimagesearch.herokuapp.com/api/imagesearch/hotdog%20offset=20'   ")
    res.send("  Hello, please use path:  'https://myimagesearch.herokuapp.com/latest/imagesearch'  or   'https://myimagesearch.herokuapp.com/api/imagesearch/hotdog%20offset=20'   ");

}) 


app.get('/', function (req, res, next) {
    console.log("  Hello, please use path:  'https://myimagesearch.herokuapp.com/latest/imagesearch'  or   'https://myimagesearch.herokuapp.com/api/imagesearch/hotdog%20offset=20'   ")
    res.send("  Hello, please use path:  'https://myimagesearch.herokuapp.com/latest/imagesearch'  or   'https://myimagesearch.herokuapp.com/api/imagesearch/hotdog%20offset=20'   ");
})


MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  
  app.get('/latest/imagesearch', function (req, res, next) {
      
    var result_arr = [];  
    database.collection('notes').find({
      }).sort({when: -1}).limit(10)
.toArray(function(err, docs) {
        if (err) throw err;
        for(var i in docs){
            var obj = { term: docs[i].term, when: docs[i].when };
            result_arr.push( obj )
        }
        console.log('mongo latest ')
        console.log(result_arr)
        res.send(result_arr);
    }) 
  }) 
})



app.listen(port, function () {
  console.log("Server has started.")
})



/*
key for bing:  b2719d54a3ac423d85b138cfac4d1809
npm run dev

Check your git status by entering the command 'git status' into the console.
Add your files with the command 'git add .'
Commit your changes with 'git commit -m "initial commit".
Create a new GitHub repository. Then copy its .git URL.
Return to c9.io's terminal and set your GitHub remote URL: 'git remote add origin https://github.com/Evgen097/timestemp.git' followed by the URL you copied from GitHub.
Run 'git push origin master'

Open up your application in a preview tab by clicking Window > Share > Application > Open

To run your application run the command: 
node server.js






MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  app.get('/api/imagesearch/:id', function (req, res, next) {
    var term = req.params.id.split(' ')[0];
    var jsonDate = (new Date()).toJSON();

    var note = { term: term, when: jsonDate };
    console.log(note)
    
    database.collection('notes').insert(note, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        //res.send(result);
        next();
      }
    })
  })              
})



app.get('/api/imagesearch/:id', function (req, res, next) {
    var loking_item = req.params.id.split(' ')[0];
    var items_number = req.params.id.split(' ')[1].split('=')[1];
    var url = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?q="+loking_item+"&count="+items_number+"&offset=0";
    request({
        url: url, //URL to hit
        method: 'GET', //Specify the method
        headers: { //We can define headers too
            'Host': 'api.cognitive.microsoft.com',
            'Ocp-Apim-Subscription-Key': 'b2719d54a3ac423d85b138cfac4d1809'
    }
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log('Hello World!');
            var obj_from_api = search_result_obj(JSON.parse(body));
            res.send(obj_from_api);
            next();
        }
    })
    
    

});


*/