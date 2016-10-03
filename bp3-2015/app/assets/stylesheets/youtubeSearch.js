var vidId;
function search(){
	var q = document.getElementById("video").value;
	var searchq = q.replace(" ", "+");
	console.log(q + "    " + searchq);

	$.ajax({
		url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + searchq + '&key=AIzaSyDuyYR4yGdSzLxeygY90AhZ29UaQGWMRE0',
		type: 'GET',
		dataType: 'json',
		data:{

		},
		success: function(resp){
			//console.log(resp);
			//console.log(resp.items);
			//console.log(resp.items[0]);
			//console.log(resp.items[0].snippet.thumbnails.default.url);
			//console.log(resp.items[0].id)
			//console.log(resp.items[0].id.videoId);

			vidId = resp.items[0].id.videoId;

			document.getElementById("results").innerHTML = "";

			for(var item in resp.items)
			{
				console.log(resp.items[item].id.videoId);
				document.getElementById("results").innerHTML = document.getElementById("results").innerHTML + "<p onclick=\"playSong(" + resp.items[item].id.videoId 
					+ ");\">" + resp.items[item].snippet.title + "<br /> <img src=\"" + resp.items[item].snippet.thumbnails.default.url + "\" /> </p> <br />";
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			alert("Could not search.");
		}
	});
}


function playSong(videoId){
	console.log("asfd: " + videoId);
}