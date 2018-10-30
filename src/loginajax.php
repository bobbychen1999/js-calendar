<?php

ini_set("session.cookie_httponly", 1);

	require 'database.php';

// login_ajax.php

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
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
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)

$stmt = $mysqli->prepare("SELECT password FROM accounts WHERE username=?");
if (!$stmt) {
	echo "guobuqua";
}
// Bind the parameter
//check if the username is empty

$stmt->bind_param('s', $username);

$stmt->execute();
// Bind the results
$stmt->bind_result($pwd_hash);
$stmt->fetch();

$pwd_guess = $password;

if(password_verify($pwd_guess, $pwd_hash)){
	session_start();

	$_SESSION['username'] = $username;
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

	echo json_encode(array(
		"success" => true,
		"message" => "success"
	));
	exit;
}else{

	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}
?>