/**
 * Canvas Open JavaScript Game Engine
 * @author daPhyre
 * @since 0.1, Tu/12/Jul/11
 * @version 0.7.3, We/21/Nov/12
 */
var stage=null,ctx=null,lastKey=null,lastRelease=null;
var CLICKING=false,ISFULLSCREEN=false,DEBUG=false;
var PRESSING=new Array();
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
function Game(canvasId,autoFull,innerScale){
	var dbuff=document.createElement('canvas');
	var bgcolor='#ccc',bgimg=null,bgfixed=false,interval=16.7;
	var time=0,acumDt=0;
	if(autoFull==null)autoFull=true;
	window.addEventListener('load',init,false);

	function init(){
		if(canvasId==null)canvasId='canvas';
		stage=document.getElementById(canvasId);
		stage.style.cursor='url(\'cursor.png\') 2 2, crosshair';
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
	
	this.getScreenshot=function(){
		window.open(stage.toDataURL());
	}
	
	this.focus=function(spr,offset){
		if(spr!=null){
			offset=(isNaN(offset))?0:offset;
			var pnt=spr.getCenter();
			if(World.width<stage.width)
				World.x=World.width/2-stage.width/2;
			else if (!World.loopX&&(pnt.x-offset<stage.width/2||World.width-offset*2<stage.width))
				World.x=offset;
			else if(!World.loopX&&pnt.x+offset>World.width-stage.width/2)
				World.x=World.width-stage.width-offset;
			else
				World.x=pnt.x-stage.width/2;
			if(World.height<stage.height)
				World.y=World.height/2-stage.height/2;
			else if (!World.loopY&&(pnt.y-offset<stage.height/2||World.height-offset*2<stage.height))
				World.y=offset;
			else if(!World.loopY&&pnt.y+offset>World.height-stage.height/2)
				World.y=World.height-stage.height-offset;
			else
				World.y=pnt.y-stage.height/2;
		}
		else if(window.cosole)console.error('Data missing in Game.focus(spr[,offset])');
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
			if(DEBUG)debug.frames++;
		}
		resize();
		repaint();
		if(DEBUG){
			debug.run(dt);
			debug.paint(ctx);
		}
	}

	function resize(){
		if(autoFull){
			if(screen.width-window.innerWidth<2&&screen.height-window.innerHeight<2)
				ISFULLSCREEN=true;
			else
				ISFULLSCREEN=false;
		}
		if(ISFULLSCREEN){
			var w=window.innerWidth/stage.width;
			var h=window.innerHeight/stage.height;
			World.scale=(innerScale)?Math.max(h,w):Math.min(h,w);
			stage.style.width=(stage.width*World.scale)+'px';
			stage.style.height=(stage.height*World.scale)+'px';
			stage.style.marginLeft=-(stage.width*World.scale)/2+'px';
			stage.style.marginTop=-(stage.height*World.scale)/2+'px';
			stage.style.top='50%';
			stage.style.left='50%';
			stage.style.position='absolute';
			document.body.style.background=bgcolor;
			document.getElementsByTagName('body')[0].style.overflow='hidden';
		}
		else{
			World.scale=1;
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
			else Util.fillTile(g2,bgimg,-World.x,-World.y);
		}
		paint(g2);
		ctx.drawImage(dbuff,0,0,stage.width,stage.height);
	}

	document.addEventListener('keydown',function(evt){
		if(!PRESSING[evt.keyCode])
			lastKey=evt.keyCode;
		PRESSING[evt.keyCode]=true;
		if(lastKey>=37&&lastKey<=40)
			evt.preventDefault();
	},false);

	document.addEventListener('keyup',function(evt){
		lastRelease=evt.keyCode;
		PRESSING[evt.keyCode]=false;
	},false);
	
	function MousePrevent(evt){
		evt.stopPropagation();
		evt.preventDefault();
	}
	
	function MouseDown(evt){
		MousePrevent(evt);
		CLICKING=true;
		if(!PRESSING[evt.button])
			lastKey=evt.button;
		PRESSING[evt.button]=true;
	}
	
	function MouseUp(evt){
		CLICKING=false;
		lastRelease=evt.button;
		PRESSING[evt.button]=false;
	}
	
	function MouseMove(evt){
		Mouse.x=parseInt(evt.pageX+document.body.scrollLeft-stage.offsetLeft)/World.scale*stage.width/stage.width;
		Mouse.y=parseInt(evt.pageY+document.body.scrollTop-stage.offsetTop)/World.scale*stage.height/stage.height;
	}
}
//	Animation.js
function Animation(_img,_frameWidth,_frameHeight,_pause){
	this.frames=new Array();
	this.frame=0;
	this.p=0;
	this.pause=0;
	var frameWidth=0;
	var frameHeight=0;
	var isStrip=false;

	this.set=function(_img,_frameWidth,_frameHeight,_pause){
		if(_frameWidth!=null){
			isStrip=true;
			this.frames.length=0;
			this.frames.push(_img);
			frameWidth=_frameWidth;
			frameHeight=_frameHeight;
			this.pause=isNaN(_pause)?0:_pause;
			return true;
		}
		else{
			if(window.cosole)console.error('Data missing in Animation.set(img,frameWidth[,frameHeight,pause])');
			return false;
		}
	}
	this.set(_img,_frameWidth,_frameHeight,_pause);

	this.length=function(){
		if(isStrip){
			return this.currentFrame().width/frameWidth;
		}
		else
			return this.frames.length;
	}

	this.addFrame=function(img){
		isStrip=false;
		this.frames.push(img);
	}

	this.currentFrame=function(){
		if(isStrip)
			return this.frames[0];
		else
			return this.frames[this.frame];
	}

	this.prevFrame=function(){
		this.p++;
		if(this.p>this.pause){
			this.frame--;
			this.p=0;
		}
		if (this.frame<0)
			this.frame=this.length()-1;
		return this.currentFrame();
	}

	this.nextFrame=function(){
		this.p++;
		if(this.p>this.pause){
			this.frame++;
			this.p=0;
		}
		if(this.frame>this.length()-1)
			this.frame=0;
		return this.currentFrame();
	}

	this.draw=function(ctx,x,y,row){
		if(y!=null){
			ctx.strokeStyle='#0f0';
			if(isStrip){
				var tImg=this.currentFrame();
				if(isNaN(row))
					ctx.drawImage(tImg,frameWidth*this.frame,0,frameWidth,tImg.height,x,y,frameWidth,tImg.height);
				else
					ctx.drawImage(tImg,frameWidth*this.frame,frameHeight*row,frameWidth,frameHeight,x,y,frameWidth,frameHeight);
				if(World.seeCollision)
					ctx.strokeRect(x,y,frameWidth,tImg.height);
			}
			else{
				ctx.drawImage(this.currentFrame(),x,y);
				if(World.seeCollision)
					ctx.strokeRect(x,y,this.currentFrame().width,this.currentFrame().height);
			}
		}
		else if(window.cosole)console.error('Data missing in Animation.draw(ctx,x,y[,row])');
	}
	
	this.drawSprite=function(ctx,spr,ox,oy,row){
		if(spr!=null){
			if(isStrip){
				ox=(isNaN(ox))?0:ox;
				oy=(isNaN(oy))?0:oy;
				var h=(spr.HFlip)?-1:1;
				var v=(spr.VFlip)?-1:1;
				var tImg=this.currentFrame();
				ctx.save();
				if(isNaN(row)){
					ctx.translate(spr.getCenterX()+ox-World.x,spr.getCenterY()+oy-World.y);
					ctx.rotate(spr.rotation*Math.PI/180);
					ctx.scale(spr.scale*h,spr.scale*v);
					ctx.drawImage(tImg,frameWidth*this.frame,0,frameWidth,tImg.height,frameWidth*-0.5,tImg.height*-0.5,frameWidth,tImg.height);
				}
				else{
					ctx.translate(spr.getCenterX()+ox-World.x,spr.getCenterY()+oy-World.y);
					ctx.rotate(spr.rotation*Math.PI/180);
					ctx.scale(spr.scale*h,spr.scale*v);
					ctx.drawImage(tImg,frameWidth*this.frame,frameHeight*row,frameWidth,frameHeight,frameWidth*-0.5,frameHeight*-0.5,frameWidth,frameHeight);
				}
				ctx.restore();
				if(World.seeCollision)
					spr.drawSprite(ctx);
			}
			else{
				spr.drawSprite(ctx,this.currentFrame());
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
	
	this.isPressed=function(){
		return(
			this.x<Mouse.x&&this.x+this.width>Mouse.x&&
			this.y<Mouse.y&&this.y+this.height>Mouse.y
		);
	}
	
	this.draw=function(ctx,img,ox,oy){
		if(ctx!=null){
			if(img!=null){
				ox=(isNaN(ox))?0:ox;
				oy=(isNaN(oy))?0:oy;
				ctx.drawImage(img,this.x+ox,this.y+oy);
			}
			if(img==null||World.seeCollision){
				ctx.strokeStyle='#fff';
				ctx.strokeRect(this.x,this.y,this.width,this.height);
			}
		}
		else if(window.cosole)console.error('Data missing in Button.draw(ctx[,img,offsetX,offsetY])');
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
function Particle(_x,_y,_diameter,_maxAge,_speed,_angle,_colorStart,_colorEnd){
	this.x=0;
	this.y=0;
	this.ox=0;
	this.oy=0;
	this.diameter=0;
	this.age=0;
	this.maxAge=0;
	this.speed=0;
	this.angle=0;
	this.rotation=0;
	this.color='#000';
	this.colorList=new Array();

	this.set=function(_x,_y,_diameter,_maxAge,_speed,_angle,_colorStart,_colorEnd){
		if(_colorStart!=null){
			this.x=_x;
			this.y=_y;
			this.ox=_x;
			this.oy=_y;
			this.diameter=_diameter+1;
			this.maxAge=_maxAge;
			this.speed=_speed;
			this.angle=_angle;
			this.rotation=_angle;
			this.color=_colorStart;
			
			if(_colorEnd!=null){
				var cStart=hex2rgb(_colorStart);
				var cEnd=hex2rgb(_colorEnd);
				var red=(cStart[0]-cEnd[0])/(_maxAge+1);
				var green=(cStart[1]-cEnd[1])/(_maxAge+1);
				var blue=(cStart[2]-cEnd[2])/(_maxAge+1);
				for (var i=0;i<_maxAge;i++)
					this.colorList.push(rgb2hex(cStart[0]-(i*red),cStart[1]-(i*green),cStart[2]-(i*blue)));
			}
			return true;
		}
		else{
			if(window.cosole)console.error('Data missing in Particle.set(x,y,diameter,maxAge,speed,angle,colorStart[,colorEnd])');
			return false;
		}
	}
	this.set(_x,_y,_diameter,_maxAge,_speed,_angle,_colorStart,_colorEnd);

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

	this.addParticle=function(p_x,y,diameter,maxAge,speed,angle,colorStart,colorEnd){
		if(isNaN(parseInt(p_x,10)))
			this.push(p_x);
		else
			this.push(new Particle(p_x,y,diameter,maxAge,speed,angle,colorStart,colorEnd));
	}

	this.moveParticles=function(){
		for(var i=0;i<this.length;++i){
			if (this[i].age<this[i].maxAge){
				this[i].x+=this[i].speed*(Math.cos(this[i].angle*(Math.PI/180)))+this.wind*this[i].age;
				this[i].y+=this[i].speed*(Math.sin(this[i].angle*(Math.PI/180)))+this.gravity*this[i].age;
				this[i].age++;
				if(this[i].colorList.length>0)
					this[i].color=this[i].colorList.shift();
			}
			else this.splice(i--,1);
		}
	}

	this.moveParticlesO=function(){
		for(var i=0;i<this.length;++i){
			if (this[i].age<this[i].maxAge){
				this[i].ox=this[i].x;
				this[i].oy=this[i].y;
				var piRad=(Math.PI/180);
				this[i].x+=this[i].speed*(Math.cos(this[i].angle*piRad))+this.wind*this[i].age;
				this[i].y+=this[i].speed*(Math.sin(this[i].angle*piRad))+this.gravity*this[i].age;
				this[i].age++;
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
				if(alpha)ctx.globalAlpha=1-this[i].age/this[i].maxAge;
				ctx.translate(this[i].x-World.x,this[i].y-World.y);
				ctx.rotate(this[i].rotation*Math.PI/180);
				ctx.drawImage(img,img.width*-0.5,img.height*-0.5);
				ctx.restore();
			}
		}
		else if(ctx!=null){
			for(var i=0;i<this.length;++i){
				ctx.fillStyle=this[i].color;
				ctx.save();
				if(alpha)ctx.globalAlpha=1-this[i].age/this[i].maxAge;
				ctx.beginPath();
				ctx.arc(this[i].x-World.x,this[i].y-World.y,this[i].diameter/2,0,Math.PI*2,true);
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
				if(alpha)ctx.globalAlpha=1-this[i].age/this[i].maxAge;
				ctx.beginPath();
				ctx.moveTo(this[i].ox,this[i].oy);
				ctx.lineTo(this[i].x,this[i].y);
				ctx.closePath();
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(this[i].x-World.x,this[i].y-World.y,this[i].diameter/2,0,Math.PI*2,true);
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
	this.VFlip=false;
	this.HFlip=false;

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
		for (var i=0;i<World.map.length;i++){
			var spr=World.map.getSprite(i);
			if(hy!=null)spr=new Sprite(spr.x+hx,spr.y+hy,0);
			if(((type!=null)?type==spr.type:true)&&
				this.x<spr.x+spr.getWidth()&&
				this.x+this.getWidth()>spr.x&&
				this.y<spr.y+spr.getHeight()&&
				this.y+this.getHeight()>spr.y)
			collision=spr.type;
		}
		return collision;
	}

	this.collisionMapEx=function(exception){
		var collision=0;
		for (var i=0;i<World.map.length;i++){
			var spr=World.map.getSprite(i);
			if(((exception!=null)?exception!=i:true)&&
				this.x<spr.x+spr.getWidth()&&
				this.x+this.getWidth()>spr.x&&
				this.y<spr.y+spr.getHeight()&&
				this.y+this.getHeight()>spr.y)
			collision=spr.type;
		}
		return collision;
	}

	this.collisionMapRange=function(typeMin,typeMax,hx,hy,exception){
		if(typeMax!=null){
			var collision=0;
			for (var i=0;i<World.map.length;i++){
				var spr=World.map.getSprite(i);
				if(hy!=null)spr=new Sprite(spr.x+hx,spr.y+hy,0);
				if(((exception!=null)?exception!=i:true)&&
					spr.type>=typeMin&&
					spr.type<=typeMax&&
					this.x<spr.x+spr.getWidth()&&
					this.x+this.getWidth()>spr.x&&
					this.y<spr.y+spr.getHeight()&&
					this.y+this.getHeight()>spr.y)
				collision=spr.type;
			}
			return collision;
		}
		else if(window.cosole)console.error('Data missing in Sprite.collisionMapRange(typeMin,typeMax[,hotspotX,hotspotY])');
	}

	this.collisionMapSwitch=function(type,newType,hx,hy,exception){
		if(newType!=null){
			var collision=0;
			for (var i=0;i<World.map.length;i++){
				var spr=World.map.getSprite(i);
				if(hy!=null)spr=new Sprite(spr.x+hx,spr.y+hy,0);
				if(((exception!=null)?exception!=i:true)&&
					((type!=null)?spr.type==spr.type:true)&&
					this.x<spr.x+spr.getWidth()&&
					this.x+this.getWidth()>spr.x&&
					this.y<spr.y+spr.getHeight()&&
					this.y+this.getHeight()>spr.y){
						collision=spr.type;
						if(newType>0)spr.type=newType;
						else World.map.remove(i);
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
				var h=(this.HFlip)?-1:1;
				var v=(this.VFlip)?-1:1;
				ctx.save();
				ctx.translate(this.getCenterX()+ox-World.x,this.getCenterY()+oy-World.y);
				ctx.rotate(this.rotation*Math.PI/180);
				ctx.scale(this.scale*h,this.scale*v);
				ctx.drawImage(img,img.width*-0.5,img.height*-0.5);
				ctx.restore();
			}
			if(img==null||World.seeCollision){
				var c=this.getCenter();
				ctx.strokeStyle='#0f0';
				ctx.strokeRect(this.x-World.x,this.y-World.y,this.width*this.scale,this.height*this.scale);
				ctx.strokeStyle='#0ff';
				ctx.beginPath();
				ctx.arc(c.x-World.x,c.y-World.y,Math.min(this.width,this.height)*this.scale/2,0,Math.PI*2,true);
				ctx.closePath();
				ctx.stroke();
				ctx.strokeStyle='#00f';
				ctx.beginPath();
				ctx.arc(c.x-World.x,c.y-World.y,Math.max(this.width,this.height)*this.scale/2,0,Math.PI*2,true);
				ctx.closePath();
				ctx.stroke();
			}
		}
		else if(window.cosole)console.error('Data missing in Sprite.drawSprite(ctx[,img,offsetX,offsetY])');
	}

	return this;
}
// SpriteMap.js
function SpriteMap(_img,_spriteWidth,_spriteHeight){
	this.img;
	var spriteWidth;
	var spriteHeight;
	
	this.set=function(_img,_spriteWidth,_spriteHeight){
		if(_spriteWidth!=null){
			this.img=_img;
			spriteWidth=_spriteWidth;
			spriteHeight=(_spriteHeight==null)?_spriteWidth:_spriteHeight;
		}
		else if(window.cosole)console.error('Data missing in SpriteMap.set(image,spriteWidth[,spriteHeight])');
	}
	this.set(_img,_spriteWidth,_spriteHeight);
	
	this.draw=function(ctx,x,y,col,row){
		if(y!=null){
			col=(isNaN(col))?0:col;
			row=(isNaN(row))?0:row;
			ctx.drawImage(this.img,col*spriteWidth,row*spriteHeight,spriteWidth,spriteHeight,x,y,spriteWidth,spriteHeight);
		}
		else if(window.cosole)console.error('Data missing in SpriteImage.draw(ctx,x,y[,col,row])');
	}
	
	this.drawSprite=function(ctx,spr,col,row,ox,oy){
		if(spr!=null){
			col=(isNaN(col))?0:col;
			row=(isNaN(row))?0:row;
			ox=(isNaN(ox))?0:ox;
			oy=(isNaN(oy))?0:oy;
			var h=(spr.HFlip)?-1:1;
			var v=(spr.VFlip)?-1:1;
			ctx.save();
			ctx.translate(spr.getCenterX()+ox-World.x,spr.getCenterY()+oy-World.y);
			ctx.rotate(spr.rotation*Math.PI/180);
			ctx.scale(spr.scale*h,spr.scale*v);
			try{
				ctx.drawImage(this.img,spriteWidth*col,spriteHeight*row,spriteWidth,spriteHeight,spriteWidth*-0.5,spriteHeight*-0.5,spriteWidth,spriteHeight);
			}
			catch(e){if(window.console)console.error(e+' Coords: '+col+','+row);}
			ctx.restore();
			if(World.seeCollision)
				spr.drawSprite(ctx);
		}
		else if(window.cosole)console.error('Data missing in SpriteImage.drawSprite(ctx,spr[,col,row,offsetX,offsetY])');
	}
	
	this.drawSpriteArea=function(ctx,spr,ax,ay,aw,ah,ox,oy){
		if(ah!=null){
			ox=(isNaN(ox))?0:ox;
			oy=(isNaN(oy))?0:oy;
			var h=(spr.HFlip)?-1:1;
			var v=(spr.VFlip)?-1:1;
			ctx.save();
			ctx.translate(spr.getCenterX()+ox-World.x,spr.getCenterY()+oy-World.y);
			ctx.rotate(spr.rotation*Math.PI/180);
			ctx.scale(spr.scale*h,spr.scale*v);
			try{
				ctx.drawImage(this.img,ax,ay,aw,ah,aw*-0.5,ah*-0.5,aw,ah);
			}
			catch(e){if(window.console)console.error(e+' Coords: '+ax+','+ay+','+aw+','+ah);}
			ctx.restore();
			if(World.seeCollision)
				spr.drawSprite(ctx);
		}
		else if(window.cosole)console.error('Data missing in SpriteImage.drawSprite(ctx,spr,areaX,areaY,areaWidth,areaHeight[,offsetX,offsetY])');
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

	this.addMap=function(map,cols,width,height,sprVctr){
		if(width!=null){
			height=(isNaN(height))?width:height;
			for(var a=0;a<map.length;a++)
				if(map[a]>0){
					var spr;
					if(sprVctr!=null){
						spr=new Sprite(sprVctr.getSprite(map[a]));
						spr.setOrigin((a%cols)*width,parseInt(a/cols)*height);
						spr.resetPosition();
					}
					else
						spr=new Sprite((a%cols)*width,parseInt(a/cols)*height,width,height);
					spr.type=map[a];
					this.addSprite(spr);
				}
		}
		else if(window.cosole)console.error('Data missing in SpriteVector.addMap(map,cols,width[,height,sprVctr])');
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
	this.x=0;
	this.y=0;
	this.width=0;
	this.height=0;
	this.scale=1;
	this.map=new SpriteVector();
	this.seeCollision=false;
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

	this.drawMap=function(ctx,img,ipr,deviation){
		if(ctx!=null){
			ctx.strokeStyle='#f00';
			for(var i=0;i<this.map.length;i++){
				var spr=this.map[i];
				if(img!=null){
					var de=(deviation)?spr.type+spr.var1:spr.type;
					if(img instanceof SpriteMap){
						var col=de;
						var row=0;
						if(!isNaN(ipr)){
							col=de%ipr;
							row=parseInt(de/ipr);
						}
						img.draw(ctx,spr.x-this.x,spr.y-this.y,col,row);
						if(this.loopX){
							if(this.x<0)img.draw(ctx,spr.x-this.width-this.x,spr.y-this.y,col,row);
							else img.draw(ctx,spr.x+this.width-this.x,spr.y-this.y,col,row);
						}
						if(this.loopY){
							if(this.y<0)img.draw(ctx,spr.x-this.x,spr.y-this.height-this.y,col,row);
							else img.draw(ctx,spr.x-this.x,spr.y+this.height-this.y,col,row);
						}
					}
					else{
						var tImg;
						if(img instanceof Array)tImg=img[de];
						else tImg=img;
						ctx.drawImage(tImg,spr.x-this.x,spr.y-this.y);
						if(this.loopX){
							if(this.x<0)ctx.drawImage(tImg,spr.x-this.width-this.x,spr.y-this.y);
							else ctx.drawImage(tImg,spr.x+this.width-this.x,spr.y-this.y);
						}
						if(this.loopY){
							if(this.y<0)ctx.drawImage(tImg,spr.x-this.x,spr.y-this.height-this.y);
							else ctx.drawImage(tImg,spr.x-this.x,spr.y+this.height-this.y);
						}
					}
				}
				if(img==null||this.seeCollision)
					ctx.strokeRect(spr.x-this.x,spr.y-this.y,spr.width,spr.height);
			}
			if(this.seeCollision){
				ctx.strokeStyle='#999';
				ctx.strokeRect(-this.x,-this.y,this.width,this.height);
				Mouse.draw(ctx);
			}
		}
		else if(window.cosole)console.error('Data missing in World.drawMap(ctx[,img,imagesPerRow])');
	}

	return this;
}
