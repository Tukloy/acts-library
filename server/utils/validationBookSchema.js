export const createBookSchema = {
    book_id: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Book ID should be between 5 and 32 characters long'
        },
        notEmpty: {
            errorMessage: 'Book ID is required'
        },
        isString: {
            errorMessage: 'Book ID should be a string'
        },
        isAlphanumeric: {
            errorMessage: 'Book ID should only contain alphanumeric characters'
        }
    },
    author_name: {
        isLength: {
            options: {
                min: 1,
                max: 100
            },
            errorMessage: 'Author name should be between 1 and 100 characters long'
        },
        notEmpty: {
            errorMessage: 'Author name is required'
        },
        isString: {
            errorMessage: 'Author name should be a string'
        }
    },
    title_name: {
        isLength: {
            options: {
                min: 5,
                max: 255
            },
            errorMessage: 'Title name should be between 5 and 255 characters long'
        },
        notEmpty: {
            errorMessage: 'Title name is required'
        },
        isString: {
            errorMessage: 'Title name should be a string'
        }
    },
    type: {
        isLength: {
            options: {
                min: 1,
                max: 20
            },
            errorMessage: 'Type should be between 1 and 20 characters long'
        },
        notEmpty: {
            errorMessage: 'Type is required'
        },
        isString: {
            errorMessage: 'Type should be a string'
        }
    },
    status: {
        isLength: {
            options: {
                min: 1,
                max: 20
            },
            errorMessage: 'Status should be between 1 and 20 characters long'
        },
        notEmpty: {
            errorMessage: 'Status is required'
        },
        isString: {
            errorMessage: 'Status should be a string'
        }
    }
}

export const updateBookSchema = {
    book_id: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Book ID should be between 5 and 32 characters long'
        },
        notEmpty: {
            errorMessage: 'Book ID is required'
        },
        isString: {
            errorMessage: 'Book ID should be a string'
        },
        isAlphanumeric: {
            errorMessage: 'Book ID should only contain alphanumeric characters'
        }
    },
    author_name: {
        isLength: {
            options: {
                min: 1,
                max: 100
            },
            errorMessage: 'Author name should be between 1 and 100 characters long'
        },
        notEmpty: {
            errorMessage: 'Author name is required'
        },
        isString: {
            errorMessage: 'Author name should be a string'
        }
    },
    title_name: {
        isLength: {
            options: {
                min: 5,
                max: 255
            },
            errorMessage: 'Title name should be between 5 and 255 characters long'
        },
        notEmpty: {
            errorMessage: 'Title name is required'
        },
        isString: {
            errorMessage: 'Title name should be a string'
        }
    },
    type: {
        isLength: {
            options: {
                min: 1,
                max: 20
            },
            errorMessage: 'Type should be between 1 and 20 characters long'
        },
        notEmpty: {
            errorMessage: 'Type is required'
        },
        isString: {
            errorMessage: 'Type should be a string'
        }
    },
    status: {
        isLength: {
            options: {
                min: 1,
                max: 20
            },
            errorMessage: 'Status should be between 1 and 20 characters long'
        },
        notEmpty: {
            errorMessage: 'Status is required'
        },
        isString: {
            errorMessage: 'Status should be a string'
        }
    }
}