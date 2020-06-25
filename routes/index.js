import { auth } from '../controllers';
import { board } from '../controllers';
import { question } from '../controllers';
import { answer } from '../controllers';
import { user } from '../controllers';
import { invitation } from '../controllers';

module.exports = (express) => {

    const apiRouter = express.Router();

    //AUTH routes
    apiRouter.get('/checkToken', auth.checkToken);
    apiRouter.post('/signUp', auth.signUp);
    apiRouter.post('/signIn', auth.signIn);
    
    //USER routes
    apiRouter.get('/user', auth.checkToken, user.getUserInfo);

    //INVITATION routes
    apiRouter.post('/invitation', auth.checkToken, invitation.sendInvitation)
    apiRouter.post('/join/:invitation', auth.checkToken, invitation.join)
    
    //BOARD routes
    apiRouter.get('/boards', auth.checkToken, board.getBoards);
    apiRouter.post('/boards', auth.checkToken, board.createBoard);
    apiRouter.post('/boards/:boardId/:userId', auth.checkToken, board.delUserBoard);
    apiRouter.put('/board', auth.checkToken, board.updateBoard);
    apiRouter.delete('/board', auth.checkToken, board.deleteBoard);

    //QUESTIONS routes
    apiRouter.post('/question', auth.checkToken, question.createQuestion);
    apiRouter.put('/question', auth.checkToken, question.updateQuestion);
    apiRouter.delete('/question', auth.checkToken, question.deleteQuestion);

    //ANSWERS routes
    apiRouter.post('/answer', auth.checkToken, answer.createAnswer);
    apiRouter.put('/answer', auth.checkToken, answer.updateAnswer);
    apiRouter.delete('/answer', auth.checkToken, answer.deleteAnswer);

    return apiRouter
}