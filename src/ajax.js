$("#add_event_css").hide();
$("#delete_event_div").hide();
$("#edit_event_div").hide();
$("#logout_area").hide();

function update_Calendar(){
	var weeks = currentMonth.getWeeks();
    if(weeks.length == 5){
		document.getElementById("extra?").style.display = "none";
	} else if(weeks.length == 6){
		document.getElementById("extra?").style.display = "";
	}
	var day = [];
	n = 0;
	for(var w in weeks){
		var days = weeks[w].getDates();
		// days contains normal JavaScript Date objects.


		
		//alert("Week starting on "+days[0]);
		
		for(var d in days){
			day[n] = days[d].getDate();
			n++;
			


		}
	}
	for(a=0;a<42;a++){
		if(day[a]==1){
			firstday = a;
			break;
		}
	}
	for (i = 1; i <= a; i++) {
		document.getElementById(i).innerHTML = "";
	}
	var end = false;
	for (i = a+1; i <= 42; i++){
		if (end) {
			document.getElementById(i).innerHTML = "";
			continue;
		}
		if (i != a && day[i] == 1) {
			end = true;
		}
        document.getElementById(i).innerHTML = day[i-1];
	}
    month_display();






}
//whether or not display the category option
var category_show = true;
document.getElementById("category_option").addEventListener("click", function(event){
    if (category_show) {
        category_show = false;
        document.getElementById("category_option").innerHTML = "show category";
    }
    else {
        category_show = true;
        document.getElementById("category_option").innerHTML = "hide category";
    }
    update_Calendar();
    get_event();
})

function get_event() {
	var year = currentMonth.year;
    var month = currentMonth.month+1;
	const pathToPhpFile = 'get_event.php';
    const data = { 'year': year, 'month': month };
    fetch(pathToPhpFile, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(response => {
          alert("Hello");
		  for (i = 0; i < response.days.length; i++) {
              console.log(i);
              console.log("we've detected sth");
              console.log("content: ");
			  var date = response.days[i];
              var content = response.contents[i];
              var minute = response.minutes[i];
              var hour = response.hours[i];
              var category = response.categories[i];
              console.log(content);
              console.log("date: ");
              console.log(date);
              console.log("category:");
              console.log(category);
              console.log(date);
              console.log(firstday);
              document.getElementById(date + firstday).innerHTML = document.getElementById(date + firstday).innerHTML + "\n" + content + "\nat " + hour + ":" + minute + "\n";
              if (category_show) {
                document.getElementById(date + firstday).innerHTML = document.getElementById(date + firstday).innerHTML + "category: " + category;
              }
		  }
      })
      //.catch(error => console.log("error"))
	  //.catch(error => console.error('Error:',error))
	//var result_data = JSON.parse(event.target.responseText);
}


document.addEventListener("load", get_event, false);
document.getElementById("last_month").addEventListener("click", get_event, false);
document.getElementById("next_month").addEventListener("click", get_event, false);

function month_display() {
    var year = currentMonth.year;
    var month = currentMonth.month + 1;
    var str = "";
    str += year;
    str += "/";
    if (month < 10) str += "0";
    str += month;
    document.getElementById("current").innerHTML = str;
}

function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form
    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("loginajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(response => {
            if(response.success){
                $("#add_event_css").show();
                 $("#edit_event_div").show();
                 $("#delete_event_div").show();
                 $("#logout_area").show();
                 $("#login").hide();
                alert("You've been logged in");
                update_Calendar();
                get_event();
                month_display();
            }else{
                alert("You failed to log in")
                console.log(response.message);
            }
            
        })
//        .then(data => console.log(data.success ? "You've been logged in!" : `You haha not logged in ${data.message}`))
}

document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click


function registerAjax(event) {
    const username = document.getElementById("newusername").value; // Get the username from the form
    const password = document.getElementById("newpassword").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("registerajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(response => {
            if(response.success){
                alert("You've been registered");
            }else{
                alert("You failed to register")
                console.log(response.message);
            }
            
        })}

document.getElementById("register_btn").addEventListener("click", registerAjax, false); // Bind the AJAX call to button click


function add_event(event) {
    var eventcontent = document.getElementById("add_event").value; 
    var year = document.getElementById("add_year").value; 
    var month = document.getElementById("add_month").value; 
    var day = document.getElementById("add_day").value; 
    var hour = document.getElementById("add_hour").value; 
    var minute = document.getElementById("add_minute").value; 
    var category = document.getElementById("category").value;
    if (month <= 0 || month > 12 || day <= 0 || day > 31 || hour <= 0 || hour > 23 || minute <= 0 || minute >= 60) {
        alert ("invalid input");
        return 0;
    }
    var group = "nongroup";
    var share = "nonshare";
    // Make a URL-encoded string for passing POST data:
    const data = { 'eventcontent': eventcontent, 'year': year,'month':month,'day':day,'hour':hour,'minute':minute,'category':category, 'group':group,'share':share};

    fetch("add_event.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(response => {
            if(response.success){
                alert("Successfully submitted");
                update_Calendar();
                get_event();
            }else{
                alert("Fail")
                console.log(response.message);
            }
            
        })        
}




