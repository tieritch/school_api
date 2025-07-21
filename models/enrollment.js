// Enrollment.js
const { Model } = require('objection');
const path=require('path');
module.exports=class Enrollment extends Model {
  static get tableName() {
    return 'enrollments';
  }

  static get relationMappings() {

    return {
      student: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname,'student'),//Student,
        join: {
          from: 'enrollments.student_id',
          to: 'students.id',
        },
      },
      grade: {
        relation: Model.BelongsToOneRelation,
        modelClass:  path.join(__dirname,'grade'),//Grade,
        join: {
          from: 'enrollments.grade_id',
          to: 'grades.id',
        },
      },
      schoolYear: {
        relation: Model.BelongsToOneRelation,
        modelClass:  path.join(__dirname,'school_year'),//SchoolYear,
        join: {
          from: 'enrollments.school_year_id',
          to: 'school_years.id',
        },
      },
    };
  }
};


