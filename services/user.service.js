import {userDb} from '../database'

const getUserInfo = uid => {
  return new Promise((resolve,reject) => {
    userDb.getUserInfo(uid)
    .then( result => resolve(result) )
    .catch( error => reject(error) )
  })
}

const userExistById = uid => {
  return new Promise((resolve,reject) => {
    userDb.userExistById(uid)
    .then( result => resolve(result) )
    .catch( error => reject(error) )
  })
}

const getBoardUsers = usersId => {
  return new Promise((resolve,reject) => {
    userDb.getBoardUsers(boardId)
    .then( result => resolve(result) )
    .catch( error => reject(error) )
  })  
}

const delBoardUser = (uid,boardId) => {
  return new Promise((resolve,reject) => {
    const query = { $pull: { boards: {_id: boardId} }, returnNewDocument: true };
    const queryData = { uid: uid, query: query}
    userDb.updateUser(0,queryData)
    .then( result => resolve(result) )
    .catch( error => reject(error) )
  })    
}

module.exports = {
  getUserInfo,
  userExistById,
  getBoardUsers,
  delBoardUser
}