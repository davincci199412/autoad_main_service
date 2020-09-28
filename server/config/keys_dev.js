const port = 8008;
module.exports = {
  port,
  mongoURI: 'mongodb://localhost:27017/autoad_db',
  secretOrKey: 'secret',
  backendUrl: `http://localhost:${port}/api/v1`,
};
