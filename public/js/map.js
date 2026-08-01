
 

// const map = new maplibregl.Map({
//     container: "map",
//     style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${apiKey}`,
//     center: coordinates,
//     zoom: 9,
// }).then((res)=>{console.log(res);})
// .catch((err)=>{console.log(err);})

// new maplibregl.Marker()
//     .setLngLat(coordinates)
//     .addTo(map);

//  console.log(coordinates);
    // Option 2: Use Geoapify (very similar)
const map = new maplibregl.Map({
    container: "map",
    style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${apiKey}`,
    center: coordinates,
    zoom: 9
});




const markerElement = document.createElement("div");
markerElement.innerHTML = '<i class="fa-regular fa-house"></i>';
markerElement.style.fontSize = "30px";
markerElement.style.color = "red";

new maplibregl.Marker({
    color:"red",
    element: markerElement,
    anchor:"bottom",
    offset: [0, -5] // Move the marker upward
   
    
})
.setPopup(
        new maplibregl.Popup().setHTML("<p>Exact location will be provided after booking!</p>")
    )
    .setLngLat(coordinates)
    .addTo(map);