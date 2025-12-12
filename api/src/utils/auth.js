const jwt = require('jsonwebtoken');

function extractBearerToken(req) { //Use this to extract a token from a request header
  const header =
    req.headers.get('X-Auth-Token') || req.headers.get('x-auth-token');
  if (!header) return null;

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;

  return token;
}


function getUserFromRequest(req) { //Use this to extract a user id
  const token = extractBearerToken(req);
  if (!token) {
    const err = new Error('No token provided');
    err.code = 'NO_TOKEN';
    throw err;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (err) {
    err.code = 'INVALID_TOKEN';
    throw err;
  }
}

module.exports = {
  extractBearerToken,
  getUserFromRequest,
};
