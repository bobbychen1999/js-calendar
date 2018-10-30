<?php

ini_set("session.cookie_httponly", 1);

    header("Content-Type: application/json");

 session_start();
 session_unset();
 session_destroy();
 echo json_encode(array(
  		"success" => true
  	));
    exit;
    ?>