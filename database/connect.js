import mongoose from 'mongoose';
import config from '../config/config'

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


var exports = module.exports = {};

exports.connectToDb = async () => {
    try {
      await mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });        
    }
    catch (error) {
      throw new Error(error)
    }
}
