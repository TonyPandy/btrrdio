




function getJSONPods (url) {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET", url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function findPod() {
    var resultsDiv = document.getElementById("resultsDiv");
    var searchTerm = document.getElementById("searchField").value;
    var url = 'https://itunes.apple.com/search?term=' + searchTerm + '&media=podcast&limit=10';
    //https://itunes.apple.com/au/rss/topaudiopodcasts/limit=20/json - example request to return top podcasts

    //clear search results
    resultsDiv.innerHTML = "";
    //Load dat data
    var json_obj = JSON.parse(getJSONPods(url));
    var resultCount = json_obj.resultCount;

    console.clear();
    console.log(json_obj);
    if (resultCount == 0) {
        resultsDiv.innerHTML = "No results found!";
    }


    for (var i = 0; i < resultCount; i++) {
        outputResults(json_obj.results[i]);
    }

    return false;
}

function outputResults(jsonResults) {
    var resultsOutput;
    var resultsDiv = document.getElementById("resultsDiv");
    console.log(jsonResults);
    var getXMLParameters = "https://cors-anywhere.herokuapp.com/" + jsonResults.feedUrl;
// '
  resultsOutput = "<div class='row podResult'><div class='col-sm-3'><img src='" + jsonResults.artworkUrl600 + "' style='width: 100%;'></div> <div class='col-sm-9'><a href='results.html?result=" + jsonResults.trackId + "' class='podTitle' id='result" + jsonResults.trackId + "'>" + jsonResults.trackName + "</a><br><p class='artist'>" + jsonResults.artistName + "</p><p id='description" + jsonResults.trackId + "'></p><br><span id='epList" + jsonResults.trackId + "'></span><br>Latest Ep: <strong><span id='epTitle" + jsonResults.trackId + "'></span></strong><br><span id=playEp" + jsonResults.trackId +"> </span><br><span id='epListing" + jsonResults.trackId + "' class='episodeListings'></span></div></div></div>";
// <p id='epDescript" + jsonResults.trackId + "'></p>
      //getXML is now called for each outputResults
      getXML(getXMLParameters, jsonResults.trackId, resultsOutput);

}

function getXML (url, jsonTrackId, resultsHTML) {
    var resultsDiv = document.getElementById("resultsDiv");
      $.when($.get(url, function (data) {
        })).then(function(data){
          console.log(data);
          var podcastDescript = $(data).find("channel > description");
          console.log(podcastDescript["0"].textContent);
          var FirstEpisode = $(data).find("item").first();
          var episodes = $(data).find("item");
          var resultsDiv = document.getElementById("resultsDiv");
          resultsDiv.innerHTML += resultsHTML;
          document.getElementById("description"+jsonTrackId).innerHTML = podcastDescript["0"].textContent;
          document.getElementById("epTitle"+jsonTrackId).innerHTML = FirstEpisode.find("title").text();
          var epListLink = document.getElementById("epList"+jsonTrackId);
          //document.getElementById("epDescript"+jsonTrackId).innerHTML = FirstEpisode.find("description").text();
          firstEpisodeUrl = FirstEpisode.find("enclosure").attr('url');
          document.getElementById("playEp"+jsonTrackId).innerHTML = "<audio controls style='width: 100%'><source src=" + firstEpisodeUrl + " type='audio/mpeg'></audio><br>";
            document.getElementById("epList"+jsonTrackId).innerHTML += "<strong><a href='results.html?result=" + jsonTrackId + "'>View Episodes</a></strong>";
          // displayEpisodes(episodes, jsonTrackId);
        });
}

function displayEpisodes(eps, jsonTrackId, epPic) {
  // console.log(eps);
  for(var i = 0; i < 30; i++){

    var title = $(eps[i]).find("title").text();
    var url = $(eps[i]).find("enclosure").attr('url');
    var descript = $(eps[i]).find("description")["0"].textContent;
    descript = descript.trim();
    var dateRaw  = $(eps[i]).find("pubdate").textContent;
    var pubdate = "";

    var epPic = $(eps[i]).find("itunes:image");

    console.log(epPic);
    console.log(eps[i]);

    //TEST - clear date, need to fix this to correctly find the date of publish
    //dateRaw.slice(0,16) -- slice for fixing date format

    document.getElementById("epResultsDiv").innerHTML += "<div class='row podResult'><div class='col-sm-2'><img src='" + epPic + "' width='150'></div><div class='col-sm-10'><p><strong>" + title + "</strong><span class='artist'> "+ pubdate + "</span></p><p>" + descript + "</p>" + "<audio controls style='width: 100%'><source src=" + url + " type='audio/mpeg'></audio><br><br></div>";
  }

  document.getElementById("epResultsDiv").innerHTML += "<br><br><a href='#' class='text-center'>Load More Episodes</a><br><br>";

}


function showPodcastDeets(id) {
  var searchTerm = id;
  var url = 'https://itunes.apple.com/search?term=' + searchTerm + '&media=podcast&limit=10';
  var json_obj = JSON.parse(getJSONPods(url));
  var resultCount = json_obj.resultCount;
  var jsonResults = json_obj.results[0];
  var getXMLParameters = "https://cors-anywhere.herokuapp.com/" + jsonResults.feedUrl;
  var jsonTrackId = id;

  $.when($.get(getXMLParameters, function (data) {
    })).then(function(data){
      // console.log(data);
      var podcastDescript = $(data).find("channel > description");
      var episodes = $(data).find("item");
      var resultsDiv = document.getElementById("epResultsDiv");



      document.getElementById("descriptionDeets").innerHTML = "<div class='row podResult'><div class='col-sm-3'><img src='" + jsonResults.artworkUrl600 + "' style='width: 100%;'></div> <div class='col-sm-9'><p class='podTitle' id='result" + jsonResults.trackId + "'>" + jsonResults.trackName + "</a><br><p class='artist'>" + jsonResults.artistName + "</p><p id='description" + jsonResults.trackId + "'>"+ podcastDescript["0"].textContent + "</p></div></div></div>";


      var epListLink = document.getElementById("epList"+jsonTrackId);
      //document.getElementById("epDescript"+jsonTrackId).innerHTML = FirstEpisode.find("description").text();
      displayEpisodes(episodes, jsonTrackId);
    });

}
