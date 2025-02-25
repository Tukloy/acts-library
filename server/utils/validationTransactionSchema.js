export const createTransactionSchema = {
    account_id: {
        notEmpty: {
            errorMessage: 'Account ID is required'
        },
        isLength: {
            options: {
                min: 5,
            },
            errorMessage: 'Account ID should be 5 characters long'
        },  
        isString: {
            errorMessage: 'Account ID should be a string'
        }
    },
    transaction_id: {
        notEmpty: {
            errorMessage: 'Transaction ID is required'
        },
        isLength: {
            options: {
                min: 5,
            },
            errorMessage: 'Transaction ID should be 5 characters long'
        },
        isString: {
            errorMessage: 'Transaction ID should be a string'
        }
    },
    item_id: {
        notEmpty: {
            errorMessage: 'Item ID is required'
        },
        isLength: {
            options: {
                min: 5,
            },
            errorMessage: 'Item ID should be 5 characters long'
        },
        isString: {
            errorMessage: 'Item ID should be a string'
        }
    },
    borrow_date: {
        notEmpty: {
            errorMessage: 'Borrow date is required'
        },
        custom: {
            options: (value) => {
                return value && value !== '1970-01-01T00:00:00.000Z';
            },
            errorMessage: 'Invalid borrow date selected'
        }
    }
}

export const updateTransactionSchema = {
    account_id: {
        notEmpty: {
            errorMessage: 'Account ID is required'
        },
        isLength: {
            options: {
                min: 5,
            },
            errorMessage: 'Account ID should be 5 characters long'
        },
        isString: {
            errorMessage: 'Account ID should be a string'
        }
    },
    transaction_id: {
        notEmpty: {
            errorMessage: 'Transaction ID is required'
        },
        isLength: {
            options: {
                min: 5,
            },
            errorMessage: 'Transaction ID should be 5 characters long'
        },
        isString: {
            errorMessage: 'Transaction ID should be a string'
        }
    },
    item_id: {
        notEmpty: {
            errorMessage: 'Item ID is required'
        },
        isLength: {
            options: {
                min: 5,
            },
            errorMessage: 'Item ID should be 5 characters long'
        },
        isString: {
            errorMessage: 'Item ID should be a string'
        }
    },
    borrow_date: {
        notEmpty: {
            errorMessage: 'Borrow date is required'
        },
        custom: {
            options: (value) => {
                return value && value !== '1970-01-01T00:00:00.000Z';
            },
            errorMessage: 'Invalid borrow date selected'
        }
    },
    created_at: {
        notEmpty: {
            errorMessage: 'Created at is required'
        }
    }
}