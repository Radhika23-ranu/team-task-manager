import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res, next) => {
  try {
    const { title, description, members } = req.body;

    const project = new Project({
      title,
      description,
      createdBy: req.user._id,
      members: members || [],
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find({}).populate('members', 'name email').populate('createdBy', 'name');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('members', 'name email').populate('createdBy', 'name');
    }
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name');

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (req.user.role !== 'admin' && !project.members.some(m => m._id.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    project.title = title || project.title;
    project.description = description || project.description;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/add-member
// @access  Private/Admin
const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.members.includes(userId)) {
      res.status(400);
      throw new Error('User is already a member');
    }

    project.members.push(userId);
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   POST /api/projects/:id/remove-member
// @access  Private/Admin
const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    project.members = project.members.filter(
      (memberId) => memberId.toString() !== userId
    );
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
