(function(){
	if(!window.tigers){
		var s=document.createElement('script');
		s.src=location.protocol+'//'+location.hostname+location.pathname+'tigerapp.php';
		var fs=document.getElementsByTagName('script')[0];
		if(fs){
			fs.parentNode.insertBefore(fs, s)
		} else {
			fs = document.getElementsByTagName('head')[0];
			if(!fs) fs = document.body;
			if(fs) fs.appendChild(s)
		}
	}
	return false;
}())