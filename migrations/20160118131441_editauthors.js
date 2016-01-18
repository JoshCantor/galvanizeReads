exports.up = function(knex, Promise) {
  	return knex.schema.table('authors', function(table) {
  		table.string('portrait_url');
  		table.string('biography');
  	});
};

exports.down = function(knex, Promise) {
  	 return knex.schema.table('authors', function(table) { 
  	 	table.dropColumn('portrait_url');
  	 	table.dropColumn('biography');
  	 });
};
