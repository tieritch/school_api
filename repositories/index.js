const userRepository=require('./user.repository');
const roleRepository=require('./role.repository');
const refreshTokenRepository=require('./refresh_token.repository');
const permissionRepository=require('./permission.repository');
const schoolYearRepository=require('./school_year.repository');
const gradeRepository=require('./grade.repository');
module.exports={
    userRepository,
    roleRepository,
    refreshTokenRepository,
    permissionRepository,
    schoolYearRepository,
    gradeRepository,
}