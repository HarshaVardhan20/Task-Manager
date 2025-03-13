const express = require('express');
const router = express.Router();
const prisma = require('./prisma'); 
const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const JWT_SECRET = process.env.JWT_SECRET;
const {JWT_SECRET} = require('../config');
const bcrypt = require('bcryptjs');

// Signup Route
router.post('/signup', async (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const existingUser = await prisma.user.findUnique({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { email, name, password: hashedPassword }
        });

        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "1h" });
        return res.status(201).json({ message: "User signed up successfully!", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Signin Route
router.post('/signin', async (req, res) => { 
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({ message: "Signed in successfully", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
