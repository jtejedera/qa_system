import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  _id: {
    required: true,
    type: String
  },   
  grantType: {
    type: String
  }
});

const InvitationSchema = new Schema({
  email: {
    type: String
  },   
  invitation: {
    type: String
  }
});

const AnswerSchema = new Schema({
  answerDescription: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  isSolution: {
    trype: Boolean,
    default: false
  },
  solvedAt: {
    type: Date,
    required: true
  }
});

const QuestionSchema = new Schema({ 
  questionTitle: {
    type: String,
    required: true
  },
  questionDescription: {
    type: String,
    required: true,
  },
  solved: {
    trype: Boolean,
    default: false
  },
  solvedAt: {
    type: Date
  },
  closedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    required: true
  },  
  closed: {
    type: Boolean,
    default: false
  },
  answers: {
    type: [ AnswerSchema ]
  },
  createdBy: {
    type: String,
    required: true
  }
});

const BoardSchema = new Schema({
    boardName: {
      type: String,
      required: true
    },
    welcomeMessage: {
      active: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      bodyMessage: {
        type: String,
        default:''
      }
    },
    invitations: [ InvitationSchema ],
    users: {
      type: [ UsersSchema ]
    },
    questions: {
      type: [ QuestionSchema ]
    }

});

module.exports = mongoose.model('Board', BoardSchema);
