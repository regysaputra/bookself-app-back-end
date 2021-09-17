const Hapi = require('@hapi/hapi');
const books = require('./api/books');
const BooksService = require('./services/inMemory/BooksService');

const init = async () => {
  const booksService = new BooksService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: books,
    options: {
      service: booksService
    }
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();