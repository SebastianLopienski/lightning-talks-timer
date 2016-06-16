var debug = false;

//debug = true;

$.fn.center = function () {
   this.css("position","absolute");
   this.css("top", ( $(window).height() - this.height() ) / 2  + "px");
   this.css("left", ( $(window).width() - this.width() ) / 2 + "px");
   return this;
}

var timer = {
	ts: 1396569886667,
	warn: 10000
}

function updateTime()
{
	var red = '00';
	var msgSmall = '', msgBig = '', digitsBig = '';

	var time, secondsLeft, msLeft;

	if (!timer.desc) timer.desc = '';

	if (timer.ts == 0) msLeft = 0;
	else msLeft = timer.ts - Date.now();

	secondsLeft = Math.abs(Math.round(msLeft / 1000));
	time = Math.floor(secondsLeft / 60) + ":" + 
		(secondsLeft % 60 < 10?"0":"") + 
		(secondsLeft % 60);

	digitsBig = time;		
	if (timer.ts == 0) {
		msgSmall = 'stopped';
	} else if (msLeft < 0) {
		red = (Math.round(msLeft/300) % 2) ? 'ff':'00';
		msgSmall = time;
		msgBig = 'FINISHED';
		digitsBig = '';
	} else if (msLeft < timer.warn) {
		red = Math.round(255*(timer.warn-msLeft)/timer.warn).toString(16);
		if (red.length < 2) red = '0'+red;
	} 
	//console.log(digitsBig);

	$('#page').css('background-color', '#'+red+'0000');

	$('#msgSmall').html(msgSmall);
	$('#msgBig').html(msgBig);
	$('#digitsBig').html(digitsBig);
	$('#description').html(timer.desc);

	$('#clock').center();
}

function syncTimer()
{
	$.get("get?" + Date.now(), function(data) {
		timer = data;
		if (debug) console.log(data);
	}).fail(function() {
		console.log("sync error");
	}).always(function() {
		setTimeout(function() { syncTimer(); }, 1000);
	});
}


$( document ).ready(function() {
	setInterval(function() { updateTime();}, 100);
	//updateTime();
	syncTimer();
});