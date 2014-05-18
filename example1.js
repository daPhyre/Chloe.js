/**
 * COJSGE Test - maze-bas.js
 * @author daPhyre
 * @since 1.0, We/10/Aug/11
 * @license CC-by-sa: http://creativecommons.org/licenses/by-sa/3.0/
 */
'use strict';
var cv=new Canvas(640,360,'canvas',FULLSCREEN_NORMAL,true,true);

cv.onReady=function(){
	var SquareUnit=40;
	var pause;
	var scGame=new Scene();
	var player=new Sprite(380,300,SquareUnit);
	var enemy=[];
	var buttons=[];
	var colliding=false;
	var drawLastPress=null,drawLastRelease=null;
	var iPlayer,iEnemy;
	var sMap,sButtons;
	var aBox;
	var ps=new ParticleSystem();
	var map1=[20,
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

	cv.setBackground('#000',Util.getImage('media/grass.png'),false);
	//cv.setInterval(1000/20);
	//cv.setAsync(false);
	
	World.setMap(map1,SquareUnit);
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
	aBox=new Animation(20,Util.getImage('media/anim.png'),40);
	
	aBox.play(5,2);
	
	Input.enableKeyboard();
	Input.enableMouse();
	Input.enableTouch();
	Input.enableAcceleration();
	Input.enableOrientation();

	scGame.act=function(deltaTime){
		if(!pause){
			// Paint lastPress and lastRelease
			if(Input.lastPress!=null)
				drawLastPress=Input.lastPress;
			if(Input.lastRelease!=null)
				drawLastRelease=Input.lastRelease;
			
			player.vy=0;
			player.vx=0;
			
			// Setplayer movement (keyboard)
			if(Input.pressing[KEY_UP] || Input.pressing[KEY_W]){
				player.vflip=true;
				player.vy=-SquareUnit/8;
			}
			if(Input.pressing[KEY_DOWN] || Input.pressing[KEY_S]){
				player.vflip=false;
				player.vy=SquareUnit/8;
			}
			if(Input.pressing[KEY_LEFT] || Input.pressing[KEY_A]){
				player.hflip=true;
				player.vx=-SquareUnit/8;
			}
			if(Input.pressing[KEY_RIGHT] || Input.pressing[KEY_D]){
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
			if(player.left<0)
				player.left=0;
			if(player.right>World.width)
				player.right=World.width;

			if(player.top<0)
				player.top=0;
			if(player.bottom>World.height)
				player.bottom=World.height;
			
			// Focus to player
			World.cam.focus(player);
			//World.cam.focus(player,1,20);

			// Enemy rotates
			for(var i=0;i<3;i++)
				enemy[i].rotation=45+Util.getAngle(enemy[i].x,enemy[i].y,Input.mouse.x+World.cam.x,Input.mouse.y+World.cam.y);

			// Detects if collides
			colliding=false;
			for(var i=0;i<3;i++){
				if(player.collisionCircle(enemy[i])){
					colliding = true;
					for (var j=0;j<10;j++)
						ps.unshift(new Particle(player.x,player.y,1,0.5,Util.random(100),Util.random(360),'#ff0'))//,'#00f'));
				}
			}

			// Grows or Shrinks
			if ((buttons[4].tap()||Input.lastPress==KEY_COMMA)&&player.scale>0.1)
				player.scale-=0.1;
			if ((buttons[5].tap()||Input.lastPress==KEY_DOT)&&player.scale<2)
				player.scale+=0.1;
		}
		// Pause/Unpause
		if(Input.lastPress==KEY_ENTER)
			pause=!pause;
		// Toggle canvas fullscreen quality
		if(Input.lastPress==KEY_I)
			cv.imageSmoothingEnabled=!cv.imageSmoothingEnabled;
		// Show/Hide screen debug
		if(Input.lastPress==KEY_K)
			cv.toggleScreenDebug();
		// ScreenShot
		if(Input.lastPress==KEY_P){
			if(Input.pressing[KEY_ALT])
				cv.getScreenshot();
		}
	};

	scGame.paint=function(ctx){
		// Draw Game
		World.drawMap(ctx,sMap);
		player.drawSprite(ctx,iPlayer);
		for(var i=0;i<3;i++)
			enemy[i].drawSprite(ctx,iEnemy);
		ps.drawParticles(ctx,true);
		//ps.drawParticles(ctx,true,iPlayer);
		if(aBox.isPlaying())
			aBox.draw(ctx,300,320);
		
		// Draw Buttons
		for(var i=0,l=buttons.length;i<l;i++){
			if(buttons[i].over())
				ctx.globalAlpha=0.7;
			else
				ctx.globalAlpha=0.5;
			sButtons.draw(ctx,buttons[i].x,buttons[i].y,i);
		}
		ctx.globalAlpha=1;
		
		// Draw Touches & Mouse
		ctx.fillStyle='#fff';
		for(var i=0,l=Input.touches.length;i<l;i++){
			Input.touches[i].draw(ctx);
			ctx.fillText('T'+i+': '+(Input.touches[i].x+World.cam.x)+','+(Input.touches[i].y+World.cam.y),cv.view.width-60,40+i*10);
		}
		Input.mouse.draw(ctx);
		
		// Draw Screen Text
		ctx.fillStyle='#fff';
		if(colliding)
			ctx.fillText ('COLLISION!!',270,220);
		if(Input.mouse.move)
			ctx.fillText ('Mouse Moving',260,10);
		if(Input.pressing[MOUSE_BUTTON_LEFT])
			ctx.fillText ('Mouse Pressing',260,10);
		ctx.fillText('P: '+player.x+','+player.y,10,10);
		ctx.fillText('K: '+drawLastPress,10,20);
		ctx.fillText('R: '+drawLastRelease,10,30);
		ctx.fillText('M: '+(Input.mouse.x+World.cam.x)+','+(Input.mouse.y+World.cam.y),10,40);
		ctx.fillText('Mobile:',cv.view.width-60,10);
		ctx.fillText('A: '+~~Input.acceleration.x+','+~~Input.acceleration.y+','+~~Input.acceleration.z,cv.view.width-60,20);
		ctx.fillText('O: '+~~Input.orientation.alpha+','+~~Input.orientation.beta+','+~~Input.orientation.gamma,cv.view.width-60,30);
		//Intructions
		ctx.fillText('Move with arrows',10,cv.view.height-30);
		ctx.fillText('Shrink with < or ,',10,cv.view.height-20);
		ctx.fillText('Grow with > or .',10,cv.view.height-10);
		if(pause){
			ctx.fillStyle='rgba(0,0,0,0.8)';
			ctx.fillRect(0,0,cv.view.width,cv.view.height);
			ctx.fillStyle='#fff';
			ctx.textAlign='center';
			ctx.fillText('PAUSE',cv.view.width/2,cv.view.height/2);
			ctx.fillText('Press Enter',cv.view.width/2,cv.view.height/2+10);
			ctx.textAlign='right';
			ctx.fillText('Programmed by daPhyre',cv.view.width,cv.view.height-20);
			ctx.fillText('© COJSGE Project, 2011-2013',cv.view.width,cv.view.height-4);
			ctx.textAlign='left';
		}
	};
};