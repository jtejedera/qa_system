import { questionService } from '../services';

const createQuestion = async (req, res, next) => {
    const questionData = req.body;
    const question = new questionService.question(questionData)
    const result = await question.createQuestion()
    res.status(200).json(result)
}

const updateQuestion = async (req, res, next) => {
  const questionData = req.body;
  const question = new questionService.question(questionData)
  const result = await question.updateQuestion()
  res.status(200).json(result)
}

const deleteQuestion = async (req, res, next) => {
  const questionData = req.body;
  const question = new questionService.question(questionData)
  const result = await question.deleteQuestion()
  res.status(200).json(result)
}

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion
}