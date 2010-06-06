(function(){
	if(!window.tigers){
		try{
			var s=document.createElement('script');
			s.src=location.protocol+'//'+location.hostname+location.pathname+'tigerapp.php';
			fs = document.getElementsByTagName('head')[0];
			if(!fs) fs = document.body;
			if(fs) fs.appendChild(s);
		}catch(e){
			alert(e.message);
		}
	} else window.tigers.init();
	return false;
}())