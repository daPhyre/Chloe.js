# Reference

## About

COJSGE stands for Canvas Open JavaScript Game Engine. It is pronounced as COJ'SGE (Very similar to "coshge", with a soft g as in "get").

COJSGE is intended to be a practical easy-to-use engine for developing games for desktop and mobile with HTML5 Canvas + JavaScript, but can also be used for any project using this technology. Current version is 1.0.

## Use

To start using COJSGE, you must start a new canvas, and put your code inside the `onReady` function. Next, there is an example with the most basic configuration of a code with COJSGE:

```javascript
var myCanvas=new Canvas();

myCanvas.onReady=function(){
	// Start your variables here
	var myScene=new Scene();
	
	myScene.act=function(){
		// This is your actions loop. Move your objects here.
		
	}
	
	myScene.paint=function(ctx){
		// This is your render loop. Draw your objects here.
		
	}
}
```

For a more advanced example, please refer to the file [example1.js](http://github.com/daPhyre/cojsge/blob/master/example1.js) included with COJSGE.

## Using cojsge.jsz

Using cojsge.jsz will be slightly faster to download and use less bandwith in your server. To use it, create a `.htaccess` file and add the next lines on it:

```
AddEncoding x-gzip .jsz
AddType application/javascript .jsz
```

Just upload this file in your server, and you can use `.jsz` as any `.js` file. Don't forget this works only on server-side codes, so for testing on your PC, you must use the normal `cojsge.js` script.

## Components

COJSGE is formed by many Pseudo-classes that allow developers to make frequent actions in games with few lines, letting them to focus more on the game logic and less on the basic behavior.

As JavaScript doesn't needs to declare type of variables, nor if the pseudo-classes are static or not, I will partialy use [WebIDL](http://www.w3.org/TR/WebIDL) in this documentation, to allow developers an easy understanding of the pseudo-classes and functions within it.

The current pseudo-classes in COJSGE are these:
 * [Canvas](#canvas)
 * [Animation] (#animation)
 * [Button] (#button)
 * [Camera] (#camera)
 * [Particle] (#particle)
 * [ParticleSystem] (#particlesystem)
 * [Scene] (#scene)
 * [Sprite] (#sprite)
 * [SpriteSheet] (#spritesheet)
 * [SpriteVector] (#spritevector)

Static pseudo-classes:
 * [Input] (#input)
 * [Toast] (#toast)
 * [Util] (#util)
 * [World] (#world)

## Public

Before starting with the pseudo-classes, I'll introduce the "Public" variable and functions within this engine:

### Public variables

```idl
HTMLCanvasElement view
```
The current canvas object set to the `Canvas`. Named "view" instead of the generic "canvas" to prevent confunsion.

```idl
boolean imageSmoothingEnabled
```
A temporal workaround to switch canvas quality when scaled, while `CanvasRenderingContext2D.imageSmoothingEnable` becomes a web standard.

### Public functions
#### Array
COJSGE extends the `Array` elements, giving them the properties `insert(long position, object element)`, `remove(long position)` and `removeAll()`.

## Canvas
The `Canvas` pseudo-class starts the canvas with id "canvas", if no other ID is specified. This class is needed to start the engine.

| **[Contructor summary](#canvas-constructor)** |
| --- |
| [Canvas(optional DOMString canvasId, optional long fullMode, optional boolean autoFull, optional boolean autoFullOnMobile)](#canvascanvas)	|

| | **[Functions summary](#canvas-functions)** |
| --- | --- |
| boolean	| [getAsync(void)](#canvasgetasync)	|
| boolean	| [getFullscreen(void)](#canvasgetfullscreen)	|
| double	| [getInterval(void)](#canvasgetinterval)	|
| void	| [getScreenshot(void)](#canvasgetscreenshot)	|
| boolean	| [getScreenDebug(void)](#canvasgetscreendebug)	|
| void	| [loadScene(Scene scene)](#canvasloadscene)	|
| void	| [onReady(void)](#canvasonready)	|
| void	| [setAsync(boolean async)](#canvassetasync)	|
| void	| [setBackground(DOMString color, optional DOMString image, optional boolean fixed)](#canvassetbackground)	|
| void	| [setFullscreen(boolean fullscreen)](#canvassetfullscreen)	|
| void	| [setInterval(double interval)](#canvassetinterval)	|
| void	| [setScreenDebub(boolean debug)](#canvassetscreendebug)	|
| void	| [toggleAsync(void)](#canvastoggleasync)	|
| void	| [toggleFullscreen(void)](#canvastogglefullscreen)	|
| void	| [toggleScreenDebug(void)](#canvastogglescreendebug)	|

### Canvas constructor
#### Canvas.Canvas
```idl
Canvas(optional DOMString canvasId = "canvas",
	   optional long fullMode = 0,
	   optional boolean autoFull = true,
	   optional boolean autoFullOnMobile = true)
```
Creates a new canvas with ID canvasID.

**Parameters:**  
*canvasId* - ID of the canvas to be bound. If no ID is given, COJSGE will search for the DOMElement with ID "canvas".  
*fullMode* - The way to fill the screen when in Fullscreen Mode. See [Fullscreen Mode](#fullscreen-mode) for more information.  
*autoFull* - Sets if the canvas will fill automatically the screen when user enters into Fullscreen mode (Like, when pressing F11).  
*autoFullOnMobile* - Sets if the canvas will fill automatically the screen when the screen is smaller than the canvas bound, common default task on mobile devices.  

### Canvas functions
#### Canvas.getAsync

```idl
boolean getAsync(void)
```
Gets if `Screen.act` is synchronized with `Screen.paint`, or regulated asynchronous by `Canvas.interval`.

**Returns:**  
Whether the actions are synchronized or not with the painting.

#### Canvas.getFullscreen
```idl
boolean getFullscreen(void)
```
Gets if the canvas is filling the browser screen.

**Returns:**  
Whether the canvas is filling the browser screen.

#### Canvas.getInterval
```idl
double getInterval(void)
```
Gets the time interval since the las cicle update.

**Returns:**  
The time interval since the las cicle update.

#### Canvas.getScreenshot

```idl
void getScreenshot(void)
```
Opens a new window with a PNG image screenshot of the canvas and the current frame. Seems to work only on server-side webpages.

#### Canvas.getScreenDebug
```idl
boolean getScreenDebug(void)
```
Gets if screen debugging is active or not.

**Returns:**  
Whether the screen debugging is active or not.

#### Canvas.loadScene
```idl
void loadScene(Scene scene)
```
Loads the given scene and sets it as the current one.

**Parameters:**  
*Scene* - The scene to be loaded.

#### Canvas.onReady
```idl
void onReady(void)
```
Is called when the webpage is loaded and the canvas is ready to start.

#### Canvas.setAsync

```idl
void setAsync(boolean async)
```
Sets if `Screen.act` synchronized with `Screen.paint`, or regulated asynchronous by `Canvas.interval`.

**Parameters:**  
*async* - Whether the actions will be synchronized or not with the painting.

#### Canvas.setBackground
```idl
void setBackground(DOMString color,
				   optional DOMString image = null,
				   optional boolean fixed = false)
```
Sets the background properties.

**Parameters:**  
*color* - The color for the canvas background.  
*image* - Image to be tiled in the canvas background.  
*fixed* - Sets if the canvas background images will be fixed when the camera moves.

#### Canvas.setFullscreen
```idl
void setFullscreen(boolean fullscreen)
```
Sets if the canvas will fill the browser screen. This does not force the browser to enter into fullscreen (like when pressing F11). This function won't work if either `autoFull` or `autoFullOnMobile` is true.

**Parameters:**  
*fullscreen* - Whether the screen will be filled. 

#### Canvas.setInterval

```idl
void setInterval(double interval)
```
Sets the time between calls to the `act` function. If `Canvas.async` is false (default), it will automatically switch the asychronous mode on.

**Parameters:**  
*interval* - The time in miliseconds between calls. Default is 1000/60 (60 frames per second).

#### Canvas.setScreenDebug
```idl
void setScreenDebug(boolean debug)
```
Sets if screen debugging is active or not. Turning on `screenDebug` shows tecnical info of your canvas in screen and all the collision bounds of all the elements in the canvas will be drawn over their respective images.

**Parameters:**  
*debug* - Whether the debug screen will be active or not.

#### Canvas.toggleAsync

```idl
void toggleAsync(void)
```
Switches between synchronous and asynchronous mode.

#### Canvas.toggleFullscreen

```idl
void toggleFullscreen(void)
```
Switches fullscreen mode between set and unset.

#### Canvas.toggleScreenDebug

```idl
void toggleScreenDebug(void)
```
Switches screen debug between on and off.

## Animation
While it is recomended to use personal SpriteSheets for more optimized games, this pseudo-class offers in contrast an easy and simple way to make animations in your game.

| | **[Variables summary](#animation-variables)** |
| --- | --- |
| Image	| [images](#animationimages)	|
| long	| [currentFrame](#animationcurrentframe)	|

| **[Contructor summary](#animation-constructor)** |
| --- |
| [Animation(long framesPerSecond, Image image, long frameWidth, optional long frameHeight)](#animationanimation)	|

| | **[Functions summary](#animation-functions)** |
| --- | --- |
| void	| [addFrame(Image img)](#animationaddframe)	|
| void	| [draw(CanvasRenderingContext2D ctx, double x, double y, optional long row)](#animationdraw)	|
| void	| [drawSprite(CanvasRenderingContext2D ctx, Sprite spr, optional double offsetX, optional double offsetY, optional long row)](#animationdrawsprite)	|
| long	| [getTotalFrames(void)](#animationgettotalframes)	|
| void	| [gotoFrame(long frame)](#animationgotoframe)	|
| boolean	| [isPlaying(void)](#animationisplaying)	|
| long	| [nextFrame(void)](#animationnextframe)	|
| long	| [prevFrame(void)](#animationprevframe)	|
| void	| [pause(void)](#animationpause)	|
| void	| [play(void)](#animationplay)	|
| void	| [setFPS(long framesPerSecond)](#animationsetfps)	|
| void	| [update(double deltaTime)](#animationupdate)	|

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

### Animation constructor
#### Animation.Animation
```idl
Animation(long framesPerSecond,
		  Image image,
		  long frameWidth,
		  optional long frameHeight = null)
```
Creates a new animation strip. If you want to use `Animation` as an animation array of images, you can construct it sending the first image array and a random frameWidth, or you can construct it sending nothing, through in this last case, your debugging console will display an error; just ignore it.

**Parameters:**  
*framesPerSecond* - The time before passing to the next image frame.  
*image* - The image to be used as an animation strip.  
*frameWidth* - The width of each frame in pixels.  
*frameHeight* - If your animation strip contains several animation (Each one on a different row, and all with the same number of animation sprites), you must send here the height of the frame heights. Otherwise, just send `null`.  

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

#### Animation.getTotalFrames
```idl
long getTotalFrames(void)
```
Gets the total of frames within the animation.

**Returns:**  
The total of frames in `Animation`.

#### Animation.gotoFrame
```idl
void gotoFrame(long frame)
```
Sets the current frame to the given position.

**Parameters:**  
*frame* - The frame number to go on the animation.

#### Animation.isPlaying
```idl
boolean isPlaying(void)
```
Returns whether the animation is playing or not.

**Returns:**  
Whether the animation is playing or not.

#### Animation.nextFrame
```idl
long nextFrame(void)
```
Moves to the next frame in the animation and returns the current frame.

**Returns:**  
The current frame after moving forward.

#### Animation.prevFrame
```idl
long prevFrame(void)
```
Moves to the previous frame in the animation and returns current frame.

**Returns:**  
The current frame after moving backward.

#### Animation.pause
```idl
void pause(void)
```
Pauses the animation.

#### Animation.play
```idl
void play(void)
```
Plays the animation.

#### Animation.setFPS
```idl
void setFPS(long framesPerSecond)
```
Sets the time before passing to the next image frame.

**Parameters:**  
*framesPerSecond* - The time before passing to the next image frame.

#### Animation.update
```idl
void update(double deltaTime)
```
Updates the animation given the time elapsed. It's called automatically every frame.

**Parameters:**  
*deltaTime* - The time elapsed since the last frame update.

## Button
This pseudo-class makes a simple button, interactive only with the mouse. Buttons position are always relative to screen position instead of world position.

| **[Contructor summary](#button-constructor)** |
| --- |
| [Button(double x, double y, double width, double height)](#buttonbutton)	|

| | **[Functions summary](#button-functions)** |
| --- | --- |
| boolean	| [down(void)](#buttondown)	|
| void	| [draw(CanvasRenderingContext2D ctx, optional Image img, optional double offsetX, optional double offsetY)](#buttondraw)	|
| boolean	| [hit(void)](#buttonhit)	|
| boolean	| [over(void)](#buttonover)	|
| boolean	| [tap(void)](#buttontap)	|
| boolean	| [touch(void)](#buttontouch)	|
| boolean	| [up(void)](#buttonup)	|

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
#### Button.down
```idl
boolean down(void)
```
Checks if the mouse left button or any touch is being pressed while the cursor is over the button.

**Returns:**  
`true` if the mouse left button or any touch is being pressed while the cursor is over the button, `false` otherwise.

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

#### Button.hit
```idl
boolean touch(void)
```
Checks if the mouse left button has been released over the button.

**Returns:**  
`true` if the mouse left button has been released over the button, `false` otherwise.

#### Button.over
```idl
boolean over(void)
```
Checks if the mouse cursor or any touch is over the button.

**Returns:**  
`true` if the mouse cursor or any touch is over the button, `false` otherwise.

#### Button.tap
```idl
boolean touch(void)
```
Checks if any screen touch has been pressed over the button.

**Returns:**  
`true` if any screen touch has been pressed over the button, `false` otherwise.

#### Button.touch
```idl
boolean touch(void)
```
Checks if any screen touch is being holded over the button.

**Returns:**  
`true` if any screen touch is being holded over the button, `false` otherwise.

#### Button.up
```idl
boolean up(void)
```
Checks if the mouse cursor or any touch is not over or pressing the button.

**Returns:**  
`true` if neither the mouse cursor or any touch is over or pressing the button, `false` otherwise.

## Camera
```idl
static Camera()
```
Camera is a pseudo-class which holds the coordinates from where the screen elements will start to be drawn.

| **[Contructor summary](#camera-constructor)** |
| --- |
| [Camera(optional boolean keepInWorld)](#cameracamera)	|

| | **[Variables summary](#camera-variables)** |
| --- | --- |
| long	| [keepInWorld](#camerakeepinworld)	|
| long	| [x](#camerax)	|
| long	| [y](#cameray)	|

| | **[Functions summary](#camera-functions)** |
| --- | --- |
| void	| [focus(Sprite spr, optional double slide, optional double offsetX, optional double offsetY)](#camerafocus)	|

### Camera constructor
#### Camera.Camera
```idl
Camera(optional boolean keepInWorld)
```
Creates the new camera.

**Parameters:**  
*keepInWorld* - Whether the camera will be contained all the time inside the world bounds. Default is `true`.

### Camera variables
#### Camera.keepinworld
```idl
boolean keepInWorld
```
Establishes whether the camera will be contained all the time inside the world bounds.

#### Camera.x
```idl
long x
```
The x coordinate from which the screen elements will start to draw.

#### Camera.y
```idl
long y
```
The y coordinate from which the screen elements will start to draw.

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

## Particle
Creates a new particle to be managed with the particle system.

| | **[Variables summary](#particle-variables)** |
| --- | --- |
| double	| [x](#particlex)	|
| double	| [y](#particley)	|
| double	| [ox](#particleox)	|
| double	| [oy](#particleoy)	|
| double	| [diameter](#particlediameter)	|
| double	| [life](#particlelife)	|
| double	| [olife](#particleolife)	|
| double	| [speed](#particlespeed)	|
| double	| [angle](#particleangle)	|
| double	| [rotation](#particlerotation)	|
| DOMString	| [color](#particlecolor)	|
| DOMString	| [colorList](#particlecolorList)	|

| **[Contructor summary](#particle-constructor)** |
| --- |
| [Particle(double x, double y, double diameter, double life, double speed, double angle, DOMString colorStart, optional DOMString colorEnd)](#particleparticle)	|

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
double life
```
The remaining time (in seconds) before the particle vanishes.

#### Particle.olife
```idl
double olife
```
The original lifespan of the particle.

#### Particle.speed
```idl
double speed
```
The speed of the particle, in pixels per second.

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
		 double life,
		 double speed,
		 double angle,
		 DOMString colorStart,
		 optional DOMString colorEnd = null)
```
Creates a new particle with the given attributes.

**Parameters:**  
*x* - The center x coordinate of the particle.  
*y* - The center x coordinate of the particle.  
*life* - The lifespan of the particle, in seconds.  
*speed* - The speed of the particle, in pixels per second.  
*angle* - The moving angle of the particle.  
*colorStart* - The beginning color of the particle.  
*colorEnd* - If set, the particle will slowly turn from colorStart to colorEnd through its lifespan.

## ParticleSystem
**extends Array**  
Contains an array of particles to be manipulated as one system.

| | **[Variables summary](#particlesystem-variables)** |
| --- | --- |
| double	| [gravity](#particlesystemgravity)	|
| boolean	| [moveOrigin](#particlesystemmoveorigin)	|
| double	| [wind](#particlesystemwind)	|

| **[Contructor summary](#particlesystem-constructor)** |
| --- |
| [ParticleSystem(void)](#particlesystemparticlesystem)	|

| | **[Functions summary](#particlesystem-functions)** |
| --- | --- |
| void	| [addParticle(Particle particle)](#particlesystemaddParticle)	|
| void	| [addParticle(double x, double y, double diameter, double life, double speed, double angle, DOMString colorStart, optional DOMString colorEnd)](#particlesystemaddParticle)	|
| void	| [drawParticles(CanvasRenderingContext2D ctx, optional boolean alpha, optional Image image)](#particlesystemdrawParticles)	|
| void	| [drawParticlesO(CanvasRenderingContext2D ctx, optional boolean alpha)](#particlesystemdrawParticlesO)	|
| void	| [moveParticles(void)](#particlesystemmoveParticles)	|
| void	| [moveParticlesO(void)](#particlesystemmoveParticlesO)	|
| void	| [update(double deltaTime)](#particlesystemupdate)	|

### ParticleSystem variables
#### ParticleSystem.gravity
```idl
double gravity
```
Sets/gets the constant vertical acceleration to the particles in the current particle system.

#### ParticleSystem.moveorigin
```idl
boolean moveOrigin
```
Whether the origin of the particle should move with the particle. Effective for some visual effects.

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
*life* - The lifespan of the particle, in seconds.  
*speed* - The speed of the particle, in pixels per second.  
*angle* - The moving angle of the particle.  
*colorStart* - The beginning color of the particle.  
*colorEnd* - If set, the particle will slowly turn from colorStart to colorEnd through its lifespan.

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

#### ParticleSystem.update
```idl
void update(double deltaTime)
```
Updates the particle system given the time elapsed. It's called automatically every frame.

**Parameters:**  
*deltaTime* - The time elapsed since the last frame update.

## Scene
This pseudo-class creates a scene to be drawn and manipulated on the main loop.

| | **[Variables summary](#scene-variables)** |
| --- | --- |
| long	| [id](#sceneid)	|

| | **[Functions summary](#scene-functions)** |
| --- | --- |
| void	| [load(void)](#sceneload)	|
| void	| [act(deltaTime)](#sceneact)	|
| void	| [paint(CanvasRenderingContext2D ctx)](#scenepaint)	|

### Scene variables
#### Scene.id
```idl
long id
```
The unique identifier for the scene. Should not be modified.

### Scene functions
#### Scene.load
```idl
void load(void)
```
Sets the tasks to be done when the scene loads. Will be called automatically when a scene is loaded with `Canvas.loadScene`.

#### Scene.act
```idl
void act(deltaTime)
```
The actions that happens frame after frame in the main loop. If `Canvas.async` is true, this is executed asynchronized from `Scene.paint`, every `Canvas.interval` times (Default is 60 times per second). Else, it is called synchronized with `Scene.paint`, every possible time that requestAnimationFrame allow.

**Parameters:**  
*deltaTime* - The elapsed time since the last frame update.

#### Scene.paint
```idl
void paint(CanvasRenderingContext2D ctx)
```
Is called every possible time that requestAnimationFrame allow (Around 60 times per second, depends on device).

**Parameters:**  
*ctx* - The context to be used for painting.

## Sprite
This pseudo-class creates an element to be used in the game, interactive with other sprites.

| | **[Variables summary](#sprite-variables)** |
| --- | --- |
| double	| [x](#spritex)	|
| double	| [y](#spritey)	|
| double	| [width](#spritewidth)	|
| double	| [height](#spriteheight)	|
| long	| [type](#spritetype)	|
| long	| [health](#spritehealth)	|
| double	| [left](#spriteleft)	|
| double	| [right](#spriteright)	|
| double	| [top](#spritetop)	|
| double	| [bottom](#spritebottom)	|
| double	| [vx](#spritevx)	|
| double	| [vy](#spritevy)	|
| double	| [ox](#spriteox)	|
| double	|[ oy](#spriteoy)	|
| long	| [ohealth](#spriteohealth)	|
| double	| [rotation](#spriterotation)	|
| double	| [scale](#spritescale)	|
| boolean	| [vflip](#spritevflip)	|
| boolean	| [hflip](#spritehflip)	|
| double	| [mapOffset](#spritemapoffset)	|

| **[Contructor summary](#sprite-constructor)** |
| --- |
| [Sprite(double x, double y, double width, optional double height, optional long type)](#spritesprite)	|

| | **[Functions summary](#sprite-functions)** |
| --- | --- |
| boolean	| [collisionBox(Sprite spr, optional double hotspotX, optional double hotspotY)](#spritecollisionbox)	|
| boolean	| [collisionCircle(Sprite spr, optional boolean inner)](#spritecollisioncircle)	|
| long	| [collisionMap(optional long type, optional double hotspotX, optional double hotspotY, optional long exception)](#spritecollisionmap)	|
| long	| [collisionMapClosest(optional long type, optional double hotspotX, optional double hotspotY)](#spritecollisionmapclosest)	|
| void	| [collisionMapFunction(function callback)](#spritecollisionmapfunction)	|
| long	| [collisionMapRange(long typeMin, long typeMax, optional double hotspotX, optional double hotspotY, optional long exception)](#spritecollisionmaprange)	|
| long	| [collisionMapSwitch(long type, long newType, optional double hotspotX, optional double hotspotY, optional long exception)](#spritecollisionmapswitch)	|
| boolean	| [collisionPoint(double x, double y)](#spritecollisionpoint)	|
| boolean	| [contains(Object obj)](#spritecontains)	|
| boolean	| [contains(double x, double y, optional double width, optional double height)](#spritecontains)	|
| double	| [distance(Sprite spr, optional boolean inner)](#spritedistance)	|
| void	| [drawSprite(CanvasRenderingContext2D ctx, optional Image img, optional double offsetX, optional double offsetY)](#spritedrawsprite)	|
| boolean	| [intersects(Object obj)](#spriteintersects)	|
| boolean	| [intersects(double x, double y, double width, double height)](#spriteintersects)	|
| double	| [getAngle(void)](#spritegetangle)	|
| double	| [getAngle(Sprite spr)](#spritegetangle)	|
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
The x coordinate of the sprite, from it's center.

#### Sprite.y
```idl
double y
```
The y coordinate of the sprite, from it's center.

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

#### Sprite.left
```idl
double left
```
The x coordinate at the left of the sprite.

#### Sprite.right
```idl
double right
```
The x coordinate at the right of the sprite.

#### Sprite.top
```idl
double top
```
The y coordinate at the top of the sprite.

#### Sprite.bottom
```idl
double bottom
```
The y coordinate at the bottom of the sprite.

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

#### Sprite.mapOffset
```idl
double mapOffset
```
Disguises a world map sprite with another given the offset from the original sprite.

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
				  optional double hotspotY = null,
				  optional long exception = null)
```
Detects if the current sprite collides with a sprite of the World Map.

**Parameters:**  
*type* - The type of the map sprite to compare against.  
*hotpotX* - The x coordinate hotspot.  
*hotpotY* - The y coordinate hotspot. If set, the collision will be detected against the hotspot instead of the whole sprite.  
*exception* - The position of the sprite not to be compared against in this function.

**Returns:**  
The position of the first found World Map sprite colliding, or 0 if none.

#### Sprite.collisionMapClosest
```idl
long collisionMapClosest(optional long type = null,
				  optional double hotspotX = null,
				  optional double hotspotY = null)
```
Detects if the current sprite collides with a sprite of the World Map, and returns the closest one. This function is slower than `collisionMap`, so use it only when required the specific closest sprite.

**Parameters:**  
*type* - The type of the map sprite to compare against.  
*hotpotX* - The x coordinate hotspot.  
*hotpotY* - The y coordinate hotspot. If set, the collision will be detected against the hotspot instead of the whole sprite.

**Returns:**  
The position of the closest World Map sprite colliding, or 0 if none.

#### Sprite.collisionMapFunction
```idl
void collisionMapFunction(function callback(sprite))
```
Executes the sent function with each and every collisioning sprite. The callback function must receive one variable that is the collisioning sprite.

**Parameters:**  
*callback(sprite)* - The function to be executed with each and every collisioning sprite.

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
Detects if the current sprite contains within it's bounds the specified point. Is the same as calling `Sprite.contains(double x, double y)`.

**Parameters:**  
*x* - The x coordinate of the point to compare.  
*y* - The y coordinate of the point to compare.

**Returns:**  
`true` if the current sprite contains within it's bounds the comparing point, `false` otherwise.

#### Sprite.contains
```idl
boolean contains(Object obj)
```
Detects if the current sprite contains within it's bounds the specified object, being it a point or a rectangle. It doesn't takes on count if the rectangle is scaled.

**Parameters:**  
*obj* - The object to compare against.

**Returns:**  
`true` if the current sprite contains within it's bounds the comparing object, `false` otherwise.

```idl
boolean contains(double x,
				 double y
				 optional double width,
				 optional double height)
```
Detects if the current sprite contains within it's bounds the specified point or area.

**Parameters:**  
*x* - The x coordinate of the point or area to compare.  
*y* - The y coordinate of the point or area to compare.  
*width* - The width of the area to compare.  
*height* - The height of the area to compare.

**Returns:**  
`true` if the current sprite contains within it's bounds the comparing point or area, `false` otherwise.

#### Sprite.distance
```idl
double distance(Sprite spr,
				optional boolean inner = false)
```
Calculates the distance between the current sprite and the given sprite.

**Parameters:**  
*spr* - The sprite to get the distance from.  
*inner* - If set true, and the sprites are rectangular instead of square, this function will compare the distance with the inner circle of the sprites instead of the outer one.

**Returns:**  
The distance in pixels between the two sprites.

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

#### Sprite.intersects
```idl
boolean intersects(Object obj)
```
Detects if the current sprite intersects within it's bounds the specified object, being it a point or a rectangle. In contrast with `Sprite.collisionBox`, this function doesn't takes on count if the rectangle is scaled.

**Parameters:**  
*obj* - The object to compare against.

**Returns:**  
`true` if the current sprite intersects within it's bounds the comparing object, `false` otherwise.

```idl
boolean intersects(double x,
				   double y
				   double width,
				   double height)
```
Detects if the current sprite intersects within it's bounds the specified area.

**Parameters:**  
*x* - The x coordinate of the area to compare.  
*y* - The y coordinate of the area to compare.  
*width* - The width of the area to compare.  
*height* - The height of the area to compare.

**Returns:**  
`true` if the current sprite intersects within it's bounds the comparing point or area, `false` otherwise.

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

| | **[Variables summary](#spritesheet-variables)** |
| --- | --- |
| Image	| [img](#spritesheetimg)	|

| **[Contructor summary](#spritesheet-constructor)** |
| --- |
| [SpriteSheet(Image img, long spriteWidth, optional long spriteHeight)](#spritesheetspritesheet)	|

| | **[Functions summary](#spritesheet-functions)** |
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

| **[Contructor summary](#spritevector-constructor)** |
| --- |
| [SpriteVector(void)](#spritevectorspritevector)	|

| | **[Functions summary](#spritevector-functions)** |
| --- | --- |
| void	| [addSprite(Sprite spr)](#spritevectoraddsprite)	|
| void	| [addSprite(double x, double y, double width, optional double height, optional long type)](#spritevectoraddsprite)	|
| void	| [addMap(long map, long cols, double width, optional double height, optional SpriteVector masterSprites)](#spritevectoraddmap)	|
| boolean	| [collisionBox(Sprite spr)](#spritevectorcollisionbox)	|
| boolean	| [contains(Object obj)](#spritevectorcontains)	|
| boolean	| [contains(double x, double y, optional double width, optional double height)](#spritevectorcontains)	|
| void	| [drawSprites(CanvasRenderingContext2D ctx, optional Image img, optional double offsetX, optional double offsetY)](#spritevectordrawsprites)	|
| boolean	| [intersects(Object obj)](#spritevectorintersects)	|
| boolean	| [intersects(double x, double y, double width, double height)](#spritevectorintersects)	|
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

#### SpriteVector.contains
```idl
boolean contains(Object obj)
```
Detects if any sprite in the current sprite vector contains within it's bounds the specified object, being it a point or a rectangle. It doesn't takes on count if the rectangle is scaled.

**Parameters:**  
*obj* - The object to compare against.

**Returns:**  
`true` if any sprite in the current sprite vector contains within it's bounds the comparing object, `false` otherwise.

```idl
boolean contains(double x,
				 double y,
				 optional double width,
				 optional double height)
```
Detects if any sprite in the current sprite vector contains within it's bounds the specified point or area.

**Parameters:**  
*x* - The x coordinate of the point or area to compare.  
*y* - The y coordinate of the point or area to compare.  
*width* - The width of the area to compare.  
*height* - The height of the area to compare.

**Returns:**  
`true` if any sprite in the current sprite vector contains within it's bounds the comparing point or area, `false` otherwise.

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

#### SpriteVector.intersects
```idl
boolean intersects(Object obj)
```
Detects if any sprite in the current sprite vector intersects within it's bounds the specified object, being it a point or a rectangle. In contrast with `Sprite.collisionBox`, this function doesn't takes on count if the rectangle is scaled.

**Parameters:**  
*obj* - The object to compare against.

**Returns:**  
`true` if any sprite in the current sprite vector intersects within it's bounds the comparing object, `false` otherwise.

```idl
boolean intersects(double x,
				   double y
				   double width,
				   double height)
```
Detects if any sprite in the current sprite vector intersects within it's bounds the specified area.

**Parameters:**  
*x* - The x coordinate of the area to compare.  
*y* - The y coordinate of the area to compare.  
*width* - The width of the area to compare.  
*height* - The height of the area to compare.

**Returns:**  
`true` if any sprite in the current sprite vector within it's bounds the comparing point or area, `false` otherwise.

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

## Input
```idl
static Input()
```
Input is an static pseudo-class which handles all external inputs, including keyboard, mouse, multitouch screen and accelerometer.

| | **[Variables summary](#input-variables)** |
| --- | --- |
| Object	| [acceleration](#inputacceleration)	|
| long	| [lastPress](#inputlastpress)	|
| long	| [lastRelease](#inputlastrelease)	|
| long	| [lastTouchPress](#inputlasttouchpress)	|
| long	| [lastTouchRelease](#inputlasttouchrelease)	|
| Object	| [mouse](#inputmouse)	|
| Object	| [orientation](#inputorientation)	|
| boolean	| [pressing](#inputpressing)	|
| Object	| [touches](#inputtouches)	|

| | **[Functions summary](#input-functions)** |
| --- | --- |
| void	| [enableAcceleration()](#inputenableacceleration)	|
| void	| [enableKeyboard()](#inputenablekeyboard)	|
| void	| [enableMouse()](#inputenablemouse)	|
| void	| [enableOrientation()](#inputenableorientation)	|
| void	| [enableTouch()](#inputenabletouch)	|
| void	| [disableAcceleration()](#inputdisableacceleration)	|
| void	| [disableKeyboard()](#inputdisablekeyboard)	|
| void	| [disableMouse()](#inputdisablemouse)	|
| void	| [disableOrientation()](#inputdisableorientation)	|
| void	| [disableTouch()](#inputdisabletouch)	|
| void	| [virtualKey(long key, boolean action)](#inputvirtualkey)	|

### Input variables
#### Input.acceleration
```idl
static acceleration()
```
Acceleration is an static object which handles the gravity acceleration on supported devices.

| | **[Variables summary](#inputacceleration-variables)** |
| --- | --- |
| boolean	| [active](#inputaccelerationactive)	|
| double	| [x](#inputaccelerationx)	|
| double	| [y](#inputaccelerationy)	|
| double	| [z](#inputaccelerationy)	|

##### Input.acceleration variables
###### Input.acceleration.active
```idl
boolean active
```
Whether the acceleration is enabled or not. It will be false if `Input.enableAcceleration` is called but the device doesn't supports it.

###### Input.acceleration.x
```idl
double x
```
The x coordinate acceleration of the device.

###### Input.acceleration.y
```idl
double y
```
The y coordinate acceleration of the device.

###### Input.acceleration.z
```idl
double z
```
The z coordinate acceleration of the device.

#### Input.lastPress
```idl
long lastPress
```
The last pressed key on the keyboard, or the last pressed mouse button. To know if an specific key has been pressed, you should call for example `if(lastPress==KEY_SPACEBAR)` (see [cojsge_defs](#cojsge_defsjs)). You should assign `null` to `lastPress` after using it, as the loop will continue returning `true` in the past example if not.

#### Input.lastRelease
```idl
long lastRelease
```
The last released key on the keyboard, or the last released mouse button. To know if an specific key has been released, you should call for example `if(lastRelease==KEY_SPACEBAR)` (see [cojsge_defs](#cojsge_defsjs)). You should assign `null` to `lastRelease` after using it, as the loop will continue returning `true` in the past example if not.

#### Input.lastTouchPress
```idl
long lastTouchPress
```
The unique identifier of the last touch pressed. You should assign `null` to `lastTouchPress` after using it, as the loop will continue returning the current value if not.

#### Input.lastTouchRelease
```idl
long lastTouchRelease
```
The unique identifier of the last touch released. You should assign `null` to `lastTouchRelease` after using it, as the loop will continue returning the current value if not.

#### Input.mouse
```idl
static mouse()
```
Mouse is an static object which handles the coordinates of the mouse, respective to the canvas.

| | **[Variables summary](#inputmouse-variables)** |
| --- | --- |
| long	| [x](#inputmousex)	|
| long	| [y](#inputmousey)	|
| long	| [ox](#inputmouseox)	|
| long	| [oy](#inputmouseoy)	|
| boolean	| [move](#inputmousemove)	|

| | **[Functions summary](#inputmouse-functions)** |
| --- | --- |
| void	| [draw(CanvasRenderingContext2D ctx)](#inputmousedraw)	|

##### Input.mouse variables
###### Input.mouse.x
```idl
long x
```
The x coordinate of the mouse, respective to the canvas.

###### Input.mouse.y
```idl
long y
```
The y coordinate of the mouse, respective to the canvas.

###### Input.mouse.ox
```idl
long ox
```
The origin x coordinate of the mouse since the mouse button started to be pressed.

###### Input.mouse.oy
```idl
long oy
```
The origin y coordinate of the mouse since the mouse button started to be pressed.

###### Input.mouse.move
```idl
boolean move
```
Returns whether the mouse is in motion or not.

##### Input.mouse functions
###### Input.mouse.draw
```idl
void draw(CanvasRenderingContext2D ctx)
```
Draws in the given `CanvasRenderingContext2D` a small red sight where the mouse is, respective to the canvas (Useful for debugging purposes. Should be the same to the mouse cursor all the time). The sight will be white if the mouse left button is being hold, and a line indicating the drag since the mouse started to press.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the mouse position will be drawn.

#### Input.orientation
```idl
static orientation()
```
Orientation is an static object which handles the orientation angle in degrees on supported devices.

| | **[Variables summary](#inputorientation-variables)** |
| --- | --- |
| boolean	| [absolute](#inputorientationabsolute)	|
| boolean	| [active](#inputorientationactive)	|
| double	| [alpha](#inputorientationalpha)	|
| double	| [beta](#inputorientationbeta)	|
| double	| [gamma](#inputorientationgamma)	|

##### Input.orientation variables
###### Input.orientation.absolute
```idl
boolean absolute
```
Whether the device returns the orientation in absolute mode or not.

###### Input.orientation.active
```idl
boolean active
```
Whether the orientation is enabled or not. It will be false if `Input.enableOrientation` is called but the device doesn't supports it.

###### Input.orientation.alpha
```idl
double alpha
```
The alpha orientation of the device.

###### Input.orientation.beta
```idl
double beta
```
The beta orientation of the device.

###### Input.orientation.gamma
```idl
double gamma
```
The gamma orientation of the device.


#### Input.pressing
```idl
boolean pressing[]
```
Array that keep track of the current pressed keys and mouse buttons. To know if an specific key is being press, you should call for example `if(pressing[KEY_SPACEBAR])` (see [cojsge_defs](#cojsge_defsjs)).

#### Input.touches
```idl
static touches()[]
```
Array that keep track of all the current screen touches on supported devices. Each touch has the next properties:

| | **[Variables summary](#inputtouches-variables)** |
| --- | --- |
| long	| [id](#inputtouchesid)	|
| long	| [x](#inputtouchesx)	|
| long	| [y](#inputtouchesy)	|
| long	| [ox](#inputtouchesox)	|
| long	| [oy](#inputtouchesoy)	|

| | **[Functions summary](#inputtouches-functions)** |
| --- | --- |
| void	| [draw(CanvasRenderingContext2D ctx)](#inputtouchesdraw)	|

##### Input.touches[i] variables
###### Input.touches[i].id
```idl
long id
```
Unique identifier of the touch.

###### Input.touches[i].x
```idl
long x
```
The x coordinate of the touch, respective to the canvas.

###### Input.touches[i].y
```idl
long y
```
The y coordinate of the touch, respective to the canvas.

###### Input.touches[i].ox
```idl
long ox
```
The origin x coordinate of the touch since it started.

###### Input.touches[i].oy
```idl
long oy
```
The origin y coordinate of the touch since it started.

##### Input.touches[i] functions
###### Input.touches[i].draw
```idl
void draw(CanvasRenderingContext2D ctx)
```
Draws in the given `CanvasRenderingContext2D` a small gray circle where the touch is, respective to the canvas (Useful for debugging purposes. Should be the same to the current touch all the time), and a line joining with the touch origin.

**Parameters:**  
*ctx* - The `CanvasRenderingContext2D` where the touch position will be drawn.


### Input functions
#### Input.enableAcceleration
```idl
void enableAcceleration(void)
```
Enables motion listener on supported devices. Modifies the `acceleration` object values with the respective gravity acceleration of the device.

#### Input.enableKeyboard
```idl
void enableKeyboard(void)
```
Enables keyboard listener. Modifies the `lastPress`, `lastRelease` and `pressing` variables with values from 8 to 222, depending on the action of the keys on the keyboard.

#### Input.enableMouse
```idl
void enableMouse(void)
```
Enables mouse listener. Modifies the `mouse` object values with the respective mouse position on the canvas, and the `lastPress`, `lastRelease` and `pressing` variables with values from 1 to 3, depending on the action of the buttons on the mouse. Also, emulates one touch on the screen.

#### Input.enableOrientation
```idl
void enableOrientation(void)
```
Enables orientation listener on supported devices. Modifies the `orientation` object values with the respective orientation of the device.

#### Input.enableTouch
```idl
void enableTouch(void)
```
Enables screen touch listener on supported devices. Modifies the `touches` objects values with the respective touch position on the canvas. Also emulates the mouse movement and left click.

#### Input.disableAcceleration
```idl
void disableAcceleration(void)
```
Disables motion listener.

#### Input.disableKeyboard
```idl
void disableKeyboard(void)
```
Disables keyboard listener.

#### Input.disableMouse
```idl
void disableMouse(void)
```
Disables mouse listener.

#### Input.disableOrientation
```idl
void disableOrientation(void)
```
Disables orientation listener.

#### Input.disableTouch
```idl
void disableTouch(void)
```
Disables touch listener.

#### Input.virtualKey
```idl
void virtualKey(long key,
				boolean action)
```
Simulates the action of pressing a key, given the boolean result of an action. This handles the management for the values on `input.lastPress`, `input.lastRelease` and `input.pressing`.

**Parameters:**  
*key* - The value of the key to be simulated.  
*action* - The boolean result of the evaluated action to determine if the key is pressed or not.

## Toast
```idl
static Toast()
```
Toast is an static pseudo-class for displaying a temporal message on screen.

| | **[Functions summary](#toast-functions)** |
| --- | --- |
| void	| [makeText(DOMString str, double time)](#toastmaketext)	|

### Toast functions
#### Toast.makeText
```idl
void makeText(DOMString str,
			  double time)
```
Creates and displays a toast with the specified name for the specified time in seconds. Since only one toast can be displayed on screen at time, if a new one is created, it will replace the older one.

**Parameters:**    
*str* - The text to be displayed.  
*time* - The time in seconds to display the message on screen.

## Util
```idl
static Util()
```
Util is an static pseudo-class with many helpful functions for your games.

| | **[Functions summary](#util-functions)** |
| --- | --- |
| void	| [fillTile(CanvasRenderingContext2D ctx, Image img, optional double x, optional double y, optional boolean repeatX, optional boolean repeatY)](#utilfilltile)	|
| double	| [getAngle(double x1, double y1, double x2, double y2)](#utilgetangle)	|
| Audio	| [getAudio(DOMString str)](#utilgetaudio)	|
| double	| [getDistance(double x1, double y1, double x2, double y2)](#utilgetdistance)	|
| Image	| [getImage(DOMString str)](#utilgetimage)	|
| double	| [random(double max)](#utilrandom)	|

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

#### Util.getDistance
```idl
double getDistance(double x1,
				   double y1,
				   double x2,
				   double y2)
```
Calculates the distance between the two points given.

**Parameters:**  
*x1* - The x coordinate of the first point.  
*y1* - The y coordinate of the first point.  
*x2* - The x coordinate of the second point.  
*y2* - The y coordinate of the second point.

**Returns**  
The distance between the two points.

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

#### Util.random
```idl
double random(double max)
```
Gets a random floating number from 0.0 to max. Should be parsed with `Math.floor(random(max))` to get an integer number.

**Parameters:**  
*max* - The max number `random` should return.

**Returns:**  
A random floating number from 0.0 to `max`.

## World
World is an static pseudo-class containing all the elements for the current world in the screen.

| | **[Variables summary](#world-variables)** |
| --- | --- |
| long	| [width](#worldwidth)	|
| long	| [height](#worldheight)	|
| SpriteVector	| [map](#worldmap)	|
| Camera	| [cam](#worldcam)	|
| boolean	| [loopX](#worldloopX)	|
| boolean	| [loopY](#worldloopY)	|

| | **[Functions summary](#world-functions)** |
| --- | --- |
| void	| [drawMap(CanvasRenderingContext2D ctx, optional Image img, optional boolean deviation)](#worlddrawMap)	|
| void	| [drawMap(CanvasRenderingContext2D ctx, optional SpriteSheet spritesheet, optional boolean deviation)](#worlddrawMap)	|
| void	| [setMap(long map, double width, optional double height, optional long cols)](#worldsetmap)	|
| void	| [setSize(double width, double height)](#worldsetsize)	|

### World variables
#### World.width
```idl
long width
```
The width of the world. Going beyond this point is considered as going out of the world, and should be managed as a sprite killer or to return it to the world area. This value is taken by the Camera pseudo-class as the furthest point it can move automatically in the horizontal axis.

#### World.height
```idl
long height
```
The height of the world. Going beyond this point is considered as going out of the world, and should be managed as a sprite killer or to return it to the world area. This value is taken by the Camera pseudo-class as the furthest point it can move automatically in the vertical axis.

#### World.map
```idl
SpriteVector map
```
The map of the world. Usually used to manage static elements in the game (as walls), and sometimes even the enemies and other sprites.

#### World.cam
```idl
Camera cam
```
The camera of the world. All the sprites will be drawn on screen respectively to this.

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
			double width,
			optional double height,
			optional long cols)
```
Sets the world map from a numeric map array. It will set the width and height of the world as the total area containing all the blocks in the map. If `cols` is not specified, the first value on the map array will be used as this value; this allow to manipulate multiple maps easier.

**Parameters:**  
*map* - A numeric array with the map blocks positions. Zeros will be ignored.  
*width* - The width of each block in the map.  
*height* - The height of each block in the map. If not set, it will take the value of the width.  
*cols* - The number of columns per row in the numeric map array.

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

To make easier some tasks with COJSGE, there is a second optional file included, called `cojsge_defs`. It includes definitions to the values of the keyboard keys, the mouse buttons and the fullscreen modes to set in the COGJSGE `Canvas` Class on it's creation. As you can access the numeric values directly, these definitions can make the coding of your project an easier task.

Feel free to explore the file, so you can know the options you have when making a project, or as a cheat code to the common numeric values of the mouse and keyboard buttons.

### Fullscreen Mode
The second parameter when creating a new `Canvas` is the Fullscreen Mode; there are 7 types of Fullscreen Mode for scale in COJSGE. The first 3 are static scale, that means, the proportion of the canvas will be kept the same. The remaining 4 are dynamic, which changes the proportion of the canvas to better fit the screen, but use these carefully and test thoroughly, as it may cause unexpected behaviour.

**Static scale**  
0 is FULLSCREEN_NORMAL - Bars of `BackgroundColor` will be added if needed.  
1 is FULLSCREEN_ZOOM - Stage will crop to fill screen.  
2 is FULLSCREEN_STRETCH - Image will stretch and deform to fill the screen.

**Dynamic scale**   
3 is FULLSCREEN_RESIZE_LANDSCAPE - Proportion will adapt to the width if it is bigger than the height, and then scale.  
4 is FULLSCREEN_RESIZE_PORTRAIT - Proportion will adapt to the height if it is bigger than the width, and then scale.  
5 is FULLSCREEN_RESIZE_WIDTH - Proportion will adapt to the width always, and then scale.  
6 is FULLSCREEN_RESIZE_HEIGHT - Proportion will adapt to the height always, and then scale.

## License

Read the attached LICENSE.txt file for full details about legal stuff with COJSGE and so.