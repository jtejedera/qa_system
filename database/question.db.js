import Board from '../models/boardModel';
import * as userDb from './user.db'

const createQuestion = (filter, query, options, userId) => {
  return new Promise((resolve,reject) => {
    Board.findByIdAndUpdate(filter, query, options)
    .then( result => {
      userDb.updateStatistics(userId, 'questions'),
      resolve({success: true, data: {}, message: `Question created`})
    })
    .catch( error => reject(error));
  });
};

const updateQuestion = (filter,query,options) => {
  return new Promise((resolve,reject) => {
    Board.findOne(filter,'questions.$')
    .then(question => {
      if(!question.questions[0].closed){
        Board.findOneAndUpdate(filter, query, options)
        .then(resolve({success: true, data: {}, message: `Question updated`}))
        .catch( error => reject({success: false, data: {}, message: error}));
      }else{
        reject({success: false, data: {}, message: `Question already solved`})
      }
    })
    .catch( error => reject({success: false, data: {}, message: error}));
  });
};

const deleteQuestion = (filter,query,options) => {
  return new Promise((resolve,reject) => {
    Board.findByIdAndUpdate(filter, query, options)
    .then(resolve({success: true, data: {}, message: `Question deleted`}))
    .catch( error => reject(error));
  });
};

const getQuestion = (filter,query,options) => {
  return new Promise((resolve,reject) => {
    Board.findById(filter, query, options)
    .then(result => resolve({success: true, data: result, message: `Question`}))
    .catch( error => reject(error));
  });
};

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestion
}