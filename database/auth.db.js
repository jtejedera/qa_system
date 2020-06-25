import User from '../models/userModel';

const userExist = email => {
  return new Promise((resolve,reject) => {
    User.findOne({email: email}).exec()
    .then( result => {
      resolve(result)      
    })
    .catch( error => reject({success: false, data: {}, message: error.errmsg}))
  })			
}
  
module.exports = {
  userExist
}