/**
 * COJSGE Test - maze-bas.js
 * @author daPhyre
 * @since 1.0, We/10/Aug/11
 * @license CC-by-sa: http://creativecommons.org/licenses/by-sa/3.0/
 */
"use strict";
var myGame=new Game('canvas',true,FULLSCREEN_NORMAL);

function onReady(){
	var SquareUnit=40;
	var pause;
	var player=new Sprite(380,300,SquareUnit);
	var enemy=[];
	var colliding=false;
	var drawLastPress=null,drawLastRelease=null;
	var iPlayer,iEnemy;
	var sMap;
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
		enemy[i]=new Sprite(300*i+80,160,40);

	iPlayer=Util.getImage('media/player.png');
	iEnemy=Util.getImage('media/enemy.png');
	sMap=new SpriteSheet(Util.getImage('media/map.png'),40);

	game=function(){
		if(!pause){
			// Paint lastPress and lastRelease
			if(lastPress!=null)
				drawLastPress=lastPress;
			if(lastRelease!=null)
				drawLastRelease=lastRelease;
			
			// Move the player
			if(pressing[KEY_UP]){
				player.vflip=true;
				if(player.y>0)
					player.y-=SquareUnit/8;
				if(player.collisionMap(1)||player.collisionMap(3))
					player.y+=SquareUnit/8;
			}
			if(pressing[KEY_DOWN]){
				player.vflip=false;
				if(player.y<World.height-player.getHeight())
					player.y+=SquareUnit/8;
				if(player.collisionMap(1)||player.collisionMap(3))
					player.y-=SquareUnit/8;
			}
			if(pressing[KEY_LEFT]){
				player.hflip=true;
				if(player.x>0)
					player.x-=SquareUnit/8;
				if(player.collisionMap(1)||player.collisionMap(2))
					player.x+=SquareUnit/8;
			}
			if(pressing[KEY_RIGHT]){
				player.hflip=false;
				if(player.x<World.width-player.getWidth())
					player.x+=SquareUnit/8;
				if(player.collisionMap(1)||player.collisionMap(2))
					player.x-=SquareUnit/8;
			}

			// Focus to player
			Camera.focus(player);
			//Camera.focus(player,1,20);
			
			// Move particles
			ps.moveParticles();

			// Enemy rotates
			for(var i=0;i<3;i++)
				enemy[i].rotation=45+Util.getAngle(enemy[i].getCenterX(),enemy[i].getCenterY(),Mouse.x+Camera.x,Mouse.y+Camera.y);

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
			if (lastPress==KEY_DOT&&player.scale<2)
				player.scale+=0.1;
			if (lastPress==KEY_COMMA&&player.scale>0.1)
				player.scale-=0.1;
		}
		// Pause/Unpause
		if(lastPress==KEY_ENTER)
			pause=!pause;
		// Show/Hide screen debug
		if(lastPress==KEY_K)
			screenDebug=!screenDebug;
		// ScreenShot
		if(lastPress==KEY_P){
			if(pressing[KEY_ALT])
				myGame.getScreenshot();
		}
		// Reset lastPress and lastRelease
		lastPress=null;
		lastRelease=null;
	};

	paint=function(ctx){
		World.drawMap(ctx,sMap);
		//ctx.save();
		//ctx.globalAlpha=0.5;
		player.drawSprite(ctx,iPlayer);
		//ctx.restore();
		for(var i=0;i<3;i++)
			enemy[i].drawSprite(ctx,iEnemy);
		ps.drawParticles(ctx,true);
		//ps.drawParticles(ctx,true,iPlayer);
		
		Mouse.draw(ctx);
		
		ctx.fillStyle='#fff';
		if(colliding)
			ctx.fillText ('COLLISION!!',270,220);
		if(pressing[MOUSE_BUTTON_LEFT])
			ctx.fillText ('Mouse Pressing',260,10);
		ctx.fillText('P: '+player.x+','+player.y,10,10);
		ctx.fillText('M: '+(Mouse.x+Camera.x)+','+(Mouse.y+Camera.y),10,20);
		ctx.fillText('K: '+drawLastPress,10,30);
		ctx.fillText('R: '+drawLastRelease,10,40);
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
			ctx.fillText('© COJSGE Project, 2011',stage.width,stage.height-4);
			ctx.textAlign='left';
		}
	};
}