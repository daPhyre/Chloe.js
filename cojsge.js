/**
 * Canvas Open JavaScript Game Engine
 * @author daPhyre
 * @since 0.1, Tu/12/Jul/11
 * @version 1.0, Su/01/Dec/13
 */
'use strict';
Math.DEG=Math.PI/180;
Array.prototype.insert=function(i,element){this.splice(i,0,element);}
Array.prototype.remove=function(i){return this.splice(i,1)[0];}
Array.prototype.removeAll=function(){this.length=0;}

var _cjsg={
	buffer:null,
	view:null,
	fullMode:0,
	viewScale:1,
	offsetTop:0,
	offsetLeft:0,
	isFullscreen:false,
	screenDebug:false,
	currentScene:0,
	scenes:[],
	runnable:[]
};

//	Canvas.js
function Canvas(canvasWidth,canvasHeight,canvasId,fullMode,autoFull,autoFullOnMobile){
	var _self=this;
	var _bgcolor='#ccc',_bgimg=null,_bgfixed=false;
	var _async=false,_interval=1000/60;
	var _lastUpdate=0,_deltaTime=0,_acumDt=0;
	var _ctx=null,_g2=null,_imageSmoothingEnabled=true;
	_cjsg.fullMode=fullMode;
	if(autoFull==null)autoFull=true;
	if(autoFullOnMobile==null)autoFullOnMobile=true;
	
	this.view=null;
	this.onReady=function(){};
	window.addEventListener('DOMContentLoaded',preload,false);
	window.addEventListener('load',init,false);
	window.addEventListener('resize',resize,false);

	function preload(){
		if(canvasId==null)canvasId='canvas';
		if(canvasWidth==null)canvasWidth=600;
		if(canvasHeight==null)canvasHeight=400;
		_cjsg.buffer=document.getElementById(canvasId);
		if(_cjsg.buffer==null){
			_cjsg.buffer=document.createElement('canvas');
			document.body.appendChild(_cjsg.buffer);
		}
		else if(_cjsg.buffer.nodeName.toLowerCase()!='canvas'){
			var container=_cjsg.buffer;
			_cjsg.buffer=document.createElement('canvas');
			container.appendChild(_cjsg.buffer);
		}
		_cjsg.buffer.width=canvasWidth;
		_cjsg.buffer.height=canvasHeight;
		_cjsg.buffer.style.cursor='url(\'cursor.png\') 8 8, crosshair';
	}
	
	function init(){
		_self.view=document.createElement('canvas');
		_self.view.width=canvasWidth;
		_self.view.height=canvasHeight;
		_ctx=_self.view.getContext('2d');
		_g2=_cjsg.buffer.getContext('2d');
		_cjsg.view=_self.view;
		World.setSize(canvasWidth,canvasHeight);
		_self.onReady();
		resize()
		run();
	}

	this.setBackground=function(color,image,fixed){
		if(color!=null){
			_bgcolor=color;
			_bgimg=image;
			_bgfixed=(fixed==null)?false:fixed;
		}
		else if(window.console)console.error('Data missing in Canvas.setBackground(color[,image,fixed])');
	}
	
	this.getAsync=function(){
		return _async;
	}
	
	this.setAsync=function(a){
		_async=a;
	}
	
	this.toggleAsync=function(){
		_async=!_async;
	}
	
	this.getFullscreen=function(){
		return _cjsg.isFullscreen;
	}
	
	this.setFullscreen=function(f){
		_cjsg.isFullscreen=f;
	}
	
	this.toggleFullscreen=function(){
		_cjsg.isFullscreen=!_cjsg.isFullscreen;
	}
	
	this.getInterval=function(){
		if(_async)return 1000/_interval;
		else return _deltaTime;
	}
	
	this.setInterval=function(fps){
		_interval=1000/fps;
		_async=true;
	}
	
	this.getScreenDebug=function(){
		return _cjsg.screenDebug;
	}
	
	this.setScreenDebug=function(d){
		_cjsg.screenDebug=d;
	}
	
	this.toggleScreenDebug=function(){
		_cjsg.screenDebug=!_cjsg.screenDebug;
	}
	
	this.getScreenshot=function(){
		window.open(_self.view.toDataURL());
	}
	
	this.loadScene=function(scene){
		_cjsg.currentScene=scene.id;
		_cjsg.scenes[_cjsg.currentScene].load();
	}
	
	this.__defineGetter__("imageSmoothingEnabled", function(){
        return _imageSmoothingEnabled;
    });
   
    this.__defineSetter__("imageSmoothingEnabled", function(b){
        _g2.webkitImageSmoothingEnabled=b;
		_g2.mozImageSmoothingEnabled=b;
		_g2.imageSmoothingEnabled=b;
		_imageSmoothingEnabled=b;
    });

	function run(){
		//setTimeout(run,1000/_interval);
		requestAnimFrame(run);
		
		var now=Date.now();
		_deltaTime=(now-_lastUpdate)/1000;
		if(_deltaTime>1)_deltaTime=0;
		_lastUpdate=now;
		
		if(_async){
            _acumDt+=_deltaTime;
			var inter=_interval/1000,
                lp=Input.lastPress,
				lr=Input.lastRelease,
				mm=Input.mouse.move;
			while(_acumDt>inter){
				if(_cjsg.scenes.length){
					_cjsg.scenes[_cjsg.currentScene].act(inter);
				}
				for(var i=0,l=_cjsg.runnable.length;i<l;i++){
					_cjsg.runnable[i].update(inter);
				}
				//if(_acumDt>1000)_acumDt=0
				_acumDt-=inter;
				if(_cjsg.screenDebug)debug.aframes++;
				Input.lastPress=null;
				Input.lastRelease=null;
				Input.mouse.move=false;
			}
			Input.lastPress=lp;
			Input.lastRelease=lr;
			Input.mouse.move=mm;
		}
		else{
			if(_cjsg.scenes.length){
				_cjsg.scenes[_cjsg.currentScene].act(_deltaTime);
			}
			for(var i=0,l=_cjsg.runnable.length;i<l;i++)
				_cjsg.runnable[i].update(_deltaTime);
		}
		Toast.update(_deltaTime);
		if(_cjsg.screenDebug){
			debug.frames++;
			debug.act(_deltaTime);
		}
		
		repaint();
		
		Input.lastPress=null;
		Input.lastRelease=null;
		Input.mouse.move=false;
	}

	function resize(){
		if(autoFull||autoFullOnMobile){
			if(autoFullOnMobile&&(canvasWidth>window.innerWidth||canvasHeight>window.innerHeight))
				_cjsg.isFullscreen=true;
			else if(autoFull&&screen.width-window.innerWidth<2&&screen.height-window.innerHeight<2){
				_cjsg.isFullscreen=true;
			}
			else
				_cjsg.isFullscreen=false;
		}
		if(_cjsg.isFullscreen){
			_cjsg.buffer.width=window.innerWidth;
			_cjsg.buffer.height=window.innerHeight;
			_cjsg.buffer.style.top='0';
			_cjsg.buffer.style.left='0';
			_cjsg.buffer.style.position='fixed';
			if(fullMode>2){
				if(fullMode%2==0){
					if(fullMode!=4||window.innerWidth<window.innerHeight)
						_self.view.height=~~(canvasWidth*window.innerHeight/window.innerWidth);
					else
						_self.view.height=canvasHeight;
				}
				else{
					if(fullMode!=3||window.innerHeight<window.innerWidth)
						_self.view.width=~~(canvasHeight*window.innerWidth/window.innerHeight);
					else
						_self.view.width=canvasWidth;
				}
				console.log(_self.view.width,_self.view.height);
			}
			var w=window.innerWidth/_self.view.width;
			var h=window.innerHeight/_self.view.height;
			_cjsg.viewScale=(fullMode==1)?Math.max(h,w):Math.min(h,w);
			_cjsg.offsetLeft=~~((window.innerWidth-_self.view.width*_cjsg.viewScale)/2);
			_cjsg.offsetTop=~~((window.innerHeight-_self.view.height*_cjsg.viewScale)/2);
			document.getElementsByTagName('body')[0].style.overflow='hidden';
		}
		else{
			_cjsg.viewScale=1;
			_cjsg.offsetLeft=0;
			_cjsg.offsetTop=0;
			_cjsg.buffer.height=canvasHeight;
			_cjsg.buffer.width=canvasWidth;
			_cjsg.buffer.style.position='';
			document.getElementsByTagName('body')[0].style.overflow='';
		}
	}

	function repaint(){
		_g2.fillStyle=_bgcolor;
		_g2.fillRect(0,0,_cjsg.buffer.width,_cjsg.buffer.height);
		if(_bgimg!=null){
			if(_bgfixed)Util.fillTile(_ctx,_bgimg);
			else Util.fillTile(_ctx,_bgimg,-World.cam.x,-World.cam.y);
		}
		else{
			_ctx.fillStyle=_bgcolor;
			_ctx.fillRect(0,0,_self.view.width,_self.view.height);
			_ctx.fillStyle='#000';
		}
		if(_cjsg.scenes.length){
			_cjsg.scenes[_cjsg.currentScene].paint(_ctx);
		}
		else{
			_ctx.fillText('It\'s Working!',20,30);
			_ctx.fillText('COJSGE 1.0',20,50);
		}
		Toast.paint(_ctx);
		if(_cjsg.screenDebug){
			debug.paint(_ctx);
		}
		if(fullMode==2){
			_g2.drawImage(_self.view,0,0,_cjsg.buffer.width,_cjsg.buffer.height);
		}
		else{
			_g2.drawImage(_self.view,_cjsg.offsetLeft,_cjsg.offsetTop,_self.view.width*_cjsg.viewScale,_self.view.height*_cjsg.viewScale);
		}
	}
	
	var debug=new function(){
		this.frames=0;
		this.aframes=0;
		var _FPS=0;
		var _AFPS=0;
		var _AFT='';
		var _secs=0;
		
		if(window.requestAnimationFrame)
			_AFT='dft';
		else if(window.webkitRequestAnimationFrame)
			_AFT='wkt';
		else if(window.mozRequestAnimationFrame)
			_AFT='moz';
		else
			_AFT='non';
		
		this.act=function(dt){
			_secs+=dt;
			if(_secs>1){
				_FPS=this.frames;
				_AFPS=this.aframes;
				this.frames=0;
				this.aframes=0;
				_secs-=1;
			}
		}
		
		this.paint=function(ctx){
			ctx.font='10px sans-serif';
			ctx.textAlign='center';
			ctx.fillStyle='#fff';
			ctx.fillText('FPS: '+_FPS,_self.view.width/2,10);
			ctx.fillText('AFPS: '+_AFPS,_self.view.width/2,20);
			ctx.fillText('AFT: '+_AFT,_self.view.width/2,30);
			ctx.textAlign='left';
		}
	}
	
	var requestAnimFrame=(function(){
		return window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			function(callback){window.setTimeout(callback,17);};
	})();
}
//	Animation.js
function Animation(fps,img,frameWidth,frameHeight){
	this.images=[];
	this.currentFrame=0;
	var _frameTime=20;
	var _frameWidth=0;
	var _frameHeight=0;
	var _loops=0;
	var _mode=0;
	var _acum=0;
	var _playing=false;
	var _isStrip=false;
	_cjsg.runnable.push(this);

	this.Animation=function(fps,img,frameWidth,frameHeight){
		_frameTime=(fps==null)?20:1000/fps;
		if(frameWidth!=null){
			_isStrip=true;
			this.images.length=0;
			this.images.push(img);
			_frameWidth=frameWidth;
			_frameHeight=frameHeight;
			return true;
		}
		else{
			if(window.console)console.error('Data missing in Animation(framesPerSecond,image,frameWidth[,frameHeight])');
			return false;
		}
	}
	this.Animation(fps,img,frameWidth,frameHeight);

	this.addFrame=function(img){
		if(img!=null){
			_isStrip=false;
			this.images.push(img);
		}
		else if(window.console)console.error('Data missing in Animation.addFrame(image)');
	}

	this.draw=function(ctx,x,y,row){
		if(y!=null){
			ctx.strokeStyle='#0f0';
			if(_isStrip){
				var tImg=this.images[0];
				if(isNaN(row)){
					ctx.drawImage(tImg,_frameWidth*this.currentFrame,0,_frameWidth,tImg.height,x,y,_frameWidth,tImg.height);
					if(_cjsg.screenDebug)
						ctx.strokeRect(x,y,_frameWidth,tImg.height);
				}
				else{
					ctx.drawImage(tImg,_frameWidth*this.currentFrame,_frameHeight*row,_frameWidth,_frameHeight,x,y,_frameWidth,_frameHeight);
					if(_cjsg.screenDebug)
						ctx.strokeRect(x,y,_frameWidth,_frameHeight);
				}
			}
			else{
				ctx.drawImage(this.images[this.currentFrame],x,y);
				if(_cjsg.screenDebug)
					ctx.strokeRect(x,y,this.images[this.currentFrame].width,this.images[this.currentFrame].height);
			}
		}
		else if(window.console)console.error('Data missing in Animation.draw(ctx,x,y[,row])');
	}

	this.drawSprite=function(ctx,spr,ox,oy,row){
		if(spr!=null){
			if(_isStrip){
				ox=(isNaN(ox))?0:ox;
				oy=(isNaN(oy))?0:oy;
				var h=(spr.hflip)?-1:1;
				var v=(spr.vflip)?-1:1;
				var tImg=this.images[0];
				ctx.save();
				ctx.translate(spr.x+ox-World.cam.x,spr.y+oy-World.cam.y);
				ctx.rotate(spr.rotation*Math.DEG);
				ctx.scale(spr.scale*h,spr.scale*v);
				if(isNaN(row)){
					ctx.drawImage(tImg,_frameWidth*this.currentFrame,0,_frameWidth,tImg.height,_frameWidth*-0.5,tImg.height*-0.5,_frameWidth,tImg.height);
				}
				else{
					ctx.drawImage(tImg,_frameWidth*this.currentFrame,_frameHeight*row,_frameWidth,_frameHeight,_frameWidth*-0.5,_frameHeight*-0.5,_frameWidth,_frameHeight);
				}
				ctx.restore();
				if(_cjsg.screenDebug)
					spr.drawSprite(ctx);
			}
			else{
				spr.drawSprite(ctx,this.images[this.currentFrame],ox,oy);
			}
		}
		else if(window.console)console.error('Data missing in Animation.drawSprite(ctx,spr[,offsetX,offsetY,row])');
	}

	this.getTotalFrames=function(){
		if(_isStrip){
			return Math.round(this.images[0].width/_frameWidth);
		}
		else
			return this.images.length;
	}
	
	this.gotoFrame=function(frame){
		if(!isNaN(frame)){
			if(frame<0)
				frame=0;
			else if(frame>this.getTotalFrames()-1)
				frame=this.getTotalFrames()-1;
			this.currentFrame=frame;
			_acum=0;
		}
		else if(window.console)console.error('Data missing in Animation.gotoFrame(frame)');
	}
	
	this.isPlaying=function(){
		return _playing;
	}

	this.nextFrame=function(){
		this.currentFrame++;
		if(this.currentFrame>this.getTotalFrames()-1)
			this.currentFrame=0;
		_acum=0;
		return this.currentFrame;
	}

	this.prevFrame=function(){
		this.currentFrame--;
		if(this.currentFrame<0)
			this.currentFrame=this.getTotalFrames()-1;
		_acum=0;
		return this.currentFrame;
	}
	
	this.pause=function(){
		_playing=false;
	}
	
	this.play=function(loops,mode){
		if(!isNaN(mode))
			_mode=mode;
		if(!isNaN(loops)){
			_loops=loops;
			if(loops!=0){
				_acum=0;
				this.currentFrame=(_mode%2==1)?this.getTotalFrames()-1:0;
			}
		}
		_playing=true;
	}
	
	this.setFPS=function(fps){
		if(fps!=null)
			_frameTime=1000/fps;
		else if(window.console)console.error('Data missing in Animation.setFPS(framesPerSecond)');
	}
	
	this.update=function(dt){
		dt=(dt==null)?1:dt;
		if(_playing){
			if(_mode%2==1)_acum-=dt;
			else _acum+=dt;
			if(_acum>_frameTime/1000){
				this.currentFrame++;
				if(this.currentFrame>this.getTotalFrames()-1){
					if(_mode==2){
						this.currentFrame--;
						_mode=3;
					}
					else if(_loops!=0){
						_loops--;
						if(_loops==0){
							this.currentFrame--;
							_playing=false;
						}
						else
							this.currentFrame=0;
					}
					else
						this.currentFrame=0;
				}
				_acum-=_frameTime/1000;
			}
			else if(_acum<0){
				this.currentFrame--;
				if(this.currentFrame<0){
					if(_mode==3){
						this.currentFrame++;
						_mode=2;
						if(_loops!=0){
							_loops--;
							if(_loops==0)
								_playing=false;
						}
					}
					else if(_loops!=0){
						_loops--;
						if(_loops==0){
							this.currentFrame++;
							_playing=false;
						}
						else
							this.currentFrame=this.getTotalFrames()-1;
					}
					else
						this.currentFrame=this.getTotalFrames()-1;
				}
				_acum+=_frameTime/1000;
			}
		}
	}
}
//	Button.js
function Button(x,y,width,height){
	this.x=(isNaN(x))?0:x;
	this.y=(isNaN(y))?0:y;
	this.width=(isNaN(width))?0:width;
	this.height=(isNaN(height))?this.width:height;
}

