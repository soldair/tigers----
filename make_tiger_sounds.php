#!/usr/bin/env php
<?php
if(php_sapi_name() != 'cli') exit('nope!');
$dir = './sounds';
if(file_exists($dir)){
	if(is_writeable($dir)){
		$files = scandir($dir);
		$sound_exts = array('wav','mp3','ogg');

		$sounds = array();

		foreach($files as $s){
			$parts = array_pad(explode('.',$s,2),2,'');
			$ext = $parts[1];
			$sound = $parts[0];
			if(in_array($ext,$sound_exts)){
				if(!isset($sounds[$sound])) $sounds[$sound] = array();
				$sounds[$sound][$ext] = 1;
			}
		}

		foreach($sounds as $name=>$sound){
			if(isset($sound['wav'])){
				if(!isset($sound['mp3'])){
					echo `sox -r44100 $dir/$name.wav $dir/$name.mp3`;
				}

				if(!isset($sound['ogg'])){
					echo `sox -r44100 $dir/$name.wav $dir/$name.ogg`;
				}
			}
		}

	} else {
		echo "sound dir is not writeable!";
	}

} else {
	echo "no sound dir!\n";
}
