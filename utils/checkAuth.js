import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    const token = req.headers.authorization?.replace(/Bearer\s/, '');
    const decoed = jwt.verify(token, 'secretKey');
    if(!decoed) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    req.userId = decoed._id;
    next();
}