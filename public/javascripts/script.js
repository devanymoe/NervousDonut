$(document).ready(function(){

  var $this = $(this);
  var $storyTitle = $('#storyTitle');
  var $likeButton = $('#likeButton');
  var $likesSpan = $('#likesSpan');

  $likeButton.click(function(){
    var currentLikes = $likesSpan.text();
    $likesSpan.text(currentLikes + 1);
    knex('stories').where('title', $storyTitle).increment('likes', 1);

  })


});
