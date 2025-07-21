const userRepository=require('./user.repository');
const roleRepository=require('./role.repository');
const refreshTokenRepository=require('./refresh_token.repository');
const permissionRepository=require('./permission.repository');
const schoolYearRepository=require('./school_year.repository');
const gradeRepository=require('./grade.repository');
const studentRepository=require('./student.repository');
const resourceRepository=require('./resources.repository');
const enrollmentRepository=require('./enrollment.repository');
const courseTypeRepository=require('./course_type.repository');
const studentSeqRepository=require('./stud_seq.repository');
const courseRepository=require('./course.repository');
const courseAssignRepository=require('./course_assign.repository');
const evaluationTypeRepository=require('./evaluation_type.repository');
const scoreRepository=require('./score.repository');
const academicSubdivisionRepository=require('./academic_subdivision.repository');
const academicPeriodRepository=require('./academic_period.repository');
module.exports={
  userRepository,
  roleRepository,
  refreshTokenRepository,
  permissionRepository,
  schoolYearRepository,
  gradeRepository,
  studentRepository,
  resourceRepository,
  enrollmentRepository,
  courseTypeRepository,
  studentSeqRepository,
  courseRepository,
  courseAssignRepository,
  evaluationTypeRepository,
  scoreRepository,
  academicSubdivisionRepository,
  academicPeriodRepository,
};
