import User from '../models/userModel';

const createUser = (uid, email) => {
  return new Promise((resolve,reject) => {
    let user = new User();
      
    user._id = uid
    user.email = email;

    user.save()
    .then( result => {
      resolve({success: true, data: {}, message: `User created`})	
    })
    .catch( error => { 
      if (error && error.code == 11000) reject({success: false, data: {}, message: 'User create successfully'})							
      else if (error && error.code != 11000) reject({ success: false, data: {}, message: error.errmsg}) 
    })
  })	   
};

const updateUser = (length = 0, newData) => {
  return new Promise((resolve,reject) => {
    if(length > 0){
      newData.users.forEach(user => {
        User.findByIdAndUpdate(user._id, newData.query)
        .then(result => {})
        .catch(error => reject({success: false, data: error, message: `Error updating user ${user}`}))
      })
      resolve()
    }else{
      User.findByIdAndUpdate(newData.uid, newData.query)
      .then(resolve(true))
      .catch( error =>  reject({success: false, data: error, message: `Error updating user`}));
    }
  });
};

const deleteUser = userId => {
  return new Promise((resolve,reject) => {
    User.findByIdAndDelete(userId)
    .then(resolve())
    .catch( error => reject(error));
  });
};

const userExist = email => {
  return new Promise((resolve,reject) => {
    User.findOne({email: email}).exec()
    .then( result => {
      resolve(result)      
    })
    .catch( error => reject({success: false, data: {}, message: error.errmsg}))
  })			
}

const userExistById = uid => {
  return new Promise((resolve,reject) => {
    User.findById(uid).exec()
    .then( result => {
      resolve(result)      
    })
    .catch( error => reject({success: false, data: {}, message: error.errmsg}))
  })			
}

const updateStatistics = (uid, type) => {
  return new Promise((resolve,reject) => {
    let query = null;
    switch(type){
      case 'questions':
        query = { $inc: { 'statistics.questions': 1 }};
        break;
      case 'answers':  
        query = { $inc: { 'statistics.answers': 1 }};
        break;
      default:
        resolve()
    }    
    User.findByIdAndUpdate(uid, query)
    .then(resolve())
    .catch( error =>  reject(error));
  });
};

const getUserInfo = uid => {
  return new Promise((resolve,reject) => {
    User.findById(uid).exec()
    .then( result => resolve({success: true, data: result, message: 'User info'}))
    .catch( error => reject({success: false, data: {}, message: error.errmsg}))
  })			
}

const getBoardUsers = usersId => {
  return new Promise((resolve,reject) => {
    User.find({_id: {$in: usersId}})
    .then(result => { 
      resolve({success: true, data: result, message: `Users List`})
    })
    .catch(error => reject({success: true, data: error, message: `Problem retirevinh Board List`}))
  });			
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  userExist,
  updateStatistics,
  getUserInfo,
  userExistById,
  getBoardUsers
}