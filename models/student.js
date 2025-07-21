// Student.js
const { Model } = require('objection');
const path=require('path');

module.exports=class Student extends Model {
  static get tableName() {
    return 'students';
  }

  static get relationMappings() {

    return {
      enrollments: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname,'enrollment'),//Enrollment,
        join: {
          from: 'students.id',
          to: 'enrollments.student_id',
        },
      },
      grades: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname,'grade'),//Grade,
        join: {
          from: 'students.id',
          through: {
            from: 'enrollments.student_id',
            to: 'enrollments.grade_id',
          },
          to: 'grades.id',
        },
      },
      schoolYears: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname,'school_year'),//SchoolYear,
        join: {
          from: 'students.id',
          through: {
            from: 'enrollments.student_id',
            to: 'enrollments.school_year_id',
          },
          to: 'school_years.id',
        },
      },
    };
  }

  $beforeUpdate(){
    if(this.student_number){
      this.student_number=this.student_number.trim().toUpperCase();
    }
  }
};
