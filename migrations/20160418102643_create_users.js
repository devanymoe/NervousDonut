
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('email');
    table.string('username');
    table.string('first_name');
    table.string('last_name');
    table.boolean('superuser');
    table.string('googleId').unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