Button.prototype={
	up:function(){
		return(
			this.x>=Input.mouse.x&&this.x+this.width<=Input.mouse.x&&
			this.y>=Input.mouse.y&&this.y+this.height<=Input.mouse.y
		);
	},
	over:function(){
		return(
			this.x<Input.mouse.x&&this.x+this.width>Input.mouse.x&&
			this.y<Input.mouse.y&&this.y+this.height>Input.mouse.y
		);
	},
	down:function(){
		return(
			Input.pressing[1]&&
			this.x<Input.mouse.x&&this.x+this.width>Input.mouse.x&&
			this.y<Input.mouse.y&&this.y+this.height>Input.mouse.y
		);
	},
	hit:function(){
		return(
			Input.lastRelease==1&&
			this.x<Input.mouse.ox&&this.x+this.width>Input.mouse.ox&&
			this.y<Input.mouse.oy&&this.y+this.height>Input.mouse.oy&&
			this.x<Input.mouse.x&&this.x+this.width>Input.mouse.x&&
			this.y<Input.mouse.y&&this.y+this.height>Input.mouse.y
		);
	},
	touch:function(){
		for(var i=0,l=Input.touches.length;i<l;i++){
			if(this.x<Input.touches[i].x&&this.x+this.width>Input.touches[i].x&&
				this.y<Input.touches[i].y&&this.y+this.height>Input.touches[i].y)
				return true;
		}
		return false;
	},
	tap:function(){
		if(Input.lastPress==1){
			for(var i=0,l=Input.touches.length;i<l;i++){
				if(this.x<Input.touches[i].x&&this.x+this.width>Input.touches[i].x&&
					this.y<Input.touches[i].y&&this.y+this.height>Input.touches[i].y)
					return true;
			}
		}
		return false;
	},
	draw:function(ctx,img,ox,oy){
		if(ctx!=null){
			if(img!=null){
				ox=(isNaN(ox))?0:ox;
				oy=(isNaN(oy))?0:oy;
				ctx.drawImage(img,this.x+World.cam.x+ox,this.y+World.cam.y+oy);
			}
			if(_cjsg.screenDebug||img==null||img.naturalWidth===0){
				if(this.over()){
					if(Input.pressing[1])
						ctx.strokeStyle='#fff';
					else
						ctx.strokeStyle='#0ff';
				}
				else
					ctx.strokeStyle='#00f';
				ctx.strokeRect(this.x+World.cam.x,this.y+World.cam.y,this.width,this.height);
			}
		}
		else if(window.console)console.error('Data missing in Button.draw(ctx[,img,offsetX,offsetY])');
	}
}
//	Camera.js
function Camera(keepInWorld){
	this.keepInWorld=(keepInWorld==null)?true:keepInWorld;
}

