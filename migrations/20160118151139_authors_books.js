exports.up = function(knex, Promise) {
  	return knex.schema.createTable('authors_books', function(table) {
  		table.increments().primary(); 
  		table.integer('book_id').unsigned().references('id')
  		.inTable('books').onDelete('cascade');
  		table.integer('author_id').unsigned().references('id')
  		.inTable('authors').onDelete('cascade');
  	});
};

exports.down = function(knex, Promise) {
  	 return knex.schema.dropTable('authors_books');
};
