<?php
/*
this php script is a proxy loader for the tigers application js files

1. creates global tigers config

2. provides requireScript function

3. requires jquery if necessary and requires tigers app

*/
header('Content-type: text/javascript');
header('Expires: '.gmdate('D, d M Y H:i:s', 0) . ' GMT');//ALWAYS NOT CACHED
require('lib/enableGZIP.php');
require('lib/getJSFile.php');

enableGZIP();

$files = scandir('./sounds/');
$sound_exts = array('wav','mp3','ogg');

$sounds = array();

foreach($files as $s){
	$parts = array_pad(explode('.',basename($s),2),2,'');
	$ext = $parts[1];
	$sound = $parts[0];
	if(in_array($ext,$sound_exts)){
		if(!isset($sounds[$ext])) $sounds[$ext] = array();
		$sounds[$ext] = $sound;
	}
}

//ensure uptodate tigers minified
getJSFile('js/tigers.js',true);

?>
(function(){
	<?php
	//inject dependency loader script
	echo getJSFile('js/requireScript.js',true);
	?>
	if(window.tiger_game_loaded) return;

	window.tiger_config={};
	tiger_config.sounds = <?php echo json_encode($sounds)?>;
	tiger_config.serverURL="http://<?php echo $_SERVER['SERVER_NAME'].dirname($_SERVER['REQUEST_URI'])?>";
	tiger_config.soundServer='tigersounds.php';

	var jqsrc = "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js";
	if(window.jQuery){
		if(/^1.4/g.test(jQuery.fn.jquery)){//jQuery is 1.4
			requireScript(tiger_config.serverURL+"/tmp/js_tigers.min.js");
			return;
		}
	}

	//no jQuery 1.4 loaded in current document. load it! but dont conflict!
	requireScript(jqsrc,function(){
		window.jQuery14 = jQuery;
		jQuery.noConflict();
		requireScript(tiger_config.serverURL+"/js/tigers.js");
	});
}());