export const createActivitySchema = {
    account_id: {
        isLength: {
            options: {
                min: 5
            },
            errorMessage: 'Account ID must be at least 5 character long'
        },
        isString: {
            errorMessage: 'Account ID must be a string'
        },
        notEmpty: {
            errorMessage: 'Account ID is required'
        },
    },
    activity: {
        notEmpty: {
            errorMessage: 'Activity is required'
        },
        isLength: {
            options: {
                min: 10
            },
            errorMessage: 'Activity must be at least 10 character long'
        },
        isString: {
            errorMessage: 'Activity must be a string'
        }
    }
}

export const updateActivitySchema = {
    account_id: {
        isLength: {
            options: {
                min: 5
            },
            errorMessage: 'Account ID must be at least 5 character long'
        },
        isString: {
            errorMessage: 'Account ID must be a string'
        },
        notEmpty: {
            errorMessage: 'Account ID is required'
        },
    },
    activity: {
        notEmpty: {
            errorMessage: 'Activity is required'
        },
        isLength: {
            options: {
                min: 10
            },
            errorMessage: 'Activity must be at least 10 character long'
        },
        isString: {
            errorMessage: 'Activity must be a string'
        }
    },
    created_at: {
        notEmpty: {
            errorMessage: 'Created at is required'
        }
    }
}