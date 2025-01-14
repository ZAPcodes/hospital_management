const handleSuccess = (res, statusCode, message, data = null) => {
    const response = {
        success: true,
        message,
        data
    };
    return res.status(statusCode).json(response);
};

const handleError = (res, error, statusCode = 500) => {
    const response = {
        success: false,
        message: error.message || 'Internal server error',
        error: config.env === 'development' ? error.stack : undefined
    };
    logger.error(error);
    return res.status(statusCode).json(response);
};

const handleValidationError = (res, errors) => {
    const response = {
        success: false,
        message: 'Validation error',
        errors: errors.array()
    };
    return res.status(400).json(response);
};

module.exports = {
    handleSuccess,
    handleError,
    handleValidationError
};