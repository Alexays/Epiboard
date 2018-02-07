<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$lon = $_GET["lon"];
$lat = $_GET["lat"];
$req = "http://api.openweathermap.org/data/2.5/weather?lat=" . $lat . "&lon=" . $lon . "&appid=0c9042777e3128fab0244da248184801";


//die($req);
$res = file_get_contents($req);

die($res);

?>