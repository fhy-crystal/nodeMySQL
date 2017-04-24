var mysql = require('mysql');
// 引入数据库配置文件
var dbConfig = require('./DBconfig.js');
// 引入sql语句
var useSql = require('./sqlConfig.js');

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// json编码
app.use(bodyParser.json());

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE");
	res.header("X-Powered-By",' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

// 创建一个连接池
var pool = mysql.createPool(dbConfig.mysql);

// 插入数据
app.post('/postTest', function(req, res) {
	// req.body 获取json格式传递的参数
	console.log(req.body);
	pool.getConnection(function(err, connection) {
		var param = req.body;
		// 建立连接，插入数据
		connection.query(useSql.insert, [param], function(err, result) {
			if (err) {
				console.log("插入失败");
				console.log(err);
			}
			if (result) {
				res.end(JSON.stringify(result));
			}
			// 释放连接
			connection.release();
		})
	})
})

// 查询所有
app.get('/query', function(req, res) {
	pool.getConnection(function(err, connection) {
		connection.query(useSql.queryAll, function(err, result) {
			if (err) {
				console.log('查询失败');
				console.log(err);
			}
			if (result) {
				res.end(JSON.stringify(result));
			}
			connection.release();
		})
	})
})

// 查询单个
app.post('/queryone', function(req, res) {
	pool.getConnection(function(err, connection) {
		var param = req.body;
		connection.query(useSql.queryOne, [param.id], function(err, result) {
			if (err) {
				console.log('查询失败');
				console.log(err);
			}
			if (result) {
				res.end(JSON.stringify(result));
			}
			connection.release();
		})
	})
})

// 删除
app.post('/deleteTest', function(req, res) {
	pool.getConnection(function(err, connection) {
		var param = req.body;
		connection.query(useSql.delete, [param.id], function(err, result) {
			if (err) {
				console.log('删除失败');
				console.log(err);
			}
			if (result) {
				res.end(JSON.stringify(result));
			}
			connection.release();
		})
	})
})

// 更新
app.post('/updateTest', function(req, res) {
	pool.getConnection(function(err, connection) {
		var param = req.body;
		var id = param.id;
		delete param.id; // 删除id属性
		connection.query(useSql.update, [param, id], function(err, result) {
			if (err) {
				console.log('更新失败');
				console.log(err);
			}
			if (result) {
				res.end(JSON.stringify(result));
			}
			connection.release();
		})
	})
})

app.get('/reset', function(req, res) {
	pool.getConnection(function(err, connection) {
		connection.query(useSql.reset, function(err, result) {
			if (err) {
				console.log('重置失败');
				console.log(err);
			}
			if (result) {
				res.end(JSON.stringify(result));
			}
			connection.release();
		})
	})
})


//监听8081接口打印请求域名和端口
var server = app.listen(8081, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log("应用实例，访问地址为 http://%s:%s", host, port);

})

// var connection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'root',
// 	database: 'nodeMysqlDB',
// 	port: 3306
// });

// connection.connect(function(err) {
// 	if (err) {
// 		console.log('连接失败');
// 		throw(err);
// 	} else {
// 		console.log('连接成功');
		
// 	}
// });

// var table = 'create table if not exists person(id int,name varchar(255),age int(9))'
// connection.query(table, function(err,result) {
// 	if (err) {
// 		console.log("创建表失败");
// 		console.log(err);
// 	} else {
// 		console.log("创建表成功");
// 	}
// })

// connection.end(function() {
// 	console.log('已关闭');
// });