<?php
ini_set("session.cookie_httponly", 1);

session_start();
 // form that passes username to verification.php
require 'database.php';
header("Content-Type: application/json");
/*if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}*/
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.


//if (isset($_SESSION['username'])) {
//	$username = $_SESSION['username'];
//} else {
//exit;
//}


$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $_SESSION["username"];
$eventcontent = $json_obj['eventcontent'];
$year = $json_obj['year'];
$month = $json_obj['month'];
$day = $json_obj['day'];
$hour = $json_obj['hour'];
$minute = $json_obj['minute'];


// same logic here with edit_event.php
$stmt = $mysqli->prepare("SELECT groupevent, sharedevent from events where username = ? and eventcontent = ? and year =? and month = ? and day = ? and hour = ? and minute = ?");
if (!$stmt) {
	echo "guobuqua";
	}
	// Bind the parameter
	$stmt->bind_param('ssiiiii', $username, $eventcontent, $year, $month, $day, $hour, $minute);
	$stmt->execute();
	
	// Bind the results
	$stmt->bind_result($groupevent,$sharedevent);
	$stmt->fetch();
	$group = htmlentities($groupevent);

	$share = htmlentities($sharedevent);
	$stmt->close();
	
	/*

*/

if($group == "group"){


		$stmt = $mysqli->prepare("delete from events where eventcontent = ? and groupevent = ? and year =? and month = ? and day = ? and hour = ? and minute = ?");
if(!$stmt){
	// echo ($mysqli->error);
	exit;
}

$stmt->bind_param('ssiiiii', $eventcontent, $group, $year, $month, $day, $hour, $minute);

if (!$stmt->execute()){
	echo json_encode(array(
		"success" => false,
		"message" => "Something goes wrong"
	));
	$stmt->close();
	exit;
} else {
	$stmt->close();
	echo json_encode(array(
		"success" => true,
		"message" => "You got right for group"
  	));
	exit;
}
}








if($group == "nongroup" && $share == "nonshare"){
$stmt = $mysqli->prepare("delete from events where username = ? and eventcontent = ? and year =? and month = ? and day = ? and hour = ? and minute = ?");
if(!$stmt){
	// echo ($mysqli->error);
	exit;
}

$stmt->bind_param('ssiiiii', $username, $eventcontent,$year, $month, $day, $hour, $minute);

if (!$stmt->execute()){
	echo json_encode(array(
		"success" => false,
		"message" => "Something goes wrong"
	));
	$stmt->close();
	exit;
} else {
	$stmt->close();
	echo json_encode(array(
		"success" => true,
		"message" => $share


  	));
	exit;
}
}



if($share == "share" ){
	echo json_encode(array(
		"success" => false,
		"message" => "shared event cannot be deleted"

  	));
	
	}
if($groupevent == ""){
	echo json_encode(array(
		"success" => false,
		"message" => "event cannot be found"

  	));
}
	
/*}
	else{
		$stmt->close();
	
	}
	
	
	*/
?>