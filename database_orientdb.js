var OrientDB = require('orientjs');

var server = OrientDB({
    host: 'localhost', //같은 컴퓨터 안에서 존재하므로
    port: 2424,
    username: 'root',
    password: '****'
});
var db = server.use('o2');

/*
db.record.get('#35:0')
.then(function(record){
    console.log('Loaded record:', record);
});
*/

var sql = 'SELECT FROM topic';
db.query(sql).then(function(results){
    console.log(results);
});