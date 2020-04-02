const PeopleService = {
  getAllPeople(db) {
    return db
      .from('sample_table')
      .select();
  },

  getPeopleByJobTitle(db, jobTitle) {
    return db
      .from('sample_table')
      .select()
      .where('job_title', 'ilike', `%${jobTitle}%`);
  },

  getPerson(db, id) {
    return db
      .from('sample_table')
      .select()
      .where({ id })
      .first();
  },

  addPerson(db, person) {
    return db
      .into('sample_table')
      .insert(person)
      .returning('*')
      .first();
  },

  updatePerson(db, id, data) {
    return db
      .from('sample_table')
      .where({ id })
      .update(data);
  },

  deletePerson(db, id) {
    return db
      .from('sample_table')
      .where({ id })
      .delete();
  }
};

module.exports = PeopleService;