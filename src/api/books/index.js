const BooksHandler = require("./handler");
const routes = require('./routes');

module.exports = {
    name: 'books',
    version: '1.1.0',
    register: async (server, { service }) => {
        const booksHandler = new BooksHandler(service);
        server.route(routes(booksHandler));
    }
};