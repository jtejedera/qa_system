import {questionDb} from '../database';
import Board from '../models/boardModel';
import {boardDb} from '../database'

class question{
  constructor(questionData){
    this.question = questionData;
    this.query = null;
    this.filter = null;
    this.options = null;
  };

  async createQuestion(){
    const userPermissions = await boardDb.getBoards(0,[this.question.boardId]);
    if(userPermissions.data[0].users.length>0 && userPermissions.data[0].users.find(u=> u._id === this.question.questionData.createdBy)){
      let parentQuestion = new Board;
      parentQuestion.questions.push(this.question.questionData)    
  
      this.query = { $push: { questions: parentQuestion.questions[parentQuestion.questions.length - 1] }, returnNewDocument: true };
      this.filter = this.question.boardId;
      const newQuestion = await questionDb.createQuestion(this.filter,this.query,this.options,this.question.uid);
      newQuestion.data = parentQuestion.questions[0]
      return newQuestion
    }else{
      return { success: false, data: {}, message: `You don't have permissions to ask in this board.`}
    }

  };

  async updateQuestion(){
    const userPermissions = await boardDb.getBoards(0,[this.question.boardId]);
    const questions = await questionDb.getQuestion({ '_id': this.question.boardId, 'questions._id': this.question.questionId },{},{})
    const question = questions.data.questions.find(q=> q._id == this.question.questionId)

    if(userPermissions.data[0].users.length>0 && userPermissions.data[0].users.find(u=> u._id === this.question.questionData.createdBy) && question.createdBy === this.question.uid){    
      Object.keys(this.question.questionData).map(key => {
        this.question.questionData[`questions.$.${key}`] = this.question.questionData[key];
        delete this.question.questionData[key];
      });

      this.query =  {$set: this.question.questionData} ;
      this.filter = { '_id': this.question.boardId, 'questions._id': this.question.questionId };
      this.options = { safe: true, upsert: true};
      try{
        return await questionDb.updateQuestion(this.filter, this.query, this.options);
      }
      catch(error){
        return error
      }
    }else{
      return { success: false, data: {}, message: `You don't have permissions to update in this board.`}
    }      

  };
  
  async deleteQuestion(){
    const userPermissions = await boardDb.getBoards(0,[this.question.payload.questionData.boardId]);
    const questions = await questionDb.getQuestion({ '_id': this.question.payload.questionData.boardId, 'questions._id': this.question.payload.questionData.questionId },{},{})
    const question = questions.data.questions.find(q=> q._id == this.question.payload.questionData.questionId)

    if(userPermissions.data[0].users.length>0 && userPermissions.data[0].users.find(u=> u._id === question.createdBy) && question.createdBy === this.question.uid){
      this.query = { $pull: { questions : { _id : this.question.payload.questionData.questionId } } };
      this.filter = { '_id': this.question.payload.questionData.boardId };
      return await questionDb.deleteQuestion(this.filter,this.query, this.options);
    }else{
      return { success: false, data: {}, message: `You don't have permissions to delete in this board.`}
    }
  };
};

module.exports = {
  question
};