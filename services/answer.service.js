import {answerDb} from '../database';
import Board from '../models/boardModel';
import {boardDb} from '../database'

class answer{
  constructor(answerData){
    this.answer = answerData;
    this.query = null;
    this.filter = null;
    this.options = null;
  };

  async createAnswer(){
    const userPermissions = await boardDb.getBoards(0,[this.answer.boardId]);
    if(userPermissions.data[0].users.length>0 && userPermissions.data[0].users.find(u=> u._id === this.answer.answerData.createdBy)){
      let parentAnswer = new Board;
      parentAnswer.questions.push({answers: this.answer.answerData}) 
  
      this.query = { $push: { 'questions.$.answers': parentAnswer.questions[0].answers[0] }, returnNewDocument: true };
      this.filter = { '_id': this.answer.boardId, 'questions._id': this.answer.questionId };
      const newAnswer = await answerDb.createAnswer(this.filter,this.query,this.options,this.answer.uid);
      newAnswer.data = parentAnswer.questions[0].answers[0]
      return newAnswer 
    }else{
      return { success: false, data: {}, message: `You don't have permissions to ask in this board.`}
    }    
  };

  async updateAnswer(){
    const userPermissions = await boardDb.getBoards(0,[this.answer.boardId]);
    const answers = await answerDb.getAnswer({ '_id': this.answer.boardId, 'questions._id': this.answer.questionId },{},{})
    const questionIndex = answers.data.questions.findIndex(q=> q._id == this.answer.questionId)
    const answer = answers.data.questions[questionIndex].answers.find(a=>a._id == this.answer.answerId)
    
    if(userPermissions.data[0].users.length>0 && userPermissions.data[0].users.find(u=> u._id === this.answer.answerData.createdBy) && answer.createdBy === this.answer.uid){  
      Object.keys(this.answer.answerData).map(key => {
        this.answer.answerData[`questions.$[qId].answers.$[aId].${key}`] = this.answer.answerData[key];
        delete this.answer.answerData[key];
      });

      this.query =  {$set:  this.answer.answerData} ;
      this.filter = { '_id': this.answer.boardId, 'questions.answers._id': this.answer.answerId };
      this.options = { arrayFilters: [{ 'qId._id': this.answer.questionId }, { 'aId._id': this.answer.answerId }]};
      return await answerDb.updateAnswer(this.filter, this.query, this.options);
    }else{
      return { success: false, data: {}, message: `You don't have permissions to ask in this board.`}
    }
  };
  
  async deleteAnswer(){
    const userPermissions = await boardDb.getBoards(0,[this.answer.boardId]);
    const answers = await answerDb.getAnswer({ '_id': this.answer.boardId, 'questions._id': this.answer.questionId },{},{})
    const questionIndex = answers.data.questions.findIndex(q=> q._id == this.answer.questionId)
    const answer = answers.data.questions[questionIndex].answers.find(a=>a._id == this.answer.answerId)
    
    if(userPermissions.data[0].users.length>0 && userPermissions.data[0].users.find(u=> u._id === this.answer.answerData.createdBy) && answer.createdBy === this.answer.uid){      
      this.query = { $pull: { 'questions.$.answers': { '_id' : this.answer.payload.answerData.answerId} } };
      this.filter = { '_id': this.answer.payload.answerData.boardId, 'questions._id': this.answer.payload.answerData.questionId };
      return await answerDb.deleteAnswer(this.filter,this.query,this.options);
    }else{
      return { success: false, data: {}, message: `You don't have permissions to ask in this board.`}
    }      
  };
};

module.exports = {
  answer
};