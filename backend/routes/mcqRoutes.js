const express = require('express');
const router = express.Router();
 const { createMcq, getAllMcqs, deleteMcq } = require('../controller/mcqController');

// POST /api/mcqs - create new MCQ
router.post('/create', createMcq);

// GET /api/mcqs - get all MCQs
router.get('/', getAllMcqs);
// DELETE route to delete an MCQ by ID
router.delete('/:id',deleteMcq);


module.exports = router;
