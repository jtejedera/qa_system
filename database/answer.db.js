import Board from '../models/boardModel';
import * as userDb from './user.db'

const createAnswer = (filter, query, options,userId) => {
  return new Promise((resolve,reject) => {
    Board.findOneAndUpdate(filter, query, options)
    .then( result => {
      userDb.updateStatistics(userId, 'answers'),
      resolve({success: true, data: {}, message: `Answer created`})
    })
    .catch( error => reject(error));
  });
};

const updateAnswer = (filter,query,options) => {
  return new Promise((resolve,reject) => {
    Board.findOneAndUpdate(filter, query, options)
    .then(resolve({success: true, data: {}, message: `Answer updated`}))
    .catch( error => reject(error));
  });
};

const deleteAnswer = (filter,query,options) => {
  return new Promise((resolve,reject) => {
    Board.findOneAndUpdate(filter, query, options)
    .then(resolve({success: true, data: {}, message: `Answer deleted`}))
    .catch( error => reject(error));
  });
};

const getAnswer = (filter,query,options) => {
  return new Promise((resolve,reject) => {
    Board.findById(filter, query, options)
    .then(result => resolve({success: true, data: result, message: `Answer`}))
    .catch( error => reject(error));
  });
};

module.exports = {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  getAnswer
};