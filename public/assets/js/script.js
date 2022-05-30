

let xhr = new XMLHttpRequest();
function getData(){
    var nameF = document.querySelector("#name").value ;
    var descF = document.querySelector("#desc").value ;
    xhr.open("POST", "/build");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
    }};

    let data = `{
    "name": 'nameF',
    "desc": "descF",
    "image": 1,
    }`;

    xhr.send(data);
}