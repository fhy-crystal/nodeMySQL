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

// 插入数据
router.post('/add', function(req, res) {
	// req.body 获取json格式传递的参数
	console.log(req.body);
	pool.getConnection(function(err, connection) {
		var param = req.body;
		// 建立连接，插入数据
		connection.query(useSql.insert, [param], function(err, result) {
			if (err) {
				console.log('插入失败', err);
			} else {
				responseJSON(res, result);
			}
			// 释放连接
			connection.release();
		})
	})
})

// 查询所有
router.get('/query', function(req, res) {
	pool.getConnection(function(err, connection) {
		connection.query(useSql.queryAll, function(err, result) {
			if (err) {
				console.log('查询失败', err);
			} else {
				responseJSON(res, result);
			}
			connection.release();
		})
	})
})

// 删除
router.post('/delete', function(req, res) {
	pool.getConnection(function(err, connection) {
		var param = req.body;
		connection.query(useSql.delete, [param.id], function(err, result) {
			if (err) {
				console.log('删除失败', err);
			}
			if (result) {
				responseJSON(res, result);
			}
			// 释放连接
			connection.release();
		})
	})
})

// 清空表格
router.get('/reset', function(req, res) {
	pool.getConnection(function(err, connection) {
		connection.query(useSql.reset, function(err, result) {
			if (err) {
				console.log('重置失败', err);
			} else {
				responseJSON(res, result);
			}
			// 释放连接
			connection.release();
		})
	})
})

module.exports = router;
