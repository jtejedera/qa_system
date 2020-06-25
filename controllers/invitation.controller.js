import { invitationService } from '../services';

const sendInvitation = async (req, res, next) => {
    const invitationData = req.body;
    const invitation = new invitationService.invitation(invitationData)
    const result = await invitation.createInvitation()

    res.status(200).json(result)
}

const validateInvitation = async (req, res, next) => {
  const boardData = req.body;
  boardService.updateBoard(boardData)
  .then( result => { res.status(200).json(result);})
  .catch( error => { res.status(200).json(error);})
}

const join = async (req, res, next) => {
    const invitationData = req.params.invitation;
    invitationService.join(invitationData)
    .then( result => { res.status(200).json(result);})
    .catch( error => { res.status(200).json(error);})
  }

module.exports = {
    sendInvitation,
    validateInvitation,
    join
}