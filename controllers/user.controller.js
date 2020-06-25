import { userService } from '../services';

const getUserInfo = async (req, res, next) => {
    const uid = req.body.uid;
    const result = await userService.getUserInfo(uid)
    res.status(200).json(result)
}

module.exports = {
  getUserInfo
}