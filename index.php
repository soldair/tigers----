<?php
require 'lib/enableGZIP.php';
require 'lib/getJSFile.php';

$code = getJSFile('js/tigercage.js',true);
$bookmarklet = 'javascript:'.rawurlencode(trim($code)).";void(0)";
?>
<!DOCTYPE html>
<html>
<head>
	<title>TIGERS!!!!!!!!!!!</title>
</head>
<body>
	TIGERS!!!!!!!!!!!<br/>
	<a href="<?php echo $bookmarklet?>">Play Tigers Now!</a>
</body>
</html>