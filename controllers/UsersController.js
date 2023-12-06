#!/usr/bin/node

const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class UsersController {
  static async getMe(req, res) {
    const { 'x-token': token } = req.headers;

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await dbClient.getUserById(userId);

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    res.json({ id: user._id.toString(), email: user.email });
  }
}

module.exports = UsersController;
