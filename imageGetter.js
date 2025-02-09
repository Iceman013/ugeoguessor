import { KEY } from "./key.js";

async function getData(bbox) {
    let url = "https://graph.mapillary.com/images?access_token=";
    let bbbox = "&bbox=" + bbox.minLon + "," + bbox.minLat + "," + bbox.maxLon + "," + bbox.maxLat;
    let closer = "&limit=1";
    let getter = url + KEY + bbbox + closer;
    let response = await fetch(getter);
    let data = await response.json();
    let object = {
        lon: data.data[0].geometry.coordinates[0],
        lat: data.data[0].geometry.coordinates[1],
        id: data.data[0].id,
        image: null
    };
    return object;
}

async function getImageUrlFromId(imageId) {
    let url = "https://graph.mapillary.com/" + imageId + "?access_token=" + KEY + "&fields=id,thumb_original_url";
    let response = await fetch(url);
    let data = await response.json();
    let imageUrl = data.thumb_original_url;
    return imageUrl;
}

export async function getObject(bbox) {
    let object = await getData(bbox);
    let image = await getImageUrlFromId(object.id);
    object.image = image;
    return object;
}