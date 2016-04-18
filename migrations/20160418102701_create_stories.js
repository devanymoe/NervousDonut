
exports.up = function(knex, Promise) {
  return knex.schema.createTable('stories', function (table) {
    table.increments();
    table.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('title');
    table.string('image_1');
    table.string('image_2');
    table.string('image_3');
    table.timestamp('datetime');
    table.text('text');
    table.integer('likes');
    table.boolean('published');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('stories');
};
