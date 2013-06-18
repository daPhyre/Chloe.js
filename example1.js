/**
 * COJSGE Test - maze-bas.js
 * @author daPhyre
 * @since 1.0, We/10/Aug/11
 * @license CC-by-sa: http://creativecommons.org/licenses/by-sa/3.0/
 */
"use strict";
var myGame=new Game('canvas',FULLSCREEN_NORMAL,true,true);

function onReady(){
	var SquareUnit=40;
	var pause;
	var player=new Sprite(380,300,SquareUnit);
	var enemy=[];
	var buttons=[];
	var colliding=false,scaleChange=false;
	var drawLastPress=null,drawLastRelease=null;
	var iPlayer,iEnemy;
	var sMap,sButtons;
	var ps=new ParticleSystem();
	var map1=[
		1,1,0,0,0,0,0,3,3,0,0,3,3,0,0,0,0,0,1,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,1,1,2,2,0,0,0,0,2,2,1,1,0,0,0,0,
		0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,
		2,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,2,
		2,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,2,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		2,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,2,
		2,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3,0,0,0,2,
		0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,
		0,0,0,0,1,1,2,2,0,0,0,0,2,2,1,1,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,1,0,0,0,0,0,3,3,0,0,3,3,0,0,0,0,0,1,1
	];

	myGame.setBackground('#000',Util.getImage('media/grass.png'),false);
	
	World.setMap(map1,20,SquareUnit);
	for(var i=0;i<3;i++)
		enemy[i]=new Sprite(300*i+80,160,SquareUnit);
	
	buttons[0]=new Button(40,240,SquareUnit);
	buttons[1]=new Button(80,240,SquareUnit);
	buttons[2]=new Button(40,280,SquareUnit);
	buttons[3]=new Button(80,280,SquareUnit);
	buttons[4]=new Button(500,260,SquareUnit);
	buttons[5]=new Button(560,240,SquareUnit);

	iPlayer=Util.getImage('media/player.png');
	iEnemy=Util.getImage('media/enemy.png');
	sMap=new SpriteSheet(Util.getImage('media/map.png'),40);
	sButtons=new SpriteSheet(Util.getImage('media/buttons.png'),40);
	
	Input.enableKeyboard();
	Input.enableMouse();
	Input.enableTouch();
	Input.enableAcceleration();
	Input.enableOrientation();

	game=function(){
		if(!pause){
			// Paint lastPress and lastRelease
			if(Input.lastPress!=null)
				drawLastPress=Input.lastPress;
			if(Input.lastRelease!=null)
				drawLastRelease=Input.lastRelease;
			
			player.vy=0;
			player.vx=0;
			
			// Setplayer movement (keyboard)
			if(Input.pressing[KEY_UP]){
				player.vflip=true;
				player.vy=-SquareUnit/8;
			}
			if(Input.pressing[KEY_DOWN]){
				player.vflip=false;
				player.vy=SquareUnit/8;
			}
			if(Input.pressing[KEY_LEFT]){
				player.hflip=true;
				player.vx=-SquareUnit/8;
			}
			if(Input.pressing[KEY_RIGHT]){
				player.hflip=false;
				player.vx=SquareUnit/8;
			}
			
			// Set player movement (touchscreen)
			if(buttons[0].touch()){	// UP-LEFT
				player.vflip=true;
				player.hflip=true;
				player.vy=-SquareUnit/8;
				player.vx=-SquareUnit/8;
			}
			if(buttons[1].touch()){	// UP-RIGHT
				player.vflip=true;
				player.hflip=false;
				player.vy=-SquareUnit/8;
				player.vx=SquareUnit/8;
			}
			if(buttons[2].touch()){	// DOWN-LEFT
				player.vflip=false;
				player.hflip=true;
				player.vy=SquareUnit/8;
				player.vx=-SquareUnit/8;
			}
			if(buttons[3].touch()){	// DOWN-RIGHT
				player.vflip=false;
				player.hflip=false;
				player.vy=SquareUnit/8;
				player.vx=SquareUnit/8;
			}
			
			// Move the player
			player.x+=player.vx;
			if(player.collisionMap(1)||player.collisionMap(2))
				player.x-=player.vx;
			
			player.y+=player.vy;
			if(player.collisionMap(1)||player.collisionMap(3))
				player.y-=player.vy;
			
			// Out of Screen
			if(player.x<0)
				player.x=0;
			if(player.x>World.width-player.getWidth())
				player.x=World.width-player.getWidth();
			
			if(player.y<0)
				player.y=0;
			if(player.y>World.height-player.getHeight())
				player.y=World.height-player.getHeight();

			// Focus to player
			Camera.focus(player);
			//Camera.focus(player,1,20);
			
			// Move particles
			ps.moveParticles();

			// Enemy rotates
			for(var i=0;i<3;i++)
				enemy[i].rotation=45+Util.getAngle(enemy[i].getCenterX(),enemy[i].getCenterY(),Input.mouse.x+Camera.x,Input.mouse.y+Camera.y);

			// Detects if collides
			colliding=false;
			for(var i=0;i<3;i++){
				if(player.collisionCircle(enemy[i])){
					colliding = true;
					for (var j=0;j<10;j++)
						ps.unshift(new Particle(player.getCenterX(),player.getCenterY(),1,24,random(2),random(360),'#ff0'))//,'#00f'));
				}
			}

			// Grows or Shrinks
			var lastPressMinus=(buttons[4].touch()&&Input.lastPress==MOUSE_BUTTON_LEFT);
			var lastPressPlus=(buttons[5].touch()&&Input.lastPress==MOUSE_BUTTON_LEFT);
			
			if ((lastPressMinus||Input.lastPress==KEY_COMMA)&&player.scale>0.1)
				player.scale-=0.1;
			if ((lastPressPlus||Input.lastPress==KEY_DOT)&&player.scale<2)
				player.scale+=0.1;
		}
		// Pause/Unpause
		if(Input.lastPress==KEY_ENTER)
			pause=!pause;
		// Show/Hide screen debug
		if(Input.lastPress==KEY_K)
			screenDebug=!screenDebug;
		// ScreenShot
		if(Input.lastPress==KEY_P){
			if(Input.pressing[KEY_ALT])
				myGame.getScreenshot();
		}
		// Reset lastPress and lastRelease
		Input.lastPress=null;
		Input.lastRelease=null;
	};

	paint=function(ctx){
		World.drawMap(ctx,sMap);
		player.drawSprite(ctx,iPlayer);
		for(var i=0;i<3;i++)
			enemy[i].drawSprite(ctx,iEnemy);
		ps.drawParticles(ctx,true);
		//ps.drawParticles(ctx,true,iPlayer);
		
		for(var i=0,l=buttons.length;i<l;i++){
			if(buttons[i].mouseOver())
				ctx.globalAlpha=0.7;
			else
				ctx.globalAlpha=0.5;
			sButtons.draw(ctx,buttons[i].x,buttons[i].y,i);
		}
		ctx.globalAlpha=1;
		
		ctx.fillStyle='#fff';
		Input.mouse.draw(ctx);
		for(var i=0,l=Input.touches.length;i<l;i++){
			Input.touches[i].draw(ctx);
			ctx.fillText('T'+i+': '+(Input.touches[i].x+Camera.x)+','+(Input.touches[i].y+Camera.y),stage.width-60,40+i*10);
		}
		
		ctx.fillStyle='#fff';
		if(colliding)
			ctx.fillText ('COLLISION!!',270,220);
		if(Input.pressing[MOUSE_BUTTON_LEFT])
			ctx.fillText ('Mouse Pressing',260,10);
		ctx.fillText('P: '+player.x+','+player.y,10,10);
		ctx.fillText('K: '+drawLastPress,10,20);
		ctx.fillText('R: '+drawLastRelease,10,30);
		ctx.fillText('M: '+(Input.mouse.x+Camera.x)+','+(Input.mouse.y+Camera.y),10,40);
		ctx.fillText('Mobile:',stage.width-60,10);
		ctx.fillText('A: '+~~Input.acceleration.x+','+~~Input.acceleration.y+','+~~Input.acceleration.z,stage.width-60,20);
		ctx.fillText('O: '+~~Input.orientation.alpha+','+~~Input.orientation.beta+','+~~Input.orientation.gamma,stage.width-60,30);
		//Intructions
		ctx.fillText('Move with arrows',10,stage.height-30);
		ctx.fillText('Shrink with < or ,',10,stage.height-20);
		ctx.fillText('Grow with > or .',10,stage.height-10);
		if(pause){
			ctx.fillStyle='rgba(0,0,0,0.8)';
			ctx.fillRect(0,0,stage.width,stage.height);
			ctx.fillStyle='#fff';
			ctx.textAlign='center';
			ctx.fillText('PAUSE',stage.width/2,stage.height/2);
			ctx.fillText('Press Enter',stage.width/2,stage.height/2+10);
			ctx.textAlign='right';
			ctx.fillText('Programmed by daPhyre',stage.width,stage.height-20);
			ctx.fillText('© COJSGE Project, 2011-2013',stage.width,stage.height-4);
			ctx.textAlign='left';
		}
	};
}