function wikiAPI(){

var searchTerm = document.getElementById('searchTerm').value;
var connect = new XMLHttpRequest();
var url = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=20&gsrsearch=" + searchTerm;

connect.open('GET', url);

connect.onload = function(){
    var wikiObject = JSON.parse(this.response);
    //console.log(wikiObject);
    //console.log(wikiObject.query.pages);
    var pages = wikiObject.query.pages;
    for (var i in pages){
        var newDiv = document.createElement("div");
        newDiv.setAttribute('class', 'row h4');
        document.getElementById("wiki").appendChild(newDiv);
        newDiv.innerText = pages[i].title;
    };
}

connect.send();

}