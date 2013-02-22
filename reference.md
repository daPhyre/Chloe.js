# Reference

## About

COJSGE stands for Canvas Open JavaScript Game Engine. It is pronounced as COJ'SGE (Very similar to "coshge", with a soft g as in "get").

COJSGE is intended to be a practical easy-to-use engine for developing games with HTML5 Canvas + JavaScript. Current version is 0.8.

## Use

To start using COJSGE for your game, you must declare a new game, and put your game code inside the onReady function. Next there is an example for the most basic configuration of a game with COJSGE:

```javascript
var myGame=new Game();

function onReady(){
	// Start your variables here
	
	game=function(){
		// This is your game loop
		
	}
	
	paint=function(ctx){
		// This is your game renderer.
		
	}
}
```

For a more advanced example, please refer to the file [example1.js](http://github.com/daPhyre/cojsge/blob/master/example1.js) included with COJSGE.

## Using cojsge.jsz

Using cojsge.jsz will be slightly faster to download and use less bandwith in your server. To use it, create a `.htaccess` fil and add the next lines on it:

```
AddEncoding x-gzip .jsz
AddType application/javascript .jsz
```

Just upload this file in your server, and you can use `.jsz` as any `.js` file. Don't forget this works only on server-side codes, so for testing on your PC, you must use the normal `cojsge.js` script.

## Components

COJSGE is formed by many Pseudo-classes that allow developers to make frequent actions in games with few lines, letting them to focus more on the game logic and less on the basic behavior.

As JavaScript doesn't needs to declare type of variables, nor if the pseudo-classes are static or not, I will partialy use [WebIDL](http://www.w3.org/TR/WebIDL) in this documentation, to allow developers an easy understanding of the pseudo-classes and functions within it.

The current pseudo-classes in COJSGE are these:
 * [Game](#game)
 * [Animation] (#animation)
 * [Button] (#button)
 * [Particle] (#particle)
 * [ParticleSystem] (#particlesystem)
 * [Sprite] (#sprite)
 * [SpriteSheet] (#spritesheet)
 * [SpriteVector] (#spritevector)

Static pseudo-classes:
 * [Camera] (#camera)
 * [Mouse] (#mouse)
 * [Util] (#util)
 * [World] (#world)

## Public

Before starting with the pseudo-classes, I'll introduce the "Public" variable and functions within this engine:

### Public variables

```idl
HTMLCanvasElement stage
```
The current canvas set to the game. Named "stage" instead of the generic "canvas" to prevent confunsion.

```idl
CanvasRenderingContext2D ctx
```
The context of the current canvas. Direct use outside the paint loop is recomended only to display messages when non-asyncronous events may temporally freeze the game.

```idl
long lastPress
```
The last pressed key on the keyboard, or the last pressed mouse button. To know if an specific key has been pressed, you should call for example `if(lastPress==KEY_SPACEBAR)` (see [cojsge_defs](#cojsge_defsjs)). You should assign `null` to `lastPress` after using it, as the loop will continue returning `true` in the past example if not.

```idl
long lastRelease
```
The last released key on the keyboard, or the last released mouse button. To know if an specific key has been released, you should call for example `if(lastRelease==KEY_SPACEBAR)` (see [cojsge_defs](#cojsge_defsjs)). You should assign `null` to `lastRelease` after using it, as the loop will continue returning `true` in the past example if not.

```idl
boolean isFullscreen
```
Turns fullscreen mode on/off. Note: it fills the browser screen; it doesn't force the browser to enter into fullscreen (like when pressing F11).

```idl
boolean screenDebug
```
Turns screen debugging mode on/off. Turning on `screenDebug` shows tecnical info of your game in screen and all the collision bounds of all the elements in the game will be drawn over their respective images.

```idl
boolean pressing[]
```
Array that keep track of the current pressed keys and mouse buttons. To know if an specific key is being press, you should call for example `if(pressing[KEY_SPACEBAR])` (see [cojsge_defs](#cojsge_defsjs)).

### Public functions
#### onReady
```idl
void onReady(void)
```
Is called when the webpage is loaded and the game is ready to start.

#### game (function)
```idl
void game(void)
```
The main loop for your game logic. Is executed every "game.interval" times (Default is 60 times per second).

#### paint
```idl
void paint(CanvasRenderingContext2D ctx)
```
Is called every possible time that requestAnimationFrame allow (Around 60 times per second). Is asyncroned from the game loop.
**Parameters:**  
*ctx* - The context to be used for painting.

#### random
```idl
double random(double max)
```
Small public util to get a random floating number from 0.0 to max. Should be parsed with `parseInt(random(max))` to get an integer number.

**Parameters:**  
*max* - The max number `random` should return.

**Returns:**  
A random floating number from 0.0 to `max`.

#### Array
COJSGE extends the `Array` elements, giving them the properties `insert(long position, object element)`, `remove(long position)` and `removeAll()`.

## Game
The `Game` pseudo-class creates a new game assigned to the canvas with id "canvas", if no other ID is specified. This class is needed to start the game.

**[Contructor summary](#game-constructor)**  
| --- |
| [Game(optional DOMString canvasId, optional boolean autoFull, optional long fullMode)](#gamegame)	|

**[Functions summary](#game-functions)**  
| --- | --- |
| void	| [getScreenshot(void)](#gamegetscreenshot)	|
| void	| [setBackground(DOMString color, optional DOMString image, optional boolean fixed)](#gamesetbackground)	|
| void	| [setInterval(double interval)](#gamesetinterval)	|

### Game constructor
#### Game.Game
```idl
Game(optional DOMString canvasId = "canvas",
	 optional boolean autoFull = true,
	 optional long fullMode = 0)
```
Creates a new game asigned to our canvas with ID canvasID.

**Parameters:**  
*canvasId* - ID of the canvas to bound the game. If no ID is given, COJSGE will search for the DOMElement with ID "canvas".  
*autoFull* - Sets if the game will fill automatically the screen when user enters into Fullscreen mode (Like, when pressing F11).  
*fullMode* - The way to fill the screen when in Fullscreen Mode. 0 is FULLSCREEN_NORMAL (bars of BackgroundColor will be added if needed), 1 is FULLSCREEN_ZOOM (stage will crop to fill screen) and 2 is FULLSCREEN_STRETCH (image will stretch to fill the screen).

### Game functions
#### Game.getScreenshot

```idl
void getScreenshot(void)
```
Opens a new window with a PNG image screenshot of the game. Seems to work only on server-side webpages.

#### Game.setBackground
```idl
void setBackground(DOMString color,
				   optional DOMString image = null,
				   optional boolean fixed = false)
```
Sets the background properties.

**Parameters:**  
*color* - The color for the background.  
*image* - Image to be tiled in the background.  
*fixed* - Sets if the background images will be fixed when the camera moves.

#### Game.setInterval

```idl
void setInterval(double interval)
```
Sets the time between calls to the `game` function.

**Parameters:**  
*interval* - The time in miliseconds between calls. Default is 16.6 (Around 60 frames per second).

## Animation
As it is recomended to use personal SpriteSheets for more optimized games, this pseudo-class offers an easy and simple way to make animations in your game.

**[Variables summary](#animation-variables)**  
| --- | --- |
| Image	| [images](#animationimages)	|
| long	| [currentFrame](#animationcurrentframe)	|
| long	| [framesPerImage](#animationframesperimage)	|

**[Contructor summary](#animation-constructor)**  
| --- |
| [Animation(Image image, long frameWidth, optional long frameHeight, optional long framesPerImage)](#animationanimation)	|

**[Functions summary](#animation-functions)**  
| --- | --- |
| void	| [addFrame(Image img)](#animationaddframe)	|
| void	| [draw(CanvasRenderingContext2D ctx, double x, double y, optional long row)](#animationdraw)	|
| void	| [drawSprite(CanvasRenderingContext2D ctx, Sprite spr, optional double offsetX, optional double offsetY, optional long row)](#animationdrawsprite)	|
| Image	| [getCurrentImage(void)](#animationgetcurrentimage)	|
| long	| [getTotalFrames(void)](#animationgettotalframes)	|
| long	| [getTotalImages(void)](#animationgettotalimages)	|
| long	| [nextFrame(void)](#animationnextframe)	|
| long	| [prevFrame(void)](#animationprevframe)	|

### Animation variables
#### Animation.images
```idl
Image images[]
```
An array containing all the images of the current animation.

#### Animation.currentFrame
```idl
long currentFrame
```
Sets/gets the current frame of our animation.

#### Animation.framesPerImage
```idl
long framesPerImage
```
Sets/gets the time in loops that need to be paused before passing to the next image in out animation. The bigger this value is, the slower the animation runs. Default is 0.

### Animation constructor
#### Animation.Animation
```idl
Animation(Image image,
		  long frameWidth,
		  optional long frameHeight = null,
		  optional long framesPerImage = 0)
```
Creates a new animation strip. If you want to use `Animation` as an animation array of images, you can construct it sending the first image array and a random frameWidth, or you can construct it sending nothing, through in this last case, your debugging console will display an error; just ignore it.

**Parameters:**  
*image* - The image to be used as an animation strip.  
*frameWidth* - The width of each frame in pixels.  
*frameHeight* - If your animation strip contains several animation (Each one on a different row, and all with the same number of animation sprites), you must send here the height of the frame heights. Otherwise, just send `null`.  
*framesPerImage* - The time in loops before passing to the next image.

### Animation functions
#### Animation.addFrame
```idl
void addFrame(Image img)
```
Adds a new image to the animation array. If there was an animation strip before, the animation strip will dissapear and it's image will become part of the current animation.

**Parameters:**  
*image* - The new image to be pushed into the animation array.

#### Animation.draw
```idl
void draw(CanvasRenderingContext2D ctx,
		  double x,
		  double y,
		  optional long row = null)
```
Draws the current frame on the given `CanvasRenderingContext2D`.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the image will be drawn.  
*x* - The x coordinate where the image to be drawn.  
*y* - The y coordinate where the image to be drawn.  
*row* - If the animation strip has different animations, select here the row to be drawn.

#### Animation.drawSprite
```idl
void drawSprite(CanvasRenderingContext2D ctx,
				Sprite spr,
				optional double offsetX = 0,
				optional double offsetY = 0,
				optional long row = null)
```
Draws the current frame on the given `CanvasRenderingContext2D` with the sprite properties.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the image will be drawn.  
*spr* - The sprite to be drawn.  
*offsetX* - The offset in the x coordinate to move the image from the sprite.  
*offsetY* - The offset in the y coordinate to move the image from the sprite.  
*row* - If the animation strip has different animations, select here the row to be drawn.

#### Animation.getCurrentImage
```idl
Image getCurrentImage(void)
```
Gets the image of the current frame. If the animation is an strip animation, it will return the only image strip as a whole.

**Returns:**  
The image of the current frame.

#### Animation.getTotalFrames
```idl
long getTotalFrames(void)
```
Gets the total of frames within the animation.

**Returns:**  
The total of frames in `Animation`.

#### Animation.getTotalImages
```idl
long getTotalImages(void)
```
Gets the total of images within the animation.

**Returns:**  
The total of images in `Animation`.

#### Animation.nextFrame
```idl
long nextFrame(void)
```
Moves to the next frame in the animation and returns the current frame. This function should be called in `paint(ctx)` at least once in order to forward animate the animation.

**Returns:**  
The current frame after moving forward.

#### Animation.prevFrame
```idl
long prevFrame(void)
```
Moves to the previous frame in the animation and returns current frame. This function should be called in `paint(ctx)` at least once in order to backward animate the animation.

**Returns:**  
The current frame after moving backward.

## Button
This pseudo-class helps with the creation of a simple button, interactive only with the mouse.

**[Contructor summary](#button-constructor)**  
| --- |
| [Button(double x, double y, double width, double height)](#buttonbutton)	|

**[Functions summary](#button-functions)**  
| --- | --- |
| boolean	| [mouseOver(void)](#buttonmouseover)	|
| boolean	| [mouseDown(void)](#buttonmousedown)	|
| void	| [draw(CanvasRenderingContext2D ctx, optional Image img, optional double offsetX, optional double offsetY)](#buttondraw)	|

### Button constructor
#### Button.Button
```idl
Button(double x,
	   double y,
	   double width,
	   double height)
```
Creates the new button within the specified bound of the rectangle sent.

**Parameters:**  
*x* - The x coordinate of the button.  
*y* - The y coordinate of the button.  
*width* - The width of the button.  
*height* - The height of the button. If no height is specified, it will take the value of width.

### Button functions
#### Button.mouseOver
```idl
boolean mouseOver(void)
```
Checks if the mouse cursor is over the button.

**Returns:**  
`true` if the mouse cursor is over the button, `false` otherwise.

#### Button.mouseDown
```idl
boolean mouseDown(void)
```
Checks if the mouse left button is being pressed while the cursor is over the button.

**Returns:**  
`true` if the mouse left button is being pressed while the cursor is over the button, `false` otherwise.

#### Button.draw
```idl
void draw(CanvasRenderingContext2D ctx,
		  optional Image img = null,
		  optional double offsetX = 0,
		  optional double offsetY = 0)
```
Draws the button in the given `CanvasRenderingContext2D`. If no image is specified, this function will draw the button collision bounds.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the button will be drawn.  
*image* - The specified image to be drawn.  
*offsetX* - The offset in the x coordinate to move the image from the button.  
*offsetY* - The offset in the y coordinate to move the image from the button.

## Particle
Creates a new particle to be managed with the particle system.

**[Variables summary](#particle-variables)**  
| --- | --- |
| double	| [x](#particlex)	|
| double	| [y](#particley)	|
| double	| [ox](#particleox)	|
| double	| [oy](#particleoy)	|
| double	| [diameter](#particlediameter)	|
| long	| [life](#particlelife)	|
| long	| [olife](#particleolife)	|
| double	| [speed](#particlespeed)	|
| double	| [angle](#particleangle)	|
| double	| [rotation](#particlerotation)	|
| DOMString	| [color](#particlecolor)	|
| DOMString	| [colorList](#particlecolorList)	|

**[Contructor summary](#particle-constructor)**  
| --- |
| [Particle(double x, double y, double diameter, long life, double speed, double angle, DOMString colorStart, optional DOMString colorEnd)](#particleparticle)	|

### Particle variables
#### Particle.x
```idl
double x
```
The center x coordinate of the particle.

#### Particle.y
```idl
double y
```
The center y coordinate of the particle.

#### Particle.ox
```idl
double ox
```
The x coordinate origin of the particle.

#### Particle.oy
```idl
double oy
```
The y coordinate origin of the particle.

#### Particle.diameter
```idl
double diameter
```
The diameter of the particle.


#### Particle.life
```idl
long life
```
The remaining time (in loops) before the particle vanishes.

#### Particle.olife
```idl
long olife
```
The original lifespan of the particle.

#### Particle.speed
```idl
double speed
```
The speed of the particle, in pixels.

#### Particle.angle
```idl
double angle
```
The moving angle of the particle in degrees.

#### Particle.rotation
```idl
double rotation
```
The image rotation of the particle in degrees.

#### Particle.color
```idl
DOMString color
```
The current color of the particle.

#### Particle.colorList
```idl
DOMString colorList[]
```
An array containing all the colors to be assigned to the particle until it dies.

### Particle constructor
#### Particle.Particle
```idl
Particle(double x,
		 double y,
		 double diameter,
		 long life,
		 double speed,
		 double angle,
		 DOMString colorStart,
		 optional DOMString colorEnd = null)
```
Creates a new particle with the given attributes.

**Parameters:**  
*x* - The center x coordinate of the particle.  
*y* - The center x coordinate of the particle.  
*life* - The lifespan of the particle.  
*speed* - The speed of the particle, in pixels.  
*angle* - The moving angle of the particle.  
*colorStart* - The beginning color of the particle.  
*colorEnd* - If set, the particle will slowly turn from colorStart to colorEnd through its lifespan.

## ParticleSystem
**extends Array**  
Contains an array of particles to be manipulated as one system.

**[Variables summary](#particlesystem-variables)**  
| --- | --- |
| double	| [gravity](#particlesystemgravity)	|
| double	| [wind](#particlesystemwind)	|

**[Contructor summary](#particlesystem-constructor)**  
| --- |
| [ParticleSystem(void)](#particlesystemparticlesystem)	|

**[Functions summary](#particlesystem-functions)**  
| --- | --- |
| void	| [addParticle(Particle particle)](#particlesystemaddParticle)	|
| void	| [addParticle(double x, double y, double diameter, long life, double speed, double angle, DOMString colorStart, optional DOMString colorEnd)](#particlesystemaddParticle)	|
| void	| [moveParticles(void)](#particlesystemmoveParticles)	|
| void	| [moveParticlesO(void)](#particlesystemmoveParticlesO)	|
| void	| [drawParticles(CanvasRenderingContext2D ctx, optional boolean alpha, optional Image image)](#particlesystemdrawParticles)	|
| void	| [drawParticlesO(CanvasRenderingContext2D ctx, optional boolean alpha)](#particlesystemdrawParticlesO)	|

### ParticleSystem variables
#### ParticleSystem.gravity
```idl
double gravity
```
Sets/gets the constant vertical acceleration to the particles in the current particle system.

#### ParticleSystem.wind
```idl
double wind
```
Sets/gets the constant horizontal acceleration to the particles in the current particle system.

### ParticleSystem constructor
#### ParticleSystem.ParticleSystem
```idl
ParticleSystem(void)
```
Creates a new empty particle system.

### ParticleSystem functions
#### ParticleSystem.addParticle
```idl
void addParticle(Particle particle)
```
Pushes the given particle into the particle system.

**Parameters:**  
*particle* - The particle to be pushed into the particle system.

```idl
void addParticle(double x,
				 double y,
				 double diameter,
				 long life,
				 double speed,
				 double angle,
				 DOMString colorStart,
				 optional DOMString colorEnd)
```
Creates a new particle with the given attributes and then pushes it into the particle system.

**Parameters:**  
*x* - The center x coordinate of the particle.  
*y* - The center x coordinate of the particle.  
*life* - The lifespan of the particle.  
*speed* - The speed of the particle, in pixels.  
*angle* - The moving angle of the particle.  
*colorStart* - The beginning color of the particle.  
*colorEnd* - If set, the particle will slowly turn from colorStart to colorEnd through its lifespan.

#### ParticleSystem.moveParticles
```idl
void moveParticles(void)
```
Moves the particles within the particle system.

#### ParticleSystem.moveParticlesO
```idl
void moveParticlesO(void)
```
Moves each particle origin position within the particle system to the current particle position, and then moves the particle position. This function combined with `drawParticlesO` gives the particle system's particles a peculiar ray effect.

#### ParticleSystem.drawParticles
```idl
void drawParticles(CanvasRenderingContext2D ctx,
				   optional boolean alpha,
				   optional Image image)
```
Draws the particles within the particle system.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the particles will be drawn.  
*alpha* - If `true`, the particles will slowly fade out in transparency through its lifespan.  
*image* - If set, the particles will be drawn as the image instead of colour circles, with the given rotation of each particle.

#### ParticleSystem.drawParticlesO
```idl
void drawParticlesO(CanvasRenderingContext2D ctx,
				   optional boolean alpha)
```
Draws the particles within the particle system as lines, from the origin to their current position.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the particles will be drawn.  
*alpha* - If `true`, the particles will slowly fade out in transparency through its lifespan.

## Sprite
This pseudo-class creates an element to be used in the game, interactive with other sprites.

**[Variables summary](#sprite-variables)**  
| --- | --- |
| double	| [x](#spritex)	|
| double	| [y](#spritey)	|
| double	| [width](#spritewidth)	|
| double	| [height](#spriteheight)	|
| long	| [type](#spritetype)	|
| long	| [health](#spritehealth)	|
| double	| [vx](#spritevx)	|
| double	| [vy](#spritevy)	|
| double	| [ox](#spriteox)	|
| double	|[ oy](#spriteoy)	|
| long	| [ohealth](#spriteohealth)	|
| double	| [rotation](#spriterotation)	|
| double	| [scale](#spritescale)	|
| boolean	| [vflip](#spritevflip)	|
| boolean	| [hflip](#spritehflip)	|
| double	| [var1](#spritevar1)	|
| double	| [var2](#spritevar2)	|
| boolean	| [flag1](#spriteflag1)	|
| boolean	| [flag2](#spriteflag2)	|

**[Contructor summary](#sprite-constructor)**  
| --- |
| [Sprite(double x, double y, double width, optional double height, optional long type)](#spritesprite)	|

**[Functions summary](#sprite-functions)**  
| --- | --- |
| boolean	| [collisionBox(Sprite spr, optional double hotspotX, optional double hotspotY)](#spritecollisionbox)	|
| boolean	| [collisionCircle(Sprite spr, optional boolean inner)](#spritecollisioncircle)	|
| long	| [collisionMap(optional long type, optional double hotspotX, optional double hotspotY)](#spritecollisionmap)	|
| long	| [collisionMapEx(long exception)](#spritecollisionmapex)	|
| long	| [collisionMapRange(long typeMin, long typeMax, optional double hotspotX, optional double hotspotY, optional long exception)](#spritecollisionmaprange)	|
| long	| [collisionMapSwitch(long type, long newType, optional double hotspotX, optional double hotspotY, optional long exception)](#spritecollisionmapswitch)	|
| boolean	| [collisionPoint(double x, double y)](#spritecollisionpoint)	|
| void	| [drawSprite(CanvasRenderingContext2D ctx, optional Image img, optional double offsetX, optional double offsetY)](#spritedrawsprite)	|
| double	| [getDistance(Sprite spr, optional boolean inner)](#spritegetdistance)	|
| double	| [getAngle(void)](#spritegetangle)	|
| double	| [getAngle(Sprite spr)](#spritegetangle)	|
| Point	| [getCenter(void)](#spritegetcenter)	|
| double	| [getCenterX(void)](#spritegetcenterx)	|
| double	| [getCenterY(void)](#spritegetcentery)	|
| double	| [getDiameter(optional boolean inner)](#spritegetdiameter)	|
| double	| [getSpeed(void)](#spritegetspeed)	|
| double	| [getWidth(void)](#spritegetwidth)	|
| double	| [getHeight(void)](#spritegetheight)	|
| void	| [move(void)](#spritemove)	|
| void	| [reset(void)](#spritereset)	|
| void	| [resetPosition(void)](#spriteresetposition)	|
| void	| [setDirection(double angle, double speed)](#spritesetdirection)	|
| void	| [setHealth(long health)](#spritesethealth)	|
| void	| [setOrigin(double x, double y)](#spritesetorigin)	|
| void	| [setPosition(double x, double y)](#spritesetposition)	|

### Sprite variables
#### Sprite.x
```idl
double x
```
The x coordinate of the sprite.

#### Sprite.y
```idl
double y
```
The y coordinate of the sprite.

#### Sprite.width
```idl
double width
```
The width of the sprite.

#### Sprite.height
```idl
double height
```
The height of the sprite.

#### Sprite.type
```idl
long type
```
Identifier of the sprite type in a group.

#### Sprite.health
```idl
long health
```
The live points of the sprite.

#### Sprite.vx
```idl
double vx
```
The speed vector of the sprite in the x coordinate.

#### Sprite.vy
```idl
double vy
```
The speed vector of the sprite in the y coordinate.

#### Sprite.ox
```idl
double ox
```
The origin x coordinate of the sprite.

#### Sprite.oy
```idl
double oy
```
The origin y coordinate of the sprite.

#### Sprite.ohealth
```idl
long ohealth
```
The original live points of the sprite.

#### Sprite.rotation
```idl
double rotation
```
The image rotation of the sprite in degrees.

#### Sprite.scale
```idl
double scale
```
The scale of the sprite, where 1 is the original size.

#### Sprite.vflip
```idl
boolean vflip
```
Sets/gets if the image of the sprite is flipped in the vertical axis.

#### Sprite.hflip
```idl
boolean hflip
```
Sets/gets if the image of the sprite is flipped in the horizontal axis.

#### Sprite.var1
```idl
double var1
```
An extra numeric variable to use as needed.

#### Sprite.var2
```idl
double var2
```
An extra numeric variable to use as needed.

#### Sprite.flag1
```idl
boolean flag1
```
An extra boolean variable to use as needed.

#### Sprite.flag2
```idl
boolean flag2
```
An extra boolean variable to use as needed.

### Sprite constructor
#### Sprite.Sprite
```idl
Sprite(double x,
	   double y,
	   double width,
	   optional double height,
	   optional long type = 0)
```
Creates a new sprite with the given attributes.

**Parameters:**  
*x* - The x coordinate of the sprite.  
*y* - The x coordinate of the sprite.  
*width* - The width of the sprite.  
*height* - The height of the sprite. If no height is specified, it will take the value of width.  
*type* - Identifier of the sprite type in a group.

### Sprite functions
#### Sprite.collisionBox
```idl
boolean collisionBox(Sprite spr,
					 optional double hotspotX = null,
					 optional double hotspotY = null)
```
Detects if the current sprite collides with another sprite within the box area.

**Parameters:**  
*spr* - The sprite to compare if the collision is happening.  
*hotpotX* - The x coordinate hotspot.  
*hotpotY* - The y coordinate hotspot. If set, the collision will be detected against the hotspot instead of the whole sprite.

**Returns:**  
`true` if the current sprite collides with the comparing sprite, `false` otherwise.

#### Sprite.collisionCircle
```idl
boolean collisionCircle(Sprite spr,
						optional boolean inner = false)
```
Detects if the current sprite collides with another sprite within the circle area.

**Parameters:**  
*spr* - The sprite to compare if the collision is happening.  
*inner* - If set true, and the sprites are rectangular instead of square, this function will compare the collision with the inner circle of the sprites instead of the outer one.

**Returns:**  
`true` if the current sprite collides with the comparing sprite, `false` otherwise.

#### Sprite.collisionMap
```idl
long collisionMap(optional long type = null,
				  optional double hotspotX = null,
				  optional double hotspotY = null)
```
Detects if the current sprite collides with a sprite of the World Map.

**Parameters:**  
*type* - The type of the map sprite to compare against.  
*hotpotX* - The x coordinate hotspot.  
*hotpotY* - The y coordinate hotspot. If set, the collision will be detected against the hotspot instead of the whole sprite.

**Returns:**  
The position plus one of the closest World Map sprite colliding, or 0 if none. Because the lowest position might be 0, the returned value will be always bigger by one than the intended if the collision happens.

#### Sprite.collisionMapEx
```idl
long collisionMapEx(long exception = null)
```
Detects if the current sprite collides with any sprite of the World Map, except the one received in the parameter. This function is specially useful when comparing a World Map sprite against the others.

**Parameters:**  
*exception* - The position of the sprite not to be compared against in this function.

**Returns:**  
The position plus one of the closest World Map sprite colliding except the one received, or 0 otherwise. Because the lowest position might be 0, the returned value will be always bigger by one than the intended if the collision happens.

#### Sprite.collisionMapRange
```idl
long collisionMapRange(long typeMin,
					   long typeMax,
					   optional double hotspotX = null,
					   optional double hotspotY = null,
					   optional long exception = null)
```
Detects if the current sprite collides with a sprite of the World Map, within the type range from typeMin to typeMax.

**Parameters:**  
*typeMin* - The lowest type of the map sprite to compare against.  
*typeMax* - The greatest type of the map sprite to compare against.  
*hotpotX* - The x coordinate hotspot.  
*hotpotY* - The y coordinate hotspot. If set, the collision will be detected against the hotspot instead of the whole sprite.  
*exception* - The position of the sprite not to be compared against in this function.

**Returns:**  
The position plus one of the closest World Map sprite colliding withing the range, or 0 otherwise. Because the lowest position might be 0, the returned value will be always bigger by one than the intended if the collision happens.

#### Sprite.collisionMapSwitch
```idl
long collisionMapSwitch(long type,
						long newType,
						optional double hotspotX = null,
						optional double hotspotY = null,
						optional long exception = null)
```
Detects if the current sprite collides with a sprite of the World Map, with the type received, and if true, it will switch it's value with newType. If newType is 0, it will remove the sprite instead.

**Parameters:**  
*type* - The type of the map sprite to compare against.  
*newType* - The new type of the map sprite if the collision happens.  
*hotpotX* - The x coordinate hotspot.  
*hotpotY* - The y coordinate hotspot. If set, the collision will be detected against the hotspot instead of the whole sprite.  
*exception* - The position of the sprite not to be compared against in this function.

**Returns:**  
The position plus one of the closest World Map sprite colliding of the type received, or 0 otherwise. If `newType` is 0, it will return instead the original sprite type of the closest removed sprite, as the sprite itself won't existe anymore, and so, the position wouldn't be useful after this function is executed.

#### Sprite.collisionPoint
```idl
boolean collisionPoint(double x,
					   double y)
```
Detects if the current sprite collides with the specified point.

**Parameters:**  
*x* - The x coordinate of the point to compare.  
*y* - The y coordinate of the point to compare.

**Returns:**  
`true` if the current sprite collides with the comparing point, `false` otherwise.

#### Sprite.drawSprite
```idl
void drawSprite(CanvasRenderingContext2D ctx,
				optional Image img = null,
				optional double offsetX = 0,
				optional double offsetY = 0)
```
Draws the sprite on the given `CanvasRenderingContext2D`. If no image is specified, this function will draw the sprite collision bounds.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the sprite will be drawn.  
*image* - The specified image to be drawn.  
*offsetX* - The offset in the x coordinate to move the image from the sprite.  
*offsetY* - The offset in the y coordinate to move the image from the sprite.

#### Sprite.getDistance
```idl
double getDistance(Sprite spr,
				   optional boolean inner = false)
```
Calculates the distance between the current sprite and the given sprite.

**Parameters:**  
*spr* - The sprite to get the distance from.  
*inner* - If set true, and the sprites are rectangular instead of square, this function will compare the distance with the inner circle of the sprites instead of the outer one.

**Returns:**  
The distance in pixels between the two sprites.

#### Sprite.getAngle
```idl
double getAngle(void)
```
Gets the moving angle of the current sprite, given his `vx` and `vy` values.

**Returns:**  
The moving angle of the current sprite in degrees.

```idl
double getAngle(Sprite spr)
```
Calculates the angle between the current sprite and the given sprite.

**Parameters:**  
*spr* - The sprite to get the angle from.

**Returns:**  
The angle in degrees between the two sprites.

#### Sprite.getCenter
```idl
Point getCenter(void)
```
Calculates the center of the sprite, considering the sprite scale.

**Returns:**  
A Pointer with the center of the sprite in the x a y coordinates.

#### Sprite.getCenterX
```idl
double getCenterX(void)
```
Calculates the center of the sprite in the x coordinate, considering the sprite scale.

**Returns:**  
The center of the sprite in the x coordinate.

#### Sprite.getCenterY
```idl
double getCenterY(void)
```
Calculates the center of the sprite in the y coordinate, considering the sprite scale.

**Returns:**  
The center of the sprite in the y coordinate.

#### Sprite.getDiameter
```idl
double getDiameter(optional boolean inner = false)
```
Calculates the diameter of the sprite, considering the sprite scale.

**Parameters:**  
*inner* - If set true, and the sprite is rectangular instead of square, this function will return the diameter of the inner circle of the sprite instead of the outer one.

**Returns:**  
The diameter of the sprite.

#### Sprite.getSpeed
```idl
double getSpeed(void)
```
Gets the moving speed of the current sprite, given his `vx` and `vy` values.

**Returns:**  
The moving speed of the current sprite in pixels.

#### Sprite.getWidth
```idl
double getWidth(void)
```
Calculates the width of the sprite, considering the sprite scale.

**Returns:**  
The width of the sprite.

#### Sprite.getHeight
```idl
double getHeight(void)
```
Calculates the height of the sprite, considering the sprite scale.

**Returns:**  
The height of the sprite.

#### Sprite.move
```idl
void move(void)
```
Moves the sprite, given his `vx` and `vy` values.

#### Sprite.reset
```idl
void reset(void)
```
Sets the sprite values back to his original creation point.

#### Sprite.resetPosition
```idl
void resetPosition(void)
```
Returns the sprite back to his origin point.

#### Sprite.setDirection
```idl
void setDirection(double angle,
				  double speed)
```
Changes the sprite direction.

**Parameters:**  
*angle* - The new moving angle of the sprite.  
*speed* - The new moving speed of the sprite.

#### Sprite.setHealth
```idl
void setHealth(long health)
```
Changes the sprite original health and fills the health to the top.

**Parameters:**  
*health* - The new health of the sprite.

#### Sprite.setOrigin
```idl
void setOrigin(double x,
			   double y)
```
Changes the sprite origin to the new given point.

**Parameters:**  
*x* - The x coordinate of the new origin point.  
*y* - The y coordinate of the new origin point.

#### Sprite.setPosition
```idl
void setPosition(double x,
				 double y)
```
Moves the sprite to the new position.

**Parameters:**  
*x* - The x coordinate of the new position.  
*y* - The y coordinate of the new position.

## SpriteSheet
This pseudo-class offers an easy and simple way to make a sprite sheet with the same width and height for each sprite on it. Also, with the `drawSpriteFromArea` function, you can use this pseudo-class to draw specific areas in the image, independent from the static width and height, for more optimized games.

**[Variables summary](#spritesheet-variables)**  
| --- | --- |
| Image	| [img](#spritesheetimg)	|

**[Contructor summary](#spritesheet-constructor)**  
| --- |
| [SpriteSheet(Image img, long spriteWidth, optional long spriteHeight)](#spritesheetspritesheet)	|

**[Functions summary](#spritesheet-functions)**  
| --- | --- |
| void	| [draw(CanvasRenderingContext2D ctx, double x, double y, optional long spriteNumber)](#spritesheetdraw)	|
| void	| [draw(CanvasRenderingContext2D ctx, double x, double y, optional long col, optional long row)](#spritesheetdraw)	|
| void	| [drawArea(CanvasRenderingContext2D ctx, double x, double y, long areaX, long areaY, long areaWidth, long areaHeight)](#spritesheetdrawarea)	|
| void	| [drawSprite(CanvasRenderingContext2D ctx, Sprite spr, optional long col, optional long row, optional double offsetX, optional double offsetY)](#spritesheetdrawsprite)	|
| void	| [drawSpriteFromArea(CanvasRenderingContext2D ctx, Sprite spr, long areaX, long areaY, long areaWidth, long areaHeight, optional double offsetX, optional double offsetY)](#spritesheetdrawspritefromarea)	|

### SpriteSheet variables
#### SpriteSheet.img
```idl
Image img
```
The image used in the current SpriteSheet.

### SpriteSheet constructor
#### SpriteSheet.SpriteSheet
```idl
SpriteSheet(Image img,
		  long spriteWidth,
		  optional long spriteHeight)
```
Creates a new sprite sheet with the given attributes.

**Parameters:**  
*img* - The image to be used by the sprite sheet.  
*spriteWidth* - The width of the sprites within the sprite sheet.  
*spriteHeight* - The height of the sprites within the sprite sheet. If not set, it will take the value of `spriteWidth`.

### SpriteSheet functions
#### SpriteSheet.draw
```idl
void draw(CanvasRenderingContext2D ctx,
		  double x,
		  double y,
		  optional long spriteNumber = 0)
```
Draws the selected sprite image in the given coordinates.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the sprite image will be drawn.  
*x* - The x coordinate where the image will be drawn.  
*y* - The y coordinate where the image will be drawn.  
*spriteNumber* - The number of sprite image to draw. Sprites are counted from 0 to n spaces given the fixed width and height of each sprite within the sprite sheet, from left to right and then from top to bottom. If no sprite number is specified, it will return the first one.

```idl
void draw(CanvasRenderingContext2D ctx,
		  double x,
		  double y,
		  optional long col = 0,
		  optional long row = 0)
```
Draws the selected sprite image in the given coordinates.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the sprite image will be drawn.  
*x* - The x coordinate where the image will be drawn.  
*y* - The y coordinate where the image will be drawn.  
*col* - The column of the sprite image to draw. If none is specified, it will return the first one.  
*row* - The row of the sprite image to draw. If none is specified, it will return the first one.

#### SpriteSheet.drawArea
```idl
void drawArea(CanvasRenderingContext2D ctx,
			  double x,
			  double y,
			  long areaX,
			  long areaY,
			  long areaWidth,
			  long areaHeight)
```
Draws the selected area of the sprite sheet in the given coordinates.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the sprite image will be drawn.  
*x* - The x coordinate where the image will be drawn.  
*y* - The y coordinate where the image will be drawn.  
*areaX* - The x coordinate in the sprite sheet from where the image will be drawn.  
*areaY* - The y coordinate in the sprite sheet from where the image will be drawn.  
*areaWidth* - The width pixels from `areaX` in the sprite sheet from where the image will be drawn.  
*areaHeight* - The height pixels from `areaY` in the sprite sheet from where the image will be drawn.

#### SpriteSheet.drawSprite
```idl
void drawSprite(CanvasRenderingContext2D ctx,
				Sprite spr,
				optional long col = 0,
				optional long row = 0,
				optional double offsetX = 0,
				optional double offsetY = 0)
```
Draws the given sprite from the sprite image selected in the sprite sheet.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the sprite will be drawn.  
*spr* - The sprite to be drawn  
*col* - The column of the sprite image to draw. If none is specified, it will return the first one.  
*row* - The row of the sprite image to draw. If none is specified, it will return the first one. If this value is `null`, the function will take the value of `col` as the sprite number, counting sprites from 0 to n spaces given the fixed width and height of each sprite within the sprite sheet, from left to right and then from top to bottom.  
*offsetX* - The offset in the x coordinate to move the image from the sprite.  
*offsetY* - The offset in the y coordinate to move the image from the sprite.

#### SpriteSheet.drawSpriteFromArea
```idl
void drawSpriteFromArea(CanvasRenderingContext2D ctx,
						Sprite spr,
						long areaX,
						long areaY,
						long areaWidth,
						long areaHeight,
						optional double offsetX = 0,
						optional double offsetY = 0)
```
Draws the given sprite from the area selected in the sprite sheet.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the sprite will be drawn.  
*spr* - The sprite to be drawn  
*areaX* - The x coordinate in the sprite sheet from where the image will be drawn.  
*areaY* - The y coordinate in the sprite sheet from where the image will be drawn.  
*areaWidth* - The width pixels from `areaX` in the sprite sheet from where the image will be drawn.  
*areaHeight* - The height pixels from `areaY` in the sprite sheet from where the image will be drawn.  
*offsetX* - The offset in the x coordinate to move the image from the sprite.  
*offsetY* - The offset in the y coordinate to move the image from the sprite.

## SpriteVector
**extends Array**  
This pseudo-class contains an array of sprites to be manipulated as one group.

**[Contructor summary](#spritevector-constructor)**  
| --- |
| [SpriteVector(void)](#spritevectorspritevector)	|

**[Functions summary](#spritevector-functions)**  
| --- | --- |
| void	| [addSprite(Sprite spr)](#spritevectoraddsprite)	|
| void	| [addSprite(double x, double y, double width, optional double height, optional long type)](#spritevectoraddsprite)	|
| void	| [addMap(long map, long cols, double width, optional double height, optional SpriteVector masterSprites)](#spritevectoraddmap)	|
| boolean	| [collisionBox(Sprite spr)](#spritevectorcollisionbox)	|
| void	| [drawSprites(CanvasRenderingContext2D ctx, optional Image img, optional double offsetX, optional double offsetY)](#spritevectordrawsprites)	|
| Sprite	| [getSprite(long position)](#spritevectorgetsprite)	|
| void	| [move(void)](#spritevectormove)	|

### SpriteVector constructor
#### SpriteVector.SpriteVector
```idl
SpriteVector(void)
```
Creates a new empty sprite vector.

### SpriteVector functions
#### SpriteVector.addSprite
```idl
addSprite(Sprite spr)
```
Pushes the given sprite into the sprite vector.

**Parameters:**  
*spr* - The sprite to be pushed into the sprite vector

```idl
void addSprite(double x,
			   double y,
			   double width,
			   optional double height,
			   optional long type = 0)
```
Creates a new sprite with the given attributes and then pushes it into the sprite vector.

**Parameters:**  
*x* - The x coordinate of the sprite.  
*y* - The x coordinate of the sprite.  
*width* - The width of the sprite.  
*height* - The height of the sprite. If no height is specified, it will take the value of width.  
*type* - Identifier of the sprite type in a group.

#### SpriteVector.addMap
```idl
void addMap(long map[],
			long cols,
			double width,
			optional double height,
			optional SpriteVector masterSprites)
```
Creates a group of sprites from the map array, setting them the type value of the corresponding map array value.

**Parameters:**  
*map* - A numeric array with the sprite positions. Zeros will be ignored.  
*cols* - The number of columns per row in the numeric map array.  
*width* - The width of the sprites.  
*height* - The height of the sprites. If no height is specified, they will take the value of width.  
*masterSprites* - If specified, the sprites will be created as clones of the masterSprite in the map\[n\] position instead of creating new sprites in such places.

#### SpriteVector.collisionBox
```idl
boolean collisionBox(Sprite spr)
```
Detects if the specified sprite collides with any of the sprites inside the sprite vector within the box area.

**Parameters:**  
*spr* - The sprite to compare if the collision is happening.

**Returns:**  
`true` if any of the sprites inside the sprite vector collides with the given sprite, `false` otherwise.

#### SpriteVector.drawSprites
```idl
void drawSprites(CanvasRenderingContext2D ctx,
				 optional Image img[] = null,
				 optional double offsetX = 0,
				 optional double offsetY = 0)
```
Draws all the sprites in the sprite vector on the given `CanvasRenderingContext2D`.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the sprites will be drawn.  
*image* - The specified image to be drawn. If you send an array of images instead of just one image, the image drawn will be that in the place order of the sprite type.  
*offsetX* - The offset in the x coordinate to move the image from the sprites.  
*offsetY* - The offset in the y coordinate to move the image from the sprites.

#### SpriteVector.getSprite
```idl
Sprite getSprite(long position)
```
Gets the sprite in the given position inside the sprite vector. Same as calling `spritevector[position]`.

**Parameters:**  
*position* - The position of the sprite you want to retrieve in the sprite vector.

**Returns:**  
The sprite in the given position inside the sprite vector.

#### SpriteVector.move
```idl
void move(void)
```
Moves all the sprites inside the sprite vector.

## Camera
```idl
static Camera()
```
Camera is an static pseudo-class which holds the coordinates from where the game will start to be drawn.

**[Variables summary](#camera-variables)**  
| --- | --- |
| long	| [x](#camerax)	|
| long	| [y](#cameray)	|

**[Functions summary](#camera-functions)**  
| --- | --- |
| void	| [focus(Sprite spr, optional double slide, optional double offsetX, optional double offsetY)](#camerafocus)	|

### Camera variables
#### Camera.x
```idl
long x
```
The x coordinate from which the game will start to draw.

#### Camera.y
```idl
long y
```
The y coordinate from which the game will start to draw.

### Camera functions
#### Camera.focus
```idl
void focus(Sprite spr,
		   optional double slide = 0,
		   optional double offsetX = 0,
		   optional double offsetY = 0)
```
The camera centers on the given sprite.

**Parameters:**  
*spr* - The sprite to which the camera will center.  
*slide* - If this value is bigger than 0, the camera will slowly move `slide` pixels each loop until the sprite is centered.  
*offsetX* - Horizontal distance from the world border to limit the camera movement. Negative values allow the camera to move beyond the world horizontal border.  
*offsetY* - Vertical distance from the world border to limit the camera movement. Negative values allow the camera to move beyond the world vertical border. If no value is given, `offsetY` will take the value of `offsetX`.

## Mouse
```idl
static Mouse()
```
Mouse is an static pseudo-class which handles the coordinates of the mouse, respective to the game.

**[Variables summary](#mouse-variables)**  
| --- | --- |
| long	| [x](#mousex)	|
| long	| [y](#mousey)	|

**[Functions summary](#mouse-functions)**  
| --- | --- |
| void	| [draw(CanvasRenderingContext2D ctx)](#mousedraw)	|

### Mouse variables
#### Mouse.x
```idl
long x
```
The x coordinate of the mouse, respective to the game.

#### Mouse.y
```idl
long y
```
The y coordinate of the mouse, respective to the game.

### Mouse functions
#### Mouse.draw
```idl
void draw(CanvasRenderingContext2D ctx)
```
Draws in the given `CanvasRenderingContext2D` a small red sight where the mouse is, respective to the game (Useful for debugging purposes. Should be the same to the mouse cursor all the time).

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the mouse position will be drawn.

## Util
```idl
static Util()
```
Util is an static pseudo-class with many helpful functions for your games.

**[Functions summary](#util-functions)**  
| --- | --- |
| void	| [fillTile(CanvasRenderingContext2D ctx, Image img, optional double x, optional double y, optional boolean repeatX, optional boolean repeatY)](#utilfilltile)	|
| double	| [getAngle(double x1, double y1, double x2, double y2)](#utilgetangle)	|
| Audio	| [getAudio(DOMString str)](#utilgetaudio)	|
| Image	| [getImage(DOMString str)](#utilgetimage)	|

### Util functions
#### Util.fillTile
```idl
void fillTile(CanvasRenderingContext2D ctx,
			  Image img,
			  optional double x = 0,
			  optional double y = 0,
			  optional boolean repeatX = true,
			  optional boolean repeatY = true)
```
Fills the screen with a tile of the given image.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the tile will be drawn.  
*img* - The specified image to be drawn as a tile.  
*x* - The x coordinate where the tile will start to draw. Can be a negative value.  
*y* - The y coordinate where the tile will start to draw. Can be a negative value.  
*repeatX* - Specifies if the tile will repeat in the x coordinate.  
*repeatY* - Specifies if the tile will repeat in the y coordinate.

#### Util.getAngle
```idl
double getAngle(double x1,
				double y1,
				double x2,
				double y2)
```
Calculates the angle between the two points given.

**Parameters:**  
*x1* - The x coordinate of the first point.  
*y1* - The y coordinate of the first point.  
*x2* - The x coordinate of the second point.  
*y2* - The y coordinate of the second point.

**Returns**  
The angle between the two points.

#### Util.getAudio
```idl
Audio getAudio(DOMString str)
```
Detects if the browser supports MPEG-like or OGG audio formats, and returns the audio that best fits the specifications in the browser. For this function to work, you must have both your MPEG-like and your OGG audio with "oga" extension in the same folder.

**Parameters:**  
*str* - The string of the path where the audio is located.

**Returns**  
If the browser supports OGG, it will return the Audio in the specified path, but with the extension changed to "oga". Else, it will return the Audio in the specified path as sent in the string.

#### Util.getImage
```idl
Image getImage(DOMString str)
```
Creates and returns a new image with the specified path in the string.

**Parameters:**  
*str* - The string of the path where the image is located.

**Returns**  
A new image with the specified path in the string.

## World
World is an static pseudo-class containing all the elements for the current world in the screen.

**[Variables summary](#world-variables)**  
| --- | --- |
| long	| [width](#worldwidth)	|
| long	| [height](#worldheight)	|
| SpriteVector	| [map](#worldmap)	|
| boolean	| [loopX](#worldloopX)	|
| boolean	| [loopY](#worldloopY)	|

**[Functions summary](#world-functions)**  
| --- | --- |
| void	| [drawMap(CanvasRenderingContext2D ctx, optional Image img, optional boolean deviation)](#worlddrawMap)	|
| void	| [drawMap(CanvasRenderingContext2D ctx, optional SpriteSheet spritesheet, optional boolean deviation)](#worlddrawMap)	|
| void	| [setMap(long map, long cols, double width, optional double height)](#worldsetmap)	|
| void	| [setSize(double width, double height)](#worldsetsize)	|

### World variables
#### World.width
```idl
long width
```
The width of the world. Going beyond this point is considered as goind out of the world, and should be managed as a sprite killer or to return it to the game area. This value is taken by the Camera as the furthest point it can move automatically in the horizontal axis.

#### World.height
```idl
long height
```
The height of the world. Going beyond this point is considered as goind out of the world, and should be managed as a sprite killer or to return it to the game area. This value is taken by the Camera as the furthest point it can move automatically in the vertical axis.

#### World.map
```idl
SpriteVector map
```
The map of the world. Usually used to manage static elements in the game (as walls), and sometimes even the enemies and other sprites.

#### World.loopX
```idl
boolean loopX
```
If set on, the game will look like it loops in the horizontal axis, giving the impresion of an infinite world. Note: Right now, it doesn't works well with loopY, as the corners are not drawn correctly.

#### World.loopY
```idl
boolean loopY
```
If set on, the game will look like it loops in the vertical axis, giving the impresion of an infinite world. Note: Right now, it doesn't works well with loopX, as the corners are not drawn correctly.

### World functions
#### World.drawMap
```idl
void drawMap(CanvasRenderingContext2D ctx,
			 optional Image img[],
			 optional boolean deviation)
```
Draws the world map with the given images.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the map will be drawn.  
*img* - The image array from where the map images will be drawn. If only one image is specified, the whole map will be drawn with that image. If no image is specified, this function will draw only the map block boundaries.  
*deviation* - Activates var1 in each map block as a deviation. This allow map blocks to be drawn as a different map block that the one it represent (As many more or less as the value in var1). This technique is good for hidden blocks, temporal effects or tricky blocks.

```idl
void drawMap(CanvasRenderingContext2D ctx,
			 optional SpriteSheet spritesheet,
			 optional boolean deviation)
```
Draws the world map with the given sprite sheet.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the map will be drawn.  
*spritesheet* - The sprite sheet from where the map images will be drawn. If no sprite sheet is specified, this function will draw only the map block boundaries.  
*deviation* -  Activates var1 in each map block as a deviation. This allow map blocks to be drawn as a different map block that the one it represent (As many more or less as the value in var1). This technique is good for hidden blocks, temporal effects or tricky blocks.

#### World.setMap
```idl
void setMap(long map[],
			long cols,
			double width,
			optional double height)
```
Sets the world map from a numeric map array. It will set the width and height of the world as the total area containing all the blocks in the map.

**Parameters:**  
*map* - A numeric array with the map blocks positions. Zeros will be ignored.  
*cols* - The number of columns per row in the numeric map array.  
*width* - The width of each block in the map.  
*height* - The height of each block in the map. If not set, it will take the value of the width.

#### World.setSize
```idl
void setSize(double width,
			 double height)
```
Manually sets the size of the current world.

**Parameters:**  
*width* - The new width of the world.  
*height* - The new height of the world.

## cojsge_defs.js

To make easier some tasks with COJSGE, there is a second optional file included, called `cojsge_defs`. It includes definitions to the values of the keyboard keys, the mouse buttons and the fullscreen modes to set in the COGJSGE Game Class on it's creation. As you can access the numeric values directly, these definitions can make the coding of your game an easier task.

Feel free to explore the file, so you can know the options you have when making a game, or as a cheat code to the common numeric values of the mouse and keyboard buttons.

## License

Read the attached LICENSE.txt file for full details about legal stuff with COJSGE and so.