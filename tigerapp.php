<?php
/*
this php script compiles the latest tigers application on demand!
*/
header('Content-type: text/javascript');

$js_file = 'js/tigers.js';

if(isset($_GET['min']) && $_GET['min'] && is_writeable('./tmp')){
	$jsmin = false;
	if(!file_exists('tmp/jsmin')){
		$gcc = trim(`which gcc`);
		if($gcc){
			`$gcc jsmin.c -o tmp/jsmin`;
			if(is_executable("tmp/jsmin")){
				$jsmin = "./tmp/jsmin";
			}
		}
		if(!$jsmin){
			touch('tmp/jsmin');//touch the tmp/jsmin fail so we dont keep trying to compile it
		}
	} else if(is_executable('tmp/jsmin')){
		$jsmin = "./tmp/jsmin"
	} else if(is_executable('jsmin')){
		$jsmin = "./jsmin";//use the prepacked version - 64bit linux
	}

	if($jsmin){
		$min_file = './tmp/tigers.min.js';
		$modified = 0;
		if(file_exists($min_file)){
			$modified = filemtime($min_file);
		}

		$fail = 0;
		if(filemtime($js_file) > $modified){
			$fail = 1;
			$min = trim(`cat $js_file | ./tmp/jsmin`);
			if($min){
				$fail = 0;
				file_put_contents($min_file,$min);
			}
		}
		
		if(!$fail){
			$js_file = $min_file;
		}
	}
}

echo file_get_contents($js_file);

?>