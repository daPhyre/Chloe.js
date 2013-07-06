/**
 * Canvas Open JavaScript Game Engine
 * @author daPhyre
 * @since 0.1, Tu/12/Jul/11
 * @version 0.9, Su/16/Jun/13
 */
'use strict';
var stage=null,ctx=null,stageScale=1,fullMode=0;
var isFullscreen=false,screenDebug=false;
Math.DEG=Math.PI/180;
Array.prototype.insert=function(i,element){this.splice(i,0,element);}
Array.prototype.remove=function(i){return this.splice(i,1)[0];}
Array.prototype.removeAll=function(){this.length=0;}
function random(max){return Math.random()*max;}

//	Canvas.js
function Canvas(canvasId,_fullMode,autoFull,autoFullOnMobile){
	var self=this;
	var dbuff=document.createElement('canvas');
	var bgcolor='#ccc',bgimg=null,bgfixed=false;
	var async=true,interval=1000/60;
	var time=0,acumDt=0;
	var ifs=false,windowWidth=0,windowHeight=0,oStageWidth=0,oStageHeight=0;
	fullMode=_fullMode;
	if(autoFull==null)autoFull=true;
	if(autoFullOnMobile==null)autoFullOnMobile=true;
	
	this.onReady=function(){};
	this.act=function(){};
	this.paint=function(ctx){ctx.fillText('It\'s Working!\nCOJSGE 0.9',20,30);}
	window.addEventListener('load',init,false);

	function init(){
		if(canvasId==null)canvasId='canvas';
		stage=document.getElementById(canvasId);
		stage.style.cursor='url(\'cursor.png\') 8 8, crosshair';
		stage.style.background=bgcolor;
		oStageWidth=stage.width;
		oStageHeight=stage.height;
		ctx=stage.getContext('2d');
		World.setSize(oStageWidth,oStageHeight);
		self.onReady();
		run();
	}

	this.setBackground=function(color,image,fixed){
		if(color!=null){
			stage.style.background=color;
			bgcolor=color;
			bgimg=image;
			bgfixed=(fixed==null)?false:fixed;
		}
		else if(window.cosole)console.error('Data missing in Canvas.setBackground(color[,image,fixed])');
	}
	
	this.setAsync=function(a){
		async=a;
	}
	
	this.getAsync=function(){
		return async;
	}
	
	this.setInterval=function(i){
		interval=i;
	}
	
	this.getInterval=function(){
		return interval;
	}
	
	this.getScreenshot=function(){
		window.open(stage.toDataURL());
	}

	function run(){
		//setTimeout(run,interval);
		requestAnimFrame(run);
		if(async||screenDebug){
			var now=new Date().getTime();
			var dt=now-(time || now);
			time=now;
			acumDt+=dt;
			if(screenDebug){
				debug.frames++;
				debug.run(dt);
			}
		}
		if(async){
			while(acumDt>interval){
				self.act();
				if(acumDt<5000)acumDt-=interval;
				else acumDt=0
				if(screenDebug)debug.aframes++;
			}
		}
		else
			self.act();
			
		if(ifs!=isFullscreen||windowWidth!=window.innerWidth||windowHeight!=window.innerHeight){
			resize();
		}
		repaint();
		if(screenDebug){
			debug.paint(ctx);
		}
	}

	function resize(){
		windowWidth=window.innerWidth;
		windowHeight=window.innerHeight;
		if(autoFull||autoFullOnMobile){
			if(autoFullOnMobile&&(stage.width>windowWidth||stage.height>windowHeight))
				isFullscreen=true;
			else if(autoFull&&screen.width-windowWidth<2&&screen.height-windowHeight<2){
				isFullscreen=true;
			}
			else
				isFullscreen=false;
		}
		ifs=isFullscreen;
		if(isFullscreen){
			if(fullMode>2){
				if(fullMode%2==0){
					if(fullMode!=4||windowWidth<windowHeight)
						stage.height=~~(stage.width*windowHeight/windowWidth);
					else
						stage.height=oStageHeight;
				}
				else{
					if(fullMode!=3||windowHeight<windowWidth)
						stage.width=~~(stage.height*windowWidth/windowHeight);
					else
						stage.width=oStageWidth;
				}
			}
			if(fullMode==2){
				stage.style.width=windowWidth+'px';
				stage.style.height=windowHeight+'px';
				stage.style.marginLeft=-windowWidth/2+'px';
				stage.style.marginTop=-windowHeight/2+'px';
			}
			else{
				var w=windowWidth/stage.width;
				var h=windowHeight/stage.height;
				stageScale=(fullMode==1)?Math.max(h,w):Math.min(h,w);
				stage.style.width=(stage.width*stageScale)+'px';
				stage.style.height=(stage.height*stageScale)+'px';
				stage.style.marginLeft=-(stage.width*stageScale)/2+'px';
				stage.style.marginTop=-(stage.height*stageScale)/2+'px';
			}
			stage.style.top='50%';
			stage.style.left='50%';
			stage.style.position='absolute';
			document.body.style.background=bgcolor;
			document.getElementsByTagName('body')[0].style.overflow='hidden';
		}
		else{
			stageScale=1;
			stage.height=oStageHeight;
			stage.width=oStageWidth;
			stage.style.width='';
			stage.style.height='';
			stage.style.marginLeft='';
			stage.style.marginTop='';
			stage.style.position='';
			document.body.style.background='';
			document.getElementsByTagName('body')[0].style.overflow='';
		}
	}

	function repaint(){
		dbuff.width=stage.width;
		dbuff.height=stage.height;
		var g2=dbuff.getContext('2d');
		g2.fillStyle=bgcolor;
		g2.fillRect(0,0,dbuff.width,dbuff.height);
		g2.fillStyle='#000';
		if(bgimg!=null){
			if(bgfixed)Util.fillTile(g2,bgimg);
			else Util.fillTile(g2,bgimg,-Camera.x,-Camera.y);
		}
		self.paint(g2);
		ctx.drawImage(dbuff,0,0,stage.width,stage.height);
	}
	
	var debug=new function(){
		this.frames=0;
		this.aframes=0;
		var FPS=0;
		var AFPS=0;
		var AFT='';
		var milis=0;
		
		if(window.requestAnimationFrame)
			AFT='dft';
		else if(window.webkitRequestAnimationFrame)
			AFT='wkt';
		else if(window.mozRequestAnimationFrame)
			AFT='moz';
		else if(window.msRequestAnimationFrame)
			AFT='ms';
		else if(window.oRequestAnimationFrame)
			AFT='o';
		else
			AFT='non';
		
		this.run=function(dt){
			milis+=dt;
			if(milis>1000){
				FPS=this.frames;
				AFPS=this.aframes;
				this.frames=0;
				this.aframes=0;
				milis-=1000;
			}
		}
		
		this.paint=function(ctx){
			ctx.font='10px sans-serif';
			ctx.textAlign='center';
			ctx.fillStyle='#fff';
			ctx.fillText('FPS: '+FPS,stage.width/2,10);
			ctx.fillText('AFPS: '+AFPS,stage.width/2,20);
			ctx.fillText('AFT: '+AFT,stage.width/2,30);
			ctx.textAlign='left';
		}
	}
	
	var requestAnimFrame=(function(){
		return window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame || 
			function(callback){window.setTimeout(callback,17);};
	})();
}
//	Animation.js
function Animation(_img,_frameWidth,_frameHeight,_framesPerImage){
	this.images=[];
	this.currentFrame=0;
	this.framesPerImage=1;
	var currentImage=0;
	var frameWidth=0;
	var frameHeight=0;
	var isStrip=false;

	this.Animation=function(_img,_frameWidth,_frameHeight,_framesPerImage){
		if(_frameWidth!=null){
			isStrip=true;
			this.images.length=0;
			this.images.push(_img);
			frameWidth=_frameWidth;
			frameHeight=_frameHeight;
			this.framesPerImage=isNaN(_framesPerImage)?1:_framesPerImage;
			return true;
		}
		else{
			if(window.cosole)console.error('Data missing in Animation(img,frameWidth[,frameHeight,framesPerImage])');
			return false;
		}
	}
	this.Animation(_img,_frameWidth,_frameHeight,_framesPerImage);

	this.addFrame=function(img){
		if(img!=null){
			isStrip=false;
			this.images.push(img);
		}
		else if(window.cosole)console.error('Data missing in Animation.addFrame(img)');
	}

	this.prevFrame=function(){
		this.currentFrame--;
		if (this.currentFrame<0)
			this.currentFrame=this.geTotalFrames()-1;
		currentImage=~~(this.currentFrame/this.framesPerImage);
		return this.currentFrame;
	}

	this.nextFrame=function(){
		this.currentFrame++;
		if(this.currentFrame>this.geTotalFrames()-1)
			this.currentFrame=0;
		currentImage=~~(this.currentFrame/this.framesPerImage);
		return this.currentFrame;
	}

	this.getCurrentImage=function(){
		if(isStrip)
			return this.images[0];
		else
			return this.images[currentImage];
	}

	this.geTotalFrames=function(){
		return this.getTotalImages()*this.framesPerImage;
	}

	this.getTotalImages=function(){
		if(isStrip){
			return Math.round(this.images[0].width/frameWidth);
		}
		else
			return this.images.length;
	}

	this.draw=function(ctx,x,y,row){
		if(y!=null){
			ctx.strokeStyle='#0f0';
			if(isStrip){
				var tImg=this.images[0];
				if(isNaN(row)){
					ctx.drawImage(tImg,frameWidth*currentImage,0,frameWidth,tImg.height,x,y,frameWidth,tImg.height);
					if(screenDebug)
						ctx.strokeRect(x,y,frameWidth,tImg.height);
				}
				else{
					ctx.drawImage(tImg,frameWidth*currentImage,frameHeight*row,frameWidth,frameHeight,x,y,frameWidth,frameHeight);
					if(screenDebug)
						ctx.strokeRect(x,y,frameWidth,frameHeight);
				}
			}
			else{
				ctx.drawImage(this.getCurrentImage(),x,y);
				if(screenDebug)
					ctx.strokeRect(x,y,this.getCurrentImage().width,this.getCurrentImage().height);
			}
		}
		else if(window.cosole)console.error('Data missing in Animation.draw(ctx,x,y[,row])');
	}

	this.drawSprite=function(ctx,spr,ox,oy,row){
		if(spr!=null){
			if(isStrip){
				ox=(isNaN(ox))?0:ox;
				oy=(isNaN(oy))?0:oy;
				var h=(spr.hflip)?-1:1;
				var v=(spr.vflip)?-1:1;
				var tImg=this.images[0];
				ctx.save();
				ctx.translate(spr.getCenterX()+ox-Camera.x,spr.getCenterY()+oy-Camera.y);
				ctx.rotate(spr.rotation*Math.DEG);
				ctx.scale(spr.scale*h,spr.scale*v);
				if(isNaN(row)){
					ctx.drawImage(tImg,frameWidth*currentImage,0,frameWidth,tImg.height,frameWidth*-0.5,tImg.height*-0.5,frameWidth,tImg.height);
				}
				else{
					ctx.drawImage(tImg,frameWidth*currentImage,frameHeight*row,frameWidth,frameHeight,frameWidth*-0.5,frameHeight*-0.5,frameWidth,frameHeight);
				}
				ctx.restore();
				if(screenDebug)
					spr.drawSprite(ctx);
			}
			else{
				spr.drawSprite(ctx,this.getCurrentImage(),ox,oy);
			}
		}
		else if(window.cosole)console.error('Data missing in Animation.drawSprite(ctx,spr[,offsetX,offsetY,row])');
	}
}
//	Button.js
function Button(_x,_y,_width,_height){
	this.x=(isNaN(_x))?0:_x;
	this.y=(isNaN(_y))?0:_y;
	this.width=(isNaN(_width))?0:_width;
	this.height=(isNaN(_height))?this.width:_height;
	
	this.mouseOver=function(){
		return(
			this.x<Input.mouse.x&&this.x+this.width>Input.mouse.x&&
			this.y<Input.mouse.y&&this.y+this.height>Input.mouse.y
		);
	}
	
	this.mouseDown=function(){
		return(
			pressing[1]&&
			this.x<Input.mouse.x&&this.x+this.width>Input.mouse.x&&
			this.y<Input.mouse.y&&this.y+this.height>Input.mouse.y
		);
	}
	
	this.touch=function(){
		var t=false;
		for(var i=0,l=Input.touches.length;i<l;i++){
			if(this.x<Input.touches[i].x&&this.x+this.width>Input.touches[i].x&&
				this.y<Input.touches[i].y&&this.y+this.height>Input.touches[i].y)
				t=true;
		}
		return t;
	}
	
	this.draw=function(ctx,img,ox,oy){
		if(ctx!=null){
			if(img!=null){
				ox=(isNaN(ox))?0:ox;
				oy=(isNaN(oy))?0:oy;
				ctx.drawImage(img,this.x+Camera.x+ox,this.y+Camera.y+oy);
			}
			if(img==null||screenDebug){
				if(this.mouseOver()){
					if(pressing[1])
						ctx.strokeStyle='#fff';
					else
						ctx.strokeStyle='#0ff';
				}
				else
					ctx.strokeStyle='#00f';
				ctx.strokeRect(this.x+Camera.x,this.y+Camera.y,this.width,this.height);
			}
		}
		else if(window.cosole)console.error('Data missing in Button.draw(ctx[,img,offsetX,offsetY])');
	}
}
//	Particle.js
function Particle(_x,_y,_diameter,_life,_speed,_angle,_colorStart,_colorEnd){
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

	this.Particle=function(_x,_y,_diameter,_life,_speed,_angle,_colorStart,_colorEnd){
		if(_colorStart!=null){
			this.x=_x;
			this.y=_y;
			this.ox=_x;
			this.oy=_y;
			this.diameter=_diameter+1;
			this.life=_life;
			this.olife=_life;
			this.speed=_speed;
			this.angle=_angle;
			this.rotation=_angle;
			this.color=_colorStart;
			
			if(_colorEnd!=null){
				var cStart=hex2rgb(_colorStart);
				var cEnd=hex2rgb(_colorEnd);
				var red=~~((cStart[0]-cEnd[0])/(_life+1));
				var green=~~((cStart[1]-cEnd[1])/(_life+1));
				var blue=~~((cStart[2]-cEnd[2])/(_life+1));
				for (var i=0;i<_life;i++)
					this.colorList.push('rgb('+(cStart[0]-(i*red))+','+(cStart[1]-(i*green))+','+(cStart[2]-(i*blue))+')');
			}
			return true;
		}
		else{
			if(window.cosole)console.error('Data missing in Particle(x,y,diameter,life,speed,angle,colorStart[,colorEnd])');
			return false;
		}
	}
	this.Particle(_x,_y,_diameter,_life,_speed,_angle,_colorStart,_colorEnd);

	function hex2rgb(h){
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

	/*function rgb2hex(r,g,b){return '#'+clr2hex(r)+clr2hex(g)+clr2hex(b);}
	function clr2hex(n){
		n=parseInt(n,10);
		if(isNaN(n)) return '00';
		n=Math.max(0,Math.min(n,255));
		return '0123456789ABCDEF'.charAt((n-n%16)/16)+'0123456789ABCDEF'.charAt(n%16);
	}*/
}
//	ParticleSystem.js
function ParticleSystem(){
	this.gravity=0;
	this.wind=0;

	this.addParticle=function(p_x,y,diameter,life,speed,angle,colorStart,colorEnd){
		if(typeof p_x == 'object')
			this.push(p_x);
		else
			this.push(new Particle(p_x,y,diameter,life,speed,angle,colorStart,colorEnd));
	}

	this.moveParticles=function(){
		for(var i=0,l=this.length;i<l;++i){
			if (this[i].life>0){
				this[i].x+=this[i].speed*(Math.cos(this[i].angle*Math.DEG))+this.wind*(this[i].olife-this[i].life);
				this[i].y+=this[i].speed*(Math.sin(this[i].angle*Math.DEG))+this.gravity*(this[i].olife-this[i].life);
				this[i].life--;
				if(this[i].colorList.length>0)
					this[i].color=this[i].colorList.shift();
			}
			else{
				this.remove(i--);
				l--;
			}
		}
	}

	this.moveParticlesO=function(){
		for(var i=0,l=this.length;i<l;++i){
			if (this[i].life>0){
				this[i].ox=this[i].x;
				this[i].oy=this[i].y;
				this[i].x+=this[i].speed*(Math.cos(this[i].angle*Math.DEG))+this.wind*(this[i].olife-this[i].life);
				this[i].y+=this[i].speed*(Math.sin(this[i].angle*Math.DEG))+this.gravity*(this[i].olife-this[i].life);
				this[i].life--;
				if(this[i].colorList.length>0)
					this[i].color=this[i].colorList.shift();
			}
			else{
				this.remove(i--);
				l--;
			}
		}
	}

	this.drawParticles=function(ctx,alpha,img){
		if(img!=null){
			for(var i=0,l=this.length;i<l;++i){
				ctx.save();
				if(alpha)ctx.globalAlpha=this[i].life/this[i].olife;
				ctx.translate(this[i].x-Camera.x,this[i].y-Camera.y);
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
				ctx.arc(this[i].x-Camera.x,this[i].y-Camera.y,this[i].diameter/2,0,Math.PI*2,true);
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			}
		}
		else if(window.cosole)console.error('Data missing in ParticleSystem.drawParticles(ctx[,img,alpha])');
	}

	this.drawParticlesO=function(ctx,alpha){
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
				ctx.arc(this[i].x-Camera.x,this[i].y-Camera.y,this[i].diameter/2,0,Math.PI*2,true);
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			}
		}
		else if(window.cosole)console.error('Data missing in ParticleSystem.drawParticles0(ctx[,alpha])');
	}
}
ParticleSystem.prototype=[];
//	Sprite.js
function Sprite(_x,_y,_width,_height,_type){
	this.ox=(isNaN(_x))?0:_x;
	this.oy=(isNaN(_y))?0:_y;
	this.ohealth=1;
	this.width=(isNaN(_width))?0:_width;
	this.height=(isNaN(_height))?this.width:_height;
	this.type=(isNaN(_type))?0:_type;

	this.x=0;
	this.y=0;
	this.vx=0;
	this.vy=0;
	this.health=0;
	this.rotation=0;
	this.scale=1;
	this.vflip=false;
	this.hflip=false;

	this.var1=0;
	this.var2=0;
	this.flag1=false;
	this.flag2=false;

	this.setOrigin=function(x,y){
		if(y!=null){
			this.ox=x;
			this.oy=y;
		}
		else if(window.cosole)console.error('Data missing in Sprite.setOrigin(x,y)');
	}

	this.setHealth=function(health){
		if(health!=null){
			this.ohealth=health;
			this.health=health;
		}
		else if(window.cosole)console.error('Data missing in Sprite.setHealth(health)');
	}

	this.setPosition=function(x,y){
		if(y!=null){
			this.x=x;
			this.y=y;
		}
		else if(window.cosole)console.error('Data missing in Sprite.setPosition(x,y)');
	}

	this.resetPosition=function(){
		this.x=this.ox;
		this.y=this.oy;
	}

	this.reset=function(){
		this.x=this.ox;
		this.y=this.oy;
		this.health=this.ohealth;
		this.vx=0;
		this.vy=0;
		this.rotation=0;
		this.scale=1;
	}
	this.reset();

	this.move=function(){
		this.x+=this.vx;
		this.y+=this.vy;
	}

	this.setDirection=function(angle,speed){
		if(speed!=null){
			this.vx=speed*Math.cos(angle*Math.DEG);
			this.vy=speed*Math.sin(angle*Math.DEG);
		}
		else if(window.cosole)console.error('Data missing in Sprite.setDirection(angle,speed)');
	}

	this.getAngle=function(spr){
		var angle=0;
		if(spr!=null)
			angle=(Math.atan2(this.getCenterY()-spr.getCenterY(),this.getCenterX()-spr.getCenterX()))/Math.DEG+90;
		else
			angle=(Math.atan2(this.vy,this.vx))/Math.DEG;
		if(angle>360)angle-=360;
		if(angle<0)angle+=360;
		return angle;
	}

	this.getSpeed=function(){
		return this.vx/Math.cos(Math.DEG*this.getAngle());
	}

	this.getWidth=function(){
		return this.width*this.scale;
	}

	this.getHeight=function(){
		return this.height*this.scale;
	}

	this.getCenterX=function(){
		return this.x+this.getWidth()/2;
	}

	this.getCenterY=function(){
		return this.y+this.getHeight()/2;
	}

	this.getCenter=function(){
		var c=function(){var x;var y;}
		c.x=this.getCenterX();
		c.y=this.getCenterY();
		return c;
	}

	this.getDiameter=function(inner){
		if (inner!=null&&inner)
			return Math.min(this.width,this.height)*this.scale;
		else
			return Math.max(this.width,this.height)*this.scale;
	}

	this.distance=function(spr,inner){
		if(spr!=null){
			var dx=this.getCenterX()-spr.getCenterX();
			var dy=this.getCenterY()-spr.getCenterY();
			return (Math.sqrt(dx*dx+dy*dy)-(this.getDiameter(inner)/2+spr.getDiameter(inner)/2));
		}
		else if(window.cosole)console.error('Data missing in Sprite.distance(spr[,inner])');
		return false;
	}
	
	this.contains=function(rect_x,y,width,height){
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
				if(window.cosole)console.error('Data missing in Sprite.contains(x,y[,width,height])');
				return false;
			}
			return(this.x<x+width&&
				this.x+this.getWidth()>x+width&&
				this.y<y+height&&
				this.y+this.getHeight()>y+height);
		}
		else if(window.cosole)console.error('Data missing in Sprite.contains(rect)');
		return false;
	}
	
	this.intersects=function(rect_x,y,width,height){
		if(rect_x!=null){
			var x=rect_x;
			if(typeof rect_x == 'object'){
				x=rect_x.x||0;
				y=rect_x.y||0;
				width=rect_x.width||0;
				height=rect_x.height||0;
			}
			else if(height==null){
				if(window.cosole)console.error('Data missing in Sprite.intersects(x,y,width,height)');
				return false;
			}
			return(this.x<x+width&&
				this.x+this.getWidth()>x&&
				this.y<y+height&&
				this.y+this.getHeight()>y);
		}
		else if(window.cosole)console.error('Data missing in Sprite.intersects(rect)');
		return false;
	}

	this.collisionCircle=function(spr,inner){
		if(spr!=null)
			return this.distance(spr,inner)<0;
		else if(window.cosole)console.error('Data missing in Sprite.collisionCircle(spr[,inner])');
		return false;
	}
	
	this.collisionPoint=function(x,y){
		if(y!=null){
			return this.contains(x,y);
		}
		else if(window.cosole)console.error('Data missing in Sprite.collisionPoint(x,y)');
		return false;
	}
	
	this.collisionBox=function(spr,hx,hy){
		if(spr!=null){
			if(hy!=null)
				return this.contains(spr.x+hx,spr.y+hy);
			else
				return this.intersects(spr.x,spr.y,spr.getWidth(),spr.getHeight());
		}
		else if(window.cosole)console.error('Data missing in Sprite.collisionBox(spr[,hotspotX,hotspotY])');
		return false;
	}

	this.collisionMap=function(type,hx,hy){
		var collision=0;
		var closest=this.getDiameter()/2;
		for (var i=0,l=World.map.length;i<l;i++){
			var spr=World.map[i];
			if(hy!=null)spr=new Sprite(spr.x+hx,spr.y+hy,0);
			if(((type!=null)?type==spr.type:true)&&
				this.x<spr.x+spr.getWidth()&&
				this.x+this.getWidth()>spr.x&&
				this.y<spr.y+spr.getHeight()&&
				this.y+this.getHeight()>spr.y){
			var d=this.distance(World.map[i]);
				if(d<closest){
					collision=i+1;
					closest=d;
				}
			}
		}
		return collision;
	}

	this.collisionMapEx=function(exception){
		if(exception!=null){
			var collision=0;
			var closest=this.getDiameter()/2;
			for (var i=0,l=World.map.length;i<l;i++){
				var spr=World.map[i];
				if(((exception!=null)?exception!=i:true)&&
					this.x<spr.x+spr.getWidth()&&
					this.x+this.getWidth()>spr.x&&
					this.y<spr.y+spr.getHeight()&&
					this.y+this.getHeight()>spr.y){
				var d=this.distance(World.map[i]);
					if(d<closest){
						collision=i+1;
						closest=d;
					}
				}
			}
			return collision;
		}
		else if(window.cosole)console.error('Data missing in Sprite.collisionMapEx(exception)');
		return false;
	}

	this.collisionMapRange=function(typeMin,typeMax,hx,hy,exception){
		if(typeMax!=null){
			var collision=0;
			var closest=this.getDiameter()/2;
			for (var i=0,l=World.map.length;i<l;i++){
				var spr=World.map[i];
				if(hy!=null)spr=new Sprite(spr.x+hx,spr.y+hy,0);
				if(((exception!=null)?exception!=i:true)&&
					spr.type>=typeMin&&
					spr.type<=typeMax&&
					this.x<spr.x+spr.getWidth()&&
					this.x+this.getWidth()>spr.x&&
					this.y<spr.y+spr.getHeight()&&
					this.y+this.getHeight()>spr.y){
				var d=this.distance(World.map[i]);
					if(d<closest){
						collision=i+1;
						closest=d;
					}
				}
			}
			return collision;
		}
		else if(window.cosole)console.error('Data missing in Sprite.collisionMapRange(typeMin,typeMax[,hotspotX,hotspotY])');
		return false;
	}

	this.collisionMapSwitch=function(type,newType,hx,hy,exception){
		if(newType!=null){
			var collision=0;
			var closest=this.getDiameter()/2;
			for (var i=0,l=World.map.length;i<l;i++){
				var spr=World.map[i];
				if(hy!=null)spr=new Sprite(spr.x+hx,spr.y+hy,0);
				if(((exception!=null)?exception!=i:true)&&
					((type!=null)?spr.type==spr.type:true)&&
					this.x<spr.x+spr.getWidth()&&
					this.x+this.getWidth()>spr.x&&
					this.y<spr.y+spr.getHeight()&&
					this.y+this.getHeight()>spr.y){
				var d=this.distance(World.map[i]);
					if(d<closest){
						if(newType>0){
							collision=i+1;
							spr.type=newType;
						}
						else{
							collision=spr.type;
							World.map.remove(i--);
							l--;
						}
						closest=d;
					}
				}
			}
			return collision;
		}
		else if(window.cosole)console.error('Data missing in Sprite.collisionMapSwitch(type,newType[,hotspotX,hotspotY])');
		return false;
	}

	this.drawSprite=function(ctx,img,ox,oy){
		if(ctx!=null){
			if(img!=null){
				ox=(isNaN(ox))?0:ox;
				oy=(isNaN(oy))?0:oy;
				var h=(this.hflip)?-1:1;
				var v=(this.vflip)?-1:1;
				ctx.save();
				ctx.translate(this.getCenterX()+ox-Camera.x,this.getCenterY()+oy-Camera.y);
				ctx.rotate(this.rotation*Math.DEG);
				ctx.scale(this.scale*h,this.scale*v);
				ctx.drawImage(img,img.width*-0.5,img.height*-0.5);
				ctx.restore();
			}
			if(img==null||screenDebug){
				var c=this.getCenter();
				ctx.strokeStyle='#0f0';
				ctx.strokeRect(this.x-Camera.x,this.y-Camera.y,this.width*this.scale,this.height*this.scale);
				ctx.strokeStyle='#0ff';
				ctx.beginPath();
				ctx.arc(c.x-Camera.x,c.y-Camera.y,Math.min(this.width,this.height)*this.scale/2,0,Math.PI*2,true);
				ctx.closePath();
				ctx.stroke();
				ctx.strokeStyle='#00f';
				ctx.beginPath();
				ctx.arc(c.x-Camera.x,c.y-Camera.y,Math.max(this.width,this.height)*this.scale/2,0,Math.PI*2,true);
				ctx.closePath();
				ctx.stroke();
			}
		}
		else if(window.cosole)console.error('Data missing in Sprite.drawSprite(ctx[,img,offsetX,offsetY])');
		return false;
	}
}
// SpriteSheet.js
function SpriteSheet(_img,_spriteWidth,_spriteHeight){
	this.img=null;
	var spriteWidth;
	var spriteHeight;
	
	this.SpriteSheet=function(_img,_spriteWidth,_spriteHeight){
		if(_spriteWidth!=null){
			this.img=_img;
			spriteWidth=_spriteWidth;
			spriteHeight=(_spriteHeight==null)?_spriteWidth:_spriteHeight;
		}
		else if(window.cosole)console.error('Data missing in SpriteSheet(image,spriteWidth[,spriteHeight])');
	}
	this.SpriteSheet(_img,_spriteWidth,_spriteHeight);
	
	this.draw=function(ctx,x,y,col,row){
		if(y!=null){
			col=(isNaN(col))?0:col;
			if(isNaN(row)&&this.img.width){
				var ipr=col*Math.round(this.img.width/spriteWidth);
				if(window.cosole)console.log('IPR: '+ipr)
				if(col>ipr){
					col=col%ipr;
					row=~~(col/ipr);
				}
				else
					row=0;
			}
			try{
				ctx.drawImage(this.img,col*spriteWidth,row*spriteHeight,spriteWidth,spriteHeight,x,y,spriteWidth,spriteHeight);
			}
			catch(e){if(window.console)console.error(e+' Area: '+col*spriteWidth+','+row*spriteHeight+','+spriteWidth+','+spriteHeight);}
		}
		else if(window.cosole)console.error('Data missing in SpriteSheet.draw(ctx,x,y[,col,row])');
	}
	
	this.drawArea=function(ctx,x,y,ax,ay,aw,ah){
		if(ah!=null){
			try{
				ctx.drawImage(this.img,ax,ay,aw,ah,x,y,aw,ah);
			}
			catch(e){if(window.console)console.error(e+' Area: '+ax+','+ay+','+aw+','+ah);}
		}
		else if(window.cosole)console.error('Data missing in SpriteSheet.drawArea(ctx,x,y,areaX,areaY,areaWidth,areaHeight)');
	}
	
	this.drawSprite=function(ctx,spr,col,row,ox,oy){
		if(spr!=null){
			col=(isNaN(col))?0:col;
			ox=(isNaN(ox))?0:ox;
			oy=(isNaN(oy))?0:oy;
			var h=(spr.hflip)?-1:1;
			var v=(spr.vflip)?-1:1;
			if(isNaN(row)&&this.img.width){
				var ipr=Math.round(this.img.width/spriteWidth);
				if(window.cosole)console.log('IPR: '+ipr)
				if(col>ipr){
					col=col%ipr;
					row=~~(col/ipr);
				}
				else
					row=0;
			}
			ctx.save();
			ctx.translate(spr.getCenterX()+ox-Camera.x,spr.getCenterY()+oy-Camera.y);
			ctx.rotate(spr.rotation*Math.DEG);
			ctx.scale(spr.scale*h,spr.scale*v);
			try{
				ctx.drawImage(this.img,spriteWidth*col,spriteHeight*row,spriteWidth,spriteHeight,spriteWidth*-0.5,spriteHeight*-0.5,spriteWidth,spriteHeight);
			}
			catch(e){if(window.console)console.error(e+' Area: '+col*spriteWidth+','+row*spriteHeight+','+spriteWidth+','+spriteHeight);}
			ctx.restore();
			if(screenDebug)
				spr.drawSprite(ctx);
		}
		else if(window.cosole)console.error('Data missing in SpriteSheet.drawSprite(ctx,spr[,col,row,offsetX,offsetY])');
	}
	
	this.drawSpriteFromArea=function(ctx,spr,ax,ay,aw,ah,ox,oy){
		if(ah!=null){
			ox=(isNaN(ox))?0:ox;
			oy=(isNaN(oy))?0:oy;
			var h=(spr.hflip)?-1:1;
			var v=(spr.vflip)?-1:1;
			ctx.save();
			ctx.translate(spr.getCenterX()+ox-Camera.x,spr.getCenterY()+oy-Camera.y);
			ctx.rotate(spr.rotation*Math.DEG);
			ctx.scale(spr.scale*h,spr.scale*v);
			try{
				ctx.drawImage(this.img,ax,ay,aw,ah,aw*-0.5,ah*-0.5,aw,ah);
			}
			catch(e){if(window.console)console.error(e+' Area: '+ax+','+ay+','+aw+','+ah);}
			ctx.restore();
			if(screenDebug)
				spr.drawSprite(ctx);
		}
		else if(window.cosole)console.error('Data missing in SpriteSheet.drawSprite(ctx,spr,areaX,areaY,areaWidth,areaHeight[,offsetX,offsetY])');
	}
}
//	SpriteVector.js
function SpriteVector(){
	this.addSprite=function(spr_x,y,width,height,type){
		if(typeof spr_x == 'object')
			this.push(spr_x);
		else
			this.push(new Sprite(spr_x,y,width,height,type));
	}

	this.addMap=function(map,cols,width,height,masterSprites){
		if(width!=null){
			height=(isNaN(height))?width:height;
			for(var a=0,l=map.length;a<l;a++)
				if(map[a]>0){
					var spr;
					if(masterSprites!=null){
						spr=new Sprite(masterSprites[map[a]]);
						spr.setOrigin((a%cols)*width,~~(a/cols)*height);
						spr.resetPosition();
					}
					else
						spr=new Sprite((a%cols)*width,~~(a/cols)*height,width,height);
					spr.type=map[a];
					this.addSprite(spr);
				}
		}
		else if(window.cosole)console.error('Data missing in SpriteVector.addMap(map,cols,width[,height,masterSprites])');
	}

	this.getSprite=function(i){
		return this[i];
	}

	this.move=function(){
		for(var i=0,l=this.length;i<l;++i)
			this[i].move();
	}

	this.collisionBox=function(spr){
		var c=false;
		if(spr!=null){
			for(var i=0,l=this.length;i<l;i++)
				if(this[i].collisionBox(spr))
					c=true;
		}
		else if(window.cosole)console.error('Data missing in SpriteVector.collisionBox(spr)');
		return c;
	}

	this.drawSprites=function(ctx,img,ox,oy){
		for(var i=0,l=this.length;i<l;++i){
			var tImg;
			if(img!=null&&img instanceof Array)tImg=img[this[i].type];
			else tImg=img;
			this[i].drawSprite(ctx,tImg,ox,oy);
		}
	}
}
SpriteVector.prototype=[];
//	Input.js
var Input=new function(){
	this.lastPress=null;
	this.lastTouchPress=null;
	this.lastTouchRelease=null;
	this.pressing=[];
	this.touches=[];
	
	this.acceleration={
		x:0,
		y:0,
		z:0
	}
	
	this.mouse={
		x:0,
		y:0,
		ox:0,
		oy:0,

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
			else if(window.cosole)console.error('Data missing in Input.mouse.draw(ctx)');
		}
	}
	
	this.orientation={
		alpha:0,
		beta:0,
		gamma:0
	}
	
	this.enableAcceleration=function(){
		window.addEventListener('devicemotion',DeviceMotion,false);
	}

	this.enableKeyboard=function(){
		document.addEventListener('keydown',KeyDown,false);
		document.addEventListener('keyup',KeyUp,false);
	}
	
	this.enableMouse=function(){
		stage.addEventListener('contextmenu',MousePrevent,false);
		stage.addEventListener('mousedown',MouseDown,false);
		document.addEventListener('mouseup',MouseUp,false);
		document.addEventListener('mousemove',MouseMove,false);
	}
	
	this.enableOrientation=function(){
		window.addEventListener('deviceorientation',DeviceOrientation,false);
	}
	
	this.enableTouch=function(){
		stage.addEventListener('touchstart',TouchStart,false);
		stage.addEventListener('touchend',TouchEnd,false);
		stage.addEventListener('touchcancel',TouchEnd,false);
		stage.addEventListener('touchmove',TouchMove,false);
	}
	
	this.disableAcceleration=function(){
		window.removeEventListener('devicemotion',DeviceMotion,false);
	}

	this.disableKeyboard=function(){
		document.removeEventListener('keydown',KeyDown,false);
		document.removeEventListener('keyup',KeyUp,false);
	}
	
	this.disableMouse=function(){
		stage.removeEventListener('contextmenu',MousePrevent,false);
		stage.removeEventListener('mousedown',MouseDown,false);
		document.removeEventListener('mouseup',MouseUp,false);
		document.removeEventListener('mousemove',MouseMove,false);
	}
	
	this.disableOrientation=function(){
		window.removeEventListener('deviceorientation',DeviceOrientation,false);
	}
	
	this.disableTouch=function(){
		stage.removeEventListener('touchstart',TouchStart,false);
		stage.removeEventListener('touchend',TouchEnd,false);
		stage.removeEventListener('touchcancel',TouchEnd,false);
		stage.removeEventListener('touchmove',TouchMove,false);
	}
	
	function DeviceMotion(evt){
		Input.acceleration.x=evt.accelerationIncludingGravity.x;
		Input.acceleration.y=evt.accelerationIncludingGravity.y;
		Input.acceleration.z=evt.accelerationIncludingGravity.z;
	}
	
	function DeviceOrientation(evt){
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
		Input.mouse.ox=Input.mouse.x;
		Input.mouse.oy=Input.mouse.y;
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
		Input.mouse.x=screen2stageX(evt.pageX);
		Input.mouse.y=screen2stageY(evt.pageY);
		if(Input.touches.length>0){
			Input.touches[0].x=Input.mouse.x;
			Input.touches[0].y=Input.mouse.y;
		}
	}
	
	function TouchStart(evt){
		evt.preventDefault();
		var t=evt.changedTouches;
		for(var i=0,l=t.length;i<l;i++){
			Input.touches.push(new vtouch(t[i].identifier,screen2stageX(t[i].pageX),screen2stageY(t[i].pageY)));
			Input.lastTouchPress=t[i].identifier;
		}
		if(!Input.pressing[1])
			Input.lastPress=1;
		Input.pressing[1]=true;
		Input.mouse.ox=Input.touches[0].x;
		Input.mouse.oy=Input.touches[0].y;
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
					Input.touches[j].x=screen2stageX(t[i].pageX);
					Input.touches[j].y=screen2stageY(t[i].pageY);
				}
			}
		}
		Input.mouse.x=Input.touches[0].x;
		Input.mouse.y=Input.touches[0].y;
	}
	
	function screen2stageX(evtX){
		if(isFullscreen&&fullMode==2){
			return ~~(evtX*stage.width/window.innerWidth);
		}
		else{
			return ~~(~~(evtX+document.body.scrollLeft-stage.offsetLeft)/stageScale);
		}
	}
	
	function screen2stageY(evtY){
		if(isFullscreen&&fullMode==2){
			return ~~(evtY*stage.height/window.innerHeight);
		}
		else{
			return ~~(~~(evtY+document.body.scrollTop-stage.offsetTop)/stageScale);
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
			else if(window.cosole)console.error('Data missing in Input.touch['+this.id+'].draw(ctx)');
		}
	}
}
//	Camera.js
var Camera={
	x:0,
	y:0,
	
	focus:function(spr,slide,ox,oy){
		if(spr!=null){
			slide=(isNaN(slide))?0:slide;
			ox=(isNaN(ox))?0:ox;
			oy=(isNaN(oy))?ox:oy;
			var cx=spr.getCenterX()-stage.width/2;
			var cy=spr.getCenterY()-stage.height/2;
			if(World.width<stage.width||World.width-ox*2<stage.width){
				this.x=World.width/2-stage.width/2;
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
				if(!World.loopX){
					if(this.x<ox)
						this.x=ox;
					else if(this.x>World.width-stage.width-ox)
						this.x=World.width-stage.width-ox;
				}
			}
			if(World.height<stage.height||World.height-oy*2<stage.height){
				this.y=World.height/2-stage.height/2;
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
				if(!World.loopY){
					if(this.y<oy)
						this.y=oy;
					else if(this.y>World.height-stage.height-oy)
						this.y=World.height-stage.height-oy;
				}
			}
		}
		else if(window.cosole)console.error('Data missing in Camera.focus(spr[,slide,offsetX,offsetY])');
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
		else if(window.cosole)console.error('Data missing in Util.getAngle(x1,y1,x2,y2)');
	},

	getDistance:function(x1,y1,x2,y2){
		if(y2!=null){
			var dx=x1-x2;
			var dy=y1-y2;
			return (Math.sqrt(dx*dx+dy*dy));
		}
		else if(window.cosole)console.error('Data missing in Util.getDistance(x1,y1,x2,y2)');
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
		if(img!=null&&img.width>0&&img.height>0){
			var a=0,b=0;
			x=(isNaN(x))?0:x;
			y=(isNaN(y))?0:y;
			repeatx=(repeatx==null)?true:repeatx;
			repeaty=(repeaty==null)?true:repeaty;
			if(repeatx){
				while(a+x<stage.width){
					b=0;
					if(repeaty){
						while(b+y<stage.height){
							ctx.drawImage(img,a+x,b+y);
							b+=img.height;
						}
					}
					else{
						ctx.drawImage(img,a+x,b+y);
					}
					a+=img.width;
				}
			}
			else{
				if(repeaty){
					while(b+x<stage.height){
						ctx.drawImage(img,a+x,b+y);
						b+=img.height;
					}
				}
				else{
					ctx.drawImage(img,a+x,b+y);
				}
			}
		}
		else if(window.cosole)console.error('Data missing in Util.fillTile(ctx,img[,x,y,repeatX,repeatY])');
	}
};
//	World.js
var World={
	width:0,
	height:0,
	map:new SpriteVector(),
	loopX:false,
	loopY:false,

	setMap:function(map,cols,width,height){
		if(width!=null){
			height=(isNaN(height))?width:height;
			this.width=cols*width;
			this.height=Math.ceil(map.length/cols)*height;
			this.map.length=0;
			this.map.addMap(map,cols,width,height);
		}
		else if(window.cosole)console.error('Data missing in World.setMap(map,cols,width[,height])');
	},

	setSize:function(width,height){
		if(height!=null){
			this.width=width;
			this.height=height;
		}
		else if(window.cosole)console.error('Data missing in World.setSize(width,height)');
	},

	drawMap:function(ctx,img,deviation){
		if(ctx!=null){
			ctx.strokeStyle='#f00';
			ctx.fillStyle='#f00';
			for(var i=0,l=this.map.length;i<l;i++){
				var spr=this.map[i];
				if(img!=null){
					var de=(deviation)?spr.type+spr.var1:spr.type;
					if(img instanceof SpriteSheet){
						img.draw(ctx,spr.x-Camera.x,spr.y-Camera.y,de);
						if(this.loopX){
							if(Camera.x<0)img.draw(ctx,spr.x-this.width-Camera.x,spr.y-Camera.y,de);
							else img.draw(ctx,spr.x+this.width-Camera.x,spr.y-Camera.y,de);
						}
						if(this.loopY){
							if(Camera.y<0)img.draw(ctx,spr.x-Camera.x,spr.y-this.height-Camera.y,de);
							else img.draw(ctx,spr.x-Camera.x,spr.y+this.height-Camera.y,de);
						}
					}
					else{
						var tImg;
						if(img instanceof Array)tImg=img[de];
						else tImg=img;
						ctx.drawImage(tImg,spr.x-Camera.x,spr.y-Camera.y);
						if(this.loopX){
							if(Camera.x<0)ctx.drawImage(tImg,spr.x-this.width-Camera.x,spr.y-Camera.y);
							else ctx.drawImage(tImg,spr.x+this.width-Camera.x,spr.y-Camera.y);
						}
						if(this.loopY){
							if(Camera.y<0)ctx.drawImage(tImg,spr.x-Camera.x,spr.y-this.height-Camera.y);
							else ctx.drawImage(tImg,spr.x-Camera.x,spr.y+this.height-Camera.y);
						}
					}
				}
				if(img==null||screenDebug){
					ctx.strokeRect(spr.x-Camera.x,spr.y-Camera.y,spr.width,spr.height);
					ctx.fillText(i+1,spr.x-Camera.x,spr.y+spr.width-Camera.y);
				}
			}
			if(screenDebug){
				ctx.strokeStyle='#999';
				ctx.strokeRect(-Camera.x,-Camera.y,Camera.width,Camera.height);
				for(var i=0,l=Input.touches.length;i<l;i++){
					Input.touches[i].draw(ctx);
				}
				Input.mouse.draw(ctx);
			}
		}
		else if(window.cosole)console.error('Data missing in World.drawMap(ctx[,img,imagesPerRow])');
	}
};