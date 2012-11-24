/*
 * NColour
 * Scott Greenlay
 */

var NColourPlayer = function() {
	this.cardCounts = ko.observableArray([5, 5, 5, 5]);
	this.truth = ko.observable('Blank');
	this.lie = ko.observable('Blank');
	this.points = ko.observable(0);
	this.updateTruth = function(card) {
		this.truth(card);
	}
	this.updateLie = function(card) {
		this.lie(card);
	}
	this.updateCardCounts = function(cards) {
		this.cardCounts(cards);
	}
	this.updatePoints = function(points) {
		this.points(points);
	}
	this.canRemoveCard = function(index) {
		var currentCounts = this.cardCounts();
		return (currentCounts[index] > 0);
	}
	this.removeCard = function(index) {
		var currentCounts = this.cardCounts();
		currentCounts[index] = currentCounts[index] - 1;
		this.updateCardCounts(currentCounts);
	}
	this.resetAll = function() {
		this.cardCounts([5, 5, 5, 5]);
		this.truth('Blank');
		this.lie('Blank');
		this.points(0);
	};
}

var NColourModel = function() {
	this.you = new NColourPlayer();
	this.me = new NColourPlayer();
	this.colours = ko.observableArray([1, 2, 3, 4]);
	this.pointValues = ko.observableArray([6, 3, 2, 1]);
	this.result = ko.observable('Tie Game');
	this.updateColours = function(colours) {
		this.colours(colours);
	};
	this.shiftColours = function(colours) {
		var myCardCounts = this.me.cardCounts();
		var myNewCardCounts = [0, 0, 0, 0];
		
		var yourCardCounts = this.you.cardCounts();
		var yourNewCardCounts = [0, 0, 0, 0];
		
		var currentColours = this.colours();
		for (curr = 0; curr < currentColours.length; curr++) {
			for (next = 0; next < colours.length; next++) {
				if (colours[next] === currentColours[curr]) {
					myNewCardCounts[next] = myCardCounts[curr];
					yourNewCardCounts[next] = yourCardCounts[curr];
				}
			}
		}
		this.me.updateCardCounts(myNewCardCounts);
		this.you.updateCardCounts(yourNewCardCounts);
		this.updateColours(colours);
	};
	this.isGameOver = function() {
		var isOver = true;
		var myCardCounts = this.me.cardCounts();
		for (var i = 0; i < myCardCounts.length; i++) {
			if (myCardCounts[i] > 0) {
				isOver = false;
			}
		}
		if (!isOver) {
			isOver = true;
			var yourCardCounts = this.you.cardCounts();
			for (var i = 0; i < yourCardCounts.length; i++) {
				if (yourCardCounts[i] > 0) {
					isOver = false;
				}
			}
		}
		return isOver;
	};
	this.updateResult = function() {
		if (this.me.points() > this.you.points()) {
			this.result('You Win');
		}
		else if (this.me.points() < this.you.points()) {
			this.result('You Lose');
		}
		else {
			this.result('Tie Game');
		}
	};
	this.resetAll = function() {
		this.you.resetAll();
		this.me.resetAll();
		this.colours([1, 2, 3, 4]);
		this.pointValues([6, 3, 2, 1]);
		this.result('Tie Game');
	};
};

var model = new NColourModel();
ko.applyBindings(model);

function colourAtIndex(index) {
	if (index != 'Blank') {
		return model.colours()[index];
	}
	return 'Blank';
}

function pointsAtIndex(index) {
	return model.pointValues()[index];
}

function play_lie(card) {
	if (model.me.canRemoveCard(card)) {
		model.me.updateLie(card);
	}
}

function play_truth(card) {
	if (model.me.canRemoveCard(card)) {
		model.me.updateTruth(card);
		game_step(false);
	}
}

function play(card) {
	if (model.me.lie() === 'Blank') {
		play_lie(card);
	}
	else {
		play_truth(card);
	}
}

function random_card_you() {
	var yourCardCounts = model.you.cardCounts();
	var idx = Math.floor(Math.random() * 4);
	while (yourCardCounts[idx] == 0) {
		idx = Math.floor(Math.random() * 4);
	}
	return idx;
}

function game_step(init) {
	if (init == false) {
		model.you.updateTruth(random_card_you());
		
		if (model.me.truth() == model.me.lie()) {
			model.me.removeCard(model.me.truth());
		}
		else {
			model.me.removeCard(model.me.truth());
			model.me.removeCard(model.me.lie());
		}
		
		if (model.you.truth() == model.you.lie()) {
			model.you.removeCard(model.you.truth());
		}
		else {
			model.you.removeCard(model.you.truth());
			model.you.removeCard(model.you.lie());
		}
		
		if (model.me.truth() == model.you.truth()) {
			var currentColours = model.colours();
			var nextColours = [currentColours[1], currentColours[2], currentColours[3], currentColours[0]];
			model.shiftColours(nextColours);
		}
		else {
			var pointValues = model.pointValues();
			model.me.updatePoints(model.me.points() + pointValues[model.me.truth()]);
			model.you.updatePoints(model.you.points() + pointValues[model.you.truth()]);
		}
		
		model.updateResult();
	}
	else {
		model.resetAll();
		
		var scoreOverlay = document.getElementById('scoreoverlay');
		scoreOverlay.style.visibility = 'hidden';
	}
	
	if (model.isGameOver()) {
		var scoreOverlay = document.getElementById('scoreoverlay');
		scoreOverlay.style.visibility = 'visible';
	}
	else {
		model.me.updateTruth('Blank');
		model.me.updateLie('Blank');
		
		model.you.updateTruth('Blank');
		model.you.updateLie(random_card_you());
	}
}

game_step(true);

