<?php
ini_set("session.cookie_httponly", 1);

 // form that passes username to verification.php
require 'database.php';
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
header("Content-Type: application/json"); 
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj['username'];

if( !preg_match('/^[\w_\.\-]+$/', $username) ){
		echo json_encode(array(
			"success" => false,
			"message" => "Invalid Username"
		));
		exit;
	}
	
$password = $json_obj['password'];
 $passwordhash = password_hash ($password,PASSWORD_BCRYPT);

// add a user and the password to the databse
$stmt = $mysqli->prepare("insert into accounts (username, password) values (?,?)");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->bind_param('ss', $username, $passwordhash);

if($stmt->execute()){
    session_start();
    $stmt->close();
	$_SESSION['username'] = $username;
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

	echo json_encode(array(
        "success" => true
	));
	exit;
}else{
	echo json_encode(array(
		"success" => false,
		"message" => "Username already existed"
	));
	exit;
}
?>