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



// Create an object that will contain all the data for the yahtzee project
var yahtzeeModel = {
	'score'	: 	new Observable(),
	'dices'	:	[]
}


// Score functionality
// Score subscriptions, get executed when score changes
//yahtzeeModel.score.subscribe(function updateScore() {
//	// Add newly published score to HTML
//    $('.score-value').html( yahtzeeModel.score.publish() );
//})

function evaluateScore( score ) 
{
    console.log(score);
}


// Dice functionality
// Loop over all dices found in HTML
$('.dice').each( function(){

	// Create new Dice observable
	var newDice = createNewDice( $( this ) );

	//var unlocked = true;

	newDice.diceElement = $( this );

	newDice.lockContainer = $( this ).find('.lockbutton');

	newDice.lockContainer.find('button').on( 'click', function() {
		
		newDice.diceElement.toggleClass('disabled');
		newDice.diceIsUnlocked = !newDice.diceIsUnlocked;
		//console.log( newDice.publish());
	})

	// Add dice to model
	yahtzeeModel.dices.push( newDice );
});

var rolls = 0;

// Add event listener to button in dice
$(".dice-functionality").on('click', function() {
    
    rolls++;
    
	for(var i=0; i<yahtzeeModel.dices.length; i++)
	{
		if(yahtzeeModel.dices[i].diceIsUnlocked)
		{
			// Generate number between 1-6
			var randomNumber = Math.floor( Math.random() * 6  ) + 1

			// Update dice value
			//currentDice.publish( randomNumber );
			yahtzeeModel.dices[i].publish(randomNumber);
		}
	}
    
//-------------------------JORDY------------------------------------//

    
    if (rolls >= 3)
    {
        document.getElementById("throwBtn").disabled = true;
    }
    
    console.log("Dit was beurt: " + rolls);
		
});

var numbers = [];

$('.lockbutton').on('click', function()
{
    var currentLock = $(this).attr('id').slice(-1);
    var currentSpan = document.getElementById('val' + currentLock).innerHTML;
    document.getElementById('lock' + currentLock).disabled = true;
    numbers.push(currentSpan);
    numbers.sort();
    console.log(numbers);
    
    checkScores();
})

$('check').on('click', function()
{
    //Print score op de bijhorende span
    unlockTrow();
})

function unlockTrow()
{
    rolls = 0;
    document.getElementById("throwBtn").disabled = false;
    //dice unlockken en values op 0 zetten
}

//SCORES
function checkScores()
{
    var ones    = numbers.indexOf("1");
    var twos    = numbers.indexOf("2");
    var threes  = numbers.indexOf("3");
    var fours   = numbers.indexOf("4");
    var fives   = numbers.indexOf("5");
    var sixes   = numbers.indexOf("6");
    var threeOfKind = "";
    var fourOfKind = "";
    var fullHouse = "";
    var smallStraight = ""; //1,2,3,4 or 2,3,4,5 or 3,4,5,6
    var largeStraight = ""; // 1,2,3,4,5 or 2,3,4,5,6
    var chance = ""; //Random stuff
    var yahtzee =""; //Five of a kind
}

function checkForHowMany(array, what) 
{
    var count = 0;
    for (var i = 0; i < numbers.length; i++) 
    {
        if (array[i] === what) 
        {
            count++;
        }
    }
    return count;
}

//--------------------------------------------------------------//

// Functionality used to make creation of die easier
// @container jQuery object
function createNewDice( container ) {

	// Create new observable
	var dice = new Observable();

	dice.diceIsUnlocked = true;

	// Add subscription to observable
	dice.subscribe(function( data ){
		// Recalculate score when dice is cast
        if (dice.diceIsUnlocked == true)
        {
            dice.subscribe( evaluateScore );
        }
		// Update dice HTML value
		container.find( '.dice-value' ).html( data )
	});

	// Return observable
	return dice;
}