import {boardDb} from '../database'
import {userDb} from '../database'
import async from 'async';

const createBoard = boardData => {
  return new Promise((resolve,reject) => {
    boardDb.createBoard(boardData)
    .then( result => resolve(result) )
    .catch( error => reject(error) )
  })
}

const updateBoard = boardData => {
  return new Promise((resolve,reject) => {
    boardDb.getBoards(0,[boardData.boardId])
    .then(boardResult => {
      if(boardResult.data[0].users.length>0 && boardResult.data[0].users.find(u=> u._id === boardData.uid && u.grantType === 'admin')){    
        const boardId = boardData.boardId;
        delete boardData['boardId'];
        delete boardData['uid'];

        Object.keys(boardData).map(key => {
          boardData[`welcomeMessage.${key}`] = boardData[key];
          delete boardData[key];
        });

        const query = { $set: boardData } ;
        const filter = { '_id': boardId};
        const options = null;    

        boardDb.updateBoard(filter,query,options)
        .then( result => resolve(result) )
        .catch( error => reject(error) )
      }else{
        reject({ success: false, data: {}, message: `You don't have permissions to modify this board.`})
      }
    })
    .catch(error => reject({ success: false, data: {}, message: error}))
  })
}

const deleteBoard = (uid,boardId) => {
  return new Promise((resolve,reject) => {
    boardDb.getBoards(0,[boardId])
    .then(boardResult => {
      if(boardResult.data[0].users.length>0 && boardResult.data[0].users.find(u=> u._id === uid && u.grantType === 'admin')){        
        boardDb.deleteBoard(boardId)
        .then( result =>  resolve(result))
        .catch( error => reject(error))
      }else{
        reject({ success: false, data: {}, message: `You don't have permissions to modify this board.`})
      }
    })
    .catch(error => reject({ success: false, data: {}, message: error}))        
  })
}

const delUserBoard = boardData => {
  return new Promise((resolve,reject) => {
    boardDb.getBoards(0,[boardData.boardId])
    .then(boardResult => {
      if(boardResult.data[0].users.length>0 && boardResult.data[0].users.find(u=> u._id === boardData.uid && u.grantType === 'admin')){    
        const filter = {'_id': boardData.boardId}  
        const query = { $pull: { users: {_id: boardData.userId} }, returnNewDocument: true };
        const options = null
        boardDb.updateBoard(filter,query,options)
        .then( result => {
          const queryData = {uid: boardData.userId, query: { $pull: { boards: {_id: boardData.boardId} }, returnNewDocument: true }}
          userDb.updateUser(0,queryData)
          resolve({ success: true, data: {}, message:"Board updated."})
        } )
        .catch( error => reject(error) )          
      }else{
        reject({ success: false, data: {}, message: `You don't have permissions to modify this board.`})
      }
    })
    .catch(error => reject({ success: false, data: {}, message: error}))            
  })    
}

const getBoards = uid => {
  return new Promise((resolve,reject) => {
    let boardsId = '';
    let boards = '';
    let userBoards = '';
    let finalBoards = '';
    let userBoardIds = '';

    async.series([
      function(cb) {
        userDb.getUserInfo(uid)
        .then(result => {
          boardsId = result.data.boards.map(boardId => boardId._id)
          cb()
        })
        .catch(error => cb(error))
      },
      function(cb) {
        boardDb.getBoards(uid, boardsId)
        .then( result =>  {
          boards = result;
          cb()
        })
        .catch( error => cb(error))
      },
      function(cb){
        userBoards = boards.data.filter(element => {
          if (element.users.find(user => user._id === uid)) {
            return true;
          }
          return false;
        })
        cb()        
      },
      function(cb){
        userBoardIds = userBoards.map(board => {
          return {
            boardId: board._id,
            users: board.users.map(uid => uid._id)
          }
        })
        cb()

      },
      function(cb) {
        let counter = 0;
        for(let i = 0 ; i<userBoardIds.length; i++){
          userDb.getBoardUsers(userBoardIds[i].users)
          .then( userData => {
            const index = userBoards.findIndex(x => x._id === userBoardIds[i].boardId)
            const userIndex = userBoards[index].users.findIndex(user => user._id === uid)
            if (userBoards[index].users[userIndex]._id === uid) {
              if(userBoards[index].users[userIndex].grantType === 'admin'){
                userBoards[index].users = []
                userData.data.forEach(user => {
                  userBoards[index].users.push(user)
                });
              }else if(userBoards[index].users[userIndex].grantType === 'viewer'){
                userBoards[index].users = []
                userData.data.forEach(user => {
                  userBoards[index].users.push({
                    _id: user._id,
                    userName: user.userName
                  })
                });
              }
            }
            counter ++;
            if(counter == userBoardIds.length){
              return cb();
            }    
          })
          .catch(err => err)      
        }
      }
    ], function(err){
        if(err) reject({success: false, data: {}, message: `Boards` });
        else {resolve({success: true, data: userBoards, message: `Boards` })};
    })
  })
}

module.exports = {
  createBoard,
  updateBoard,
  deleteBoard,
  getBoards,
  delUserBoard
}