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
var maxrolls = 3;
var numbers = [];
var eersteKeerGerold = false;

function evaluateScore( score ) 
{
    console.log(score);
}

$(".dice-functionality").on('click', function() 
{
    eersteKeerGerold = true;
    rolls++;
	for(var i=0; i<yahtzeeModel.dices.length; i++)
	{
		if(yahtzeeModel.dices[i].diceIsUnlocked)
		{
			var randomNumber = Math.floor( Math.random() * 6  ) + 1
			yahtzeeModel.dices[i].publish(randomNumber);   
		}
	}
    
    if (rolls >= maxrolls)
    {
        document.getElementById("throwBtn").disabled = true;
    }
    
    console.log("Dit was beurt: " + rolls);
		
});

$('.dice').each( function(){

	// Create new Dice observable
	var newDice = createNewDice( $( this ) );

	//var unlocked = true;

	newDice.diceElement = $( this );

	newDice.lockContainer = $( this ).find('.lockbutton');
    
    // Add dice to model
	yahtzeeModel.dices.push( newDice );
    
        newDice.lockContainer.find('button').on( 'click', function() 
        {
            if(eersteKeerGerold)
            {
                newDice.diceElement.toggleClass('disabled');
                newDice.diceIsUnlocked = !newDice.diceIsUnlocked;

                var currentLock = newDice.lockContainer.attr('id').slice(-1);
                var currentSpan = document.getElementById('val' + currentLock).innerHTML;

                if (!newDice.diceIsUnlocked) 
                {
                    numbers[ 'val' + currentLock ] = currentSpan;
                } 
                else 
                {
                    delete numbers[ 'val' + currentLock ];
                }

                //numbers.sort();    
                console.log(numbers);
                checkScore();
            }
        })
});

function checkScore()
{
    console.log(numbers[0]);
}

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
		//container.find( '.dice-value' ).html( data )	 //DIT MAG EVENTUEEL VERWIJDERD WORDEN.. DIT GEEFT DE GETALLEN WEER IPV DE IMAGES

		var imagesource = "";

		switch (data)
		{
			case 1:
				imagesource = "img_dobbelstenen/dice1.png";
				break;
			case 2:
				imagesource = "img_dobbelstenen/dice2.png";
				break;
			case 3:
				imagesource = "img_dobbelstenen/dice3.png";
				break;
			case 4:
				imagesource = "img_dobbelstenen/dice4.png";
				break;
			case 5:
				imagesource = "img_dobbelstenen/dice5.png";
				break;
			case 6:
				imagesource = "img_dobbelstenen/dice6.png";
				break;
			default:
				break;
		}

		container.find( '.dice-value' ).html( "<img src='" + imagesource + "'>" )

	});

	// Return observable
	return dice;
}