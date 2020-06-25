import { boardService } from '../services';

const createBoard = async (req, res, next) => {
    const boardData = req.body;
    boardService.createBoard(boardData)
    .then( result => { res.status(200).json(result); })
    .catch( error => { res.status(200).json(error); })
}

const updateBoard = async (req, res, next) => {
  const boardData = req.body;
  boardService.updateBoard(boardData)
  .then( result => { res.status(200).json(result);})
  .catch( error => { res.status(200).json(error);})
}

const deleteBoard = async (req, res, next) => {
  const boardId = req.body.payload;
  const uid = req.body.uid;
  boardService.deleteBoard(uid,boardId)
  .then( result =>  res.status(200).json(result))
  .catch( error =>  res.status(400).json(error));
}

const getBoards = async (req, res, next) => {
  const uid = req.body.uid;
  boardService.getBoards(uid)
  .then( result =>  res.status(200).json(result))
  .catch( error =>  res.status(400).json(error));
}

const delUserBoard = async (req, res, next) => {
  const boardData = {
    boardId: req.params.boardId,
    userId: req.params.userId,
    uid: req.body.uid
  }
  boardService.delUserBoard(boardData)
  .then( result => { res.status(200).json(result);})
  .catch( error => { res.status(200).json(error);})
}

module.exports = {
  createBoard,
  updateBoard,
  deleteBoard,
  getBoards,
  delUserBoard
}