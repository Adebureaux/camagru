<?php

$to = "adebureaux@gmail.com";
$subject = "Test mail";
$message = "First test mail";

$headers = "From: camagruft@gmail.com\r\n";

if(mail($to, $subject, $message, $headers))
  echo 'Send !';
else
  echo 'Error !';