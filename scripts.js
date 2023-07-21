var redirect_uri= "http://127.0.0.1:5500/index.html"
var client_id = "";
var client_secret = "";

const AUTHORIZE =  "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const TOP_ARTISTS = "https://api.spotify.com/v1/me/top/artists";


function onPageLoad() {
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    if ( window.location.search.length > 0) {
        handleRedirect();
    } else {
        access_token = localStorage.getItem("access_token");
}
}

function handleRedirect() {
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect_uri);
}

function getCode() {
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function requestAuth() {
    client_id = "";
    client_secret = "";
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-top-read";
    window.location.href = url; // Show Spotify's authorization screen
    console.log(url);
}


function fetchAccessToken(code) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationAPI(body);
}

function refreshAccessToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationAPI(body);
}


function callAuthorizationAPI(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    if ( this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if (data.access_token != undefined) {
            access_token = data.access_token
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token != undefined) {
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        window.alert(this.responseText);
    }
}

function getArtists() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", 'Bearer ' + access_token);
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    const listEl = document.getElementById("favorite_artist");
    fetch("https://api.spotify.com/v1/me/top/artists?time_range=medium_term", requestOptions)
      .then(response => response.json())
      //.then(result => console.log(result))
      .then(result => Object.values(result.items).forEach(value => {
        listEl.insertAdjacentHTML('beforeend', `<li>${value.name}</li>`)
        console.log(value.name);
      }))
      .catch(error => console.log('error', error));
      const listEll = document.getElementById("favorite_songs");
      fetch("https://api.spotify.com/v1/me/top/tracks?time_range=medium_term", requestOptions)
        .then(response => response.json())
        //.then(result => console.log(result.items))
        .then(result => Object.values(result.items).forEach(value => {
          listEll.insertAdjacentHTML('beforeend', `<li>${value.name}</li>`)
          //console.log(value.name);
        }))
        .catch(error => console.log('error', error));
}

function getTracks() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", 'Bearer ' + access_token);
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

      
}