Camera.prototype={
	x:0,
	y:0,
	focus:function(spr,slide,ox,oy){
		if(spr!=null){
			slide=(isNaN(slide))?0:slide;
			ox=(isNaN(ox))?0:ox;
			oy=(isNaN(oy))?ox:oy;
			var cx=~~(spr.x-_cjsg.view.width/2);
			var cy=~~(spr.y-_cjsg.view.height/2);
			if(World.width<_cjsg.view.width||World.width-ox*2<_cjsg.view.width){
				this.x=World.width/2-_cjsg.view.width/2;
			}
			else{
				if(slide&&Math.abs(cx-this.x)>slide){
					if(cx>this.x)
						this.x+=slide;
					else
						this.x-=slide;
				}
				else
					this.x=cx;
				if(this.keepInWorld&&!World.loopX){
					if(this.x<ox)
						this.x=ox;
					else if(this.x>World.width-_cjsg.view.width-ox)
						this.x=World.width-_cjsg.view.width-ox;
				}
			}
			if(World.height<_cjsg.view.height||World.height-oy*2<_cjsg.view.height){
				this.y=World.height/2-_cjsg.view.height/2;
			}
			else{
				if(slide&&Math.abs(cy-this.y)>slide){
					if(cy>this.y)
						this.y+=slide;
					else
						this.y-=slide;
				}
				else
					this.y=cy;
				if(this.keepInWorld&&!World.loopY){
					if(this.y<oy)
						this.y=oy;
					else if(this.y>World.height-_cjsg.view.height-oy)
						this.y=World.height-_cjsg.view.height-oy;
				}
			}
		}
		else if(window.console)console.error('Data missing in Camera.focus(spr[,slide,offsetX,offsetY])');
	}
}
//	Particle.js
function Particle(x,y,diameter,life,speed,angle,colorStart,colorEnd){
	this.x=0;
	this.y=0;
	this.ox=0;
	this.oy=0;
	this.diameter=0;
	this.life=0;
	this.olife=0;
	this.speed=0;
	this.angle=0;
	this.rotation=0;
	this.color='#000';
	this.colorList=[];
	this.Particle(x,y,diameter,life,speed,angle,colorStart,colorEnd);
}

