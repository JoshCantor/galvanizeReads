exports.up = function(knex, Promise) {
  	return knex.schema.table('books', function(table) {
  		table.dropColumn('author_id');
  	});
};

exports.down = function(knex, Promise) {
  	 return knex.schema.table('books', function(table) { 
  	 	table.string('author_id');
  	 });
};