var express = require('express');
var session = require('express-session');
var md5 = require('md5'); //요즘은 안쓰는 추세 대신 sha256
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var FileStore = require('session-file-store')(session);
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'asdffsdsfdaw23@#$@few',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host:'localhost',
        port:3306,
        user:'root',
        password:'1111',
        database:'o2'
    })
}));
app.get('/count', function(req, res){
    if(req.session.count){
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : '+req.session.count);
});
app.get('/auth/logout', function(req, res){
    delete req.session.displayName;
    req.session.save(function(){
        res.redirect('/welcome');
    })
});
app.get('/welcome', function(req, res){
    if(req.session.displayName){
        res.send(`
        <h1>Hello, ${req.session.displayName}</h1>
        <a href="/auth/logout">logout</a>
        `);
    } else {
        res.send(`
        <h1>Welcome</h1>
        <ul>
            <li>
                <a href="/auth/login">Login</a>
            </li>
            <li>
                <a href="/auth/register">Register</a>
            </li>
        </ul>
        `);
    }
});
app.post('/auth/login', function(req, res){
    var uname = req.body.username;
    var pwd = req.body.password;
    for(var i = 0; i < users.length; i++){
        var user = users[i];
        if(uname === user.username){
            return hasher({password: pwd, salt:user.salt}, function(err, pass, salt, hash){
                if(hash === user.password){
                    req.session.displayName = user.displayName;
                    req.session.save(function(){
                        res.redirect('/welcome');
                    })
                } else {
                    res.send('Who are you? <a href="/auth/login">login</a>');
                }
            });
        }
        /*if(uname === user.username && sha256(pwd+user.salt) === user.password){
            req.session.displayName = user.displayName;
            return req.session.save(function(){
                res.redirect('/welcome');
            }); //save가 끝난 다음에 welcome 페이지로 이동
        }*/ 
    }
});
var users = [
    {
        username:'egoing',
        password:'15OYli2RFcY6qg/AEP+VzOwMGWNF5JBUaMgBTmydClDpMmMkt5Dqep2sPBX/cbKqbqzr66RrOsOuhpY5iExr+J91fB7kfTVqRg4tX63DhDTdUh9Gt7QHIP7dB+WodY+Oor+NczHRqb5ts0MYZd0EYUxeLizEKGCpXiEK02NjfUo=',
        salt: 'dvE3DlFhWvCFJT1yjCPmWVq8utIN161lC4WLERaGJevvmZCwvC243y/uUS9koTa1SJAqC1YJrhcPxXma9xFjDw==',
        displayName:'Egoing'
    }
]; //나쁜방식
app.post('/auth/register', function(req, res){
    hasher({password:req.body.password}, function(err, pass, salt, hash){
        var user = {
            username:req.body.username,
            password:hash,
            salt:salt,
            displayName:req.body.displayName
        };
        users.push(user);
        console.log(users);
        req.session.displayName = req.body.displayName;
        req.session.save(function(){
            res.redirect('/welcome');
        });
    });
});
app.get('/auth/register', function(req, res){
    var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
        <p>
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="text" name="displayName" placeholder="display name">
        <p>
            <input type="submit">
        </p>
    </form>
    `;
    res.send(output);
})
app.get('/auth/login', function(req, res){
    var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
        <p>
            <input type="text" name="username" placeholder="username">
        </p>
        <p>
            <input type="password" name="password" placeholder="password">
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    <a href="/auth/register">register</a>
    `;
    res.send(output);
})
app.listen(3003, function(){
    console.log('Connected 3003 port!!!');
});

// session은 로그인 기록처럼 남의 컴퓨터에서는 안남는다. (보안성 강화)