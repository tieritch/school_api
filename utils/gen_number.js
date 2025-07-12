const moment = require('moment');
const  knexInstance = require('../db/db_connect'); // ton instance knex
const {studentSeqRepository} = require('../repositories');

async function generateHexStudentNumber() {
  const year = moment().format('YYYY');

  return await knexInstance.transaction(async trx => {
    const nextSeq = await studentSeqRepository.getNextSeq(year, trx);

    const hexPart = nextSeq.toString(16).toUpperCase().padStart(9, '0');
    const formatted = `${hexPart.slice(0, 3)}-${hexPart.slice(3, 6)}-${hexPart.slice(6)}`;

    return `${year}-${formatted}`;
  });
}
module.exports=generateHexStudentNumber;
