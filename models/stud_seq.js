const { Model } = require('objection');

module.exports=class StudentSequence extends Model {
  static get tableName() {
    return 'student_sequences';
  }

  static get idColumn() {
    return 'year'; // primary key
  }
};

