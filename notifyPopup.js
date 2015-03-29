function audioNotification(){
    var yourSound = new Audio('POP.WAV');
    yourSound.play();
}
function notify(title, msg, url) {
	var notif = chrome.notifications.create(
		url,
		{   
			'type': 'basic',
	    		'iconUrl' : 'football_popup.jpg',
	    		'title' : title,
	    		'message' : msg
		},
		function(notifid){
			//console.log("Last error:", chrome.runtime.lastError); 
		}
	);
	chrome.notifications.onClicked.addListener(function(notifid) {
		window.open(url.replace("json", "html"), "_blank");
		chrome.notifications.clear(notifid, function(cleared){});
	});
	setTimeout(function(){
		chrome.notifications.clear(url, function(cleared){});
	}, 10000);
} 
	    //'http://static1.squarespace.com/static/5163feb6e4b0928e3b20b3b1/54098b1ee4b0b1838682a701/54098b31e4b035477df28fba/1409911895462/football-fiesta-salisbury.jpg',
running = {}
function notificationPopups(url){
    if (url in running) {
        return;
    }
    running[url] = 1;
    //console.log(url);
//    url = 'http://www.scorespro.com/soccer/livescore/welling-vs-grimsby/28-03-2015/';
    $.get(url, function(txt) {
        // console.log("Retrieved Page");
        count=0;
        titlematch = txt.match.team1_name + ' vs. ' + txt.match.team2_name + ', ' + txt.match.town_name;
	parser=new DOMParser();
	htmlDoc=parser.parseFromString(txt, "text/html");
	tds=htmlDoc.getElementsByTagName('td');
	curscr = 0;
	var matchtit = "Match";
	var latests = "0 - 0";
	var scorer = "";
	var scorer2 = "";
	gameover = 0;
	matchtit = htmlDoc.getElementsByTagName('title')[0].innerHTML;
	//console.log(matchtit);
	tmpsc = "";
	yellowh = ""; yellowa = "";
	redh = ""; reda = "";
	for (var i = 0; i < tds.length; i++) { 
		brflag = 0;
		if (tds[i].className == "home") {
			scores = tds[i].innerHTML;
			tmpsc = scores;
			//console.log(tmpsc);
			if (scores.indexOf("yellowcard")>-1) {
				yellowh = "";
				curf = 0;
				for (var j = 0; j < scores.length; j++) {
					if (scores[j]=='<') {
						curf++;
					}
					if (curf == 0) {
						yellowh = yellowh + scores[j];
					}
					if (scores[j]=='>') {
						curf--;
					}
				}
			}
			if (scores.indexOf("redcard")>-1) {
				redh = "";
				curf = 0;
				for (var j = 0; j < scores.length; j++) {
					if (scores[j]=='<') {
						curf++;
					}
					if (curf == 0) {
						redh = redh + scores[j];
					}
					if (scores[j]=='>') {
						curf--;
					}
				}
			}
		}
		if (tds[i].className == "score") {
			scores = tds[i].innerHTML;
			pros = scores
			for (var j=0;j<pros.length;j++) {
				if (pros[j]=='-') {
					brflag = 1;
					break;
				}
			}
			// console.log(pros);
			if (brflag == 1) {
				latests = scores;
				curscr = scores.length;
			}
		}
		if (brflag == 1) {
			scorer = tmpsc;
		}
		
		if (tds[i].className == "away" && brflag == 0) {
			// console.log("here");
			scores = tds[i].innerHTML;
			scorer2 = scores;
			if (scores.indexOf("yellowcard")>-1) {
				yellowa = "";
				curf = 0;
				for (var j = 0; j < scores.length; j++) {
					if (scores[j]=='<') {
						curf++;
					}
					if (curf == 0) {
						yellowa = yellowa + scores[j];
					}
					if (scores[j]=='>') {
						curf--;
					}
				}
			}
			if (scores.indexOf("redcard")>-1) {
				reda = "";
				curf = 0;
				for (var j = 0; j < scores.length; j++) {
					if (scores[j]=='<') {
						curf++;
					}
					if (curf == 0) {
						reda = reda + scores[j];
					}
					if (scores[j]=='>') {
						curf--;
					}
				}
			}
		}
		if (tds[i].className == "synopsis st") {
			scores = tds[i].innerHTML;
			// console.log(scores);
			if (scores.indexOf("Finished")>-1) {
				gameover = 1;
			}
		}
	}
    if (gameover == 0) {
//	    console.log(matchtit);
	    //	console.log(latests);
	    //	console.log(scorer);
	    for (var i = 0; i < scorer.length; i++) {
		    if (scorer[i]=='&') {
			    scorer = scorer2;
			    break;
		    }
	    }
	    //console.log("scorer - " + scorer);
	    var time = "";
	    flag1 = 0;
	    flag2 = 0;
	    flag3 = 0;
	    var player = "";
	    swape = 0;
	    for (var i = 0; i < scorer.length; i++) {
		    if (flag3 == 1) {
			    player = player + scorer[i];
			  //  console.log(player);
			    if (!isNaN(parseInt(scorer[i]))) {
				    swape = 1;
			    }
		    }
		    if (scorer[i] == '<') {
			    flag1 = 1;
		    }
		    if (flag1 == 0) {
			    time = time + scorer[i];
		    }
		    if (scorer[i] == '/') {
			    flag2=1;
		    }
		    if (flag2==1 && scorer[i]=='>') {
			    flag3=1;
		    }
	    }
	    if (swape == 1) {
		    // swap time and player
		    var tmpp = time;
		    time = player;
		    player = tmpp;
	    }
	    //	console.log(player);
	    //	console.log(time);
	    // cleanup player
	    flag1 = 0;
	    var anotp = "";
	    for (var i = 0; i < player.length; i++) {
		    if (player[i] == '<') {
			    flag1++;
		    }
		    if (flag1 == 0) {
			    anotp = anotp + player[i];
		    }
		    if (player[i] == '>') {
			    flag1--;
		    }
	    }
	    player = anotp;
	    // cleanup time
	    flag1 = 0;
	    anotp = "";
	    for (var i = 0; i< time.length;i++ ){
		    if (time[i]=='<') {
			    flag1++;
		    }
		    if (flag1==0) {
			    anotp = anotp+time[i];
		    }
		    if (time[i]=='>') {
			    flag1--;
		    }
	    }
	    time = anotp;
	    if (localStorage.getItem("yellowh-"+url) != yellowh && yellowh != "") {
		    localStorage.removeItem("yellowh-"+url);
		    localStorage.setItem("yellowh-"+url, yellowh, url);
		    var msg = "YELLOW CARD!! " + yellowh;
		    notify(matchtit, msg, url + "yellowh");
	    }
	    if (localStorage.getItem("yellowa-"+url) != yellowa && yellowa != "") {
		    localStorage.removeItem("yellowa-"+url);
		    localStorage.setItem("yellowa-"+url, yellowa, url);
		    var msg = "YELLOW CARD!! " + yellowa;
		    notify(matchtit, msg, url + "yellowa");
	    }
	    if (localStorage.getItem("redh-"+url) != redh && redh != "") {
		    localStorage.removeItem("redh-"+url);
		    localStorage.setItem("redh-"+url, redh, url);
		    var msg = "RED CARD FOR HOME TEAM!! " + redh;
		    notify(matchtit, msg, url + "redh");
	    }
	    if (localStorage.getItem("reda-"+url) != reda && reda != "") {
		    localStorage.removeItem("reda-"+url);
		    localStorage.setItem("reda-"+url, reda, url);
		    var msg = "RED CARD!! " + reda;
		    notify(matchtit, msg, url + "reda");
	    }
	    //	    console.log(curscr);
//	    console.log(localStorage.getItem("prevscore-"+url));
	    if (localStorage.getItem("prevscore-"+url) == null) {
		    localStorage.setItem("prevscore-"+url, curscr, url);
		    if (curscr != 0) {
			    var msg = "GOAAALLL!" + player + " score " + time + "!! Live Score: " + latests;
			    //		    console.log(msg);
			    notify(matchtit, msg, url);
		    }
	    }
	    if (localStorage.getItem("prevscore-"+url) < curscr) {
		    localStorage.removeItem("prevscore-"+url);
		    localStorage.setItem("prevscore-"+url, curscr, url);
		    var msg = "GOAAALLL! " + player + " score at " + time + "!! Live Score: " + latests;
//		    console.log(msg);
		    notify(matchtit, msg, url);
	    }
//	    console.log(localStorage.getItem("prevscore-"+url));
    }
	delete running[url];
    });
}

//console.log(results[1]);
function showPopups(){
    //console.log("showPopups Running");
    activeMatches = JSON.parse(localStorage.getItem("activeMatches"));
    //console.log(activeMatches);
    if(activeMatches != null){
        for(i=0;i<activeMatches.length;i++){
            notificationPopups(activeMatches[i]);
        }
    }
}
popupFunc = showPopups;
window.setInterval(popupFunc, 5000);
