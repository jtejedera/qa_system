import * as serviceAccount from '../utils/serviceAccountKey.json';
import * as serviceAppSnippet from '../utils/serviceAppSnippet.json';
import * as admin from 'firebase-admin';
import firebase from 'firebase/app';
import auth from 'firebase/auth';
import { userDb } from '../database'

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
firebase.initializeApp(serviceAppSnippet);

const checkToken = async token => {
  try {
    return await admin.auth().verifyIdToken(token)
  } catch(e) {
    return {success: false, data: {}, message: e.message};
  }
}

const signUp = userData => {
  return new Promise((resolve,reject) => {
    userDb.userExist(userData.email)
    .then( result => {
      if(result){
        reject({success: false, data: {}, message: `User already exist`})
      }else{
        admin.auth().createUser({email: userData.email, password: userData.password})
        .then( newUser => {
          userDb.createUser(newUser.uid, userData.email)
          .then( result => resolve(result) )
          .catch( error => reject(error) )
        })
        .catch( error => reject({success: false, data: {}, message: error.message}) )        
      }
    })
    .catch( error => reject(error))
  })
}

const signIn = userData => {
  return new Promise((resolve,reject) => {
    userDb.userExist(userData.email)
    .then( result => {
      if(result){
        firebase.auth().signInWithEmailAndPassword(userData.email, userData.password)
        .then( result => resolve(result) )
        .catch( error => {
          reject({success: false, data: {}, message: error.message})
        })        
      }else{
        reject({success: false, data: {}, message: `User not exist`})
      }
    })
    .catch( error => {
      reject(error)
    })    
  })
}

module.exports = {
  checkToken,
  signUp,
  signIn
}