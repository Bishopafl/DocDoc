

function searchForCondtions(search){
	var $search_bar = $(".js-search-bar").val();
	console.log($search_bar)
	var api_key = "66b0850367645bf27af70b06c3979f7f"
	var resource_url = "https://api.betterdoctor.com/2014-09-12/doctors?query="+ $search_bar +"&skip=0&limit=10&user_key" + api_key;


		$.ajax({
			type: "GET",
			url: resource_url,
			success: function (responce){
				console.log(searchApi, responce)
				displaySpecialties(responce)

			},
			error: function (err){
				console.log("Somethings not right.")
			}
		});
}

function displaySpecialties (drs){
console.log('hello')
	drs.data.forEach(function(dr){
		console.log(dr)
		var speciality = dr.specialties[0].description;
		var html = "\
		<li>\
			<span>" + speciality + "</span>\
		</li>";

		$(".js-specialist-list").append(html)
	});
}