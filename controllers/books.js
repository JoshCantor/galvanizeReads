var express = require('express'),
	router = express.Router(),
	knex = require('../db/knex');

router.get('/', function(req, res) {
	knex('books').then(function(books) {
		knex('categories').then(function(categories) {
			res.render('../views/books/index', {books: books, categories:categories});
		});
	});
});

router.get('/new', function(req, res) {
	res.render('../views/books/new');
});

router.post('/new', function(req, res) {
	var title = req.body.title,
		category = req.body.category,
		url = req.body.url,
		description = req.body. description;
	knex('categories').where({name: category})
	.then(function(result) {
		if(result.length === 0) {
			knex('categories').insert({name: category}).returning('id')
			.then(function(id) {
				addBook(title, id, url, description, res);
			});
		} else {
			addBook(title, result[0].id, url, description, res);
		}
	})
});

function addBook (title, categoryId, url, description, res) {
	knex('books').insert({title: title, cover_art_url: url, description: description}).returning('id')
	.then(function(id){
		knex('books_categories').insert({book_id: id[0], category_id: categoryId[0]})
		.then(function() {
			res.redirect('/books');
		})
	});
}

router.get('/:id', function(req, res) {
	var bookId = req.params.id;
	knex('books').where({id: bookId})
	.then(function(book) {
		knex('books_categories').where({book_id: bookId}).returning('id')
		.then(function(result) {
			var categoryIds = [];
			result.forEach(function(row) {
				categoryIds.push(row.category_id);	
			});
			knex('categories').whereIn('id', categoryIds)
			.then(function(categories) { 
					res.render('../views/books/update', {book: book[0], categories: categories});
			});
		});
	});	
});

router.post('/:id', function(req, res) {
	var newGenre = req.body.name,
		bookId = req.params.id;
	knex('categories').where({name: newGenre})
	.then(function(category) {
		if (category.length === 0 ) {
			knex('categories').insert({name: newGenre}).returning('id')
			.then(function(id) {
				var categoryId = id[0];
				addCatToBook(bookId, categoryId, res);
			});
		} else {
			knex('categories').where({name: newGenre})
			.then(function(category) {
				var categoryId = category[0].id;
				addCatToBook(bookId, categoryId, res);
			});
		}
	});
});

function addCatToBook (bookId, categoryId, res) {
	knex('books_categories').insert({book_id: bookId, category_id: categoryId})
	.then(function() {
		res.redirect('/books');
	});
}

router.delete('/category/:bookId/:categoryId', function(req, res) {
	var bookId = req.params.bookId,
		categoryId = req.params.categoryId;
	knex('books_categories').where({book_id: bookId, category_id: categoryId}).del()
    .then(function() {
        res.redirect('/books/' + bookId);
    });
});

router.delete('/categories/:categoryId', function(req, res) {
	var categoryId = req.params.categoryId;
	console.log('id',categoryId);
	knex('categories').where({id: categoryId}).del()
    .then(function() {
        res.redirect('/books');
    });
});

module.exports = router;