/**
 * COJSGE Test - maze-bas.js
 * @author daPhyre
 * @since 1.0, We/10/Aug/11
 * @license CC-by-sa: http://creativecommons.org/licenses/by-sa/3.0/
 */
var myGame=new Game('canvas');

function onReady(){
	var SU=40;
	var PAUSE;
	var player=new Sprite(300,220,SU);
	var enemy=new Array();
	var colliding=false;
	var drawLastKey=null,drawLastRelease=null;
	var iPlayer,iEnemy,iBlocks=new Array();
	var ps=new ParticleSystem();
	var map1=[
		 1,0,0,0,0,0,2,2,2,2,0,0,0,0,0,1,
		 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		 0,0,0,1,1,3,3,0,0,3,3,1,1,0,0,0,
		 0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,
		 3,0,0,2,0,0,0,0,0,0,0,0,2,0,0,3,
		 3,0,0,2,0,0,0,0,0,0,0,0,2,0,0,3,
		 3,0,0,2,0,0,0,0,0,0,0,0,2,0,0,3,
		 3,0,0,2,0,0,0,0,0,0,0,0,2,0,0,3,
		 0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,
		 0,0,0,1,1,3,3,0,0,3,3,1,1,0,0,0,
		 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		 1,0,0,0,0,0,2,2,2,2,0,0,0,0,0,1
	];

	myGame.setBackground('#000',Util.getImage('media/grass.png'),false);
	
	World.setMap(map1,16,SU);
	for(var i=0;i<3;i++)
		enemy[i]=new Sprite(300*i,80,40);

	iPlayer=Util.getImage('media/player.png');
	iEnemy=Util.getImage('media/enemy.png');
	
	iBlocks[1]=Util.getImage('media/block.png');
	iBlocks[2]=Util.getImage('media/lr.png');
	iBlocks[3]=Util.getImage('media/ud.png');

	game=function(){
		if(!PAUSE){
			if(lastKey!=null)
				drawLastKey=lastKey;
			if(lastRelease!=null)
				drawLastRelease=lastRelease;
		
			if(PRESSING[38]){ //↑
				player.VFlip=true;
				if(player.y>0)
					player.y-=SU/8;
				if(player.collisionMap(1)||player.collisionMap(2))
					player.y+=SU/8;
			}
			if(PRESSING[40]){ //↓
				player.VFlip=false;
				if(player.y<World.height-player.getHeight())
					player.y+=SU/8;
				if(player.collisionMap(1)||player.collisionMap(2))
					player.y-=SU/8;
			}
			if(PRESSING[37]){ //←
				player.HFlip=true;
				if(player.x>0)
					player.x-=SU/8;
				if(player.collisionMap(1)||player.collisionMap(3))
					player.x+=SU/8;
			}
			if(PRESSING[39]){ //→
				player.HFlip=false;
				if(player.x<World.width-player.getWidth())
					player.x+=SU/8;
				if(player.collisionMap(1)||player.collisionMap(3))
					player.x-=SU/8;
			}

			/*if(player.x>myGame.getWidth())player.x=-player.width;
			if(player.y>myGame.getHeight())player.y=-player.height;
			if(player.x<-player.width)player.x=myGame.getWidth();
			if(player.y<-player.height)player.y=myGame.getHeight();*/

			// Focus to player
			Camera.focus(player,0,5);
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
			if (lastKey==190&&player.scale<2) //>
				player.scale+=0.1;
			if (lastKey==188&&player.scale>0.1) //<
				player.scale-=0.1;
		}
		// Pause/Unpause
		if(lastKey==13) //ENTER
			PAUSE=!PAUSE;
		if(lastKey==75) //K
			World.seeCollision=!World.seeCollision;
		if(lastKey==80){ //P
			if(PRESSING[18])	//ALT
				myGame.getScreenshot();
		}
		lastKey=null;
		lastRelease=null;
	}

	paint=function(ctx){
		World.drawMap(ctx,iBlocks);
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
		if(CLICKING)
			ctx.fillText ('Mouse Pressing',260,10);
		ctx.fillText('P: '+player.x+','+player.y,10,10);
		ctx.fillText('M: '+(Mouse.x+Camera.x)+','+(Mouse.y+Camera.y),10,20);
		ctx.fillText('K: '+drawLastKey,10,30);
		ctx.fillText('R: '+drawLastRelease,10,40);
		//Intructions
		ctx.fillText('Move with arrows',10,stage.height-30);
		ctx.fillText('Grow with >',10,stage.height-20);
		ctx.fillText('Shrink with <',10,stage.height-10);
		if(PAUSE){
			ctx.fillStyle='rgba(0,0,0,0.8)';
			ctx.fillRect(0,0,SU*15,SU*10);
			ctx.fillStyle='#fff';
			ctx.textAlign='center';
			ctx.fillText('PAUSE',stage.width/2,stage.height/2);
			ctx.fillText('Press Enter',stage.width/2,stage.height/2+10);
			ctx.textAlign='right';
			ctx.fillText('Programmed by daPhyre',stage.width,stage.height-20);
			ctx.fillText('© Octabot Network, 2011',stage.width,stage.height-4);
			ctx.textAlign='left';
		}
	}
}
