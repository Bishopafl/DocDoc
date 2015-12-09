

function searchForCondtions(search){
	var $search_bar = $(".js-search-bar").val();
	console.log($search_bar)
	var api_key = "66b0850367645bf27af70b06c3979f7f"
	var resource_url = "https://api.betterdoctor.com/2014-09-12/doctors?query="+ $search_bar +"&skip=0&limit=10&user_key" + api_key;
	var condition_url = "https://api.betterdoctor.com/2015-09-22/conditions?user_key=" + api_key ;

	$.ajax({
		url: condition_url,
		success: function (condition_search){
			condition_search.data.forEach(function(cs){
				var condition_type = cs.name

				if ($search_bar == condition_type){

					$.ajax({
						type: "GET",
						url: resource_url,
						success: function (responce){		
							console.log(searchApi, responce)
						},
						error: function (err){
							console.log("Somethings not right.")
						}
					});
				} else {
					alert("Condition unknown. Please search another condition")
				}
			})
		},
		error: function (err) {
			console.log("it's not working")
		}
	});


}