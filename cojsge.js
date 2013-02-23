/**
 * Canvas Open JavaScript Game Engine
 * @author daPhyre
 * @since 0.1, Tu/12/Jul/11
 * @version 0.8, Sa/18/Jan/13
 */
var stage=null,ctx=null,lastPress=null,lastRelease=null;
var isFullscreen=false,screenDebug=false;
var pressing=new Array();
Array.prototype.insert=function(i,element){this.splice(i,0,element);}
Array.prototype.remove=function(i){return this.splice(i,1)[0];}
Array.prototype.removeAll=function(){this.length=0;}
function onReady(){}
function game(){}
function paint(ctx){ctx.fillText('It\'s Working!\nCOJSGE 0.7',20,30);}
function random(max){return Math.random()*max;}

window.requestAnimFrame=(function(){
	return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
		function(callback){window.setTimeout(callback,17);};
})(); 

//	Game.js
function Game(canvasId,autoFull,fullMode){
	var dbuff=document.createElement('canvas');
	var bgcolor='#ccc',bgimg=null,bgfixed=false,interval=16.7;
	var gameScale=1,time=0,acumDt=0;
	if(autoFull==null)autoFull=true;
	window.addEventListener('load',init,false);

	function init(){
		if(canvasId==null)canvasId='canvas';
		stage=document.getElementById(canvasId);
		stage.style.cursor='url(\'cursor.png\') 8 8, crosshair';
		stage.style.background=bgcolor;
		stage.addEventListener('contextmenu',MousePrevent,false);
		stage.addEventListener('mousedown',MouseDown,false);
		document.addEventListener('mouseup',MouseUp,false);
		document.addEventListener('mousemove',MouseMove,false);
		ctx=stage.getContext('2d');
		World.setSize(stage.width,stage.height);
		debug.init();
		onReady();
		run();
	}

	this.setBackground=function(color,image,fixed){
		if(color!=null){
			stage.style.background=color;
			bgcolor=color;
			bgimg=image;
			bgfixed=(fixed==null)?false:fixed;
		}
		else if(window.cosole)console.error('Data missing in Game.setBackground(color[,image,fixed])');
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
		var now=new Date().getTime();
		var dt=now-(time || now);
		time=now;
		acumDt+=dt;
		
		while(acumDt>interval){
			game();
			acumDt-=interval;
			if(screenDebug)debug.frames++;
		}
		resize();
		repaint();
		if(screenDebug){
			debug.run(dt);
			debug.paint(ctx);
		}
	}

	function resize(){
		if(autoFull){
			if(screen.width-window.innerWidth<2&&screen.height-window.innerHeight<2)
				isFullscreen=true;
			else
				isFullscreen=false;
		}
		if(isFullscreen){
			if(fullMode==2){
				stage.style.width=window.innerWidth+'px';
				stage.style.height=window.innerHeight+'px';
				stage.style.marginLeft=-window.innerWidth/2+'px';
				stage.style.marginTop=-window.innerHeight/2+'px';
			}
			else{
				var w=window.innerWidth/stage.width;
				var h=window.innerHeight/stage.height;
				gameScale=(fullMode)?Math.max(h,w):Math.min(h,w);
				stage.style.width=(stage.width*gameScale)+'px';
				stage.style.height=(stage.height*gameScale)+'px';
				stage.style.marginLeft=-(stage.width*gameScale)/2+'px';
				stage.style.marginTop=-(stage.height*gameScale)/2+'px';
			}
			stage.style.top='50%';
			stage.style.left='50%';
			stage.style.position='absolute';
			document.body.style.background=bgcolor;
			document.getElementsByTagName('body')[0].style.overflow='hidden';
		}
		else{
			gameScale=1;
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
		paint(g2);
		ctx.drawImage(dbuff,0,0,stage.width,stage.height);
	}

	document.addEventListener('keydown',function(evt){
		if(!pressing[evt.keyCode])
			lastPress=evt.keyCode;
		pressing[evt.keyCode]=true;
		if(lastPress>=37&&lastPress<=40)
			evt.preventDefault();
	},false);

	document.addEventListener('keyup',function(evt){
		lastRelease=evt.keyCode;
		pressing[evt.keyCode]=false;
	},false);
	
	function MousePrevent(evt){
		evt.stopPropagation();
		evt.preventDefault();
	}
	
	function MouseDown(evt){
		MousePrevent(evt);
		if(!pressing[evt.which])
			lastPress=evt.which;
		pressing[evt.which]=true;
	}
	
	function MouseUp(evt){
		lastRelease=evt.which;
		pressing[evt.which]=false;
	}
	
	function MouseMove(evt){
		if(isFullscreen&&fullMode==2){
			Mouse.x=evt.pageX*stage.width/window.innerWidth;
			Mouse.y=evt.pageY*stage.height/window.innerHeight;
		}
		else{
			Mouse.x=parseInt(evt.pageX+document.body.scrollLeft-stage.offsetLeft)/gameScale;
			Mouse.y=parseInt(evt.pageY+document.body.scrollTop-stage.offsetTop)/gameScale;
		}
	}
}
//	Animation.js
function Animation(_img,_frameWidth,_frameHeight,_framesPerImage){
	this.images=new Array();
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
		currentImage=parseInt(this.currentFrame/this.framesPerImage);
		return this.currentFrame;
	}

	this.nextFrame=function(){
		this.currentFrame++;
		if(this.currentFrame>this.geTotalFrames()-1)
			this.currentFrame=0;
		currentImage=parseInt(this.currentFrame/this.framesPerImage);
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
				if(isNaN(row)){
					ctx.translate(spr.getCenterX()+ox-Camera.x,spr.getCenterY()+oy-Camera.y);
					ctx.rotate(spr.rotation*Math.PI/180);
					ctx.scale(spr.scale*h,spr.scale*v);
					ctx.drawImage(tImg,frameWidth*currentImage,0,frameWidth,tImg.height,frameWidth*-0.5,tImg.height*-0.5,frameWidth,tImg.height);
				}
				else{
					ctx.translate(spr.getCenterX()+ox-Camera.x,spr.getCenterY()+oy-Camera.y);
					ctx.rotate(spr.rotation*Math.PI/180);
					ctx.scale(spr.scale*h,spr.scale*v);
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

	return this;
}
//	Button.js
function Button(_x,_y,_width,_height){
	this.x=(isNaN(_x))?0:_x;
	this.y=(isNaN(_y))?0:_y;
	this.width=(isNaN(_width))?0:_width;
	this.height=(isNaN(_height))?this.width:_height;
	
	this.mouseOver=function(){
		return(
			this.x+Camera.x<Mouse.x&&this.x+this.width>Mouse.x&&
			this.y+Camera.y<Mouse.y&&this.y+this.height>Mouse.y
		);
	}
	
	this.mouseDown=function(){
		return(
			pressing[1]&&
			this.x+Camera.x<Mouse.x&&this.x+this.width>Mouse.x&&
			this.y+Camera.y<Mouse.y&&this.y+this.height>Mouse.y
		);
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
	
	return this;
}
//	Camera.js
Camera=new function(){
	this.x=0;
	this.y=0;
	
	this.focus=function(spr,slide,ox,oy){
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
	
	return this;
}
//	debug
debug=new function(){
	this.frames=0;
	var FPS=0;
	var AFPS=0;
	var AFT='';
	var milis=0;
	
	this.init=function(){
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
	}
	
	this.run=function(dt){
		milis+=dt;
		FPS=(1000/dt).toFixed(1);
		if(milis>1000){
			AFPS=this.frames;
			this.frames=0;
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
//	Mouse.js
Mouse=new function(){
	var x=0;
	var y=0;

	this.draw=function(ctx){
		if(ctx!=null){
			ctx.strokeStyle='#f00';
			ctx.beginPath();
			ctx.arc(this.x,this.y,5,0,Math.PI*2,true);
			ctx.moveTo(this.x-5,this.y);
			ctx.lineTo(this.x+5,this.y);
			ctx.moveTo(this.x,this.y-5);
			ctx.lineTo(this.x,this.y+5);
			ctx.closePath();
			ctx.stroke();
		}
		else if(window.cosole)console.error('Data missing in Mouse.draw(ctx)');
	}
	
	return this;
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
	this.colorList=new Array();

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
				var red=(cStart[0]-cEnd[0])/(_life+1);
				var green=(cStart[1]-cEnd[1])/(_life+1);
				var blue=(cStart[2]-cEnd[2])/(_life+1);
				for (var i=0;i<_life;i++)
					this.colorList.push(rgb2hex(cStart[0]-(i*red),cStart[1]-(i*green),cStart[2]-(i*blue)));
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
		var c=new Array();
		h=(h.charAt(0)=='#')? h.substring(1,7):h;
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

	function rgb2hex(r,g,b){return '#'+clr2hex(r)+clr2hex(g)+clr2hex(b);}
	function clr2hex(n){
		var n=parseInt(n,10);
		if(isNaN(n)) return '00';
		n=Math.max(0,Math.min(n,255));
		return '0123456789ABCDEF'.charAt((n-n%16)/16)+'0123456789ABCDEF'.charAt(n%16);
	}

	return this;
}
//	ParticleSystem.js
function ParticleSystem(){
	this.gravity=0;
	this.wind=0;

	this.addParticle=function(p_x,y,diameter,life,speed,angle,colorStart,colorEnd){
		if(isNaN(parseInt(p_x,10)))
			this.push(p_x);
		else
			this.push(new Particle(p_x,y,diameter,life,speed,angle,colorStart,colorEnd));
	}

	this.moveParticles=function(){
		for(var i=0;i<this.length;++i){
			if (this[i].life>0){
				this[i].x+=this[i].speed*(Math.cos(this[i].angle*(Math.PI/180)))+this.wind*(this[i].olife-this[i].life);
				this[i].y+=this[i].speed*(Math.sin(this[i].angle*(Math.PI/180)))+this.gravity*(this[i].olife-this[i].life);
				this[i].life--;
				if(this[i].colorList.length>0)
					this[i].color=this[i].colorList.shift();
			}
			else this.splice(i--,1);
		}
	}

	this.moveParticlesO=function(){
		for(var i=0;i<this.length;++i){
			if (this[i].life>0){
				this[i].ox=this[i].x;
				this[i].oy=this[i].y;
				this[i].x+=this[i].speed*(Math.cos(this[i].angle*(Math.PI/180)))+this.wind*(this[i].olife-this[i].life);
				this[i].y+=this[i].speed*(Math.sin(this[i].angle*(Math.PI/180)))+this.gravity*(this[i].olife-this[i].life);
				this[i].life--;
				if(this[i].colorList.length>0)
					this[i].color=this[i].colorList.shift();
			}
			else this.splice(i--,1);
		}
	}

	this.drawParticles=function(ctx,alpha,img){
		if(img!=null){
			for(var i=0;i<this.length;++i){
				ctx.save();
				if(alpha)ctx.globalAlpha=this[i].life/this[i].olife;
				ctx.translate(this[i].x-Camera.x,this[i].y-Camera.y);
				ctx.rotate(this[i].rotation*Math.PI/180);
				ctx.drawImage(img,img.width*-0.5,img.height*-0.5);
				ctx.restore();
			}
		}
		else if(ctx!=null){
			for(var i=0;i<this.length;++i){
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
			for(var i=0;i<this.length;++i){
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
	
	return this;
};
ParticleSystem.prototype=new Array();
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
			this.vx=speed*Math.cos((Math.PI/180)*angle);
			this.vy=speed*Math.sin((Math.PI/180)*angle);
		}
		else if(window.cosole)console.error('Data missing in Sprite.setDirection(angle,speed)');
	}

	this.getAngle=function(spr){
		var angle=0;
		if(spr!=null)
			angle=(Math.atan2(this.getCenterY()-spr.getCenterY(),this.getCenterX()-spr.getCenterX()))/(Math.PI/180)+90;
		else
			angle=(Math.atan2(this.vy,this.vx))/(Math.PI/180);
		if(angle>360)angle-=360;
		if(angle<0)angle+=360;
		return angle;
	}

	this.getSpeed=function(){
		return this.vx/Math.cos((Math.PI/180)*this.getAngle());
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
	}

	this.collisionCircle=function(spr,inner){
		if(spr!=null)
			return this.distance(spr,inner)<0;
		else if(window.cosole)console.error('Data missing in Sprite.collisionCircle(spr[,inner])');
	}
	
	this.collisionPoint=function(x,y){
		if(y!=null){
			return(this.x<x&&this.x+this.getWidth()>x&&
				this.y<y&&this.y+this.getHeight()>y);
		}
		else if(window.cosole)console.error('Data missing in Sprite.collisionPoint(x,y)');
	}
	
	this.collisionBox=function(spr,hx,hy){
		if(spr!=null){
			if(hy!=null)spr=new Sprite(spr.x+hx,spr.y+hy,0);
			return(this.x<spr.x+spr.getWidth()&&
				this.x+this.getWidth()>spr.x&&
				this.y<spr.y+spr.getHeight()&&
				this.y+this.getHeight()>spr.y);
		}
		else if(window.cosole)console.error('Data missing in Sprite.collisionBox(spr[,hotspotX,hotspotY])');
		return false;
	}

	this.collisionMap=function(type,hx,hy){
		var collision=0;
		var closest=this.getDiameter()/2;
		for (var i=0;i<World.map.length;i++){
			var spr=World.map.getSprite(i);
			if(hy!=null)spr=new Sprite(spr.x+hx,spr.y+hy,0);
			if(((type!=null)?type==spr.type:true)&&
				this.x<spr.x+spr.getWidth()&&
				this.x+this.getWidth()>spr.x&&
				this.y<spr.y+spr.getHeight()&&
				this.y+this.getHeight()>spr.y){
			var d=this.distance(World.map.getSprite(i));
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
			for (var i=0;i<World.map.length;i++){
				var spr=World.map.getSprite(i);
				if(((exception!=null)?exception!=i:true)&&
					this.x<spr.x+spr.getWidth()&&
					this.x+this.getWidth()>spr.x&&
					this.y<spr.y+spr.getHeight()&&
					this.y+this.getHeight()>spr.y){
				var d=this.distance(World.map.getSprite(i));
					if(d<closest){
						collision=i+1;
						closest=d;
					}
				}
			}
			return collision;
		}
		else if(window.cosole)console.error('Data missing in Sprite.collisionMapEx(exception)');
	}

	this.collisionMapRange=function(typeMin,typeMax,hx,hy,exception){
		if(typeMax!=null){
			var collision=0;
			var closest=this.getDiameter()/2;
			for (var i=0;i<World.map.length;i++){
				var spr=World.map.getSprite(i);
				if(hy!=null)spr=new Sprite(spr.x+hx,spr.y+hy,0);
				if(((exception!=null)?exception!=i:true)&&
					spr.type>=typeMin&&
					spr.type<=typeMax&&
					this.x<spr.x+spr.getWidth()&&
					this.x+this.getWidth()>spr.x&&
					this.y<spr.y+spr.getHeight()&&
					this.y+this.getHeight()>spr.y){
				var d=this.distance(World.map.getSprite(i));
					if(d<closest){
						collision=i+1;
						closest=d;
					}
				}
			}
			return collision;
		}
		else if(window.cosole)console.error('Data missing in Sprite.collisionMapRange(typeMin,typeMax[,hotspotX,hotspotY])');
	}

	this.collisionMapSwitch=function(type,newType,hx,hy,exception){
		if(newType!=null){
			var collision=0;
			var closest=this.getDiameter()/2;
			for (var i=0;i<World.map.length;i++){
				var spr=World.map.getSprite(i);
				if(hy!=null)spr=new Sprite(spr.x+hx,spr.y+hy,0);
				if(((exception!=null)?exception!=i:true)&&
					((type!=null)?spr.type==spr.type:true)&&
					this.x<spr.x+spr.getWidth()&&
					this.x+this.getWidth()>spr.x&&
					this.y<spr.y+spr.getHeight()&&
					this.y+this.getHeight()>spr.y){
				var d=this.distance(World.map.getSprite(i));
					if(d<closest){
						if(newType>0){
							collision=i+1;
							spr.type=newType;
						}
						else{
							collision=spr.type;
							World.map.remove(i);
						}
						closest=d;
					}
				}
			}
			return collision;
		}
		else if(window.cosole)console.error('Data missing in Sprite.collisionMapSwitch(type,newType[,hotspotX,hotspotY])');
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
				ctx.rotate(this.rotation*Math.PI/180);
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
	}

	return this;
}
// SpriteSheet.js
function SpriteSheet(_img,_spriteWidth,_spriteHeight){
	this.img;
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
					row=parseInt(col/ipr);
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
			if(isNaN(row)&&img.width){
				var ipr=col>Math.round(img.width/spriteWidth);
				if(window.cosole)console.log('IPR: '+ipr)
				if(col>ipr){
					col=col%ipr;
					row=parseInt(col/ipr);
				}
				else
					row=0;
			}
			ctx.save();
			ctx.translate(spr.getCenterX()+ox-Camera.x,spr.getCenterY()+oy-Camera.y);
			ctx.rotate(spr.rotation*Math.PI/180);
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
			ctx.rotate(spr.rotation*Math.PI/180);
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
	
	return this;
}
//	SpriteVector.js
function SpriteVector(){
	this.addSprite=function(spr_x,y,width,height,type){
		if(isNaN(parseInt(spr_x,10)))
			this.push(spr_x);
		else
			this.push(new Sprite(spr_x,y,width,height,type));
	}

	this.addMap=function(map,cols,width,height,masterSprites){
		if(width!=null){
			height=(isNaN(height))?width:height;
			for(var a=0;a<map.length;a++)
				if(map[a]>0){
					var spr;
					if(masterSprites!=null){
						spr=new Sprite(masterSprites.getSprite(map[a]));
						spr.setOrigin((a%cols)*width,parseInt(a/cols)*height);
						spr.resetPosition();
					}
					else
						spr=new Sprite((a%cols)*width,parseInt(a/cols)*height,width,height);
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
		for(var i=0;i<this.length;++i)
			this[i].move();
	}

	this.collisionBox=function(spr){
		var c=false;
		if(spr!=null){
			for(var i=0;i<this.length;i++)
				if(this[i].collisionBox(spr))
					c=true;
		}
		else if(window.cosole)console.error('Data missing in SpriteVector.collisionBox(spr)');
		return c;
	}

	this.drawSprites=function(ctx,img,ox,oy){
		for(var i=0;i<this.length;++i){
			var tImg;
			if(img!=null&&img instanceof Array)tImg=img[this[i].type];
			else tImg=img;
			this[i].drawSprite(ctx,tImg,ox,oy);
		}
	}

	return this;
}
SpriteVector.prototype=new Array();
//	Util.js
Util=new function(){
	this.getAngle=function(x1,y1,x2,y2){
		if(y2!=null){
			var angle=(Math.atan2(y1-y2,x1-x2))/(Math.PI/180)+90;
			if(angle>360)angle-=360;
			if(angle<0)angle+=360;
			return angle;
		}
		else if(window.cosole)console.error('Data missing in Util.getAngle(x1,y1,x2,y2)');
	}

	this.getDistance=function(x1,y1,x2,y2){
		if(y2!=null){
			var dx=x1-x2;
			var dy=y1-y2;
			return (Math.sqrt(dx*dx+dy*dy));
		}
		else if(window.cosole)console.error('Data missing in Util.getDistance(x1,y1,x2,y2)');
	}

	this.getImage=function(str){
		var img=new Image();
		if(str!=null){
			img.src=str;
		}
		return img;
	}

	this.getAudio=function(str){
		var aud=new Audio();
		if(str!=null){
			if(aud.canPlayType('audio/ogg').replace(/no/,''))
				aud.src=str.substr(0,str.lastIndexOf('.'))+'.oga';
			else
				aud.src=str;
		}
		return aud;
	}

	this.fillTile=function(ctx,img,x,y,repeatx,repeaty){
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

	return this;
}
//	World.js
World=new function(){
	this.width=0;
	this.height=0;
	this.map=new SpriteVector();
	this.loopX=false;
	this.loopY=false;

	this.setMap=function(map,cols,width,height){
		if(width!=null){
			height=(isNaN(height))?width:height;
			this.width=cols*width;
			this.height=Math.ceil(map.length/cols)*height;
			this.map.length=0;
			this.map.addMap(map,cols,width,height);
		}
		else if(window.cosole)console.error('Data missing in World.setMap(map,cols,width[,height])');
	}

	this.setSize=function(width,height){
		if(height!=null){
			this.width=width;
			this.height=height;
		}
		else if(window.cosole)console.error('Data missing in World.setSize(width,height)');
	}

	this.drawMap=function(ctx,img,deviation){
		if(ctx!=null){
			ctx.strokeStyle='#f00';
			ctx.fillStyle='#f00';
			for(var i=0;i<this.map.length;i++){
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
				Mouse.draw(ctx);
			}
		}
		else if(window.cosole)console.error('Data missing in World.drawMap(ctx[,img,imagesPerRow])');
	}

	return this;
}
