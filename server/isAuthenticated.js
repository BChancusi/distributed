module.exports = function isAuthenticated(req, res, next) {
    if(!req.isAuthenticated()){
        return res.status(403).send({express: "not authenticated"})
    }

    next()
};