
let map;
let bounds;
let markers = [];


// Call GOOGLE MAPS API
async function initMap() {
  const center = { lat: 48.856613, lng: 2.352222 };
  const zoom = 8;
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("mapContainer"), {
    center: center,
    zoom: zoom,
    disableDefaultUI: true
  });
  bounds = new google.maps.LatLngBounds();  
}
  

// Call COUNTRIES LOCACTIONS API
async function fetchCountries() {
    const url = 'https://country-state-city-search-rest-api.p.rapidapi.com/allcountries';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '9bddfb3d64mshc7769cf5f40afa8p158dacjsn6266b2210bdb',
        'X-RapidAPI-Host': 'country-state-city-search-rest-api.p.rapidapi.com'
      }
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      return result;
    } 
    catch (error) {
      console.error(error);
    }
};


// Call HOTELS LOCATION API
async function fetchHotels(country) {
  const url = `https://priceline-com-provider.p.rapidapi.com/v1/hotels/locations?search_type=ALL&name=${country}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '9bddfb3d64mshc7769cf5f40afa8p158dacjsn6266b2210bdb',
      'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
    }
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    for(let i = 0; i < result.length; i++){
      let x = (i + 1).toString();
      const marker =  new google.maps.Marker({
      position: { lat: result[i].lat, lng: result[i].lon},
      label: `${x}`,
      map
  }); 
      bounds.extend(new google.maps.LatLng({ lat: result[i].lat, lng: result[i].lon}));
      map.fitBounds(bounds); 
      markers.push(marker);
    }
  }
  catch (error) {
    console.error(error);
  };
};


function addToSelectMenu(result) {
    const x = result.length;
    for(let i = 0; i < x; i++){
        const country = result[i].name;
        loadCountries(country);
    };
};

function loadCountries(country) {
    let option = document.createElement("option");
        option.text = country;
        option.value = country;
        let select = document.getElementById("selectMenu");
        select.appendChild(option);
};


async function main() {
    window.initMap = initMap;
    const result = await fetchCountries();
    addToSelectMenu(result);
};
main();


const changeCountryFromTheList = document.getElementById("selectMenu");
changeCountryFromTheList.addEventListener("change", function(){
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];

  const country = changeCountryFromTheList.value;
    fetchHotels(country);

});