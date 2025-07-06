const userRepository=require('./user.repository');
const roleRepository=require('./role.repository');
const refreshTokenRepository=require('./refresh_token.repository');
const permissionRepository=require('./permission_repository');
const schoolYearRepository=require('./school_year.repository')
module.exports={
    userRepository,
    roleRepository,
    refreshTokenRepository,
    permissionRepository,
    schoolYearRepository
}