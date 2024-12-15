const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.send({ message: "please login", succcess: false });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.send({ message: "token expired! login again", succcess: false, error: error.message })
    }
}

module.exports = {
    authenticateUser
}