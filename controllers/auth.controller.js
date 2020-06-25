import {authService} from '../services';
import {userService} from '../services';

const checkToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
      try {
        const result = await authService.checkToken(token)
          if(result.user_id){
            req.body.uid = result.user_id;
            userService.userExistById(result.user_id)
            .then(result => {
              if(result != null){
                return next()
              }else{
                return res.status(200).json({success: false, data: {}, message: `User not exist.`});
              }
            })
            .catch(error => {
              return res.status(200).json(error);
            })
          }
      } catch(e) {
        return res.status(200).json({success: false, data: {}, message: e});
      }
  } else {
    return res.status(200).json({success: false, data: {}, message: `No token provided`});
  }  
}

const signUp = (req, res, next) => {
    const userData = req.body;
    authService.signUp(userData)
    .then( result => { res.status(200).json(result); })
    .catch( error => { res.status(400).json(error); });
}

const signIn = (req, res, next) => {
    const userData = req.body;
    authService.signIn(userData)
    .then( result => { 
        res.status(200).json({success: true, data: { token: result.user.xa}, message: `User Logged In`}); 
    })
    .catch( error => { res.status(400).json(error); });
}

module.exports = {
    checkToken,
    signUp,
    signIn
}