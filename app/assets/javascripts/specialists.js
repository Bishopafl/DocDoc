  // Add spinner to page
var target = document.getElementById('spinner')
var spinner = new Spinner().spin()
target.appendChild(spinner.el)

createMap({ lat: parseFloat("25.7629064"), lng: parseFloat("-80.193075,193075") })

// document start
$(document).ajaxSend(function() {
}); 

if ($('.container-fluid').hasClass('specialist-page')){
	function positionError () {
		$(".js-loading-text").fadeOut();
		$(".js-position-error").fadeIn();
	};
	// check geolocation
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(onLocation, positionError);
	} else {
		alert("geolocation is not available.")
	};
		
};

function onLocation(position) {
	var myPosition = {
		lat: position.coords.latitude,
		lng: position.coords.longitude
	};
	spinner.stop();
	createMap(myPosition); //creates the map once geolocation has been found
	searchApi(myPosition); //searches the API once location is found
	doctorMarker(myPosition); //puts doctors on map once location is found
};

// start google map function creation
function createMap(position) {
	var latlngPos = new google.maps.LatLng([]);
	var mapOptions = {
		center: position,
		zoom: 12
	};
	map = new google.maps.Map($('#map')[0], mapOptions);
	var marker = createMarker(position);
	marker.setIcon("http://www.google.com/mapfiles/arrow.png");
};
	function onError(err) {
		console.log("Your map isn't working...")
};

var infowindow;
var doctorMarker;

function createMarker(position) {
	var marker = new google.maps.Marker({
		position: position,
		map: map
	});
	return marker;
};

// google maps function to find the doctors coordinates
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

// start doctor marker functions on left side of screen
function doctorMarker(position){
	var query_string = getUrlVars();
	var latcoord = position.lat;
	var lngcoord = position.lng;
	var userlatlng = (latcoord, lngcoord)
	var api_key = "f6518083c37cafdce1f8534f269c9ee7"
	var resource_url = 'https://api.betterdoctor.com/2014-09-12/doctors?query=' + query_string['search-bar'] + '&location='+latcoord+','+lngcoord+',200&skip=0&limit=10&user_key=' + api_key;
	infowindow = new google.maps.InfoWindow();

	$.ajax({
		url: resource_url,
		success: function(response){
			// hide the spinner
			console.log(response)
			response.data.forEach(function(dr_ptn){
				var drlatcoord = dr_ptn.practices[0].lat;
				var drlngcoord = dr_ptn.practices[0].lon;
				var name = dr_ptn.profile.first_name + " " + dr_ptn.profile.last_name;
				var latlngPos = new google.maps.LatLng(drlatcoord, drlngcoord);
				var street = dr_ptn.practices[0].visit_address.street;
				var city = dr_ptn.practices[0].visit_address.city;
				var state = dr_ptn.practices[0].visit_address.state;
				var zip = dr_ptn.practices[0].visit_address.zip;
				var phone = dr_ptn.practices[0].phones[0].number;
				var picture = dr_ptn.profile.image_url;
				var marker = createMarker(latlngPos)

				doctorMarker[name] = marker

				google.maps.event.addListener(marker, "click", function() {
					var html = '\
						<h5>'+name+'</h5>\
						<img class="image" height="100" width="100" src='+ picture +'>\
						<br>\
						<span>'+ 'Contact: '+ phone +'</span>\
						<div class="address">\
						<span class="street">\
						'+ street +'\
						</span>\
						<br>\
						<span class="city-zip">\
						'+city + ',' + state+ ',' + zip +'\
						</span>\
						</div>\
						';
					map.setCenter(marker.getPosition());
					infowindow.setContent(html);
					infowindow.open(map, this);
				});

				});
		},
		error: function(){
			console.log("side bar doctors got lost...")
		};
	});
};



function searchApi (position) {
	var query_string = getUrlVars();
	var latcoord = position.lat;
	var lngcoord = position.lng;
	var api_key = "f6518083c37cafdce1f8534f269c9ee7"
	var resource_url = 'https://api.betterdoctor.com/2014-09-12/doctors?query=' + query_string['search-bar'] + '&location='+latcoord+','+lngcoord+',100&skip=0&limit=10&user_key=' + api_key;

	$.ajax({
		url: resource_url,
		success: function (response){
			displayDoctors(response)
		},
		error: function(err){
			console.log("API search is not working bro");
		}
	});
};

function displayDoctors (response) {
	response.data.forEach(function(dr){
		var name = dr.profile.first_name + " " + dr.profile.last_name;
		var picture = dr.profile.image_url;
		var street = dr.practices[0].visit_address.street;
		var city = dr.practices[0].visit_address.city;
		var state = dr.practices[0].visit_address.state;
		var zip = dr.practices[0].visit_address.zip;
		var speciality = dr.specialties[0].actor;
		var description = dr.specialties[0].description;
		var bio = dr.profile.bio;
		var lati = dr.practices[0].lat;
		var longi = dr.practices[0].lon;
		var html = '\
			<li class="side-drs">\
				<h3>'+ name +'</h3>\
				<span class="side-speciality"><strong>' + speciality + '</strong></span>\
				<br>\
				<div class="side-description">' + description + '<div>\
				<br>\
				<div class="hover-area">\
				<img id="'+dr.uid+'" class="doc-pic" src='+ picture +'>\
				</div>\
				<span>Click Image for Doctor Location</span>\
				<br>\
				<span>-------------------------------</span>\
			</li>';
			
		$(".js-dr-list").append(html);
		$("#"+dr.uid).on("click", function (){
			google.maps.event.trigger(doctorMarker[name], 'click');
		})
	});
}
