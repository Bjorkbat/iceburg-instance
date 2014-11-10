var uiIsHidden = false;

$("#play").click(function(e) {
  e.preventDefault();
  killIntro();
  $(".content").hide();
  $(".about").hide();
  $("#hideUI").hide();
  startGame();
});

$("#about").click(function(e) {
  e.preventDefault();
  $(".content").hide();
  $(".about").show();
})

$("#aboutBack").click(function(e) {
  e.preventDefault();
  $(".about").hide();
  $(".content").show();
})

$("#hideUI").click(function(e) {
  e.preventDefault();
  if(uiIsHidden === false) {
    $(".about").hide();
    $(".content").hide();
    uiIsHidden = true;
  }
  else {
    $(".content").show();
    uiIsHidden = false;
  }
})
