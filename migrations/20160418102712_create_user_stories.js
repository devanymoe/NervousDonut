
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_stories', function (table) {
    table.increments();
    table.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.integer('story_id')
      .references('id')
      .inTable('stories')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_stories');
};
