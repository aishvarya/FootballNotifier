function audioNotification(){
    var yourSound = new Audio('POP.WAV');
    yourSound.play();
}
function notify(title, msg, url) {
    chrome.notifications.create(
            url,
            {   
                'type': 'basic',
                'iconUrl' : 'http://4.bp.blogspot.com/-7MZ6c0_tVpI/TomENvjGD4I/AAAAAAAAAGo/iZjcX2pg9fg/s45/test-cricket-ball.jpg',
                'title' : title,
                'message' : msg
            },
            function(notifid){
      //          console.log("Last error:", chrome.runtime.lastError); 
            }
    );
    chrome.notifications.onClicked.addListener(function(notifid) {
	    window.open(url);
	    chrome.notifications.clear(notifid, function(cleared){});
    });
    setTimeout(function(){
        chrome.notifications.clear(url, function(cleared){});
    }, 3000);
} 
running = {}
function notificationPopups(url){
    if (url in running) {
        return;
    }
    running[url] = 1;
    url = 'http://www.scorespro.com/soccer/livescore/fcm-dorohoi-vs-fc-balotesti/28-03-2015/';
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
	for (var i = 0; i < tds.length; i++) { 
		if (tds[i].className == "score") {
			scores = tds[i].innerHTML;
			curscr = scores.length;
			latests = scores
		}
		if (tds[i].className == "league") {
			scores = tds[i].innerHTML;
			// parse score
			var curn = "";
	    		flag = 0;
    			flag2 = 0;
			for (var j = 0; j < scores.length; j++) {
				if (flag2 == 1) {
					curn = curn + scores[j];
				}
				if (scores[j] == '/') {
					flag = 1;
				}
				if (flag == 1 && scores[j]=='>') {
					flag2 = 1;
				}
			}
			matchtit = curn
			// console.log(scores);
		}
		if (tds[i].className == "home") {
			scores = tds[i].innerHTML;
			scorer = scores;
		}
	}
	console.log(matchtit);
//	console.log(latests);
//	console.log(scorer);
	var time = "";
	flag1 = 0;
	flag2 = 0;
	flag3 = 0;
	var player = "";
	for (var i = 0; i < scorer.length; i++) {
		if (flag3 == 1) {
			player = player + scorer[i];
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
//	console.log(player);
//	console.log(time);
	localStorage.setItem("prevscore-"+url,0);
	if (localStorage.getItem("prevscore-"+url) == null || localStorage.getItem("prevscore-"+url) < curscr) {
		localStorage.removeItem("prevscore-"+url);
		localStorage.setItem("prevscore-"+url, curscr, url);
		var msg = "GOAAALLL!" + player + " scores at " + time + "!! Current Score: " + latests;
		console.log(msg);
                notify(matchtit, msg, url);
	}
	console.log(localStorage.getItem("prevscore-"+url));
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
