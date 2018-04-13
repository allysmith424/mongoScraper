var id;

function loadTeams() {

  $.get("/teams").then(function(result) {

    console.log(result);

    for (var i = 0; i < 50; i++) {

      var team = $("<div class='team'></div>");

        team.html("<span class='team__position'>" + result[i].ranking + "</span><span class='team__flag'><img src='https://" + result[i].flag + "' class='team__flag-img'></span><span class='team__name'>" + result[i].team + "</span><div class='team__comments-div' data-id='" + result[i]._id + "'><span class='team__comments-link'><i class='fas fa-chevron-right'></i></span></div>");

        $(".rankings-list").append(team);

    }

  });

}

function loadCommentSection() {

  $.get("/teams/" + id).then(function(result) {

    $(".user-comment__team-name").empty();

    $("#userComment__submit-btn").remove();

    var commentTeam = $("<h3 class='user-comment__team-name'>");
    commentTeam.html("<span class='user-comment__flag'><img src='https://" + result.flag + "' class='user-comment__flag-img'>" + result.team + "</span>");

    var submitBtn = $("<button id='userComment__submit-btn' data-id='" + result._id + "'>Submit</button>");

    $(".user-comment").prepend(commentTeam).append(submitBtn);

    loadComments(result);

  });

}

function loadComments() {

  $(".comments-list").empty();

  $.get("/teamwithcomments/" + id).then(function(result) {

    console.log(result);

    for (var i = 0; i < result.comments.length; i++) {

      var newComment = $("<div class='comment'></div");
      newComment.html("<span class='comment__name'>" + result.comments[i].name + "</span><br><span class='comment__time'>" + result.comments[i].created.substring(0,10) + "</span><br><span class='comment__body'>" + result.comments[i].body + "</span>");

      $(".comments-list").append(newComment);

    }

    });

}

$(document).ready(function() {

  $.post

  loadTeams();

  $("#header__load-btn").on("click", function(e) {

    $.get("/remove");

    $.get("/scrapeRankings");

    location.reload();

  });

  $(document).on("click", ".team__comments-div", function() {

    console.log("team button clicked");

    id = $(this).data("id");

    loadCommentSection();

  });

  $(document).on("click", "#userComment__submit-btn", function(e) {

    e.preventDefault();

    id = $(this).data("id");

    if ($("#nameInput").val() !== "" && $("#bodyInput").val() !== "") {

      $.ajax({
        method: "POST",
        url: "/teams/" + id,
        data: {
          "name": $("#nameInput").val(),
          "body": $("#bodyInput").val()
        }
      }).then(function(result) {

        console.log(result);

        loadComments();

      });

      $("#nameInput").val("");
      $("#bodyInput").val("");

    }

  });

});
