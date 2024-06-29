const users = require('../models/user');

class accountController {

    async getAllAccount(req, res, next) {
        try {
          const user = await users.find({});
          res.json(user);  // Ensure the response is in JSON format
        } catch (err) {
          next(err);
        }
      }
}

module.exports = new accountController();