Particle.prototype={
	Particle:function(x,y,diameter,life,speed,angle,colorStart,colorEnd){
		if(colorStart!=null){
			this.x=x;
			this.y=y;
			this.ox=x;
			this.oy=y;
			this.diameter=diameter+1;
			this.life=life;
			this.olife=life;
			this.speed=speed;
			this.angle=angle;
			this.rotation=angle;
			this.color=colorStart;
			
			if(colorEnd!=null){
				var cStart=this._hex2rgb(colorStart);
				var cEnd=this._hex2rgb(colorEnd);
				var red=~~((cStart[0]-cEnd[0])/(life*1000+1));
				var green=~~((cStart[1]-cEnd[1])/(life*1000+1));
				var blue=~~((cStart[2]-cEnd[2])/(life*1000+1));
				for (var i=0;i<life*1000;i++)
					this.colorList.push('rgb('+(cStart[0]-(i*red))+','+(cStart[1]-(i*green))+','+(cStart[2]-(i*blue))+')');
			}
			return true;
		}
		else{
			if(window.console)console.error('Data missing in Particle(x,y,diameter,life,speed,angle,colorStart[,colorEnd])');
			return false;
		}
	},
	/*_rgb2hex:function(r,g,b){return '#'+this._clr2hex(r)+this._clr2hex(g)+this._clr2hex(b);},
	_clr2hex:function(n){
		n=parseInt(n,10);
		if(isNaN(n)) return '00';
		n=Math.max(0,Math.min(n,255));
		return '0123456789ABCDEF'.charAt((n-n%16)/16)+'0123456789ABCDEF'.charAt(n%16);
	},*/
	_hex2rgb:function(h){
		if(h.charAt(0)=='#'){
			var c=[];
			h=h.substring(1,7);
			if(h.length==3){
				c[0]=parseInt(h.charAt(0),16)*17;
				c[1]=parseInt(h.charAt(1),16)*17;
				c[2]=parseInt(h.charAt(2),16)*17;
			}
			else{
				c[0]=parseInt(h.substr(0,2),16);
				c[1]=parseInt(h.substr(2,2),16);
				c[2]=parseInt(h.substr(4,2),16);
			}
			return c;
		}
		else if(window.console)console.log('Error: Color is not hexadecimal');
		return [0,0,0];
	}
}
//	ParticleSystem.js
function ParticleSystem(){
	this.gravity=0;
	this.wind=0;
	this.moveOrigin=false;
	_cjsg.runnable.push(this);
}
ParticleSystem.prototype=[];

ParticleSystem.prototype.addParticle=function(p_x,y,diameter,life,speed,angle,colorStart,colorEnd){
	if(typeof p_x == 'object')
		this.push(p_x);
	else
		this.push(new Particle(p_x,y,diameter,life,speed,angle,colorStart,colorEnd));
}

