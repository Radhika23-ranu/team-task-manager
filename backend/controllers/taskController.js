import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find({}).populate('project', 'title').populate('assignedTo', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate('project', 'title').populate('assignedTo', 'name email');
    }
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title')
      .populate('assignedTo', 'name email');

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this task');
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private/Admin
const updateTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private (Member & Admin)
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task status');
    }

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
