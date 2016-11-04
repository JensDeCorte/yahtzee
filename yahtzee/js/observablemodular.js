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
var bonusScore = 0;
var turn = 0;
var maxrolls = 3;
var numbers = [];
var eersteKeerGerold = false;
var bonusAdded = false;
var buttonCheck = document.getElementsByClassName("check");
var printTable = document.getElementsByClassName("print");
var diceSound = new Audio("sounds/dice.mp3");

$(".dice-functionality").on('click', function() 
{
    if (eersteKeerGerold == false)
    {
        //enkel op eerste worp turn + 1
        turn++;
    }
    diceSound.play();
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
        alert("Het spel is gedaan. Je score was " + scoreTotal);
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
                //de slice is om het nummer van de dobbelsteen uit de image-source te halen
                var currentSpan = document.getElementById('val' + currentLock).innerHTML.slice(31,32);

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
                numbers.sort();
                console.log(numbers);
            }
        })
});



$(".check").click(function()
{
    var point = this.id;
    var matchingTable = point - 1;
    var score = 0;
    var groeiWaarde = 0;
    var groeiWaarde1 = 0;
    var groeiWaarde2 = 0;
    var origin = []
    var amount = [];
    var prev;
    
    var singleNumbers = [];
	var vorigNummer = 0;
	var indexNummer = 0;
    
    var houseDouble = false;
    var houseTriple = false;
    
    var smallStraight = true;
    var largeStraight = true;
    
    //Als op throw is geklikt, zoek en print score
    if (eersteKeerGerold == true)
    {
        
        //Alle niet gelocked dices in numbers steken
        for(var i = 0; i<yahtzeeModel.dices.length; i++)
        {
            if (yahtzeeModel.dices[i].diceIsUnlocked == true) 
            {
                var currentLock = yahtzeeModel.dices[i].lockContainer.attr('id').slice(-1);
                var currentSpan = document.getElementById('val' + currentLock).innerHTML.slice(31,32);
                numbers.push(currentSpan);
            }
        }
        //verwijder alle dubbele nummers voor controle small straight
		for (var i = 0; i < numbers.length; i++) 
        {
            if (numbers[i] != vorigNummer)
            {
                vorigNummer = numbers[i];
                singleNumbers[indexNummer] = numbers[i];
                indexNummer++;
            }
		}
        
        //Tel hoeveel een number voorkomt en stop hoeveelheid in amount
        for (var x = 0; x < numbers.length; x++)
        {
            if (numbers[x] !== prev) 
            {
                origin.push(numbers[x]);
                amount.push(1);
            } else 
            {
                amount[amount.length-1]++;
            }
            prev = numbers[x];
            }
            //Check voor een full house combo
        for(var p=0; p < amount.length; p++)
        {       
            switch(amount[p])
            {
                case 2: houseDouble = true;
                    break;
                case 3: houseTriple = true;
                    break;
                default:
                    break;
            }
        }
        //Check voor een small straight
        groeiWaarde1 = singleNumbers[0];
        groeiWaarde2 = singleNumbers[1];
        for (var d=0; d < 4; d++)
        {
            if (singleNumbers[d] == groeiWaarde1)
            {
                groeiWaarde1 = parseInt(singleNumbers[d]) + 1;
            }
            else if (singleNumbers[d] == groeiWaarde2)
            {
                groeiWaarde2 = parseInt(singleNumbers[d]) + 1;
            }
            else
            {
                smallStraight = false;
            }
        }
        //check voor een large straight
        groeiWaarde = numbers[0];
        for (var c=0; c < 5; c++)
        {
            if (numbers[c] == groeiWaarde)
            {
                groeiWaarde = parseInt(numbers[c]) + 1;
            }
            else
            {
                largeStraight = false;
            }
        }
        
        //Check voor bovenkant of mogelijke combo's
        for (var i= 0; i < numbers.length; i++)
        {            
            //Numbers 1-6 of hoeveel voorkomen
            if (numbers[i] == point) // Bovenkant
            {
                score += parseInt(point);
                bonusScore += parseInt(point);
            }
            else if(amount[i] >= 3 && point == 7) //Three of kind
            {
                for (var l=0; l<numbers.length; l++)
                {
                    score += parseInt(numbers[l]);
                }
            }
            else if(amount[i] >= 4 && point == 8) //Four of kind
            {
                for (var l=0; l<numbers.length; l++)
                {
                    score += parseInt(numbers[l]);
                }     
            }
            else if (houseDouble == true && houseTriple == true && point == 9) // Full house
            {
                score = 25;                
            }
            else if(smallStraight == true && point == 10) //Small Straight
            {
                score = 30;
            }
            else if(largeStraight == true && point == 11)// Large straight
            {
                score = 40;
            }
            else if(point == 12) // Chance
            {
                score += parseInt(numbers[i]);
            }
            else if(amount[i] == 5 && point == 13) //Yathzee
            {
                score = 50;
            }
        }
        
        printTable[matchingTable].innerHTML = score;
        this.disabled = true;
        scoreTotal += score;
        document.getElementById("allValues").innerHTML = scoreTotal;
        clearRound();
    }
    else
    {
        alert("Eerst rollen aub.");
    }
    
});

function clearRound()
{
    //Check for bonus
    if(bonusScore > 63 && bonusAdded == false)
    {
        scoreTotal += 35;
        document.getElementById("bonus").innerHTML = 35;
        document.getElementById("allValues").innerHTML = scoreTotal;
        bonusAdded = true;
        console.log(bonusScore);
    }
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
    document.getElementById("beurt").innerHTML = rolls;
}

function createNewDice( container ) 
{
	var dice = new Observable();

	dice.diceIsUnlocked = true;
	dice.subscribe(function(data)
    {
    	//container.find( '.dice-value' ).html( data )    DIT WAS OM DE GETALLEN TE LATEN ZIEN -- als je dit wil moet het deel hieronder weg

    	//dit deel hieronder is om de getallen om te zetten naar dobbelsteen-images
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
							//tot hier is om de images te tonen
	});
    
	return dice;
}