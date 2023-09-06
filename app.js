var express = require('express');
var bodyParser = require('body-parser')//post 정보 가져오기
var app = express();
app.locals.pretty = true; //temp 템플릿 예쁘게 만들기(jade)
app.set('view engine', 'jade'); // jade 세팅
app.set('views', './views');
app.use(express.static('public')); //static은 변경시 바로 실행 가능
app.use(bodyParser.urlencoded({extended: false}));
app.get('/form', function(req, res){
    res.render('form');
});
app.get('/form_receiver', function(req, res){
    var title = req.query.title;
    var description = req.query.description;
    res.send(title+','+description);
})
app.post('/form_receiver', function(req, res){
    var title = req.body.title; //body-parser이용해 사용 가능
    var description = req.body.description;
    res.send(title+','+description);
})
app.get('/topic/:id', function(req, res){
    var topics = [
        'Javascript is ...',
        'Nodejs is ...',
        'Express is ...',
    ];
    var output = `
        <a href = "/topic?id=0">JavaScript</a><br>
        <a href = "/topic?id=1">Nodejs</a><br>
        <a href = "/topic?id=2">Express</a><br>
        ${topics[req.params.id]}
    `
    res.send(output);
})
app.get('/topic/:id/:mode', function(req, res){
    res.send(req.params.id+','+req.params.mode);
})
app.get('/template', function(req, res){
    res.render('temp', {time:Date(), _title:'Jade'});
})
app.get('/', function(req, res){
    res.send('Hello home page');
});
app.get('/dynamic', function(req, res){
    var lis = '';
    for(var i = 0;i < 5;i++){
        lis = lis + '<li>coding</li>';
    }
    var output = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title></title>
        </head>
        <body>
            Hello, dynamic!;
            <ul>
                ${lis}
            </ul>
        </body>
    </html>`;
    res.send(output);
})
app.get('/login', function(req, res){
    res.send('Login please');
})
app.listen(3000, function(){
    console.log("Connected 3000 port!");
})