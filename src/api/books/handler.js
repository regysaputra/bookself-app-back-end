class BooksHandler {
    constructor(service) {
        this._service = service;

        this.postBookHandler = this.postBookHandler.bind(this);
        this.getBooksHandler = this.getBooksHandler.bind(this);
        this.getBookByIdHandler = this.getBookByIdHandler.bind(this);
        this.putBookByIdHandler = this.putBookByIdHandler.bind(this);
        this.deleteBookByIdHandler = this.deleteBookByIdHandler.bind(this);
    }

    postBookHandler(request, h) {
        try {
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

            const finished = pageCount === readPage;
            const insertedAt = new Date().toISOString();

            const book = this._service.addBooks({ name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt });

            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: book
                }
            })

            response.code(201);

            return response;
        } catch(error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });

            response.code(400);

            return response;
        }
        
    }

    getBooksHandler(request, h) {
        const books = this._service.getBooks();

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

        return {
            status: 'success',
            data: {
                books,
            }
        };
    }

    getBookByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const book = this._service.getBookById(id)

            return {
                status: 'success',
                data: {
                    book,
                },
            };
        } catch (error) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            });

            response.code(404);
            return response;
        }
    }

    putBookByIdHandler(request, h) {
        try{
            const { id } = request.params;
    
            this._service.editBookById(id, request.payload);

            const response = h.response({
                status: "success",
                message: "Buku berhasil diperbarui"
            });
      
            response.code(200);
      
            return response;

            // return {
            //     status: 'success',
            //     message: 'Buku berhasil diperbarui'
            // };
        } catch (error) {
            const errorCode = parseInt(error.message.substring(0, 3))
            const errorMessage = error.message.substring(3, error.message.length)
            
            const response = h.response({
              status: 'fail',
              message: errorMessage,
            });

            response.code(errorCode);

            return response;
        }
        
    }

    deleteBookByIdHandler(request, h) {
        try{
            const { id } = request.params;
            this._service.deleteBookById(id);

            return {
                status: 'success',
                message: 'Buku berhasil dihapus'
            }
        } catch (error) {
            const response = h.response({
              status: 'fail',
              message: 'Buku gagal dihapus. Id tidak ditemukan',
            });
            response.code(404);
            return response;
        }
        
    }
}

module.exports = BooksHandler;