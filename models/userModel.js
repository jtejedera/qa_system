import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const BoardSchema = new Schema({
  _id: {
    required: true,
    type: String
  },   
  grantType: {
    type: String
  }
});

const InvitationSchema = new Schema({
  _id: {
    type: String
  },   
  invitation: {
    type: String
  }
});

const UserSchema = new Schema({
    _id: {
      required: true,
      type: String
    },
    userName: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    invitations: {
      type: Array
    },
    boards: {
      type: [ BoardSchema ]
    },
    statistics: {
      questions: {
        type: Number,
        default: 0
      },
      answers: {
        type: Number,
        default: 0
      },
      solved: {
        type: Number,
        default: 0
      }
    }
});

module.exports = mongoose.model('User', UserSchema);
