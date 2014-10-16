$(function(){

  var playerCardValue = null;
  var totalBet        = [];
  var state           = { 
    cardPlaced: false,
    coinPlaced: false
  };

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

  // State Cases //
  function cardPlacedOnly() {
    if ((state.cardPlaced === true) && (state.coinPlaced === false)) {
      $("#coin-bet-area").css("visibility", "visible");
      showCoinBetArea();
      $("#coin-bet-area").text("Place Bet Here").css("color", "black");
      $(".speech-bubble").css("visibility", "visible").text("Place a Bet");
      $(".bet-btn").css("visibility", "hidden");
    }
  }

  function coinPlacedOnly() {
    if ((state.cardPlaced === false) && (state.coinPlaced === true)) {
      $("#player-card-area").text("Place Card Here").css("color", "black");
      $(".speech-bubble").css("visibility", "visible").text("Pick a Card");
      $(".bet-btn").css("visibility", "hidden");
    }
  }

  function bothPlaced() {
    if ((state.cardPlaced === true) && (state.coinPlaced === true)) {
      $(".bet-btn").css("visibility", "visible");
      $(".speech-bubble").css("visibility", "visible").text("Press Bet");
    }
  }

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
      state.cardPlaced = true;
      cardPlacedOnly();
      bothPlaced();
    },
    out: function(event, ui){
      $(this).droppable('option', 'accept', '.card-deck');
    }
  });

  // Coin Drag-Drop to Target Droppable //
  function showCoinBetArea(){ 
    $("#coin-bet-area").droppable({
      accept: ".coin",
      drop: function(event, ui){
        var betValue = $(ui.draggable).data("value");
        var betCoin = totalBet.push(ui.draggable[0]);
        $(this).text("Placed!").css("color", "white");
        state.coinPlaced = true;
        coinPlacedOnly();
        bothPlaced();
      }
    }); 
  } 

  // Card Drag-Drop to Original Droppable //
  $("#player-card-deck-container").droppable({
    accept: ".card-deck",
    drop: function(event, ui){
      ui.draggable.position();
      state.cardPlaced = false;
      coinPlacedOnly();  
    }
  });

  // Coin Drag-Drop to Original Droppable //
  $("#player-coin-container").droppable({
    accept: ".coin",
    drop: function(event, ui){
      ui.draggable.position();
      totalBet.pop();
      if (totalBet.length === 0) {
        state.coinPlaced = false;
        cardPlacedOnly();
      }
    }
  });

  // Add Coins on Win //
  function addCoin(bet) {
    for (var i = 0; i < bet; i++) {
      $("<div>").fadeIn('slow').addClass("coin ui-draggable").appendTo("#player-coin-container");
    }
  }

  // Game Play //
  $(".bet-btn").on("click", function(event){
    var houseCardValue = Math.floor(Math.random() * 10 + 1);
    var houseCard = "card-" + houseCardValue;

    $(".card").addClass("flipped", function(){
      $(".back").attr("id", houseCard);
    });

    setTimeout(function(){
      if (playerCardValue === houseCardValue) {
        $(".speech-bubble").text("MEH. U GOT LUCKY.").css("color", "green");
        var playerWinnings = (totalBet.length * 2);
        addCoin(playerWinnings);
      } else {
        $(".casino-table-container").removeClass("casino-table-container").addClass("casino-table-container-penguin-won")
        $(".speech-bubble").text("PENGUIN PWNED!").css("color", "red");
      }
      $(totalBet).fadeOut('slow', function() { 
        $(this).remove(); 
        $("#coin-bet-area").fadeOut('slow');
      });
    }, 500);

    $(this).off(event);

    $(this).removeClass("bet-btn").addClass("reset-btn").text("Reset");

    $(".reset-btn").on("click", function(event){
      event.preventDefault();
      location.reload();
    });
  });
});
