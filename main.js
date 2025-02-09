import { getObject } from "./imageGetter.js";

let bbox = {
    minLon: -83.380,
    minLat: 33.936,
    maxLon: -83.370,
    maxLat: 33.959
};
let object;
let map;
let time;
let timerInterval;

let marker = {
    marker: null,
    lon: null,
    lat: null
};
let corr;

function drawMap() {
    let location = [(bbox.minLat + bbox.maxLat)/2, (bbox.minLon + bbox.maxLon)/2];
    map = L.map('map').setView(location, 15);

    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "Google",
        pane: "mapPane"
    }).addTo(map);

    function onMapClick(e) {
        if (object.image != null) {
            if (marker.marker != null) {
                marker.marker.remove();
            }
            let point = L.marker(e.latlng, {opacity: 0.6}).addTo(map);
            marker.marker = point;
            marker.lat = e.latlng.lat;
            marker.lon = e.latlng.lng;
        }
    }

    map.on('click', onMapClick);
}
drawMap();

function showImage(object) {
    let base = document.getElementById("picture");
    base.src = object.image;
}

async function start() {
    document.getElementById("map").style.display = "block";
    document.getElementById("welcome").style.display = "block";
    document.getElementById("picture-viewer").style.display = "none";
    document.getElementById("start-button").addEventListener("click", newRound);
    document.getElementById("submit").addEventListener("click", submit);
    document.getElementById("restart").addEventListener("click", restart);
    document.getElementById("submit").disabled = false;
}
start();

function restart() {
    // document.getElementById("welcome").style.display = "block";
    // document.getElementById("picture-viewer").style.display = "none";
    document.getElementById("score").innerText = "";
    if (corr != null) {
        corr.remove();
    }
    if (marker.marker != null) {
        marker.marker.remove();
    }
    newRound();
}

async function newRound() {
    clearInterval(timerInterval);
    document.getElementById("submit").disabled = false;
    time = Date.now();
    document.getElementById("time").innerText = (Date.now() - time)/1000;
    object = await getObject(bbox);
    document.getElementById("welcome").style.display = "none";
    document.getElementById("picture-viewer").style.display = "block";
    showImage(object);
    timerInterval = setInterval(function() {
        document.getElementById("time").innerText = (Date.now() - time)/1000;
    }, 50);
}

function submit() {
    document.getElementById("submit").disabled = true;
    let point = L.marker([object.lat, object.lon], {
        title: "Correct Location"
    }).addTo(map);
    corr = point;
    object.image = null;
    let xa = object.lat;
    let ya = object.lon;
    let xb = marker.lat;
    let yb = marker.lon;
    let distance = Math.sqrt(Math.pow(xa - xb,2) + Math.pow(ya - yb,2));
    let score = 700/(distance*(Date.now() - time));
    score = 0.001*Math.floor(1000*score);
    score = "" + score;
    score = score.substring(0, Math.min(8, score.length));
    document.getElementById("score").innerText = score;
    clearInterval(timerInterval);
}