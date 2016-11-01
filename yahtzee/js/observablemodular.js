function Observable() {
	
	var _self = this;

	// members that will collect necessary data
	_self.data;
    _self.subscribers = []

    // Public methods
	_self.methods = {

	    publish: function( data ) {

	    	if (typeof data !== 'undefined') {

		    	_self.data = data;
		        for (var subscriberKey = 0; subscriberKey < _self.subscribers.length; ++subscriberKey) {
		            _self.subscribers[ subscriberKey ](data);
		        }
	    	} else {
	    		return _self.data
	    	}
	    },

	    subscribe: function(callback) {
	        _self.subscribers.push(callback);
	    },

	    unsubscribe: function(callback) {
	        var i = 0,
	            len = _self.subscribers.length;
	        // Iterate through the array and if the callback is
	        // found, remove it.
	        for (; i < len; i++) {
	            if (_self.subscribers[i] === callback) {
	                _self.subscribers.splice(i, 1);
	                // Once we've found it, we don't need to
	                // continue, so just return.
	                return;
	            }
	        }
	    }

	}

	return _self.methods
};

var yahtzeeModel = {
	'score'	: 	new Observable(),
	'dices'	:	[]
}

var rolls = 0;
var scoreTotal = 0;
var turn = 1;
var maxrolls = 3;
var numbers = [];
var eersteKeerGerold = false;
var buttonCheck = document.getElementsByClassName("check");
var printTable = document.getElementsByClassName("print");


$(".dice-functionality").on('click', function() 
{
    eersteKeerGerold = true;
    rolls++;
    document.getElementById("turn").innerHTML = turn;
    document.getElementById("beurt").innerHTML = rolls;
    
    if(turn <= 13)
    {
        for(var i=0; i<yahtzeeModel.dices.length; i++)
        {
            if(yahtzeeModel.dices[i].diceIsUnlocked == true)
            {
                var randomNumber = Math.floor( Math.random() * 6  ) + 1
                yahtzeeModel.dices[i].publish(randomNumber);
            }
        }

        if (rolls >= maxrolls)
        {
            document.getElementById("throwBtn").disabled = true;
        }
    }
    else
    {
        alert("Het spel is gedaan.")
    }
		
});

$('.dice').each( function(){

	// Create new Dice observable
	var newDice = createNewDice( $( this ) );
    var compare = [];
    var value;
    var index;
    
    
	newDice.diceElement = $( this );

	newDice.lockContainer = $( this ).find('.lockbutton');
    
    // Add dice to model
	yahtzeeModel.dices.push( newDice );
    
        newDice.lockContainer.find('button').on( 'click', function() 
        {
            if(eersteKeerGerold)
            {
                newDice.diceElement.toggleClass('disabled');
                //Op lock: true = false?
                //op Unock: false = true?
                newDice.diceIsUnlocked = !newDice.diceIsUnlocked;

                var currentLock = newDice.lockContainer.attr('id').slice(-1);
                var currentSpan = document.getElementById('val' + currentLock).innerHTML;

                if (!newDice.diceIsUnlocked) 
                {
                    numbers.push(currentSpan);
                }
                else 
                {
                    index = numbers.indexOf(currentSpan);
                    {
                        numbers.splice(index, 1);
                    }
                }
                console.log(numbers);
                compareScore(currentSpan);
            }
        })
});

function compareScore(currentS)
{
    for (var i = 0; i < 6; i++)
    {
        var currentMin = currentS - 1;
        if (numbers.indexOf(currentS) > -1 && printTable[currentMin].innerHTML == "")
        {
            buttonCheck[currentMin].className += " recomended";
        }
        else
        {
            buttonCheck[currentMin].className = "check";
        }
    }
}

$(".check").click(function()
{
    var point = this.id;
    var matchingTable = point - 1;
    var score = 0;
    var print = false;
    if (eersteKeerGerold == true && printTable[matchingTable].innerHTML == "")
    {
        for (var i= 0; i < numbers.length; i++)
        {        
            if (numbers[i] == point)
            {
                score += parseInt(point);
                buttonCheck[matchingTable].className = "check";
            }
        }
        
        scoreTotal += score;
        printTable[matchingTable].innerHTML = score;
        document.getElementById("allValues").innerHTML = scoreTotal;
        turn++;
        clearRound();
    }
});

function clearRound()
{
    //Remove classes
    $(".dice").removeClass("disabled");
    $(".check").removeClass("recomended");
    //Empty HTML, Array
    $(".dice-value").empty();
    numbers = [];   
    //Enable Throw Button
    document.getElementById("throwBtn").disabled = false;
    //Reset rolls, eerstekeergerold
    rolls = 0;
    eersteKeerGerold = false;
    //Reset de locks
    for(var i=0; i<yahtzeeModel.dices.length; i++)
    {
        yahtzeeModel.dices[i].diceIsUnlocked = true;
    }
    document.getElementById("turn").innerHTML = turn;
    document.getElementById("beurt").innerHTML = rolls;
}

function createNewDice( container ) 
{
	var dice = new Observable();

	dice.diceIsUnlocked = true;
	dice.subscribe(function(data)
    {
		container.find('.dice-value').html( data )
	});
    
	return dice;
}