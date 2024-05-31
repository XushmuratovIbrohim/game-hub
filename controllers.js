import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

export async function register(req, res) {
    try {
        const { username, nickname, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const doc = new User({
            username, nickname, passwordHash: hash
        })

        const user = await doc.save();

        delete user._doc.passwordHash;
        const token = jwt.sign(
            { _id: user._id },
            'secretKey',
            {
                expiresIn: '365d',
            },
        );
        res.status(201).json({
            ...user._doc,
            token,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        const isValidPass = await bcrypt.compare(password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Invalid password or username',
            });
        }
        const token = jwt.sign(
            { _id: user._id },
            'secretKey',
            {
                expiresIn: '365d',
            },
        );
        delete user._doc.passwordHash;
        res.json({
            ...user._doc,
            token,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Failed to login',
        });
    }
}

export async function getMe(req, res) {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        delete user._doc.passwordHash;
        res.json({
            ...user._doc,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Failed to get user',
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { nickname, coins, username } = req.body
        const user = await User.findByIdAndUpdate(req.userId, { nickname, username, $inc: { coins } }, { returnDocument: 'after' })
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        delete user._doc.passwordHash;
        res.json({
            ...user._doc,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Failed to update user',
        });
    }
}