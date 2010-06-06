window.requireScript = function fn(src,complete){
	if(!complete) complete = function(){};
	if(!fn.loadedScripts) fn.loadedScripts = {};
	if(src instanceof Array){
		var z = fn;
		/*given an array of src attributes, considered sequential dependencies
			load each one incrementing the counter 
			when the last script has been loaded fire the complete function.
		*/
		//console.log('batch loading src',src);
		(function fn(){
			if(!fn.counter) {
				fn.counter = 0;
			}
			//i have no more scripts to include
			if(fn.counter == src.length){
				//console.log('done');
				complete();
			} else {
				//console.log('loading src',fn.counter,src[fn.counter]);
				z(src[fn.counter++],fn);
			}
		}());
		return;
	}
	if(!fn.loadedScripts[src]){
		var script_el = document.createElement('script');
		document.body.appendChild(script_el);
		
		fn.loadedScripts[src] = [];
		script_el.onload = script_el.onreadystatechange = function(ev) {
			if(!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
				runCallbacks(src,script_el);
			}
		}
		script_el.src = src;
	}
	if(fn.loadedScripts[src] !== true && typeof complete == 'function') fn.loadedScripts[src].push(complete);

	function runCallbacks(src,script_el){
		var cbs = fn.loadedScripts[src];
		for(var i=0,j=cbs.length;i<j;i++) cbs[i].call(script_el);
		fn.loadedScripts[src] = true;
	}
};