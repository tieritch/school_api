const createToken=require('./gen_token');
const generateHexStudentNumber=require('./gen_number');
const asyncHandler=require('./wrapper');
module.exports={
  createToken,
  generateHexStudentNumber,
  asyncHandler,
};