ParticleSystem.prototype.drawParticles=function(ctx,alpha,img){
	if(img!=null){
		for(var i=0,l=this.length;i<l;++i){
			ctx.save();
			if(alpha)ctx.globalAlpha=this[i].life/this[i].olife;
			ctx.translate(this[i].x-World.cam.x,this[i].y-World.cam.y);
			ctx.rotate(this[i].rotation*Math.DEG);
			ctx.drawImage(img,img.width*-0.5,img.height*-0.5);
			ctx.restore();
		}
	}
	else if(ctx!=null){
		for(var i=0,l=this.length;i<l;++i){
			ctx.fillStyle=this[i].color;
			ctx.save();
			if(alpha)ctx.globalAlpha=this[i].life/this[i].olife;
			ctx.beginPath();
			ctx.arc(this[i].x-World.cam.x,this[i].y-World.cam.y,this[i].diameter/2,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}
	}
	else if(window.console)console.error('Data missing in ParticleSystem.drawParticles(ctx[,img,alpha])');
}

ParticleSystem.prototype.drawParticlesO=function(ctx,alpha){
	if(ctx!=null){
		for(var i=0,l=this.length;i<l;++i){
			ctx.strokeStyle=this[i].color;
			ctx.fillStyle=this[i].color;
			ctx.save();
			if(alpha)ctx.globalAlpha=this[i].life/this[i].olife;
			ctx.beginPath();
			ctx.moveTo(this[i].ox,this[i].oy);
			ctx.lineTo(this[i].x,this[i].y);
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(this[i].x-World.cam.x,this[i].y-World.cam.y,this[i].diameter/2,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}
	}
	else if(window.console)console.error('Data missing in ParticleSystem.drawParticles0(ctx[,alpha])');
}

ParticleSystem.prototype.update=function(dt){
	dt=(dt==null)?1:dt;
	for(var i=0,l=this.length;i<l;++i){
		this[i].life-=dt;
		if(this[i].life>0){
			if(this.moveOrigin){
				this[i].ox=this[i].x;
				this[i].oy=this[i].y;
			}
			this[i].x+=(this[i].speed*(Math.cos(this[i].angle*Math.DEG))+this.wind*(this[i].olife-this[i].life))*dt;
			this[i].y+=(this[i].speed*(Math.sin(this[i].angle*Math.DEG))+this.gravity*(this[i].olife-this[i].life))*dt;
			if(this[i].colorList.length>0)
				this[i].color=this[i].colorList.shift();
		}
		else{
			this.remove(i--);
			l--;
		}
	}
}
//  Scene.js
function Scene(){
	this.id=_cjsg.scenes.length;
	_cjsg.scenes.push(this);
}
Scene.prototype={
	load:function(){},
	act:function(dt){},
	paint:function(ctx){ctx.fillText('Scene '+this.id,20,30);}
}
//	Sprite.js
function Sprite(x,y,width,height,type){
	this.ox=(isNaN(x))?0:x;
	this.oy=(isNaN(y))?0:y;
	this.ohealth=1;
	this.width=(isNaN(width))?0:width;
	this.height=(isNaN(height))?this.width:height;
	this.type=(isNaN(type))?0:type;

	this.x=0;
	this.y=0;
	this.vx=0;
	this.vy=0;
	this.health=0;
	this.rotation=0;
	this.scale=1;
	this.vflip=false;
	this.hflip=false;
	this.mapOffset=0;
	
	this.reset();
}

Sprite.prototype={
	get left(){
		return this.x-this.getWidth()/2;
	},
	set left(n){
		this.x=n+this.getWidth()/2;
	},
	get right(){
		return this.x+this.getWidth()/2;
	},
	set right(n){
		this.x=n-this.getWidth()/2;
	},
	get top(){
		return this.y-this.getHeight()/2;
	},
	set top(n){
		this.y=n+this.getHeight()/2;
	},
	get bottom(){
		return this.y+this.getHeight()/2;
	},
	set bottom(n){
		this.y=n-this.getHeight()/2;
	},
	setOrigin:function(x,y){
		if(y!=null){
			this.ox=x;
			this.oy=y;
		}
		else if(window.console)console.error('Data missing in Sprite.setOrigin(x,y)');
	},
	setHealth:function(health){
		if(health!=null){
			this.ohealth=health;
			this.health=health;
		}
		else if(window.console)console.error('Data missing in Sprite.setHealth(health)');
	},
	setPosition:function(x,y){
		if(y!=null){
			this.x=x;
			this.y=y;
		}
		else if(window.console)console.error('Data missing in Sprite.setPosition(x,y)');
	},
	resetPosition:function(){
		this.x=this.ox;
		this.y=this.oy;
	},
	reset:function(){
		this.x=this.ox;
		this.y=this.oy;
		this.health=this.ohealth;
		this.vx=0;
		this.vy=0;
		this.rotation=0;
		this.scale=1;
	},
	move:function(m){
		m=(m==null)?1:m;
		this.x+=this.vx*m;
		this.y+=this.vy*m;
	},
	setDirection:function(angle,speed){
		if(speed!=null){
			this.vx=speed*Math.cos(angle*Math.DEG);
			this.vy=speed*Math.sin(angle*Math.DEG);
		}
		else if(window.console)console.error('Data missing in Sprite.setDirection(angle,speed)');
	},
	getAngle:function(spr){
		var angle=0;
		if(spr!=null)
			angle=(Math.atan2(this.y-spr.y,this.x-spr.x))/Math.DEG+90;
		else
			angle=(Math.atan2(this.vy,this.vx))/Math.DEG;
		if(angle>360)angle-=360;
		if(angle<0)angle+=360;
		return angle;
	},
	getSpeed:function(){
		return this.vx/Math.cos(Math.DEG*this.getAngle());
	},
	getWidth:function(){
		return this.width*this.scale;
	},
	getHeight:function(){
		return this.height*this.scale;
	},
	getDiameter:function(inner){
		if (inner!=null&&inner)
			return Math.min(this.width,this.height)*this.scale;
		else
			return Math.max(this.width,this.height)*this.scale;
	},
	distance:function(spr,inner){
		if(spr!=null){
			var dx=this.x-spr.x;
			var dy=this.y-spr.y;
			return (Math.sqrt(dx*dx+dy*dy)-(this.getDiameter(inner)/2+spr.getDiameter(inner)/2));
		}
		else if(window.console)console.error('Data missing in Sprite.distance(spr[,inner])');
		return false;
	},
	contains:function(rect_x,y,width,height){
		if(rect_x!=null){
			var x=rect_x;
			if(typeof rect_x == 'object'){
				x=rect_x.x||0;
				y=rect_x.y||0;
				width=rect_x.width||0;
				height=rect_x.height||0;
			}
			else if(y!=null){
				width=width||0;
				height=height||0;
			}
			else{
				if(window.console)console.error('Data missing in Sprite.contains(x,y[,width,height])');
				return false;
			}
			return(this.left<x+width&&
				this.right>x+width&&
				this.top<y+height&&
				this.bottom>y+height);
		}
		else if(window.console)console.error('Data missing in Sprite.contains(rect)');
		return false;
	},
	intersects:function(rect_x,y,width,height){
		if(rect_x!=null){
			var x=rect_x;
			if(typeof rect_x == 'object'){
				x=rect_x.x||0;
				y=rect_x.y||0;
				width=rect_x.width||0;
				height=rect_x.height||0;
			}
			else if(height==null){
				if(window.console)console.error('Data missing in Sprite.intersects(x,y,width,height)');
				return false;
			}
			return(this.left<x+width&&
				this.right>x&&
				this.top<y+height&&
				this.bottom>y);
		}
		else if(window.console)console.error('Data missing in Sprite.intersects(rect)');
		return false;
	},
	collisionCircle:function(spr,inner){
		if(spr!=null)
			return this.distance(spr,inner)<0;
		else if(window.console)console.error('Data missing in Sprite.collisionCircle(spr[,inner])');
		return false;
	},
	collisionPoint:function(x,y){
		if(y!=null){
			return this.contains(x,y);
		}
		else if(window.console)console.error('Data missing in Sprite.collisionPoint(x,y)');
		return false;
	},
	collisionBox:function(spr,hx,hy){
		if(spr!=null){
			if(hy!=null)
				return spr.contains(this.x+hx,this.y+hy);
			else
				return this.intersects(spr.left,spr.top,spr.getWidth(),spr.getHeight());
		}
		else if(window.console)console.error('Data missing in Sprite.collisionBox(spr[,hotspotX,hotspotY])');
		return false;
	},
	collisionMap:function(type,hx,hy,exception){
		if(!isNaN(hx)){hx+=this.x;}
		if(!isNaN(hy)){hy+=this.y;}
		for(var i=1,l=World.map.length;i<l;i++){
			var spr=World.map[i];
			if( ((type!=null)?type==spr.type:true)&&
				((exception!=null)?exception!=i:true)&&
				(hx||this.left)<spr.right&&
				(hx||this.right)>spr.left&&
				(hy||this.top)<spr.bottom&&
				(hy||this.bottom)>spr.top){
					return i;
			}
		}
		return 0;
	},
	collisionMapClosest:function(type,hx,hy){
		var collision=0;
		var closest=this.getDiameter()/2;
		if(!isNaN(hx)){hx+=this.x;}
		if(!isNaN(hy)){hy+=this.y;}
		for(var i=1,l=World.map.length;i<l;i++){
			var spr=World.map[i];
			if( ((type!=null)?type==spr.type:true)&&
				(hx||this.left)<spr.right&&
				(hx||this.right)>spr.left&&
				(hy||this.top)<spr.bottom&&
				(hy||this.bottom)>spr.top){
			var d=this.distance(World.map[i]);
				if(d<closest){
					collision=i;
					closest=d;
				}
			}
		}
		return collision;
	},
	collisionMapFunction:function(f){
		if(typeof(f)=='function'){
			for(var i=1,l=World.map.length;i<l;i++){
				var spr=World.map[i];
				if(	this.left<spr.right&&
					this.right>spr.left&&
					this.top<spr.bottom&&
					this.bottom>spr.top){
						f(spr);
				}
			}
		}
		else if(window.console)console.error('Data missing in Sprite.collisionMapFunction(function)');
	},
	collisionMapRange:function(typeMin,typeMax,hx,hy,exception){
		if(!isNaN(hx)){hx+=this.x;}
		if(!isNaN(hy)){hy+=this.y;}
		if(typeMax!=null){
			for(var i=1,l=World.map.length;i<l;i++){
				var spr=World.map[i];
				if( ((exception!=null)?exception!=i:true)&&
					spr.type>=typeMin&&
					spr.type<=typeMax&&
					(hx||this.left)<spr.right&&
					(hx||this.right)>spr.left&&
					(hy||this.top)<spr.bottom&&
					(hy||this.bottom)>spr.top){
						return i;
				}
			}
			return 0;
		}
		else if(window.console)console.error('Data missing in Sprite.collisionMapRange(typeMin,typeMax[,hotspotX,hotspotY,exception])');
		return false;
	},
	collisionMapSwitch:function(type,newType,hx,hy,exception){
		if(!isNaN(hx)){hx+=this.x;}
		if(!isNaN(hy)){hy+=this.y;}
		if(newType!=null){
			var collision=false;
			for(var i=1,l=World.map.length;i<l;i++){
				var spr=World.map[i];
				if( ((exception!=null)?exception!=i:true)&&
					((type!=null)?spr.type==spr.type:true)&&
					(hx||this.left)<spr.right&&
					(hx||this.right)>spr.left&&
					(hy||this.top)<spr.bottom&&
					(hy||this.bottom)>spr.top){
						if(newType>0){
							spr.type=newType;
						}
						else{
							World.map.remove(i--);
							l--;
						}
						collision=true;
				}
			}
			return collision;
		}
		else if(window.console)console.error('Data missing in Sprite.collisionMapSwitch(type,newType[,hotspotX,hotspotY,exception])');
		return false;
	},
	drawSprite:function(ctx,img,ox,oy){
		if(ctx!=null){
			if(img!=null){
				ox=(isNaN(ox))?0:ox;
				oy=(isNaN(oy))?0:oy;
				var h=(this.hflip)?-1:1;
				var v=(this.vflip)?-1:1;
				ctx.save();
				ctx.translate(this.x+ox-World.cam.x,this.y+oy-World.cam.y);
				ctx.rotate(this.rotation*Math.DEG);
				ctx.scale(this.scale*h,this.scale*v);
				ctx.drawImage(img,img.width*-0.5,img.height*-0.5);
				ctx.restore();
			}
			if(_cjsg.screenDebug||img==null||img.naturalWidth===0){
				ctx.strokeStyle='#fff';
				ctx.beginPath();
				ctx.moveTo(this.left-World.cam.x,this.y-World.cam.y);
				ctx.lineTo(this.right-World.cam.x,this.y-World.cam.y);
				ctx.moveTo(this.x-World.cam.x,this.top-World.cam.y);
				ctx.lineTo(this.x-World.cam.x,this.bottom-World.cam.y);
				//ctx.closePath();
				ctx.stroke();
				ctx.strokeStyle='#0f0';
				ctx.strokeRect(this.left-World.cam.x,this.top-World.cam.y,this.width*this.scale,this.height*this.scale);
				ctx.strokeStyle='#0ff';
				ctx.beginPath();
				ctx.arc(this.x-World.cam.x,this.y-World.cam.y,Math.min(this.width,this.height)*this.scale/2,0,Math.PI*2,true);
				ctx.closePath();
				ctx.stroke();
				ctx.strokeStyle='#00f';
				ctx.beginPath();
				ctx.arc(this.x-World.cam.x,this.y-World.cam.y,Math.max(this.width,this.height)*this.scale/2,0,Math.PI*2,true);
				ctx.closePath();
				ctx.stroke();
			}
		}
		else if(window.console)console.error('Data missing in Sprite.drawSprite(ctx[,img,offsetX,offsetY])');
		return false;
	}
}
// SpriteSheet.js
function SpriteSheet(img,spriteWidth,spriteHeight){
	this.img=null;
	var _spriteWidth;
	var _spriteHeight;
	
	this.SpriteSheet=function(img,spriteWidth,spriteHeight){
		if(spriteWidth!=null){
			this.img=img;
			_spriteWidth=spriteWidth;
			_spriteHeight=(spriteHeight==null)?spriteWidth:spriteHeight;
		}
		else if(window.console)console.error('Data missing in SpriteSheet(image,spriteWidth[,_spriteHeight])');
	}
	this.SpriteSheet(img,spriteWidth,spriteHeight);
	
	this.draw=function(ctx,x,y,col,row){
		if(y!=null){
			col=(isNaN(col))?0:col;
			if(isNaN(row)&&this.img.width){
				var ipr=col*Math.round(this.img.width/_spriteWidth);
				if(col>ipr){
					col=col%ipr;
					row=~~(col/ipr);
				}
				else
					row=0;
			}
			try{
				ctx.drawImage(this.img,col*_spriteWidth,row*_spriteHeight,_spriteWidth,_spriteHeight,x,y,_spriteWidth,_spriteHeight);
			}
			catch(e){if(window.console)console.error(e+' Area: '+col*_spriteWidth+','+row*_spriteHeight+','+_spriteWidth+','+_spriteHeight);}
		}
		else if(window.console)console.error('Data missing in SpriteSheet.draw(ctx,x,y[,col,row])');
	}
	
	this.drawArea=function(ctx,x,y,ax,ay,aw,ah){
		if(ah!=null){
			try{
				ctx.drawImage(this.img,ax,ay,aw,ah,x,y,aw,ah);
			}
			catch(e){if(window.console)console.error(e+' Area: '+ax+','+ay+','+aw+','+ah);}
		}
		else if(window.console)console.error('Data missing in SpriteSheet.drawArea(ctx,x,y,areaX,areaY,areaWidth,areaHeight)');
	}
	
	this.drawSprite=function(ctx,spr,col,row,ox,oy){
		if(spr!=null){
			col=(isNaN(col))?0:col;
			ox=(isNaN(ox))?0:ox;
			oy=(isNaN(oy))?0:oy;
			var h=(spr.hflip)?-1:1;
			var v=(spr.vflip)?-1:1;
			if(isNaN(row)&&this.img.width){
				var ipr=Math.round(this.img.width/_spriteWidth);
				if(col>ipr){
					col=col%ipr;
					row=~~(col/ipr);
				}
				else
					row=0;
			}
			ctx.save();
			ctx.translate(spr.x+ox-World.cam.x,spr.y+oy-World.cam.y);
			ctx.rotate(spr.rotation*Math.DEG);
			ctx.scale(spr.scale*h,spr.scale*v);
			try{
				ctx.drawImage(this.img,_spriteWidth*col,_spriteHeight*row,_spriteWidth,_spriteHeight,_spriteWidth*-0.5,_spriteHeight*-0.5,_spriteWidth,_spriteHeight);
			}
			catch(e){if(window.console)console.error(e+' Area: '+col*_spriteWidth+','+row*_spriteHeight+','+_spriteWidth+','+_spriteHeight);}
			ctx.restore();
			if(_cjsg.screenDebug)
				spr.drawSprite(ctx);
		}
		else if(window.console)console.error('Data missing in SpriteSheet.drawSprite(ctx,spr[,col,row,offsetX,offsetY])');
	}
	
	this.drawSpriteFromArea=function(ctx,spr,ax,ay,aw,ah,ox,oy){
		if(ah!=null){
			ox=(isNaN(ox))?0:ox;
			oy=(isNaN(oy))?0:oy;
			var h=(spr.hflip)?-1:1;
			var v=(spr.vflip)?-1:1;
			ctx.save();
			ctx.translate(spr.x+ox-World.cam.x,spr.y+oy-World.cam.y);
			ctx.rotate(spr.rotation*Math.DEG);
			ctx.scale(spr.scale*h,spr.scale*v);
			try{
				ctx.drawImage(this.img,ax,ay,aw,ah,aw*-0.5,ah*-0.5,aw,ah);
			}
			catch(e){if(window.console)console.error(e+' Area: '+ax+','+ay+','+aw+','+ah);}
			ctx.restore();
			if(_cjsg.screenDebug)
				spr.drawSprite(ctx);
		}
		else if(window.console)console.error('Data missing in SpriteSheet.drawSprite(ctx,spr,areaX,areaY,areaWidth,areaHeight[,offsetX,offsetY])');
	}
}
//	SpriteVector.js
function SpriteVector(){}
SpriteVector.prototype=[];

SpriteVector.prototype.addSprite=function(spr_x,y,width,height,type){
	if(spr_x!=null){
		if(typeof spr_x == 'object')
			this.push(spr_x);
		else
			this.push(new Sprite(spr_x,y,width,height,type));
	}
	else if(window.console)console.error('Data missing in SpriteVector.addSprite(sprite)');
}

SpriteVector.prototype.addMap=function(map,width,height,cols,masterSprites){
	if(width!=null){
		height=(height==null)?width:height;
		var _c=(cols==null)?map.shift():cols;
		for(var a=0,l=map.length;a<l;a++)
			if(map[a]>0){
				var spr;
				if(masterSprites!=null){
					spr=new Sprite(masterSprites[map[a]]);
					spr.setOrigin((a%_c)*width+width/2,~~(a/_c)*height+height/2);
					spr.resetPosition();
				}
				else
					spr=new Sprite((a%_c)*width+width/2,~~(a/_c)*height+height/2,width,height);
				spr.type=map[a];
				this.addSprite(spr);
			}
		if(cols)
			map.unshift(_c);
	}
	else if(window.console)console.error('Data missing in SpriteVector.addMap(map,width[,height,cols,masterSprites])');
}

SpriteVector.prototype.getSprite=function(i){
	return this[i];
}

SpriteVector.prototype.move=function(m){
	for(var i=0,l=this.length;i<l;++i)
		this[i].move(m);
}

SpriteVector.prototype.contains=function(rect_x,y,width,height){
	if(rect_x!=null){
		for(var i=1,l=this.length;i<l;i++)
			if(this[i].contains(rect_x,y,width,height))
				return i;
	}
	else if(window.console)console.error('Data missing in SpriteVector.contains(rect)');
	return false;
}

SpriteVector.prototype.intersects=function(rect_x,y,width,height){
	if(rect_x!=null){
		for(var i=1,l=this.length;i<l;i++)
			if(this[i].intersects(rect_x,y,width,height))
				return i;
	}
	else if(window.console)console.error('Data missing in SpriteVector.intersects(rect)');
	return false;
	
}

SpriteVector.prototype.collisionBox=function(spr){
	if(spr!=null){
		for(var i=0,l=this.length;i<l;i++)
			if(this[i].collisionBox(spr))
				return true;
	}
	else if(window.console)console.error('Data missing in SpriteVector.collisionBox(spr)');
	return false;
}

SpriteVector.prototype.drawSprites=function(ctx,img,ox,oy){
	for(var i=0,l=this.length;i<l;++i){
		var tImg;
		if(img!=null&&img instanceof Array)tImg=img[this[i].type];
		else tImg=img;
		this[i].drawSprite(ctx,tImg,ox,oy);
	}
}
//	Input.js
var Input=new function(){
	this.lastPress=null;
	this.lastTouchPress=null;
	this.lastTouchRelease=null;
	this.pressing=[];
	this.touches=[];
	
	this.acceleration={
		active:false,
		x:0,
		y:0,
		z:0
	}
	
	this.mouse={
		x:0,
		y:0,
		ox:0,
		oy:0,
		move:false,

		draw:function(ctx){
			if(ctx!=null){
				if(Input.pressing[1])
					ctx.strokeStyle='#fff';
				else
					ctx.strokeStyle='#f00';
				ctx.beginPath();
				ctx.arc(this.x,this.y,5,0,Math.PI*2,true);
				ctx.moveTo(this.x-5,this.y);
				ctx.lineTo(this.x+5,this.y);
				ctx.moveTo(this.x,this.y-5);
				ctx.lineTo(this.x,this.y+5);
				if(Input.pressing[1]){
					ctx.moveTo(this.x,this.y);
					ctx.lineTo(this.ox,this.oy);
				}
				ctx.closePath();
				ctx.stroke();
			}
			else if(window.console)console.error('Data missing in Input.mouse.draw(ctx)');
		}
	}
	
	this.orientation={
		active:false,
		absolute:false,
		alpha:0,
		beta:0,
		gamma:0
	}
	
	this.virtualKey=function(key,action){
		if(action!=null){
			if(action){
				if(!this.pressing[key]){
					this.lastPress=key;
				}
			}
			else{
				if(this.pressing[key]){
					this.lastRelease=key;
				}
			}
			this.pressing[key]=action;
		}
		else if(window.console)console.error('Data missing in Input.virtualKey(key,action)');
	}
	
	this.enableAcceleration=function(){
		if(window.DeviceMotionEvent){
			this.acceleration.active=true;
			window.addEventListener('devicemotion',DeviceMotion,false);
		}
		else{
			if(window.console)console.error('Device motion not supported');
		}
	}

	this.enableKeyboard=function(){
		document.addEventListener('keydown',KeyDown,false);
		document.addEventListener('keyup',KeyUp,false);
	}
	
	this.enableMouse=function(){
		_cjsg.buffer.addEventListener('contextmenu',MousePrevent,false);
		_cjsg.buffer.addEventListener('mousedown',MouseDown,false);
		document.addEventListener('mouseup',MouseUp,false);
		document.addEventListener('mousemove',MouseMove,false);
	}
	
	this.enableOrientation=function(){
		if(window.DeviceOrientationEvent){
			this.orientation.active=true;
			window.addEventListener('deviceorientation',DeviceOrientation,false);
		}
		else{
			if(window.console)console.error('Device orientation not supported');
		}
	}
	
	this.enableTouch=function(){
		_cjsg.buffer.addEventListener('touchstart',TouchStart,false);
		_cjsg.buffer.addEventListener('touchend',TouchEnd,false);
		_cjsg.buffer.addEventListener('touchcancel',TouchEnd,false);
		_cjsg.buffer.addEventListener('touchmove',TouchMove,false);
	}
	
	this.disableAcceleration=function(){
		window.removeEventListener('devicemotion',DeviceMotion,false);
		acceleration.active=false;
	}

	this.disableKeyboard=function(){
		document.removeEventListener('keydown',KeyDown,false);
		document.removeEventListener('keyup',KeyUp,false);
	}
	
	this.disableMouse=function(){
		_cjsg.buffer.removeEventListener('contextmenu',MousePrevent,false);
		_cjsg.buffer.removeEventListener('mousedown',MouseDown,false);
		document.removeEventListener('mouseup',MouseUp,false);
		document.removeEventListener('mousemove',MouseMove,false);
	}
	
	this.disableOrientation=function(){
		window.removeEventListener('deviceorientation',DeviceOrientation,false);
		orientation.active=false;
	}
	
	this.disableTouch=function(){
		_cjsg.buffer.removeEventListener('touchstart',TouchStart,false);
		_cjsg.buffer.removeEventListener('touchend',TouchEnd,false);
		_cjsg.buffer.removeEventListener('touchcancel',TouchEnd,false);
		_cjsg.buffer.removeEventListener('touchmove',TouchMove,false);
	}
	
	function DeviceMotion(evt){
		Input.acceleration.x=evt.accelerationIncludingGravity.x;
		Input.acceleration.y=evt.accelerationIncludingGravity.y;
		Input.acceleration.z=evt.accelerationIncludingGravity.z;
	}
	
	function DeviceOrientation(evt){
		Input.orientation.absolute=evt.absolute;
		Input.orientation.alpha=evt.alpha;
		Input.orientation.beta=evt.beta;
		Input.orientation.gamma=evt.gamma;
	}
	
	function KeyDown(evt){
		if(!Input.pressing[evt.keyCode])
			Input.lastPress=evt.keyCode;
		Input.pressing[evt.keyCode]=true;
		if(Input.lastPress>=37&&Input.lastPress<=40)
			evt.preventDefault();
	}
	
	function KeyUp(evt){
		Input.lastRelease=evt.keyCode;
		Input.pressing[evt.keyCode]=false;
	}
	
	function MousePrevent(evt){
		evt.stopPropagation();
		evt.preventDefault();
	}
	
	function MouseDown(evt){
		new MousePrevent(evt);
		Input.lastPress=evt.which;
		Input.pressing[evt.which]=true;
		if(evt.which==1){
			Input.mouse.ox=Input.mouse.x;
			Input.mouse.oy=Input.mouse.y;
		}
		if(Input.touches.length==0){
			Input.touches.push(new vtouch(0,Input.mouse.x,Input.mouse.y));
			Input.lastTouchPress=0;
		}
	}
	
	function MouseUp(evt){
		Input.lastRelease=evt.which;
		Input.pressing[evt.which]=false;
		if(Input.touches.length>0){
			Input.touches.length=0;
			Input.lastTouchRelease=0;
		}
	}
	
	function MouseMove(evt){
		Input.mouse.move=true;
		Input.mouse.x=screen2viewX(evt.pageX);
		Input.mouse.y=screen2viewY(evt.pageY);
		if(Input.touches.length>0){
			Input.touches[0].x=Input.mouse.x;
			Input.touches[0].y=Input.mouse.y;
		}
	}
	
	function TouchStart(evt){
		evt.preventDefault();
		var t=evt.changedTouches;
		for(var i=0,l=t.length;i<l;i++){
			Input.touches.push(new vtouch(t[i].identifier,screen2viewX(t[i].pageX),screen2viewY(t[i].pageY)));
			Input.lastTouchPress=t[i].identifier;
		}
		if(!Input.pressing[1])
			Input.lastPress=1;
		Input.pressing[1]=true;
		Input.mouse.ox=Input.touches[0].x;
		Input.mouse.oy=Input.touches[0].y;
		Input.mouse.move=true;
		Input.mouse.x=Input.mouse.ox;
		Input.mouse.y=Input.mouse.oy;
	}
	
	function TouchEnd(evt){
		evt.preventDefault();
		var t=evt.changedTouches;
		for(var i=0,l=t.length;i<l;i++){
			for(var j=0,m=Input.touches.length;j<m;j++){
				if(Input.touches[j].id==t[i].identifier){
					Input.touches.remove(j--);
					Input.lastTouchRelease=t[i].identifier;
					m--;
				}
			}
		}
		Input.lastRelease=1;
		Input.pressing[1]=false;
	}
	
	function TouchMove(evt){
		evt.preventDefault();
		var t=evt.targetTouches;
		for(var i=0,l=t.length;i<l;i++){
			for(var j=0,m=Input.touches.length;j<m;j++){
				if(Input.touches[j].id==t[i].identifier){
					Input.touches[j].x=screen2viewX(t[i].pageX);
					Input.touches[j].y=screen2viewY(t[i].pageY);
				}
			}
		}
		Input.mouse.move=true;
		Input.mouse.x=Input.touches[0].x;
		Input.mouse.y=Input.touches[0].y;
	}
	
	function screen2viewX(evtX){
		if(_cjsg.isFullscreen&&_cjsg.fullMode==2){
			return ~~(evtX*_cjsg.view.width/window.innerWidth);
		}
		else{
			return ~~(~~(evtX+document.documentElement.scrollLeft-(_cjsg.offsetLeft||_cjsg.buffer.offsetLeft))/_cjsg.viewScale);
		}
	}
	
	function screen2viewY(evtY){
		if(_cjsg.isFullscreen&&_cjsg.fullMode==2){
			return ~~(evtY*_cjsg.view.height/window.innerHeight);
		}
		else{
			return ~~(~~(evtY+document.documentElement.scrollTop-(_cjsg.offsetTop||_cjsg.buffer.offsetTop))/_cjsg.viewScale);
		}
	}

	function vtouch(id,x,y){
		this.id=id||0;
		this.x=x||0;
		this.y=y||0;
		this.ox=this.x;
		this.oy=this.y;

		this.draw=function(ctx){
			if(ctx!=null){
				ctx.strokeStyle='#999';
				ctx.beginPath();
				ctx.arc(this.x,this.y,10,0,Math.PI*2,true);
				ctx.moveTo(this.x,this.y);
				ctx.lineTo(this.ox,this.oy);
				ctx.stroke();
			}
			else if(window.console)console.error('Data missing in Input.touch['+this.id+'].draw(ctx)');
		}
	}
}
var Toast={
	text:'',
	time:0,
	offset:0,
	makeText:function(str,time){
		if(time!=null){
			this.text=str;
			this.time=time;
			this.offset=0;
		}
		else if(window.console)console.error('Data missing in Toast.makeText(string,time)');
	},
	update:function(deltaTime){
		if(this.time>0){
			this.time-=deltaTime;
		}
	},
	paint:function(ctx){
		if(this.time>0){
			ctx.font='10px sans-serif';
			ctx.textAlign='center';
			if(this.offset==0)this.offset=ctx.measureText(this.text).width/2;
			if(this.time<1)ctx.globalAlpha=this.time;
			var hw=_cjsg.view.width/2,h=_cjsg.view.height;
			ctx.fillStyle='#333';
			ctx.beginPath();
			ctx.rect(hw-this.offset,h-20,this.offset*2,16);
			ctx.beginPath();
			ctx.arc(hw-this.offset,h-12,8,Math.PI*1.5,Math.PI*0.5,true);
			ctx.arc(hw+this.offset,h-12,8,Math.PI*0.5,Math.PI*1.5,true);
			ctx.fill();
			ctx.fillStyle='#ccc';
			ctx.fillText(this.text,hw,h-8);
			ctx.globalAlpha=1;
			ctx.textAlign='left';
		}
	}
};
//	Util.js
var Util={
	getAngle:function(x1,y1,x2,y2){
		if(y2!=null){
			var angle=(Math.atan2(y1-y2,x1-x2))/Math.DEG+90;
			if(angle>360)angle-=360;
			if(angle<0)angle+=360;
			return angle;
		}
		else if(window.console)console.error('Data missing in Util.getAngle(x1,y1,x2,y2)');
	},

	getDistance:function(x1,y1,x2,y2){
		if(y2!=null){
			var dx=x1-x2;
			var dy=y1-y2;
			return (Math.sqrt(dx*dx+dy*dy));
		}
		else if(window.console)console.error('Data missing in Util.getDistance(x1,y1,x2,y2)');
	},

	getImage:function(str){
		var img=new Image();
		if(str!=null){
			img.src=str;
		}
		return img;
	},

	getAudio:function(str){
		var aud=new Audio();
		if(str!=null){
			if(aud.canPlayType('audio/ogg').replace(/no/,''))
				aud.src=str.substr(0,str.lastIndexOf('.'))+'.oga';
			else
				aud.src=str;
		}
		return aud;
	},

	fillTile:function(ctx,img,x,y,repeatx,repeaty){
		if(img!=null){
			if(img.width>0&&img.height>0){
				x=(isNaN(x))?0:x;
				y=(isNaN(y))?0:y;
				var a=0,b=0;
				repeatx=(repeatx==null)?true:repeatx;
				repeaty=(repeaty==null)?true:repeaty;
				if(repeatx){
					a=~~(x/img.width)*img.width
					if(x>0)a+=img.width;
					while(x-a<_cjsg.view.width){
						if(repeaty){
							b=~~(y/img.height)*img.height;
							if(y>0)b+=img.height;
							while(y-b<_cjsg.view.height){
								ctx.drawImage(img,x-a,y-b);
								b-=img.height;
							}
						}
						else{
							ctx.drawImage(img,x-a,y-b);
						}
						a-=img.width;
					}
				}
				else{
					if(repeaty){
						b=~~(y/img.height)*img.height;
						if(y<0)b-=img.height;
						while(y-b<_cjsg.view.height){
							ctx.drawImage(img,x-a,y-b);
							b-=img.height;
						}
					}
					else{
						ctx.drawImage(img,x-a,y-b);
					}
				}
				//console.log(a,x,b,y)
			}
		}
		else if(window.console)console.error('Data missing in Util.fillTile(ctx,img[,x,y,repeatX,repeatY])');
	},
	
	random:function(max){
		return Math.random()*max;
	}
};
//	World.js
var World={
	width:0,
	height:0,
	map:new SpriteVector(),
	cam:new Camera(),
	loopX:false,
	loopY:false,

	setMap:function(map,width,height,cols){
		if(width!=null){
			height=(height==null)?width:height;
			var _c=(cols==null)?map.shift():cols;
			this.width=_c*width;
			this.height=Math.ceil(map.length/_c)*height;
			this.map.length=0;
			this.map.push(new Sprite(0,0,0)); //dummy
			this.map.addMap(map,width,height,_c);
			if(cols)
				map.unshift(_c);
		}
		else if(window.console)console.error('Data missing in World.setMap(map,cols,width[,height])');
	},

	setSize:function(width,height){
		if(height!=null){
			this.width=width;
			this.height=height;
		}
		else if(window.console)console.error('Data missing in World.setSize(width,height)');
	},

	drawMap:function(ctx,img){
		if(ctx!=null){
			ctx.strokeStyle='#f00';
			ctx.fillStyle='#f00';
			for(var i=1,l=this.map.length;i<l;i++){
				var spr=this.map[i];
				if(img!=null){
					if(img instanceof SpriteSheet){
						img.draw(ctx,spr.left-this.cam.x,spr.top-this.cam.y,spr.type+spr.mapOffset);
						if(this.loopX){
							if(this.cam.x<0)img.draw(ctx,spr.left-this.width-this.cam.x,spr.top-this.cam.y,spr.type+spr.mapOffset);
							else img.draw(ctx,spr.left+this.width-this.cam.x,spr.top-this.cam.y,spr.type+spr.mapOffset);
						}
						if(this.loopY){
							if(this.cam.y<0)img.draw(ctx,spr.left-this.cam.x,spr.top-this.height-this.cam.y,spr.type+spr.mapOffset);
							else img.draw(ctx,spr.left-this.cam.x,spr.top+this.height-this.cam.y,spr.type+spr.mapOffset);
						}
					}
					else{
						var tImg;
						if(img instanceof Array)tImg=img[spr.type+spr.mapOffset];
						else tImg=img;
						ctx.drawImage(tImg,spr.left-this.cam.x,spr.top-this.cam.y);
						if(this.loopX){
							if(this.cam.x<0)ctx.drawImage(tImg,spr.left-this.width-this.cam.x,spr.top-this.cam.y);
							else ctx.drawImage(tImg,spr.left+this.width-this.cam.x,spr.top-this.cam.y);
						}
						if(this.loopY){
							if(this.cam.y<0)ctx.drawImage(tImg,spr.left-this.cam.x,spr.top-this.height-this.cam.y);
							else ctx.drawImage(tImg,spr.left-this.cam.x,spr.top+this.height-this.cam.y);
						}
					}
				}
				if(_cjsg.screenDebug||img==null||img.naturalWidth===0){
					ctx.strokeRect(spr.left-this.cam.x,spr.top-this.cam.y,spr.width,spr.height);
					ctx.fillText(i,spr.left-this.cam.x,spr.top+spr.width-this.cam.y);
				}
			}
			if(_cjsg.screenDebug){
				ctx.strokeStyle='#999';
				ctx.strokeRect(-this.cam.x,-this.cam.y,this.width,this.height);
				for(var i=0,l=Input.touches.length;i<l;i++){
					Input.touches[i].draw(ctx);
				}
				Input.mouse.draw(ctx);
			}
		}
		else if(window.console)console.error('Data missing in World.drawMap(ctx[,img,imagesPerRow])');
	}
};