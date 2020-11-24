const { RESTDataSource } = require('apollo-datasource-rest');

class BookAPI extends RESTDataSource {
	constructor() {
		super()
		this.baseURL = "https://api.itbook.store/1.0/";
	};

	bookReducer(response) {
		return {
			title: response.title + " - " + response.subtitle,
			description: response.desc,
			authors: response.authors,
			isbn10: response.isbn10,
			isbn13: response.isbn13,
			publisher: response.publisher,
			pages: response.pages,
			year: response.year,
			image: response.image,
			url: response.url,
			pdfs: response.pdf && [response.pdf[Object.keys(response.pdf)[0]], response.pdf[Object.keys(response.pdf)[1]]]
		}
	}
	

	async getByISBN(isbn13) {
		const response = await this.get(`books/${isbn13}`);
		return this.bookReducer(response);
	}

	async getByKeyword(keyword, page) {
		let res = await this.get(`search/${keyword}/1`);
		let maxPageNumber = (Math.ceil(res.total / 10) > 100) ? 100 : Math.ceil(res.total / 10);
		if ((!!page) && (page != 1)) {
			page = (page <= maxPageNumber) ? page : maxPageNumber;
			res = await this.get(`search/${keyword}/${page}`);
		} else {
			page = 1;
		}
		const response1 = Array.isArray(res.books) ? res.books.map(book => book.isbn13) : [];
		const books = await Promise.all(response1.map(isbn13 => this.getByISBN(isbn13)));
		return { page, maxPageNumber, books };
	}

};

module.exports = BookAPI;