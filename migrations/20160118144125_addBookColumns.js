exports.up = function(knex, Promise) {
  	return knex.schema.table('books', function(table) {
  		table.string('cover_art_url');
  		table.string('description');
  	});
};

exports.down = function(knex, Promise) {
  	 return knex.schema.table('books', function(table) { 
  	 	table.dropColumn('cover_art_url');
  		table.dropColumn('description');
  	 });
};
