<?php
ini_set("session.cookie_httponly", 1);

session_start();
 // form that passes username to verification.php
require 'database.php';
header("Content-Type: application/json");
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.


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
$category = $json_obj['category'];
$group = $json_obj['group'];
$share = $json_obj['share'];

// store the groupuser as an array
$groupuser = [];
$stmt = $mysqli->prepare("SELECT username FROM accounts");
if(!$stmt){
  printf("Query Prep Failed: %s\n", $mysqli->error);
  exit();
}
$stmt -> execute();
$stmt -> bind_result($user);
while ($stmt->fetch()){
  $groupuser[]=$user;
}


$stmt = $mysqli->prepare("insert into events (username, year, month, day, hour, minute, eventcontent, category, groupevent, sharedevent) values (?,?,?,?,?,?,?,?,?,?)");
foreach ($groupuser as $user) {
  $stmt->bind_param('siiiiissss', $user, $year, $month, $day, $hour, $minute, $eventcontent, $category,$group, $share);
  if (!$stmt->execute()){
	echo json_encode(array(
	  "success" => false,
	  "message" => "Something goes wrong."
	));
	$stmt->close();
	exit;
  }
}
	  $stmt->close();
	  echo json_encode(array(
		  "success" => true
	));
	  exit;

?>