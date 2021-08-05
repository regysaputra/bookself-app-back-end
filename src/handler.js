const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if(!name) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        });

        response.code(400);

        return response;
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });

        response.code(400);

        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            }
        });

        response.code(201);

        return response;
    } 

    const response = h.response({
        status: "error",
        message: "Buku gagal ditambahkan"
    });

    response.code(500);

    return response;
};

const getAllBooksHandler = (request, h) => {
    const len = books.length;

    if(len > 0){
        const query = request.query
        if(Object.keys(query).length === 0){
            const results = books.map(({year, author, summary, pageCount, readPage, finished, reading, insertedAt, updatedAt,...rest}) => ({...rest}));

            const response = h.response({
                status: "success",
                data: {
                    "books": results
                }
            });
    
            response.code(200);
    
            return response;
        } else{
            //let filteredBooks = []
            //console.log(typeof Object.keys(query)[0])
            if(Object.keys(query)[0] === 'name'){
                //console.log(query.name.toLowerCase());
                const str = query.name.toLowerCase()
                let filteredBooks = books.filter(result => result.name.toLowerCase().includes(str));
                filteredBooks = filteredBooks.map(({year, author, summary, pageCount, readPage, finished, reading, insertedAt, updatedAt,...rest}) => ({...rest}));
            
                const response = h.response({
                    status: "success",
                    data: {
                        "books": filteredBooks
                    }
                });
        
                response.code(200);
        
                return response;

            } else if(Object.keys(query)[0] === 'reading'){
                let filteredBooks = books.filter(result => result.reading == query.reading);
                filteredBooks = filteredBooks.map(({year, author, summary, pageCount, readPage, finished, reading, insertedAt, updatedAt,...rest}) => ({...rest}));
            
                const response = h.response({
                    status: "success",
                    data: {
                        "books": filteredBooks
                    }
                });
        
                response.code(200);
        
                return response;

            } else if(Object.keys(query)[0] === 'finished'){
                let filteredBooks = books.filter(result => result.finished == query.finished);
                filteredBooks = filteredBooks.map(({year, author, summary, pageCount, readPage, finished, reading, insertedAt, updatedAt,...rest}) => ({...rest}));
            
                const response = h.response({
                    status: "success",
                    data: {
                        "books": filteredBooks
                    }
                });
        
                response.code(200);
        
                return response;

            }
        }
    } 

    const response = h.response({
        status: "success",
        message: {
            "books": []
        }
    });

    response.code(200);

    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        return {
          status: "success",
          data: {
            "book": book
          }
        };
    }

    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan"
    });

    response.code(404);

    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    
    if(!name){
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        });
  
        response.code(400);
  
        return response;
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });

        response.code(400);

        return response;
    }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();
    
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {
          ...books[index],
          name, 
          year, 
          author, 
          summary, 
          publisher, 
          pageCount, 
          readPage,
          finished,
          reading,
          updatedAt
        };

        const response = h.response({
          status: "success",
          message: "Buku berhasil diperbarui"
        });

        response.code(200);

        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan"
    });

    response.code(404);

    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
   
    const index = books.findIndex((book) => book.id === bookId);
   
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: "success",
        message: "Buku berhasil dihapus"
      });

      response.code(200);

      return response;
    }
   
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);

    return response;
};

module.exports = {
     addBookHandler, 
     getAllBooksHandler, 
     getBookByIdHandler,
     editBookByIdHandler,
     deleteBookByIdHandler
};