(function(){
	if(!window.tigers){
		try{
			var s=document.createElement('script');
			s.src='{SERVER_URL}/tigerapp.php';
			fs = document.getElementsByTagName('head')[0];
			if(!fs) fs = document.body;
			if(fs) fs.appendChild(s);
		}catch(e){
			alert('tigers failed to load =(');
		}
	} else window.tigers.init();
	return false;
}())