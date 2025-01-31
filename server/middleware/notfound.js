const notfound = (req, res, next) => {
    const error = new Error('This is the not found error middleware');
    error.status = 404;
    next(error);
}

export default notfound;