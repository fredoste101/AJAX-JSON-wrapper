<?php

	$headers = apache_request_headers();
	$header_string = "";
	
	foreach ($headers as $header => $value) {
		$header_string .= "{$header} : {$value} <br />";
	}

	$request_variables = "";

	foreach ($_REQUEST as $key => $value)
	{
	  $request_variables += $key . " = " . $value . "<br/>";
	}

	echo json_encode(new Response("Response from json_response.php. <br/><br/>All request headers:<br/> " . $header_string . "<br/>All request variables: <br/>" . $request_variables));
	die;

	class Response
	{
		public $message;

		function __construct($message)
		{
			$this->message = $message;
		}
	}

?>
