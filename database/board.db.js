import Board from '../models/boardModel';
//import User from '../models/userModel';
import * as userDb from './user.db'

const createBoard = boardData => {
  return new Promise((resolve,reject) => {
    let board = new Board();
      
    board.boardName = boardData.boardName;
    board.users.push({
      _id: boardData.uid,
      grantType: 'admin'
    });

    board.save()
    .then( result => {
      boardData.query = {
        $push: {
          boards: {
            _id: result._id, 
            grantType: 'admin'
          }
        },
        returnNewDocument: true
      };

      userDb.updateUser(0,boardData)
      .then(resolve({success: true, data: result, message: "Board created"}))
      .catch(error => {
        deleteBoard(result._id);
        reject({ success: false, data: {}, message: error.errmsg});
      });
    })
    .catch( error => { 		
      if (error && error.code == 11000) reject({success: false, data: {}, message: `The Board '${boardData.boardName}' already exist.`});
      else if (error) reject({ success: false, data: {}, message: error.errmsg});
    });
  });
};

const updateBoard = (filter,query,options) => {
  return new Promise((resolve,reject) => {
    Board.findOneAndUpdate(filter, query, options)
    .then(result => resolve({success: true, data: result, message: `Board updated`}))
    .catch( error => {
      reject({success: false, data: error, message: `Board updated error`})});
  });  
}

const deleteBoard = boardId => {
  return new Promise((resolve,reject) => {
    Board.findById(boardId)
    .then(result => { 
      if(result.users.length > 0) {
        const newData = {
          users: result.users,
          query: { $pull: { boards : { _id : boardId } } }
        };        
        userDb.updateUser(result.users.length, newData)
      }
    })
    .catch(error => reject({success: false, data: error.message, message: `Problem deleting the board.`}))
    Board.findByIdAndDelete(boardId)
    .then(resolve({success: true, data: {}, message: `Board deleted`}))
    .catch( error => reject(error));
  });
};

const getBoards = (uid, boardsId) => {
  return new Promise((resolve,reject) => {
    Board.find({_id: {$in: boardsId}}).lean()
    .then(result => { 
      if(result) {
        resolve({success: true, data: result, message: `Board List`})
      }
      resolve({success: true, data: {}, message: `Board List`})
    })
    .catch(error => reject({success: true, data: error, message: `Problem retrieving board list`}))
  });
};

module.exports = {
  createBoard,
  deleteBoard,
  updateBoard,
  getBoards
}