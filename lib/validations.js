var knex = require('../db/knex');

module.exports = {

  titleIsNotBlank: function(input){
    return !input.trim() ? 'Title cannot be blank' : '';
  },

  storyIsNotBlank: function(input){
    return !input.trim() ? 'Story cannot be blank' : '';
  }

}
