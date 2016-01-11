exports.up = function(knex, Promise) {
  	return knex.schema.createTable('non_fiction', function(table) {
  		table.increments().primary(); 
  		table.string('title');
  		table.integer('book_id').unsigned().references('id')
  		.inTable('books').onDelete('cascade');
  	});
};

exports.down = function(knex, Promise) {
  	 return knex.schema.dropTable('non_fiction');
};