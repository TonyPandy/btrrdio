
function getJSONPods (url) {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function renameThisFunction() {
    var searchTerm = document.getElementById("searchField").value;
    var url = 'https://itunes.apple.com/search?term=' + searchTerm + '&limit=200&media=podcast';
    var resultsDiv = document.getElementById("resultsDiv");
    var json_obj = JSON.parse(getJSONPods(url))
    resultsDiv.innerHTML = "";
    for (var i = 0; i < json_obj.resultCount; i++) {
        //alert(json_obj.results[i].artistName);
        resultsDiv.innerHTML += "name: " + json_obj.results[i].artistName +
            "<br><img name='test" + i + "' src=" + json_obj.results[i].artworkUrl100 + "><br>";
    }
}

