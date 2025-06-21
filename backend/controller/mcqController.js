const Mcq = require('../model/Mcq');
// Create new MCQ
const createMcq = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;

    // Ensure all fields are present and options contain exactly 4 elements
    if (!question || !options || options.length !== 4 || !correctAnswer) {
      return res.status(400).json({ error: 'All fields are required and must have 4 options' });
    }

    // Ensure that the correct answer is one of the options
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ error: 'Correct answer must be one of the 4 options' });
    }

    // Create and save the MCQ
    const newMcq = new Mcq({ question, options, correctAnswer });
    await newMcq.save();

    // Send response with the created MCQ
    res.status(201).json(newMcq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while creating MCQ' });
  }
};

// Get all MCQs
const getAllMcqs = async (req, res) => {
  try {
    const mcqs = await Mcq.find().sort({ createdAt: -1 });
    res.json(mcqs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch MCQs' });
  }
};

// DELETE MCQ by ID
const deleteMcq = async (req, res) => {
  const mcqId = req.params.id;

  try {
    const deletedMcq = await Mcq.findByIdAndDelete(mcqId);

    if (!deletedMcq) {
      return res.status(404).json({ message: 'MCQ not found' });
    }

    res.status(200).json({ message: 'MCQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting MCQ:', error);
    res.status(500).json({ message: 'Server error while deleting MCQ' });
  }
};

module.exports = { createMcq, getAllMcqs, deleteMcq };
