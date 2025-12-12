const Class = require('../models/Class');
const Announcement = require('../models/Announcement');

// @desc    Get all classes (for testing mainly, or discovery)
// @route   GET /api/classes
// @access  Public (or Protected)
const getClasses = async (req, res) => {
    try {
        let query = {};
        if (req.query.teacher === 'me' && req.user && req.user.role === 'teacher') {
            query.teacher = req.user._id;
        }

        const classes = await Class.find(query).populate('teacher', 'name email');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Private
const getClassById = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id)
            .populate('teacher', 'name email')
            .populate('students', 'name email');

        if (classItem) {
            res.json(classItem);
        } else {
            res.status(404).json({ message: 'Class not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a class
// @route   POST /api/classes
// @access  Private (Teacher only)
const createClass = async (req, res) => {
    const { name, subject, description, schedule, code } = req.body;

    try {
        const newClass = new Class({
            name,
            subject,
            description,
            schedule,
            code,
            teacher: req.user._id,
        });

        const createdClass = await newClass.save();
        res.status(201).json(createdClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get announcements for a class
// @route   GET /api/classes/:id/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ class: req.params.id })
            .populate('author', 'name')
            .sort({ date: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create announcement
// @route   POST /api/classes/:id/announcements
// @access  Private (Teacher)
const createAnnouncement = async (req, res) => {
    const { title, content, important } = req.body;

    try {
        const announcement = new Announcement({
            title,
            content,
            important,
            class: req.params.id,
            author: req.user._id,
        });

        const createdAnnouncement = await announcement.save();
        res.status(201).json(createdAnnouncement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private (Teacher only)
const updateClass = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id);

        if (!classItem) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Check user
        if (classItem.teacher.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.json(updatedClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private (Teacher only)
const deleteClass = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.id);

        if (!classItem) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Check user
        if (classItem.teacher.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await classItem.deleteOne();
        res.json({ message: 'Class removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getClasses,
    getClassById,
    createClass,
    getAnnouncements,
    createAnnouncement,
    updateClass,
    deleteClass,
};
