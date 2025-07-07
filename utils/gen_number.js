const moment = require('moment');
const {studentRepository}=require('../repositories');
/**
 * Generate a student number in format: YYYY-XXX-XXX-XXX
 * Uses hexadecimal sequence per year for uniqueness and readability
 * 
 * @param {object} knex - Knex instance
 * @returns {Promise<string>} - Formatted student number
 */
async function generateHexStudentNumber() {
  const year = moment().format('YYYY'); // Current year (e.g. 2025)

  // Fetch the latest student number for this year
  const lastStudent = await studentRepository.findAll()
    .where('student_number', 'like', `${year}%`)
    .orderBy('student_number', 'desc')
    .first();

  let nextSeq = 1;

  if (lastStudent) {
    // Remove dashes, extract hex part after the year
    const lastHexPart = lastStudent.id;//student_number.replace(/-/g, '').slice(4);
    nextSeq = parseInt(lastHexPart, 16) + 1;
  }

  // Convert to hexadecimal, uppercase, and pad to 9 characters
  const hexPart = nextSeq.toString(16).toUpperCase().padStart(9, '0');

  // Format into 3 groups of 3 characters (e.g., 0FF-A11-00A)
  const formattedHex = `${hexPart.slice(0, 3)}-${hexPart.slice(3, 6)}-${hexPart.slice(6, 9)}`;

  // Final format: YYYY-XXX-XXX-XXX
  return `${year}-${formattedHex}`;
}


module.exports=generateHexStudentNumber;
