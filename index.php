<?php
require 'lib/enableGZIP.php';
require 'lib/getJSFile.php';

$code = getJSFile('js/tigercage.js',true);

$clean_code = trim(json_encode(array($code)),'[]');


?>
<!DOCTYPE html>
<html>
<head>
	<title>TIGERS!!!!!!!!!!!</title>
	<link href='http://fonts.googleapis.com/css?family=Crimson+Text' rel='stylesheet' type='text/css'>
	<style>
		body{
			margin:0;
			padding:0;
			background:#000;
			color:#fff;
			font-size:14px;
			font-family: 'Crimson Text', arial, serif;
		}

		#main{
			width:900px;
			margin:0px auto;
		}

		#page{
			border:3px solid orange;
			background-color:#fff;
			color:#000;
			border-radius:10px;
			-moz-border-radius:10px;
			-webkit-border-radius:10px;
			-khtml-border-radius:10px;
			-o-border-radius:10px;
			padding:5px;
		}

		a,a:visited{
			color:blue;
		}

		a:hover{
			color:green;
		}

		.play-link{
			font-size:20px;
		}
	</style>
</head>
<body>
	<div id="main">
		<h1>TIGERS!!!!!!!!!!!</h1>

		<div id="page">
			<a href="javascript://" class="play-link">Play Tigers Now!</a>
			<script>
				
			</script>
			<div style="margin:3px;padding:3px;">
				you can play tigers on any site when ever you want!<br/>just <u>drag</u> the above link to your <u>bookmark bar</u> and click it when you want to save the world from <span style="color:red">evil</span> tigers!
				<div>
					this game is a <b>BOOKMARKLET!</b> playing it will not change your current domain and you can use it on <b>ANY DOMAIN</b> if you click the bookmark.
				</div>
			</div>
			<div>
				<a href="http://github.com/soldair/tigers----">fork me on github to get your own tigers!</a>
			</div>
		</div>
	</div>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
	<script>
	$(function(){
		var code = <?=$clean_code?>;

		//clean filename chunk if its there
		var path = location.pathname;
		var path_chunks = path.split('/');
		if(path_chunks[path_chunks.length-1].indexOf('.') !== -1){
			path_chunks.pop();
			path = path_chunks.join('/');
		}
		//trim trailing slashes for cleanliness
		path = path.replace(/^\/+|\/+$/g,'');
		var url = location.protocol+'//'+location.host+'/'+path;
		code = code.replace("{SERVER_URL}",url);
		$(".play-link").attr('href','javascript:'+encodeURIComponent(code+';void(0);'));
	})
	</script>
	<?php
		if(file_exists("../google_analytics.inc.php")) include("../google_analytics.inc.php");
	?>
</body>
</html>