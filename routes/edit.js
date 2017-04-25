var mysql = require('mysql');
// 引入数据库配置文件
var dbConfig = require('../config/DBconfig.js');
// 引入sql语句
var useSql = require('../config/sqlConfig.js');

var express = require('express');
var router = express.Router();

// 规范返回格式
var responseJSON = function (res, result) {
	if(typeof res === 'undefined') { 
		res.json({
			status:'-200',
			msg: '操作失败'
		}); 
	} else {
		var finalResult = {
			status: 0,
			msg: '操作成功'
		};
		if (Array.isArray(result)) {
			finalResult.data = result;
		}
		res.json(finalResult);
	}
};

// 创建一个连接池
var pool = mysql.createPool(dbConfig.mysql);

// 查询单个
router.post('/queryone', function(req, res) {
	pool.getConnection(function(err, connection) {
		var param = req.body;
		connection.query(useSql.queryOne, [param.id], function(err, result) {
			if (err) {
				console.log('查询失败', err);
			} else {
				responseJSON(res, result);
			}
			connection.release();
		})
	})
})

// 更新
router.post('/update', function(req, res) {
	pool.getConnection(function(err, connection) {
		var param = req.body;
		var id = param.id;
		delete param.id; // 删除id属性
		connection.query(useSql.update, [param, id], function(err, result) {
			if (err) {
				console.log();
				console.log('更新失败', err);
			} else {
				responseJSON(res, result);
			}
			connection.release();
		})
	})
})

module.exports = router;