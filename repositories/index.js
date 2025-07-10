const userRepository=require('./user.repository');
const roleRepository=require('./role.repository');
const refreshTokenRepository=require('./refresh_token.repository');
const permissionRepository=require('./permission.repository');
const schoolYearRepository=require('./school_year.repository');
const gradeRepository=require('./grade.repository');
const studentRepository=require('./student.repository');
const resourceRepository=require('./resources.repository');
const enrollmentRepository=require('./enrollment.repository');
module.exports={
    userRepository,
    roleRepository,
    refreshTokenRepository,
    permissionRepository,
    schoolYearRepository,
    gradeRepository,
    studentRepository,
    resourceRepository,
    enrollmentRepository
}