function add_groupevent(event) {
    var eventcontent = document.getElementById("add_event").value; 
    var year = document.getElementById("add_year").value; 
    var month = document.getElementById("add_month").value; 
    var day = document.getElementById("add_day").value; 
    var hour = document.getElementById("add_hour").value; 
    var minute = document.getElementById("add_minute").value; 
    var category = document.getElementById("category").value;
    if (month <= 0 || month > 12 || day <= 0 || day > 31 || hour <= 0 || hour > 23 || minute <= 0 || minute >= 60) {
        alert ("invalid input");
        return 0;
    }
    var group = "group";
    var share = "nonshare";
    // Make a URL-encoded string for passing POST data:
    const data = { 'eventcontent': eventcontent, 'year': year,'month':month,'day':day,'hour':hour,'minute':minute,'category':category, 'group':group,'share':share};

    fetch("add_groupevent.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(response => {
            if(response.success){
                alert("Success");
                update_Calendar();
                get_event();
            }else{
                alert("Fail")
                console.log(response.message);
            }
            
        })}

function delete_event(event) {
    if (month <= 0 || month > 12 || day <= 0 || day > 31 || hour <= 0 || hour > 23 || minute <= 0 || minute >= 60) {
        alert ("invalid input");
        return 0;
    }
    var eventcontent = document.getElementById("delete_event").value;
    var year = document.getElementById("delete_year").value; 
    var month = document.getElementById("delete_month").value; 
    var day = document.getElementById("delete_day").value; 
    var hour = document.getElementById("delete_hour").value; 
    var minute = document.getElementById("delete_minute").value; 
    var token = document.getElementById("token").value;
    // Make a URL-encoded string for passing POST data:
    const data = { 'eventcontent': eventcontent,'year': year,'month':month,'day':day,'hour':hour,'minute':minute, 'token':token};

    fetch("delete_event.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(response => {
            if(response.success){
                alert("Success");
                update_Calendar();
                get_event();
                console.log(response.message);

            }else{
                alert("Fail")
                console.log(response.message);
            }
            
        })        
}

document.getElementById("add_event_btn").addEventListener("click", add_event, false);
document.getElementById("add_groupevent_btn").addEventListener("click", add_groupevent, false);
document.getElementById("delete_event_btn").addEventListener("click", delete_event, false); // Bind the AJAX call to button click


function share_event(event) {
    var eventcontent = document.getElementById("add_event").value;
    var otheruser = document.getElementById("otheruser").value;
    var year = document.getElementById("add_year").value; 
    var month = document.getElementById("add_month").value; 
    var day = document.getElementById("add_day").value; 
    var hour = document.getElementById("add_hour").value; 
    var minute = document.getElementById("add_minute").value; 
    var category = document.getElementById("category").value;
    if (month <= 0 || month > 12 || day <= 0 || day > 31 || hour <= 0 || hour > 23 || minute <= 0 || minute >= 60) {
        alert ("invalid input");
        return 0;
    }
    var group = "nongroup";
    var share = "share";
    // Make a URL-encoded string for passing POST data:
    const data = { 'eventcontent': eventcontent, 'otheruser':otheruser, 'year': year,'month':month,'day':day,'hour':hour,'minute':minute,'category':category, 'group':group,'share':share};

    fetch("share_event.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(response => {
            if(response.success){
                alert("Success");
                update_Calendar();
                get_event();
            }else{
                alert("Fail")
                console.log(response.message);
            }
            
        })        
}
document.getElementById("otheruser_btn").addEventListener("click", share_event, false);


function edit_event(event) {
    var eventcontent = document.getElementById("edit_event").value;
    var year = document.getElementById("edit_year").value; 
    var month = document.getElementById("edit_month").value; 
    var day = document.getElementById("edit_day").value; 
    var hour = document.getElementById("edit_hour").value; 
    var minute = document.getElementById("edit_minute").value; 
    var new_eventcontent = document.getElementById("new_event").value;
    var new_year = document.getElementById("new_year").value; 
    var new_month = document.getElementById("new_month").value; 
    var new_day = document.getElementById("new_day").value; 
    var new_hour = document.getElementById("new_hour").value; 
    var new_minute = document.getElementById("new_minute").value; 
        var token = document.getElementById("token").value;
        if (month <= 0 || month > 12 || day <= 0 || day > 31 || hour <= 0 || hour > 23 || minute <= 0 || minute >= 60) {
            alert ("invalid input");
            return 0;
        }
        if (new_month <= 0 || new_month > 12 || new_day <= 0 || new_day > 31 || new_hour <= 0 || new_hour > 23 || new_minute <= 0 || new_minute >= 60) {
            alert ("invalid input");
            return 0;
        }
    // Make a URL-encoded string for passing POST data:
    const data = { 'eventcontent': eventcontent,'year': year,'month':month,'day':day,'hour':hour,'minute':minute,'new_eventcontent': new_eventcontent,'new_year': new_year,'new_month':new_month,'new_day':new_day,'new_hour':new_hour,'new_minute':new_minute, 'token':token};

    fetch("edit_event.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(response => {
            if(response.success){
                alert("Success");
                update_Calendar();
                get_event();
                console.log(response.message);

            }else{
                alert("Fail")
                console.log(response.message);
            }
            
        })        
}
document.getElementById("edit_event_btn").addEventListener("click", edit_event, false); // Bind the AJAX call to button click




function logoutAjax(event) {
    
    fetch("logoutajax.php", {
            method: 'POST',
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(response => {
            if(response.success){
                $("#add_event_css").hide();
                 $("#edit_event_div").hide();
                 $("#delete_event_div").hide();
                 $("#logout_area").hide();
                 $("#login").show();
                alert("You've been logged out");
                update_Calendar();
            }else{
                alert("You failed to log out")
            }
            
        })
//        .then(data => console.log(data.success ? "You've been logged in!" : `You haha not logged in ${data.message}`))
}

document.getElementById("logout_btn").addEventListener("click", logoutAjax, false); // Bind the AJAX call to button click


