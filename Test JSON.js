function getJSONPods (url) {
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function renameThisFunction() {
    console.clear();
    var searchTerm = document.getElementById("searchField").value;
    //var url = 'https://itunes.apple.com/search?term=' + searchTerm + '&limit=7&media=podcast';
    var url = 'https://itunes.apple.com/search?term=' + searchTerm + '&media=podcast&limit=7';
    var resultsDiv = document.getElementById("resultsDiv");
    var json_obj = JSON.parse(getJSONPods(url));
    resultsDiv.innerHTML = "";

    if (json_obj.resultCount == 0) {
        resultsDiv.innerHTML = "<br>No results found!";
    }
    
    for (var i = 0; i < json_obj.resultCount; i++) { //loop for the podcast results
        //alert(json_obj.results[i].feedUrl);

        resultsDiv.innerHTML += "name: " + json_obj.results[i].artistName +
            "<br><img name='test" + i + "' src=" + json_obj.results[i].artworkUrl100 + "><br>"; //output title + image

        getXML('https://cors-anywhere.herokuapp.com/'+json_obj.results[i].feedUrl);
    }
}

function getXML (url) {
    $.get(url, function (data) {
        console.log(data);
        $(data).find("channel > title").each(function () { // or "item" or whatever suits your feed
            var el = $(this);
            console.log("===Podcast Info===");
            console.log(el["0"].textContent);


            console.log("===Episodes from this podcast===");
            $(data).find("item").each(function () {
                var itemEl = $(this);

                console.log("title      : " + itemEl.find("title").text());
                console.log("description: " + itemEl.find("description").text());
                console.log(itemEl.find("enclosure")["0"].attributes[2].nodeValue);
            });
        });
    });
}
