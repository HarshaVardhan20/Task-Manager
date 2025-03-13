const express = require('express');
const router = express.Router();
const prisma = require('./prisma'); // Ensure correct path to Prisma client
const authMiddleware = require('./middleware');

// Create Task
router.post('/create', authMiddleware,async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.userId;
    if (!title || !description) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const newTask = await prisma.task.create({
            data: { title, userId, description } 
        });
        return res.status(201).json({ message: "Task added successfully", task: newTask });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", details: error.message });
    }
});

// Update Task
router.post('/update',authMiddleware, async (req, res) => {
    const { postId, title, description } = req.body;
    if (!postId || !title || !description) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const updatedPost = await prisma.task.update({
            where: { id: postId },
            data: { title, description }
        });
        return res.status(200).json({ message: "Post updated successfully", updatedVersion: updatedPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", details: error.message });
    }
});

// Mark Task as Completed
router.post('/markCompleted', async (req, res) => {
    const { isCompleted, postId } = req.body;
    if (!postId || isCompleted === undefined) { 
        return res.status(400).json({ message: "Missing required values" });
    }
    try {
        const markedTask = await prisma.task.update({
            where: { id: postId },
            data: { completed: isCompleted }
        });
        return res.status(200).json({ message: "Task marked", markedTask });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", details: error.message });
    }
});

module.exports = router;
