<?php
ini_set("session.cookie_httponly", 1);

	header("Content-Type: application/json");
	require 'database.php';
	session_start();
	$json_str = file_get_contents('php://input');

	//get the event from sql database in order to display
	$json_obj = json_decode($json_str, true);
	$username = $_SESSION["username"];
	$year = $json_obj['year'];
	$month = $json_obj['month'];
	$stmt = $mysqli->prepare("select eventcontent, day, hour, minute, category from events where username = ? and year = ? and month = ?");
	if (!$stmt) {
		echo ($mysqli->error);
		exit;
	}
	$stmt->bind_param("sii", $username, $year, $month);
	$stmt->execute();
	$stmt->bind_result($eventcontent, $day, $hour, $minute, $category);
	//store them as arrays
	$contents = array();
	$days = array();
	$minutes = array();
	$hours = array();
	$categories = array();
	$index = 0;
	while ($stmt->fetch()) {
		$contents[$index] = htmlentities($eventcontent);
		$days[$index] = $day;
		$hours[$index] = $hour;
		$minutes[$index] = $minute;
		$categories[$index]=htmlentities($category);
		$index++;
	}
	$stmt->close();
	echo json_encode(array("success"=> true, "days"=> $days, "contents"=>$contents, "hours" =>$hours, "minutes"=>$minutes, "categories"=>$categories));
?>