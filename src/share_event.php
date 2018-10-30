<?php
ini_set("session.cookie_httponly", 1);

session_start();
 // form that passes username to verification.php
require 'database.php';
header("Content-Type: application/json");
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
$otheruser = $json_obj['otheruser'];
$eventcontent = $json_obj['eventcontent'];
$year = $json_obj['year'];
$month = $json_obj['month'];
$day = $json_obj['day'];
$hour = $json_obj['hour'];
$minute = $json_obj['minute'];
$category = $json_obj['category'];
$group = $json_obj['group'];
$share = $json_obj['share'];


// add a user and the password to the databse
$stmt = $mysqli->prepare("insert into events (username, year, month, day, hour, minute, eventcontent, category, groupevent, sharedevent) values (?,?,?,?,?,?,?,?,?,?)");
if(!$stmt){
    echo json_encode(array(
		"success" => false,
		"message" => "Something goes super wrong"
	));
	exit;
}

$stmt->bind_param('siiiiissss', $otheruser, $year, $month, $day, $hour, $minute, $eventcontent,$category, $group, $share);

if($username == $otheruser){

    echo json_encode(array(
		"success" => false,
		"message" => "You cannot share sth to yourself"
	));
	exit;

}

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
		"success" => true
  	));
	exit;
}
?>