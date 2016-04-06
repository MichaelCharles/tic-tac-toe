/* global $ */
var failsafe = 0;
var brush = {
    player: "x",
    ai: "o"
},
    winStates = {
        x: [
            [["x","x","x"],["","",""],["","",""]],
            [["","",""],["x","x","x"],["","",""]],
            [["","",""],["","",""],["x","x","x"]],
            [["x","",""],["x","",""],["x","",""]],
            [["","x",""],["","x",""],["","x",""]],
            [["","","x"],["","","x"],["","","x"]],
            [["x","",""],["","x",""],["","","x"]],
            [["","","x"],["","x",""],["x","",""]]
            ],
        y: [
            [["y","y","y"],["","",""],["","",""]],
            [["","",""],["y","y","y"],["","",""]],
            [["","",""],["","",""],["y","y","y"]],
            [["y","",""],["y","",""],["y","",""]],
            [["","y",""],["","y",""],["","y",""]],
            [["","","y"],["","","y"],["","","y"]],
            [["y","",""],["","y",""],["","","y"]],
            [["","","y"],["","y",""],["y","",""]]
            ]
    },
    game = {
        isOver: false,
        state: [["","",""],["","",""],["","",""]],
        turn: "player",
        defaultState: [["","",""],["","",""],["","",""]],
        endGame: function(winner) {
            game.isOver = true;
            $("#gamebox").fadeOut(function(){
                $("#play-again h1").text(winner === "draw" ? "DRAW!" : winner.toUpperCase() + " wins!");
                $("#play-again").fadeIn();
            });
        },
        updateState: function () {
            $("#gamebox div").each(function(i){
                var newVal = "";
                var row = 0;
                var col = 0;
                if ($(this).hasClass("o")) {
                    newVal = "o";
                } else if ($(this).hasClass("x")) {
                    newVal = "x";
                }
                switch (true) {
                    case i < 3:
                        row = 0;
                        col = i;
                        break;
                    case i < 6:
                        row = 1;
                        col = i - 3;
                        break;
                    case i < 9:
                        row = 2;
                        col = i - 6;
                        break;
                    default:
                        throw new Error("Invalid game state input.");
                }
                game.state[row][col] = newVal;
            });
            
            var markCount = 0;
            
            if (game.state[0].isEqualTo(["x","x","x"])
                || game.state[1].isEqualTo(["x","x","x"])
                || game.state[2].isEqualTo(["x","x","x"])
                || game.state[0][0] === "x" && game.state[1][0] === "x" && game.state[2][0] === "x"
                || game.state[0][1] === "x" && game.state[1][1] === "x" && game.state[2][1] === "x"
                || game.state[0][2] === "x" && game.state[1][2] === "x" && game.state[2][2] === "x"
                || game.state[0][0] === "x" && game.state[1][1] === "x" && game.state[2][2] === "x"
                || game.state[0][2] === "x" && game.state[1][1] === "x" && game.state[2][0] === "x") {
                    game.endGame("x");
                } else if (game.state[0].isEqualTo(["o","o","o"])
                || game.state[1].isEqualTo(["o","o","o"])
                || game.state[2].isEqualTo(["o","o","o"])
                || game.state[0][0] === "o" && game.state[1][0] === "o" && game.state[2][0] === "o"
                || game.state[0][1] === "o" && game.state[1][1] === "o" && game.state[2][1] === "o"
                || game.state[0][2] === "o" && game.state[1][2] === "o" && game.state[2][2] === "o"
                || game.state[0][0] === "o" && game.state[1][1] === "o" && game.state[2][2] === "o"
                || game.state[0][2] === "o" && game.state[1][1] === "o" && game.state[2][0] === "o") {
                    game.endGame("o");
                } else {
                    $("#gamebox div").each(function(){
                        if ($(this).hasClass("x") || $(this).hasClass("o")) {
                            markCount++;
                        }
                    });
                    if (markCount === 9) {
                        game.endGame("draw");
                    }
                }
        }
    },
    ai = {
        goal: [],
        play: function() {
            if (game.isOver === false) {
            failsafe ++;
            if (failsafe > 100) { throw new Error("Failsafe triggered."); }
            game.turn = "ai";
            var move = Math.floor((Math.random() * 9) + 1)
            $target = $("#gamebox div:nth-child("+move+")");
            
            if ($target.hasClass("x") || $target.hasClass("o")) {
                console.log("Invalid move(" + move + "), trying again");
                ai.play();
            } else {
            console.log("Played at" + move);
            $target.addClass(brush.ai);
            game.updateState();
            }
            }
        }
    }

Array.prototype.isEqualTo = function(arr) {
    if(this.length !== arr.length)
        return false;
    for(var i = this.length; i--;) {
        if(this[i] !== arr[i])
            return false;
    }
    return true;
}
    
$.fn.fadeInFlex = function (val, callback) {
    if (!val ) { val = 400 }
    this.css({
        "display": "flex",
        "visibility": "hidden"
    })
    this.hide();
    this.css("visibility", "visible");
    this.fadeIn(val)
    setTimeout(callback, val);
}

function main(){
$(".mdl-shadow--2dp").mouseover(function() {
    $(this).addClass("mdl-shadow--6dp"); 
}).mouseleave(function(){
    $(this).removeClass("mdl-shadow--6dp"); 
});

$(".choice").click(function() {
    if ($(this).hasClass("o")) {
        brush.player = "o";
        brush.ai = "x";
        
    }
    $("#options").fadeOut(400, function(){
        $("#gamebox").fadeInFlex(function(){
            if (brush.player === "o") {
                game.turn = "ai";
                ai.play();
            }
        });
    })
})    


$("#gamebox div").click(function() {
    $(this).addClass(brush.player);
    game.updateState();
    ai.play();
});

$("#play-again button").click(function() {
    game.state = game.defaultState;
    $("#gamebox div").each(function(){
        $(this).removeClass("o").removeClass("x");
    })
    brush.player = "x";
    brush.ai = "o";
    failsafe = 0;
    game.turn = "player";
    game.isOver = false;
    $("#play-again").fadeOut(400, function() {
        $("#options").fadeIn();
    })
});

}

$(document).ready(main());