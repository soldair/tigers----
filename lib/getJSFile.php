<?php
/*
this functions job is to grab a js file and return its contents minified or not based on args =)

this will compile jsmin with gcc if its avaiable and you dont have a jsmin that works

WARNING: path assumtions
*/


function getJSFile($js_file,$min  = false){
	static $base;
	if(!isset($base)) $base = dirname(dirname(__FILE__));

	if($min && is_writeable('./tmp')){
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
			$jsmin = "./tmp/jsmin";
		} else if(is_executable('jsmin')){
			$jsmin = "./jsmin";//use the prepacked version - 64bit linux
		}

		if($jsmin){
			$min_file = './tmp/'.basename(str_replace('/','_',$js_file),'.js').'.min.js';
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
	return  file_get_contents($js_file);
}