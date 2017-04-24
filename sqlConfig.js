// sql语句
module.exports = {
	// insert: 'insert into person(id, name, age) values(null, ?, ?)',
	insert: 'insert into person set ?',
	delete: 'delete from person where id = ?',
	update: 'update person set ? where id = ?',
	queryAll: 'select * from person',
	queryOne: 'select * from person where id = ?',
	reset: 'truncate person'
};