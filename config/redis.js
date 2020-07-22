const redis = require('redis');

let redis_client = null;

function createCache(port) {
  redis_client = redis.createClient(port);
  return redis_client;
}

function setCache(path, object, exp=60) {
  redis_client.setex(path, exp, JSON.stringify(object));
}

function getCache(path, appendId=false) {
  return (req, res, next) => {
    if(appendId && !req.params.id)
      next();
    redis_client.get(path+(appendId?req.params.id:''), (err, data) => {
      if(err)
        next();
      if(data !== null) {
        data = JSON.parse(data);
        return res.status(data.status).json(data.response);
      } else {
        next();
      }
    });
  };
}

function deleteCache(path) {
  redis_client.delete(path);
}

module.exports = {
  createCache,
  setCache,
  getCache,
  deleteCache
}