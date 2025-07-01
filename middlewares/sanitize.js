const xss = require('xss');
function sanitizeInput(input) {
  if (typeof input === 'string') {
    return xss(input.trim());
  } else if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  } else if (input !== null && typeof input === 'object') {
    const sanitized = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }
  return input;
}

function sanitizeData(req, res, next) {
  if(req.body)
    req.body = sanitizeInput(req.body);
  if(req.param)
    req.param=sanitizeInput(req.param);
  if(req.query)
    req.query=sanitizeInput(req.query);
  next();
};
module.exports = sanitizeData;