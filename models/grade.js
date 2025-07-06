// Grade.js
const { Model } = require('objection');
const path=require('path');

module.exports=class Grade extends Model {
  static get tableName() {
    return 'grades';
  }

  static get relationMappings() {

    return {
      enrollments: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname,'enrollment'),
        join: {
          from: 'grades.id',
          to: 'enrollments.grade_id',
        },
      },
      students: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname,'student'),
        join: {
          from: 'grades.id',
          through: {
            from: 'enrollments.grade_id',
            to: 'enrollments.student_id',
          },
          to: 'students.id',
        },
      },
      schoolYears: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname,'school_year'),
        join: {
          from: 'grades.id',
          through: {
            from: 'enrollments.grade_id',
            to: 'enrollments.school_year_id',
          },
          to: 'school_years.id',
        },
      }
    };
  }
  $beforeInsert(){
    this.name=this.name.trim();
  }
  $beforeUpdate(){
    this.name=this.name.trim();
  }
}

