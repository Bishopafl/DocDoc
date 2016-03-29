// landing page javascript call to the api

function searchForCondtions(search){
	var $search_bar = $(".js-search-bar").val();
	alert($search_bar)
	var api_key = "f6518083c37cafdce1f8534f269c9ee7"
	var resource_url = "https://api.betterdoctor.com/2014-09-12/doctors?query="+ $search_bar +"&skip=0&limit=10&user_key" + api_key;

		$.ajax({
			type: "GET",
			url: resource_url,
			success: function (responce){		
				console.log(searchApi, responce)
				
			},
			error: function (err){
				console.log("Landing search is not working.")
			}
		});
	}