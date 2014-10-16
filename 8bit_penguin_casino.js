$(function(){

  // Draggables Descriptions //
  var z = 400;
  $(".card-deck").draggable({ 
    start: function(event,ui) { $(this).css("z-index", z++); },
    revert: 'invalid' 
  });

  $(".coin").draggable({ 
    start: function(event,ui) { $(this).css("z-index", z++) },
    revert: 'invalid' 
  });

  // Card Drag-Drop to Target Droppable //
  $("#player-card-area").droppable({
    accept: ".card-deck",
    drop: function(event, ui){
      $(this).droppable('option', 'accept', ui.draggable);
      playerCardValue = $(ui.draggable).data("value");
      ui.draggable.position({
        my: "center-80% center-60%",
        of: $(this),    
        collision: "touch"
      });

      $(this).text("Placed!").css("color", "white");
      if (event.bubbles) {
        $(".speech-bubble").css("visibility", "visible").text("Place a Bet");
        $("#coin-bet-area").css("visibility", "visible");

        // Coin Drag-Drop to Target Droppable //
        totalBet = []
        $("#coin-bet-area").droppable({
          accept: ".coin",
          drop: function(event, ui){
            betValue = $(ui.draggable).data("value");
            betCoin = totalBet.push(ui.draggable[0]);
            $(this).text("Placed!").css("color", "white");
            $(".bet-btn").css("visibility", "visible");
            $(".speech-bubble").css("visibility", "visible").text("Press Bet");
          }
        });     
      }
    },
    out: function(event, ui){
      $(this).droppable('option', 'accept', '.card-deck');
    }
  });

  // Card Drag-Drop to Original Droppable //
  $("#player-card-deck-container").droppable({
    accept: ".card-deck",
    drop: function(event, ui){
      $("#player-card-area").text("Place Card Here").css("color", "black");
      ui.draggable.position();
      if (event.bubbles === true) {
        $(".bet-btn").css("visibility", "hidden");
        $(".speech-bubble").css("visibility", "visible").text("Pick a Card");
      }
    }
  });

  // Coin Drag-Drop to Original Droppable //
  $("#player-coin-container").droppable({
    accept: ".coin",
    drop: function(event, ui){
      $("#coin-bet-area").text("Place Bet Here").css("color", "black");
      ui.draggable.position();
      if (event.bubbles === true) {
        $(".bet-btn").css("visibility", "hidden");
        $(".speech-bubble").css("visibility", "visible").text("Place a Bet");
      }
    }
  });

  // Game Play //
  $(".bet-btn").on("click", function(event){
    var houseCardValue = 1;//Math.floor(Math.random() * 10 + 1);
    var houseCard = "card-" + houseCardValue;

    $(".card").addClass("flipped", function(){
      $(".back").attr("id", houseCard);
    });

    setTimeout(function(){
      if (playerCardValue == houseCardValue){
        $(".speech-bubble").text("MEH. U GOT LUCKY.").css("color", "green");
        playerWinnings = (totalBet.length * 2);
        $("<div>").addClass("coin ui-draggable").appendTo("#player-coin-container");
      } else {
        $(".casino-table-container").removeClass("casino-table-container").addClass("casino-table-container-penguin-won")
        $(".speech-bubble").text("PENGUIN PWNED!").css("color", "red");
        $(totalBet).fadeOut('slow', function() { 
          $(this).remove(); 
          $("#coin-bet-area").fadeOut('slow');
        });
      }
    }, 500);

    $(this).off(event);

    $(this).removeClass("bet-btn").addClass("reset-btn").text("Reset");

    $(".reset-btn").on("click", function(event){
      event.preventDefault();
      location.reload();
    });
  });
});
