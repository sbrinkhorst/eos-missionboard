var socket = io();
var clockCache = "";
var ddCache = "";
var dowCache = "";


function checkGridSupport() {
	var result;

	if($(window).width() > 768) {
			try {
				result = CSS.supports("display", "grid");
			}
			catch(err) {
				$('#board').html('<p style="font-size:1.7rem;font-weight:bold;" class="text-center">You are using a <u>severely outdated</u> browser. <br/>Please upgrade to a modern browser, like Firefox or Chrome.</p>');
			}

		if(result == false) {
			$('#board').html('<p style="font-size:1.7rem;font-weight:bold;opacity:0.8;" class="text-center">Your current browser does not support CSS grids. Please upgrade to a modern browser (i.e. Chrome/Firefox).</p>');
		} else {
			console.log('checkGridSupport => Thank you for using a real browser!');
		}
	} else {
		console.log('checkGridSupport => Mobile resolution detected.');
	}


}

function openTab(target) {

	if(target) {
		let board = $('#board');
		board.find('.tabs').removeClass('active');

		if($('#'+target).length > 0) {
			$('#'+target).addClass('active');
		} else {
			$('#missions').addClass('active');
		}

	}



}

function showSpinner() {

	$('body').prepend('<div class="transitionOverlay"><i class="fas fa-sync fa-spin"></i></div>');

	setTimeout(function(){
		let overlay = $('body').find('.transitionOverlay');
		overlay.empty().remove();
	},750)

}

/* show / hide dialogues on connecting/disconnecting */
function connError() {
	setTimeout(function(){
		$('body').prepend('<div class="errorOverlay"><div class="center-center"><h1><i class="fas fa-exclamation-triangle"></i> CONNECTION LOST - Reconnecting ...</h1></div></div>');
	},1000);
}

function reConn() {
	if($('.errorOverlay').length > 0) {
		$('.errorOverlay').empty().remove();
	}
}


/* PARSE THE JSON/ARRAY CONTAINING ALL MISSIONS, BY DATE AND TIME! */
function parseMissions(missions) {

	let d = new Date();
	let currentdate = (d.getDay() + "-" + d.getMonth() + "-" + d.getFullYear());
	let prevdate = ((d.getDay()-1) + "-" + d.getMonth() + "-" + d.getFullYear());
	let board = $('#missions');

	if(missions.length > 0) {

		board.empty();

    console.log('<> Operations detected. Initialising phase one.');

		board.append( "<div class=\"topheader\">"
		 + "<div class=\"rows\">Title:</div>"
		 + "<div class=\"rows\">Goal:</div>"
		 + "<div class=\"rows\">XO:</div>"
		 + "<div class=\"rows\">Shuttle:</div>"
		 + "<div class=\"rows\">Departs:</div>"
		 + "<div class=\"rows\">Est. return:</div>" );

		$(missions).each(function(counter) {

			var entry = missions[counter];

			/* check for status */
			if(entry.status != 'done') {
				/* check the date */
				if(entry.date == currentdate || entry.date == prevdate) {

					let printresult = "<div class=\"entry "+entry.colour+"\">"
					 + "<div class=\"rows\"><span class=\"sm-hidden\">Title:<br/></span>" + entry.title + "</div>"
					 + "<div class=\"rows\"><span class=\"sm-hidden\">Goal:<br/></span>" + entry.goal + "</div>"
					 + "<div class=\"rows\"><span class=\"sm-hidden\">XO:<br/></span>" + entry.XO + "</div>"
					 + "<div class=\"rows\"><span class=\"sm-hidden\">Shuttle:<br/></span>" + entry.shuttlebool + "</div>"
					 + "<div class=\"rows\"><span class=\"sm-hidden\">Departs:<br/></span>" + entry.startTime + "</div>"
					 + "<div class=\"rows\"><span class=\"sm-hidden\">Est. return:<br/></span>" + entry.endTime + "</div>";

					printresult += "</div>";

					board.append(printresult);
				}

			}


		});

		/* FOR EACH MISSION... */

	} else {
    noMissionMessage();
  }

}

/* Print a NO ACTIVE MISSIONS message. This is a function for re-using. */
function noMissionMessage() {

	$('#missions').html('<h2 class="center-center"><i class="fas fa-check"></i> No active or planned missions. Please stand by.</h2>');

}


/* CLOCK */
function updateClock() {
	var currentTime = new Date();

	var currentHours   = currentTime.getHours ( );
	var currentMinutes = currentTime.getMinutes ( );
	var currentSeconds = currentTime.getSeconds ( );

	/* Pad the minutes and seconds with leading zeros, if required */
	currentHours = ( currentHours < 10 ? "0" : "" ) + currentHours;
	currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
	currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

	/* Compose the string for display */
	var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + "&nbsp;ECT";

  var dow;
  var dd = currentTime.getDate();
  /*var mm = currentTime.getMonth()+1;*/

  if(dd < 10){
    dd='0'+dd;
  }

  if (dd == 20) {
    dd    = '20';
    dow   = 'FRI';
  } else if (dd == 21) {
    dd    = '21';
    dow   = 'SAT';
  } else if (dd == 22) {
    dd    = '22';
    dow   = 'SUN';
  } else {
    dd    = '20';
    dow   = 'FRI';
  }
	/* put the target HTML elements into a var we can keep reusing; that way the function will only need to look up each element ONCE. */
	if(clockCache == ""){ clockCache = $("#clock"); }
	if(ddCache == ""){ ddCache = $("#dd"); }
	if(dowCache == ""){ dowCache = $("#dow"); }

	/* apply clock to cached element. */
	clockCache.html(currentTimeString);
	ddCache.html(dd);
	dowCache.html(dow);
}

$(document).ready(function() {
  updateClock();
	checkGridSupport()

  setInterval('updateClock()', 1000);
});
