function navigateADM(target) {

  $('#admin-panel').empty().load('/admin/' + target + '.html');

  setTimeout(function(){
    if(target == 'adminpanel') {
      socket.emit('requestMissions');
    }
  },500);

}

function parseMissionsADM(missions) {

	let d = new Date();
	let currentdate = (d.getDay() + "-" + d.getMonth() + "-" + d.getFullYear());
	let prevdate = ((d.getDay()-1) + "-" + d.getMonth() + "-" + d.getFullYear());
	let board = $('#missions');

	if(missions.length > 0) {

		board.empty();

    missions.sort(sortArrDESC("colourcode"));

    $(missions).each(function(counter) {

      var entry = missions[counter];

      /* check for status */
      if(entry.status != 'done') {

        let printresult = "<form method=\"POST\" action=\"/admin/edit\" class=\"form\">"
        + "<div class=\"entry\">"

          + "<div class=\"freerow "+entry.colour+"\">&nbsp;</div>"

          + "<input type=\"hidden\" value=\""+entry.id+"\" name=\"updateMission[id]\" />"
          + "<div class=\"rows title\">"
            +"<div class=\"col\"><label>Title:</label><input type=\"text\" name=\"updateMission[title]\" value=\"" + entry.title + "\"/></div>"
            +"<div class=\"col\"><label>Goal:</label><input type=\"text\" name=\"updateMission[goal]\" value=\"" + entry.goal + "\"/></div>"
            +"<div class=\"col\"><label>XO:</label><input type=\"text\" name=\"updateMission[XO]\" value=\"" + entry.XO + "\"/></div>"
          +"</div>"

          + "<div class=\"rows title\">"
            +"<div class=\"col\"><label>Departs:</label><input type=\"time\" name=\"updateMission[startTime]\" value=\"" + entry.startTime + "\"/></div>"
            +"<div class=\"col\"><label>Est. return:</label><input type=\"time\" name=\"updateMission[endTime]\" value=\"" + entry.endTime + "\"/></div>"
            +"<div class=\"col\"><label>Shuttle:</label><select name=\"updateMission[shuttleswitch]\">"
              + "<option "+ (entry.shuttleswitch == "none" ? "selected" : "") +" value=\"none\">None</option>"
              + "<option "+ (entry.shuttleswitch == "#1" ? "selected" : "") +" value=\"#1\">#1</option>"
              + "<option "+ (entry.shuttleswitch == "#2" ? "selected" : "") +" value=\"#2\">#2</option>"
              + "<option "+ (entry.shuttleswitch == "#3" ? "selected" : "") +" value=\"#3\">#3</option>"
            +"</select></div>"
          +"</div>"

          + "<div class=\"rows\">"

            +"<div class=\"col\"><label>Status:</label><select name=\"updateMission[status]\">"
              + "<option "+ (entry.status == "prep" ? "selected" : "") +" value=\"prep\">Prep (new)</option>"
              + "<option "+ (entry.status == "delayed" ? "selected" : "") +" value=\"delayed\">Delayed</option>"
              + "<option "+ (entry.status == "departing" ? "selected" : "") +" value=\"departing\">Departing</option>"
              + "<option "+ (entry.status == "ongoing" ? "selected" : "") +" value=\"ongoing\">Ongoing</option>"
              + "<option "+ (entry.status == "returning" ? "selected" : "") +" value=\"returning\">Returning</option>"
              + "<option "+ (entry.status == "done" ? "selected" : "") +" value=\"done\">Done (delete from board)</option>"
            +"</select></div>"

            +"<div class=\"col\"><label>Colour:</label><select name=\"updateMission[colourcode]\">"
              + "<option "+ (entry.colourcode == "10" ? "selected" : "") +" value=\"10\">Gray (default)</option>"
              + "<option "+ (entry.colourcode == "20" ? "selected" : "") +" value=\"20\">Blue</option>"
              + "<option "+ (entry.colourcode == "30" ? "selected" : "") +" value=\"30\">Green</option>"
              + "<option "+ (entry.colourcode == "40" ? "selected" : "") +" value=\"40\">Yellow</option>"
              + "<option "+ (entry.colourcode == "50" ? "selected" : "") +" value=\"50\">Orange</option>"
              + "<option "+ (entry.colourcode == "60" ? "selected" : "") +" value=\"60\">Red</option>"
            +"</select></div>"

            +"<div class=\"col\"><input class=\"button blue\" type=\"submit\" value=\"Edit\" /></div>"
          +"</div>";

        printresult += "</div></form>";

        board.append(printresult);

      }


    });

	} else {

    noMissionMessage();

  }

}


// Internet's meest generieke, gecopypaste en gestolen functie allertijden :
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length,c.length);
      }
    }
  return "";
}


function logout() {
  setCookie('auth','false','-1');
  location.href = "/admin/index.html";
}
