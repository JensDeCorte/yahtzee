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
    //Niks
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
    var compare = [];
    var value;

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
                
                console.log(numbers);
                
                //BUG, deze houd values in de array vast, die moet net als de
                //if statement hierboven aangepast worden dat value gedeletet wordt
                //wanneer je weer op de lock drukt
                for(var key in numbers) 
                {
                    value = numbers[key];
                    
                    compare.push(value); 
                    compare.sort();  
                }
                
                console.log("Compare: " + compare);
                compareScore(compare);
            }
        })
});

function compareScore(playerInput)
{
    console.log("PlayerInput: " + playerInput);  
    
    if(playerInput.indexOf('2') > -1 )
    {
        console.log("YES!");
    }
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
		container.find( '.dice-value' ).html( data )
	});

	// Return observable
	return dice;
}