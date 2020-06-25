import {userDb} from '../database';
import {boardDb} from '../database';
import { secret } from '../config/config'
import jwt from 'jsonwebtoken';

class invitation{
  constructor(invitationData){
    this.email = invitationData.email;
    this.boardId = invitationData.boardId;
    this.boardName = invitationData.boardName;
    this.userId = null;
  };

  async checkEmail(){
    return await userDb.userExist(this.email)
    .then( result => {
      if(result) return result
      else  return false
    })
    .catch( err => {return false})    
  };

  async checkUserInBoard(){
    return await boardDb.getBoards(0,[this.boardId])
    .then( result => {
      result.data[0].users.some(u => u.email === this.email)
    })
    .catch( err => {return false})    
  };  

  async createInvitation(){
      try{
        const userExistInBoard = await this.checkUserInBoard()
        if(userExistInBoard){
          return { success: false, data: {}, message: `User already exist in this board`}
        }else{
          await this.checkInvitationExist()

          const emailExist = await this.checkEmail()
          if(emailExist){
            //Save the invitation in the user object in DB
            this.userId = emailExist._id;
            const token = await this.generateToken()
            const query = { $push: { invitations: [{_id: this.boardId, invitation: token}] }, returnNewDocument: true };
            const invitationData = { uid: emailExist._id, query: query}
            const userUpdate = await userDb.updateUser(0,invitationData)
  
            //Save the user data invitation in the board invitation object in DB
            const boardQuery = { $push: { invitations: [{email: this.email, invitation: token}] }, returnNewDocument: true } ;
            const boardFilter = { '_id': this.boardId};
            const boardOptions = null;      
            const boardUpdate = await boardDb.updateBoard(boardFilter,boardQuery,boardOptions)
            
            if(userUpdate === true && boardUpdate.success){
              return { success: true, data: token, message: `Invitation created`}
            }else{
              return { success: false, data: {}, message: userUpdate }
            }
          }else{
            const token = await this.generateToken()
            const query = { $push: { invitations: [{email: this.email, invitation: token}] }, returnNewDocument: true } ;
            const filter = { '_id': this.boardId};
            const options = null;             
            const boardUpdate = await boardDb.updateBoard(filter,query,options)
  
            boardUpdate.message = `Invitation created`
            return boardUpdate
          }
        }
      }catch(error){
        return { success: false, data: {}, message: error}
      }      
  };
  
  async generateToken(){
    return await jwt.sign({
      userId: this.userId,
      email: this.email,
      userId: this.userId,
      boardId: this.boardId,
      boardName: this.boardName,
    }, secret, {
        expiresIn: '24h'
    });  
  };

  async checkInvitationExist(){
    const board = await boardDb.getBoards(0,[this.boardId])
    if(board.data[0].invitations.findIndex(i => i.email === this.email) != -1){
      const result = await this.deleteInvitation(board.data[0].invitations.findIndex(i => i.email === this.email))
      return result
    }else{
      return false
    }

  }

  async deleteInvitation(index){
    
    let query = { $pull: { invitations: {email: this.email}}, returnNewDocument: true } ;
    let filter = { '_id': this.boardId};
    let options = null;                
    await boardDb.updateBoard(filter,query,options)

    const emailExist = await this.checkEmail()
    if(emailExist){
      //PUSH board to the user boards array, , delete invitation
      let queryUser = { $pull: { invitations: {_id: this.boardId}}, returnNewDocument: true };
      let invitationData = { uid: emailExist._id, query: queryUser}
      await userDb.updateUser(0,invitationData)
      return false
    }
    return false

  }  

  async sendEmailInvitation(invitation){

  };
};

const join = invitationData => {
  return new Promise((resolve,reject) => {
    checkInvitation(invitationData)
    .then(result => {
      if(result.userId){
        //añadir al usuario en users array de boardId
        //eliminar la invitación de su perfil 
        userDb.getBoardUsers(result.userId)
        .then(uResult => {
          if(uResult.data[0].boards.find(b=> b._id === result.boardId)){
            reject({ success: true, data: {}, message: `User already exist in the board`})
          }else{
            //PUSH user to the board provided, delete invitation
            let query = { $push: { users: [{_id: result.userId, grantType: 'viewer'}] }, $pull: { invitations: {email: result.email}}, returnNewDocument: true } ;
            let filter = { '_id': result.boardId};
            let options = null;                
            boardDb.updateBoard(filter,query,options)
            .then()
            .catch(bError => reject({ success: false, data: {}, message: bError}))

            //PUSH board to the user boards array, , delete invitation
            query = { $push: { boards: [{_id: result.boardId, grantType: 'viewer'}] }, $pull: { invitations: {_id: result.boardId}}, returnNewDocument: true };
            invitationData = { uid: result.userId, query: query}
            userDb.updateUser(0,invitationData)
            .then(uResult => resolve({ success: true, data: {}, message: `Joined to the board`}))
            .catch(uError => reject({ success: false, data: {}, message: uError}))
          }
        })
        .catch(bError => reject({success: false, data: bError, message: `Error joining to the board`}))
        
      }else{
        //TODO: User not registede, redirecto to the app register from, add to the boardId and to user Profile
      }
    })
    .catch(error => {
      if(error.name === "TokenExpiredError"){
        reject({ success: false, data: {}, message: `Invitation expired`})
      }else{
        reject({ success: false, data: {}, message: `Invalid invitation`})
      }
    })
  })
}

const checkInvitation = invitationData => {
  return new Promise((resolve,reject) => {
    jwt.verify(invitationData, secret, function(err, decoded) {
      if (err) {
	        reject(err)
      } else {
          resolve(decoded)
      }
    });  
  })
}

module.exports = {
  invitation,
  join
};