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
        }
    },
    due_date: {
        notEmpty: {
            errorMessage: 'Due date is required'
        }
    },
    status: {
        notEmpty: {
            errorMessage: 'Status is required'
        },
        isLength: {
            options: {
                min: 5,
            },
            errorMessage: 'Status should be 5 characters long'
        },
        isString: {
            errorMessage: 'Status should be a string'
        }
    },
    activity_date: {
        notEmpty: {
            errorMessage: 'Activity date is required'
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
        }
    },
    due_date: {
        notEmpty: {
            errorMessage: 'Due date is required'
        }
    },
    status: {
        notEmpty: {
            errorMessage: 'Status is required'
        },
        isLength: {
            options: {
                min: 5,
            },
            errorMessage: 'Status should be 5 characters long'
        },
        isString: {
            errorMessage: 'Status should be a string'
        }
    },
    activity_date: {
        notEmpty: {
            errorMessage: 'Activity date is required'
        }
    }
}