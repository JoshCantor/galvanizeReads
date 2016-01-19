var express = require('express'),
	router = express.Router(),
	knex = require('../db/knex');

router.get('/', function(req, res) {
	knex('authors')
	.then(function(authors) {
		if (authors.length === 0) {
			res.redirect('/authors/new');
		} else {
			var authorsBooks = 0;
			authors.forEach(function(author) {
				knex('authors_books').where({author_id: author.id}).returning('book_id')
				.then(function(books) {
					// below need work getting books to render
					// var bookIds = [];
					// books.forEach(function(book) {
					// 	bookIds.push(book.id);
					// });
					// console.log('ids', bookIds);
					// knex.select('title').from('books').whereIn('id', bookIds)
					// .then(function(titles) {
					// 	console.log('TIIIITLES', titles);
					// })
					author.books = books;
					authorsBooks += 1;
					if (authorsBooks === authors.length) {
						console.log('authors', authors);
						res.render('../views/authors/list', {authors: authors});
					}
				});
			});
		}
	});
});	

router.get('/new', function(req, res) {
	knex('books').then(function(books) {
		res.render('../views/authors/new', {books: books});
	})
});

router.post('/new', function(req, res) {
	var name = req.body.name,
		portraitUrl = req.body.url,
		bio = req.body.bio,
		bookIds = req.body.bookList;
	knex('authors').insert({name: name, portrait_url: portraitUrl, biography: bio})
	.returning('id').then(function(authorId) { 
		console.log('authorId', authorId);
		var bookCounter = 0;
		bookIds.forEach(function(bookId) {
			console.log('bookId', bookId);
			knex('authors_books').insert({author_id: authorId[0], book_id: bookId})
			.then(function() {
				bookCounter += 1;
				if (bookCounter === bookIds.length) {
					res.redirect('/');
				}
			});
		});	
	});
});

router.get('/:id', function(req, res) {
	knex('authors').where({id: req.params.id})
	.then(function(author) {				
		knex('books').where({author_id: author[0].id})
		.then(function(books) {
			author[0].books = books;
			console.log('books', books);
			res.render('../views/authors/author', {authors: author});
		});
	});
});

router.get('/update/:id', function(req, res) {
	knex('authors').where({id: req.params.id}).then(function(author) {
		console.log(author[0]);
		res.render('../views/authors/update', {author:author[0]});
	});
});

router.put('/:id', function(req, res) {
	var id = req.params.id,
		name = req.body.name,
		url = req.body.url,
		bio = req.body.bio;
    knex('authors').where({id: id}).update({name: name, portrait_url: url, biography: bio})
    .then(function(){
        res.redirect('/authors');
    });
});

router.get('/delete/:id', function(req, res) {
	knex('authors').where({id: req.params.id})
	.then(function(author) {
		author.books = [];				
		res.render('../views/authors/remove', {authors: author});
	});
})

router.delete('/delete/:id', function(req, res) {
	knex('authors').where({id:req.params.id}).del()
    .then(function(result) {
        res.redirect('/authors');
    });
});


module.exports = router;