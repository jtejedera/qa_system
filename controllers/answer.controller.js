import { answerService } from '../services';

const createAnswer = async (req, res, next) => {
    const answerData = req.body;
    const answer = new answerService.answer(answerData)
    const result = await answer.createAnswer()
    res.status(200).json(result)
}

const updateAnswer = async (req, res, next) => {
  const answerData = req.body;
  const answer = new answerService.answer(answerData)
  const result = await answer.updateAnswer()
  res.status(200).json(result)
}

const deleteAnswer = async (req, res, next) => {
  const answerData = req.body;
  const answer = new answerService.answer(answerData)
  const result = await answer.deleteAnswer()
  res.status(200).json(result)
}

module.exports = {
  createAnswer,
  updateAnswer,
  deleteAnswer
}