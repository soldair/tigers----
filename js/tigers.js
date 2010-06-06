//http://api.flickr.com/services/rest/?method=flickr.test.echo&name=value&format=json&jsoncallback=?
/*
important flikr links

http://www.flickr.com/search/?q=tiger
http://www.flickr.com/services/apps/create/noncommercial/
http://www.flickr.com/services/api/flickr.photos.search.html
http://www.flickr.com/services/api/misc.urls.html
*/
(function(tiger_config,$){
window.tigers = {
	key:null,
	popTime:1000,//inital time between tiger loading
	frozen:0,//freeze game loop - stop tiger image download
	photos:[],//buffer of tiger photos to show
	activeTigers:0,//tigers on the screen
	totalTigers:0,// total number of tiger expected to load
	slainTigers:0,//how many tigers you have saved the world from
	soundWorks:0,
	soundEnabled:0,// user wants sounds
	sounds:[],// the soulds i should pick from
	server:{
		url:'',
		sounds:{},
		soundserver:''
	},
	init:function(){
		if(window.tiger_config) this.server = window.tiger_config;
		if(this.server.FLICKER_KEY){
			this.key = this.server.FLICKER_KEY;
		} else {
			this.key = "70442bef719c380723ebb906dbb70644";
		}

		var z = this;
		this.get(function(response){
			if(window.console && window.console.log){
				console.log(response);
			}
			
			z.photos = [];
			var queue = [];
			var loadPhoto = function(img){
				if(img) z.photos.push(img);
				if(!z.frozen){
					var next = queue.shift();
					if(next){
						$(next.img).attr('src',next.src);
					}
				}
			}
			z.totalTigers = response.photos.photo.length;
			$.each(response.photos.photo,function(k,photo){
				var img = $("<img/>").bind('load',function(){
					loadPhoto(this);
				}).css({display:'none'}).addClass('tiger')[0];
				
				queue.push({img:img,src:z.photoToURL(photo)});
				loadPhoto();
			});
		});
		
		z.tigerPoll();
		z.slayable();
		z.activateTigerSounds();
	},
	get:function(cb){
		this.apiPhotoSearch('tiger,cat',this.photoTypes.photos_only,cb);
	},
	tigerPoll:function(){
		var lastTiger = 0;
		var z = this;
		var interval;
		var tiger_count = 0;
		interval = setInterval(function(){
			if(z.activeTigers > 10){
				clearInterval(interval);
				z.gameOver();
				return;
			} else if(z.totalTigers == z.slainTigers && z.slainTigers > 0){
				clearInterval(interval);
				z.victory();
				return;
			}
			if(z.photos.length && !z.frozen){
				var now = z.now();
				if(now-lastTiger > z.popTime){
					z.activeTigers++;
					if(z.activeTigers%10 == 0){
						z.popTime -=30;//FASTER!!!
					}
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
	slayable:function(){
		var z = this;
		$(".tiger").live('click',function(){
			if(!$(this).hasClass('slain')){
				$(this).addClass('slain');
				z.playSound();
				z.activeTigers--;
				z.slainTigers++;
				$(this).fadeOut('fast',function(){
					$(this).remove();
				});
			}
		});
	},
	victory:function(){
		alert("you won! thanks for saving the world from all of those horrible tigers!");
		this.frozen = 1;
	},
	gameOver:function(){
		this.frozen = 1;
		alert('tigers won!');
		$(".tiger").die('click');
		$(".tiger").fadeOut('slow',function(){
			$(this).remove();
		});
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
		var support = this.audioSupport();
		if(support){
			this.soundWorks = 1;
			var type;
			if(support.mp3){
				type = 'mp3';
			} else if(support.ogg){
				type = 'ogg';
			} else if(support.wav){
				type = 'wav';
			}
			var sounds = this.server.sounds[type];
			if(type && sounds){
				this.sounds = sounds;
			}
		}
		//per domain is not exactly the best =)
		this.soundEnabled = window.localStorage.tigerSounds == 0?0:1;
	},
	playSound:function(){
		if(this.soundWorks && this.soundEnabled && this.sounds.length){
			var key = (+(Math.rand()+'').substr(0,4,4))%(sounds.length-1);
			var a = document.createElement('audio');
			a.attr('src','')
		}
	},
	audioSupport:function(){
		var a = document.createElement('audio');

		if(!!a.canPlayType){
			var types = {};
			types.mp3 = !!(a.canPlayType('audio/mpeg;').replace(/no/, ''));
			types.ogg = !!(a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
			types.wav = !!(a.canPlayType('audio/wav; codecs="1"').replace(/no/, ''));
			types.aac = !!(a.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''));
		}
		return false;
	},
	enableSound:function(enable){
		if(window.localStorage){
			window.localStorage.tigerSounds = enabled?1:0;
		}
	}
};
tigers.init();
}(window.tiger_config,window.jQuery14||window.jQuery));