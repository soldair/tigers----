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
	pollInterval:0,
	soundWorks:0,
	soundEnabled:0,// user wants sounds
	sounds:[],// the soulds i should pick from
	loadedSounds:{},
	gameNumber:0,
	server:{
		url:'',
		sounds:{},
		soundserver:''
	},
	init:function(){
		if(window.tiger_config) this.server = window.tiger_config;
		if(this.server.FLIKR_KEY){
			this.key = this.server.FLIKR_KEY;
		} else {
			//this is a non comercial key owned by me [Ryan Day aka soldair] on flikr.
			//set your own in tmp/flikr_key
			this.key = "70442bef719c380723ebb906dbb70644";
		}

		var z = this;
		z.reset();
		z.loading(true);
		this.get(function(response){
			z.loading(false);

			z.photos = [];
			var queue = [];
			var game = z.gameNumber;
			var loadPhoto = function(img){
				if(img) z.photos.push(img);
				var sameGame = (game == z.gameNumber);
				if(!z.frozen && sameGame){
					var next = queue.shift();
					if(next){
						$(next.img).attr('src',next.src);
					}
				} else if(!sameGame){
					$.each(queue,function(k,v){
						v.img = null;//delete refs to these images
					});
					queue = [];
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
		z.activateSoundManager();
	},
	reset:function(){
		this.photos = [];
		this.popTime = 1000;
		this.frozen = 0;
		this.photos = [];
		this.activeTigers = 0;
		this.totalTigers = 0;
		this.slainTigers = 0;
		clearInterval(this.pollInterval);
		this.removeTigers();
		this.gameNumber++;
		$(".tiger-sounds").hide();
	},
	get:function(cb){
		this.apiPhotoSearch('tiger,cat',this.photoTypes.photos_only,cb);
	},
	tigerPoll:function(){
		var lastTiger = 0;
		var z = this;
		var tiger_count = 0;
		z.pollInterval = setInterval(function(){
			if(z.activeTigers > 10){
				clearInterval(z.pollInterval);
				z.gameOver();
				return;
			} else if(z.totalTigers == z.slainTigers && z.slainTigers > 0){
				clearInterval(z.pollInterval);
				z.victory();
				return;
			}
			if(z.photos.length && !z.frozen){
				var now = z.now();
				if(now-lastTiger > z.popTime){
					z.activeTigers++;
					if(z.totalTigers%10 == 0){
						z.popTime -=30;//FASTER!!!
					}
					lastTiger = now;
					var tiger = z.photos.shift();
					
					var position = z.randomCoordinate(tiger.width,tiger.height);
					$(tiger).css({position:'absolute',top:position.y+'px',left:position.x+'px',zIndex:5000}).appendTo("body").fadeIn('fast');
				}
			}
		},400);
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
		this.reset();
	},
	gameOver:function(){
		alert('tigers won! click to slay evil tigers.... the tigers may be disguised as ladies, house cats, or buildings');
		this.removeTigers();
		this.reset();
	},
	removeTigers:function(){
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
			var sounds = [];
			if(type && sounds){
				var z = this;
				$.each(this.server.sounds[type],function(k,name){
					var a = document.createElement('audio');
					a.src = z.server.serverURL+"/sounds/"+name;
					sounds.push(a);
				});
				this.sounds = sounds;
			}
		}
		//per domain is not exactly the best =)
		this.soundEnabled = window.localStorage.tigerSounds == 0?0:1;
	},
	playSound:function(){
		if(this.soundWorks && this.soundEnabled && this.sounds.length){
			var key = (+(Math.random()+'').substr(4,4))%(this.sounds.length-1);
			this.sounds[key].play();
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
			return types;
		}
		return false;
	},
	enableSound:function(enabled){
		if(window.localStorage){
			window.localStorage.tigerSounds = enabled?1:0;
		}
		this.soundEnabled = enabled?1:0;
	},
	activateSoundManager:function(){
		var z = this;
		if(!$(".tiger-sounds").length && z.soundWorks){
			var unmuted = $("<img>").attr('src',z.server.serverURL+"/images/speaker.jpg")
				.addClass('audio-icon')
				.addClass('mute').attr('title',"Mute tiger sounds");
			var muted = $("<img>").attr('src',z.server.serverURL+"/images/muted.jpg")
				.addClass('audio-icon')
				.addClass('unmute').attr('title',"Unmute tiger sounds");

			if(this.soundEnabled){
				$(muted).hide();
			} else {
				$(unmuted).hide();
			}

			$("<div>").css({
				zIndex:5010,
				position:'fixed',
				top:'0px',
				right:'0px',
				background:'#000',
				border:'3px solid orange',
				"border-radius":'5px',
				"-moz-border-radius":'5px',
				"-webkit-border-radius":'5px',
				"-khtml-border-radius":'5px',
				"-o-border-radius":'5px',
				padding:'5px'
			}).addClass('tiger-sounds').append(unmuted).append(muted).appendTo("body");

			$(".tiger-sounds .mute").live('click',function(){
				z.enableSound(false);
				$(".tiger-sounds .mute").hide();
				$(".tiger-sounds .unmute").show();
			});

			$(".tiger-sounds .unmute").live('click',function(){
				z.enableSound(true);
				$(".tiger-sounds .mute").show();
				$(".tiger-sounds .unmute").hide();
			});
		} else {
			$(".tiger-sounds").show();
		}
	},
	loading:function(show){
		if(!$(".tiger-loading").length){
			//get center of window
			var h = $(window).height();
			var w = $(window).width();
			var loading = $("<div>").addClass('tiger-loading').text("LOADING TIGERS!").css({
				"font-size":'30px',
				color:'#d4d4d4',
				"font-weight":'bold',
				padding:'5px',
				position:'fixed',
				zIndex:5010,
				background:'#fff',
				border:'3px solid #d4d4d4',
				"border-radius":'5px',
				"-moz-border-radius":'5px',
				"-webkit-border-radius":'5px',
				"-khtml-border-radius":'5px',
				"-o-border-radius":'5px'
			}).appendTo("body");
			var l_w = loading.width();
			var l_h = loading.height();
			loading.hide();
			loading.css({top:((h/2)-(l_h/2))+'px',left:((w/2)-(l_w/2))+'px'});
		}
		if(show) {
			$(".tiger-loading").show();
		} else {
			$(".tiger-loading").hide();
		}
	
	}
};
tigers.init();
}(window.tiger_config,window.jQuery14||window.jQuery));