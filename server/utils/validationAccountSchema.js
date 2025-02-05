export const createAccountSchema = {
    account_id: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Account ID should be between 5 and 32 characters long'
        },
        notEmpty: {
            errorMessage: 'Account ID is required'
        },
        isString: {
            errorMessage: 'Account ID should be a string'
        }
    },
    name: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Name should be between 5 and 32 characters long'
        },
        notEmpty: {
            errorMessage: 'Account name is required'
        },
        isString: {
            errorMessage: 'Account name should be a string'
        }
    },
    password: {
        isLength: {
            options: {
                min: 8
            },
            errorMessage: 'Password should be at least 8 characters long'
        },
        notEmpty: {
            errorMessage: 'Password is required'
        },
        isString: {
            errorMessage: 'Password should be a string'
        }
    },
    course: {
        isLength: {
            options: {
                min: 4,
                max: 32
            },
            errorMessage: 'Course should be between 4 and 32 characters long'
        },
        notEmpty: {
            errorMessage: 'Course is required'
        },
        isString: {
            errorMessage: 'Course should be a string'
        }
    },
    year_and_section: {
        isLength: {
            options: {
                min: 4,
                max: 32
            },
            errorMessage: 'Year and section should be between 4 and 32 characters long'
        },
        notEmpty: {
            errorMessage: 'Year and section is required'
        },
        isString: {
            errorMessage: 'Year and section should be a string'
        }
    },
    email: {
        isEmail: {
            errorMessage: 'Invalid email format'
        },
        notEmpty: {
            errorMessage: 'Email is required'
        },
        isString: {
            errorMessage: 'Email should be a string'
        }
    },
    account_type: {
        isIn: {
            options: [
                ['student', 'faculty', 'admin'],
                { message: 'Invalid account type' }
            ],
            errorMessage: 'Account type should be either student, faculty, or admin'
        },
        notEmpty: {
            errorMessage: 'Account type is required'
        },
        isString: {
            errorMessage: 'Account type should be a string'
        }
    }
}

export const updateAccountSchema = {
    account_id: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Account ID should be between 5 and 32 characters long'
        },
        notEmpty: {
            errorMessage: 'Account ID is required'
        },
        isString: {
            errorMessage: 'Account ID should be a string'
        }
    },
    name: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Name should be between 5 and 32 characters long'
        },
        notEmpty: {
            errorMessage: 'Account name is required'
        },
        isString: {
            errorMessage: 'Account name should be a string'
        }
    },
    password: {
        isLength: {
            options: {
                min: 8
            },
            errorMessage: 'Password should be at least 8 characters long'
        },
        notEmpty: {
            errorMessage: 'Password is required'
        },
        isString: {
            errorMessage: 'Password should be a string'
        }
    },
    course: {
        isLength: {
            options: {
                min: 4,
                max: 32
            },
            errorMessage: 'Course should be between 4 and 32 characters long'
        },
        notEmpty: {
            errorMessage: 'Course is required'
        },
        isString: {
            errorMessage: 'Course should be a string'
        }
    },
    year_and_section: {
        isLength: {
            options: {
                min: 4,
                max: 32
            },
            errorMessage: 'Year and section should be between 4 and 32 characters long'
        },
        notEmpty: {
            errorMessage: 'Year and section is required'
        },
        isString: {
            errorMessage: 'Year and section should be a string'
        }
    },
    email: {
        isEmail: {
            errorMessage: 'Invalid email format'
        },
        notEmpty: {
            errorMessage: 'Email is required'
        },
        isString: {
            errorMessage: 'Email should be a string'
        }
    },
    account_type: {
        isIn: {
            options: [
                ['student', 'faculty', 'admin'],
                { message: 'Invalid account type' }
            ],
            errorMessage: 'Account type should be either student, faculty, or admin'
        },
        notEmpty: {
            errorMessage: 'Account type is required'
        },
        isString: {
            errorMessage: 'Account type should be a string'
        }
    },
    created_at: {
        notEmpty: {
            errorMessage: 'Created at is required'
        }
    }
}