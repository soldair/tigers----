//http://api.flickr.com/services/rest/?method=flickr.test.echo&name=value&format=json&jsoncallback=?
/*
important flikcr links

http://www.flickr.com/search/?q=tiger
http://www.flickr.com/services/apps/create/noncommercial/
http://www.flickr.com/services/api/flickr.photos.search.html
http://www.flickr.com/services/api/misc.urls.html
*/

var tigers = {
	key:null,
	popTime:1000,
	photos:[],
	activeTigers:0,
	soundWorks:0,
	soundEnabled:1,
	frozen:0,
	init:function(){
		if(window.FLICKER_KEY){
			this.key = window.FLICKER_KEY;
		} else {
			this.key = "70442bef719c380723ebb906dbb70644";
		}
		
		var z = this;
		this.get(function(response){
			if(window.console && window.console.log){
				console.log(response);
			}
			
			z.photos = [];
			$.each(response.photos.photo,function(k,photo){
				$("<img/>").bind('load',function(){
					z.photos.push(this);
				}).attr('src',z.photoToURL(photo)).css({display:'none'}).addClass('tiger');
			});
		});
		
		z.tigerPoll();
	},
	get:function(cb){
		this.apiPhotoSearch('tiger,cat',this.photoTypes.photos_only,cb);
	},
	tigerPoll:function(){
		var lastTiger = 0;
		var z = this;
		var interval;
		interval = setInterval(function(){
			if(z.photos.length && !z.frozen){
				var now = z.now();
				if(now-lastTiger > z.popTime){
					lastTiger = now;
					var tiger = z.photos.shift();

					var position = z.randomCoordinate(tiger.width,tiger.height);
					$(tiger).css({position:'absolute',top:position.y+'px',left:position.x+'px'}).appendTo("body").fadeIn('fast');
				}
			}
		},500);
	},
	randomCoordinate:function(pad_x,pad_y){
		var rand = (+(Math.random()+"").substr(4));
		var ret = {};
		ret.x = (rand%($(window).width()-pad_x))+$(window).scrollLeft();
		ret.y = (rand%($(window).height()-pad_y))+$(window).scrollTop();
		
		return ret;
	},
	tigerSlayable:function(){
	
	},
	now:function(){
		return (new Date().getTime());
	},
	apiPhotoSearch:function(tags,type,cb){
		if(tags.join) tags.join(',');
		this.apiCall('flickr.photos.search',{tags:tags,tag_mode:'all',content_type:type},cb);
	},
	photoTypes:{
		photos_only:1,
		screenshots_only:2,
		other:3,
		photos_and_screenshots:4,
		screenshots_and_other:5,
		photos_and_other:6,
		all:7
	},
	apiCall:function(method,params,cb){
		params = $.extend(params,{api_key:this.key,method:method});
		$.getJSON("http://api.flickr.com/services/rest/?format=json&jsoncallback=?",params,cb);
	},
	photoToURL:function(photo){
		return "http://farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+".jpg";
	},
	activateTigerSounds:function(){
		if(sounds.length){

			
		}
	},
	sounds:[],
	playSound:function(){
		if(this.soundWorks && this.soundEnabled && this.sounds.length){
			var key = (+(Math.rand()+'').substr(0,4,4))%(sounds.length-1);
		}
	}
}

$(function(){
	tigers.init();
});