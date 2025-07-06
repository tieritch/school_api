const moment = require('moment');

async function generateHexStudentNumber(knex) {
  const year = moment().format('YYYY'); // "2025"

  // On cherche le dernier student_number qui commence par l’année
  const lastStudent = await knex('students')
    .where('student_number', 'like', `${year}%`)
    .orderBy('student_number', 'desc')
    .first();

  let nextSeq = 1;
  if (lastStudent) {
    // Récupère la partie hexadécimale et la convertit en décimal
    const lastHexPart = lastStudent.student_number.slice(4);
    nextSeq = parseInt(lastHexPart, 16) + 1;
  }

  nextSeq = nextSeq.toString(16).padStart(10, '0'); // toujours 10 caractères
  return year + nextSeq;
}

module.exports=generateHexStudentNumber;
