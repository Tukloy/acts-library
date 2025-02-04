export const createAcademicPaperSchema = {
    acadp_id: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Academic paper ID should be between 10 and 16 characters long'
        },
        notEmpty: {
            errorMessage: 'Academic paper ID is required'
        },
        isString: {
            errorMessage: 'Academic paper ID should be a string'
        }
    },
    author_name: {
        isLength : {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Author name should be between 5 and 32 characters long'
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
                max: 64
            },
            errorMessage: 'Title name should be between 5 and 64 characters long'
        },
        notEmpty: {
            errorMessage: 'Title name is required'
        },
        isString: {
            errorMessage: 'Title name should be a string'
        }
    },
    status: {
        isIn: {
            options: [['available', 'borrowed', 'achived']],
            errorMessage: 'Status should be either available, borrowed or archived'
        },
        notEmpty: {
            errorMessage: 'Status is required'
        },
        isString: {
            errorMessage: 'Status should be a string'
        }
    },
    academic_year: {
        isInt: {
            errorMessage: 'Academic year should be a number'
        },
        notEmpty: {
            errorMessage: 'Academic year is required'
        }
    },
    course: {
        isLength: {
            options: {
                min: 4,
                max: 64
            },
            errorMessage: 'Course name should be between 5 and 64 characters long'
        },
        notEmpty: {
            errorMessage: 'Course name is required'
        },
        isString: {
            errorMessage: 'Course name should be a string'
        }
    },
    type: {
        isIn: {
            options: [['capstone', 'project', 'thesis']],
            errorMessage: 'Type should be (capstone, project or thesis)'
        },
        notEmpty: {
            errorMessage: 'Type is required'
        },
        isString: {
            errorMessage: 'Type should be a string'
        }
    }
}

export const updateAcademicPaperSchema = {
    acadp_id: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Academic paper ID should be between 10 and 16 characters long'
        },
        notEmpty: {
            errorMessage: 'Academic paper ID is required'
        },
        isString: {
            errorMessage: 'Academic paper ID should be a string'
        }
    },
    author_name: {
        isLength : {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Author name should be between 5 and 32 characters long'
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
                max: 64
            },
            errorMessage: 'Title name should be between 5 and 64 characters long'
        },
        notEmpty: {
            errorMessage: 'Title name is required'
        },
        isString: {
            errorMessage: 'Title name should be a string'
        }
    },
    status: {
        isIn: {
            options: [['available', 'borrowed', 'achived']],
            errorMessage: 'Status should be either available, borrowed or archived'
        },
        notEmpty: {
            errorMessage: 'Status is required'
        },
        isString: {
            errorMessage: 'Status should be a string'
        }
    },
    academic_year: {
        isInt: {
            errorMessage: 'Academic year should be a number'
        },
        notEmpty: {
            errorMessage: 'Academic year is required'
        }
    },
    course: {
        isLength: {
            options: {
                min: 4,
                max: 64
            },
            errorMessage: 'Course name should be between 5 and 64 characters long'
        },
        notEmpty: {
            errorMessage: 'Course name is required'
        },
        isString: {
            errorMessage: 'Course name should be a string'
        }
    },
    type: {
        isIn: {
            options: [['capstone', 'project', 'thesis']],
            errorMessage: 'Type should be (capstone, project or thesis)'
        },
        notEmpty: {
            errorMessage: 'Type is required'
        },
        isString: {
            errorMessage: 'Type should be a string'
        }
    }
}