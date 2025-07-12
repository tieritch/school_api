const {StudentSequence} = require('../models');

const studentSeqRepository = {
  /**
   * Retrieves the next sequence number for a given year.
   * Uses a FOR UPDATE lock within a transaction.
   */
  async getNextSeq(year, trx) {
    const existing = await StudentSequence.query(trx)
      .findById(year)
      .forUpdate(); // verrouillage ligne

    if (existing) {
      const next = Number(existing.last_seq) + 1;

      await StudentSequence.query(trx)
        .patch({ last_seq: next })
        .where({ year });

      return next;
    } else {
      await StudentSequence.query(trx)
        .insert({ year, last_seq: 1 });

      return 1;
    }
  }
};

module.exports = studentSeqRepository;
