// TODO: fix for mobile
// TODO: add options to build one's own scene.
// https://www.sketchlikeanarchitect.com/blog/what-type-of-perspective-should-you-choose

// different methods for perspective: https://www.artistsnetwork.com/art-mediums/learn-to-draw-perspective/
// notes: implement this instead: https://learn.toonboom.com/modules/stay-on-point-with-new-rulers-and-guides/topic/3-point-perspective-horizontal-pan

window.onload = function()
{
	initialize();
}

// assumed to be evenly distributed.
const DENSITY_LOW_LINECOUNT = 32;
const DENSITY_MEDIUM_LINECOUNT = 64;
const DENSITY_HIGH_LINECOUNT = 128;
const DENSITY_VERY_HIGH_LINECOUNT = 256;

const FONT_SIZE = 18;
const FONT = "Times New Roman";

var mainContainer;
var canvas;
var context;
var needsUpdating = true;

var perspectiveMode = "1-point";
const PERSPECTIVE_MODES = ["1-point","2-point","3-point","curvilinear-4-point", "curvilinear-5-point"];

var densityMode = "low";
const DENSITY_MODES = ["low","medium","high", "very-high"];

var snapMode = true;
const SNAP_MODES = ["true", "false"];

var constructionLineMode = true;
const CONSTRUCTION_LINE_MODES = ["true", "false"];

var isNotesHidden = false;
var isModesContainerHidden = false;

// colours of each new point
var lineColours = ["#f745b6","#a1fc40","#3ee8fe","#f8fe3e","#fe8e3e","#fe3efe"];

function initialize()
{
	mainContainer = document.createElement("div");
	mainContainer.classList.add("container");
	document.body.appendChild(mainContainer);
	
	canvas = document.createElement("canvas");
	canvas.classList.add("fixed");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	mainContainer.appendChild(canvas);
	
	canvas.addEventListener("pointerdown",onpointerdown, false);
	canvas.addEventListener("pointerup",onpointerup, false);
	canvas.addEventListener("pointermove",onpointermove, false);
	window.addEventListener("resize",onresize, false);
	
	context = canvas.getContext("2d");
	// setup context
	context.font = `${FONT_SIZE}px ${FONT}`;
	
	// create more UI 
	let createText = function(text)
	{
		let p = document.createElement("p");
		p.innerHTML = text;
		return p;
	}
	var selectorContainer = document.createElement("div");
	selectorContainer.classList.add("fixed");
	selectorContainer.classList.add("popup-box");
	selectorContainer.classList.add("compact");
	mainContainer.appendChild(selectorContainer);
	
	selectorContainer.appendChild(createText("Perspective"));
	var selector = createModeSelector(PERSPECTIVE_MODES,(event)=>
	{
		if(event.target.checked) perspectiveMode = event.target.value;
		onMode(event.target.value);
		
		needsUpdating = true;
	});
	selectorContainer.appendChild(selector);
	
	selectorContainer.appendChild(createText("Line Density"));
	var selector = createModeSelector(DENSITY_MODES,(event)=>
	{
		if(event.target.checked) densityMode = event.target.value;
		needsUpdating = true;
	});
	selectorContainer.appendChild(selector);
	
	selectorContainer.appendChild(createText("Snap Mode"));
	var selector = createModeSelector(CONSTRUCTION_LINE_MODES,(event)=>
	{
		if(event.target.checked)
		{
			// we must recast a string back to boolean
			snapMode = event.target.value === "true" ? true : false;
			onMode(perspectiveMode);
		}
		needsUpdating = true;
	});
	selectorContainer.appendChild(selector);
	
	selectorContainer.appendChild(createText("Show Construction Lines"));
	var selector = createModeSelector(CONSTRUCTION_LINE_MODES,(event)=>
	{
		if(event.target.checked)
		{
			// we must recast a string back to boolean
			constructionLineMode = event.target.value === "true" ? true : false;
		}
		needsUpdating = true;
	});
	selectorContainer.appendChild(selector);
	
	let hideAll = () => {
		if(!isModesContainerHidden) toggleModesContainer();
		if(!isNotesHidden) toggleNotes();
	}
	
	let showAll = () => {
		if(isModesContainerHidden) toggleModesContainer();
		if(isNotesHidden) toggleNotes();
	}
	
	let isUIHidden = () => {
		if(!isModesContainerHidden) return false;
		if(!isNotesHidden) return false;
		return true;
	}
	
	let toggleUI = () => {
		if(isUIHidden())
		{
			showAll();
		}
		else 
		{
			hideAll();
		}
	}
	
	let toggleModesContainer = () => {
		if(isModesContainerHidden)
		{
			selectorContainer.classList.remove("closed");
			isModesContainerHidden = false;
		}
		else 
		{
			selectorContainer.classList.add("closed");
			isModesContainerHidden = true;
		}
	}
	
	let toggleNotes = () => {
		if(isNotesHidden)
		{
			notesContainer.classList.remove("closed");
			isNotesHidden = false;
		}
		else 
		{
			notesContainer.classList.add("closed");
			isNotesHidden = true;
		}
	}
	
	var buttonsContainer = document.createElement("div");
	buttonsContainer.classList.add("fixed-bottom");
	buttonsContainer.classList.add("vertical-button-container");
	mainContainer.appendChild(buttonsContainer);
	
	var hideUIButton = document.createElement("button");
	hideUIButton.innerHTML = "UI";
	hideUIButton.classList.add("square-button");
	hideUIButton.onclick = toggleUI;
	buttonsContainer.appendChild(hideUIButton);
			
	var toggleNotesButton = document.createElement("button");
	toggleNotesButton.innerHTML = "?";
	toggleNotesButton.classList.add("square-button");
	toggleNotesButton.classList.add("front");
	toggleNotesButton.onclick = toggleNotes;
	buttonsContainer.appendChild(toggleNotesButton);
	
	var notesContainer = document.createElement("div");
	notesContainer.innerHTML = `
<h1>Notes</h1>
<p>Click and drag the coloured points to modify the grid.</p>
<p>Note that in order to allow you to manipulate the vanishing points, the canvas is larger than it needs to be. When actually making a grid, I'd advise you to crop somewhere around the center for the best results.</p>

<p>Notes on FOV degrees: What does a 45° field of view mean? In a literal sense, imagine an observer. Now project a cone from their eyes. Anything that cone touches is what the observer can see. Degrees of FOV determines how big that cone is. At 180° FOV, that cone is a hemisphere. At 360° FOV, the observer sees everything. But what does that mean on paper? From the standing point to the horizon line, a 60° FOV is also, conveniently, a 30° triangle, and at one of those points, we mark it as the 30 ° viewpoint.</p>

<p>Notes on perspective. 1-point perspective is easily prone to distortion. As an approximation, we assume the camera is really far away, and limit ourselves to less than ~50° of FOV for the least amount of distortion. For 2 or 3 point perspective, 60° of FOV is acceptable. In 4 point perspective, we are a cylinder. In 5 point perspective, we can achieve 180° FOV without distortion (that's half of a sphere, basically), and in 6 point perspective, we grow eyes on the back of our head and see 360° without distortion.</p>

<p>Notes on 1-point perspective: The red circle is the 60° FOV, which you are recommended to stay within when drawing. The green station point is the observer. Normally, we cannot see behind them unless we grow eyes on the back of our head!</p>
<p>By <a href="https://aivct.github.io">aivct</a>. Suggestions are welcome on <a href="https://github.com/aivct/aivct-js-art-toys/">github</a>.</p>`;
	notesContainer.classList.add("popup-box");
	notesContainer.classList.add("margin-left-50");
	notesContainer.classList.add("fixed-bottom");
	mainContainer.appendChild(notesContainer);
	
	// close notes at start 
	toggleNotes();
	
	// setup init 
	perspectivePoints.push(new PerspectivePoint(15,canvas.height/2));
	perspectivePoints.push(new PerspectivePoint(canvas.width-15,canvas.height/2));
	perspectivePoints.push(new PerspectivePoint(canvas.width/2,canvas.height-15));
	perspectivePoints.push(new PerspectivePoint(canvas.width/2,15));
	perspectivePoints.push(new PerspectivePoint(canvas.width/2,canvas.height/2));
	// https://termespheres.com/6-point-perspective/
	
	onMode("1-point");
	
	// draw for output
	window.requestAnimationFrame(draw);
}

function draw()
{
	if(needsUpdating)
	{
		context.clearRect(0,0,canvas.width,canvas.height);
		
		drawPerspective(context);
		
		drawTestCube(context);
		
		needsUpdating = false;
	}
	window.requestAnimationFrame(draw);
}

/**
 * @param options - an array of strings denoting each option
 * @param onclick - a function (event) => { return void } that is fired upon clicking any individual radio input
 */
function createModeSelector(options, onclick)
{
	let modeSelector = document.createElement("form");
	
	for(let index = 0; index < options.length; index++)
	{
		let optionString = options[index];
		// create the input
		let radioInput = document.createElement("input");
		radioInput.setAttribute("type","radio");
		radioInput.setAttribute("id","modeSelector_" + optionString);
		radioInput.setAttribute("name","mode");
		radioInput.setAttribute("value",optionString);
		radioInput.addEventListener("click", onclick);
		modeSelector.appendChild(radioInput);
		// the first one is assumed to be default
		if(index === 0) radioInput.setAttribute("checked",true);
		
		let radioLabel = document.createElement("label");
		radioLabel.innerHTML = optionString;
		radioLabel.setAttribute("for","radioLabel" + optionString);
		modeSelector.appendChild(radioLabel);
		
		modeSelector.appendChild(document.createElement("br"));
		
		"modeSelector_" + optionString
	}
	
	return modeSelector;
}

function onpointerdown(event)
{
	canvasBoundingRectangle = canvas.getBoundingClientRect();
	
	var pointerX = event.clientX - canvasBoundingRectangle.x;
	var pointerY = event.clientY - canvasBoundingRectangle.y;
	
	for(let index = 0; index < perspectivePoints.length; index++)
	{
		let perspectivePoint = perspectivePoints[index];
		// pointer down should ONLY be called once per click to prevent bleeding.
		if(perspectivePoint.onpointerdown(pointerX, pointerY)) return;
	}
	needsUpdating = true;
}

function onpointermove(event)
{
	canvasBoundingRectangle = canvas.getBoundingClientRect();
	
	var pointerX = event.clientX - canvasBoundingRectangle.x;
	var pointerY = event.clientY - canvasBoundingRectangle.y;
	
	for(let index = 0; index < perspectivePoints.length; index++)
	{
		let perspectivePoint = perspectivePoints[index];
		perspectivePoint.onpointermove(pointerX, pointerY);
	}
	needsUpdating = true;
}

function onpointerup(event)
{
	canvasBoundingRectangle = canvas.getBoundingClientRect();
	
	var pointerX = event.clientX - canvasBoundingRectangle.x;
	var pointerY = event.clientY - canvasBoundingRectangle.y;
	
	for(let index = 0; index < perspectivePoints.length; index++)
	{
		let perspectivePoint = perspectivePoints[index];
		perspectivePoint.onpointerup(pointerX, pointerY);
	}
	needsUpdating = true;
}

function onresize(event)
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	needsUpdating = true;
}

function onMode(mode)
{
	// clear all
	perspectivePoints[0].ondrag = null;
	perspectivePoints[1].ondrag = null;
	perspectivePoints[2].ondrag = null;
	perspectivePoints[3].ondrag = null;
	perspectivePoints[4].ondrag = null;
	
	let snapLeftRight = (x,y) => {
		let circlePositionOne = perspectivePoints[2].position;
		let circlePositionTwo = perspectivePoints[3].position;
		
		let midpoint = circlePositionOne.getMidpointTo(circlePositionTwo);
		let directionVector = circlePositionOne.clone();
		directionVector.minus(circlePositionTwo);
		
		let displacementVector = directionVector.clone();
		displacementVector.rotate(Math.PI/2);
		displacementVector.scale(1/2);
		
		perspectivePoints[0].position.x = midpoint.x + displacementVector.x;
		perspectivePoints[0].position.y = midpoint.y + displacementVector.y;
		
		displacementVector.scale(-1);
		perspectivePoints[1].position.x = midpoint.x + displacementVector.x;
		perspectivePoints[1].position.y = midpoint.y + displacementVector.y;
		
		// center the midpoint
		perspectivePoints[4].position.x = midpoint.x;
		perspectivePoints[4].position.y = midpoint.y;
	}
	
	let snapUpDown = (x,y) => {
		let circlePositionOne = perspectivePoints[0].position;
		let circlePositionTwo = perspectivePoints[1].position;
		
		let midpoint = circlePositionOne.getMidpointTo(circlePositionTwo);
		let directionVector = circlePositionOne.clone();
		directionVector.minus(circlePositionTwo);
		
		let displacementVector = directionVector.clone();
		displacementVector.rotate(-Math.PI/2);
		displacementVector.scale(1/2);
		
		perspectivePoints[2].position.x = midpoint.x + displacementVector.x;
		perspectivePoints[2].position.y = midpoint.y + displacementVector.y;
		
		displacementVector.scale(-1);
		perspectivePoints[3].position.x = midpoint.x + displacementVector.x;
		perspectivePoints[3].position.y = midpoint.y + displacementVector.y;
		
		// center the midpoint
		perspectivePoints[4].position.x = midpoint.x;
		perspectivePoints[4].position.y = midpoint.y;
	}
	
	let snapAll = (x,y) => {
		let circlePositionOne = perspectivePoints[2].position;
		let circlePositionTwo = perspectivePoints[3].position;
		
		let midpoint = perspectivePoints[4].position;
		let directionVector = circlePositionOne.clone();
		directionVector.minus(circlePositionTwo);
		
		let displacementVector = directionVector.clone();
		displacementVector.rotate(Math.PI/2);
		displacementVector.scale(1/2);
		
		perspectivePoints[0].position.x = midpoint.x + displacementVector.x;
		perspectivePoints[0].position.y = midpoint.y + displacementVector.y;
		
		displacementVector.scale(-1);
		perspectivePoints[1].position.x = midpoint.x + displacementVector.x;
		perspectivePoints[1].position.y = midpoint.y + displacementVector.y;
		
		// snap the rest 
		snapUpDown(x,y);
	}
	
	switch(mode)
	{
		case "curvilinear-5-point":
			if(snapMode)
			{
				perspectivePoints[2].ondrag = snapLeftRight;
				perspectivePoints[3].ondrag = snapLeftRight;
				
				perspectivePoints[0].ondrag = snapUpDown;
				perspectivePoints[1].ondrag = snapUpDown;
				
				perspectivePoints[4].ondrag = snapAll;
				// init
				snapLeftRight();
			}
			break;
		case "curvilinear-4-point":
			if(snapMode)
			{
				perspectivePoints[2].ondrag = snapLeftRight;
				perspectivePoints[3].ondrag = snapLeftRight;
				
				perspectivePoints[0].ondrag = snapUpDown;
				perspectivePoints[1].ondrag = snapUpDown;
				// init
				snapLeftRight();
			}
			break;
		case "3-point":
			if(snapMode)
			{
			}
			break;
		case "2-point":
			
			let snap2PointY = (x,y) => {
				perspectivePoints[0].position.y = y;
				perspectivePoints[1].position.y = y;
			}
			// for a 'SNAP' effect
			if(snapMode)
			{
				perspectivePoints[0].ondrag = snap2PointY;
				perspectivePoints[1].ondrag = snap2PointY;
			}
			break;
		case "1-point":
			let snap2PointX = (x,y) => {
				perspectivePoints[0].position.x = x;
				perspectivePoints[1].position.x = x;
			}
			if(snapMode)
			{
				perspectivePoints[0].ondrag = snap2PointX;
				perspectivePoints[1].ondrag = snap2PointX;
				// init 
				perspectivePoints[0].position.x = canvas.width/2;
				perspectivePoints[0].position.y = canvas.height/2;
				perspectivePoints[1].position.x = perspectivePoints[0].position.x;
				perspectivePoints[1].position.y = perspectivePoints[0].position.y + 400;
			}
			break;
	}
}

var perspectivePoints = [];

function drawPerspective(context)
{
	switch(perspectiveMode)
	{
		case "curvilinear-5-point":
			draw5PointCurvilinearPerspective(context);
			break;
		case "curvilinear-4-point":
			draw4PointCurvilinearPerspective(context);
			break;
		case "3-point":
			draw3PointLinearPerspective(context);
			break;
		case "2-point":
			draw2PointLinearPerspective(context);
			break;
		case "1-point":
		default:
			draw1PointLinearPerspective(context);
			break;
	}
}

function getLineCount()
{
	let lineCount = DENSITY_LOW_LINECOUNT;
	switch(densityMode)
	{
		case "very-high":
			lineCount = DENSITY_VERY_HIGH_LINECOUNT;
			break;
		case "high":
			lineCount = DENSITY_HIGH_LINECOUNT;
			break;
		case "medium":
			lineCount = DENSITY_MEDIUM_LINECOUNT;
			break;
		case "low":
		default:
			lineCount = DENSITY_LOW_LINECOUNT;
			break;
	}
	return lineCount;
}

/* 
	Each mode is hardcoded because there are different requirements.
	So, instead of having a byzantine layer of "if" statements,
	we can simply change what we want in individual functions,
	and as much as possible, repeated code has been factored out.
	
 */

function draw1PointLinearPerspective(context)
{	
	let lineCount = getLineCount();
	let firstPerspectivePoint = perspectivePoints[0];
	let stationPoint = perspectivePoints[1];
	
	// draw perspective points
	context.lineWidth = 0.25;
	context.strokeStyle = "black";
	drawPerspectiveLinesLinear(context, firstPerspectivePoint, lineCount);
	
	// draw guiding lines (and the construction too)
	drawHorizontalGuidingLines(context, firstPerspectivePoint, stationPoint, constructionLineMode);
		
	// draw the horizon line
	context.lineWidth = 1.0;
	context.strokeStyle = "red";
	context.beginPath();
	context.moveTo(0, firstPerspectivePoint.position.y);
	context.lineTo(canvas.width, firstPerspectivePoint.position.y);
	context.stroke();
	
	// draw the sole perspective point 
	var colour = lineColours[0];
	drawDraggableCircle(context, firstPerspectivePoint, colour); 
	
	// draw the S-point
	var colour = lineColours[1];
	drawDraggableCircle(context, stationPoint, colour); 
}

function draw2PointLinearPerspective(context)
{
	let lineCount = getLineCount();
	let firstPerspectivePoint = perspectivePoints[0];
	let secondPerspectivePoint = perspectivePoints[1];
	
	// draw perspective points
	context.lineWidth = 0.25;
	context.strokeStyle = "black";
	drawPerspectiveLinesLinear(context, firstPerspectivePoint, lineCount);
	drawPerspectiveLinesLinear(context, secondPerspectivePoint, lineCount);
	
	// draw the horizon line
	//context.lineWidth = 1.0;
	//context.strokeStyle = "red";
	//drawHorizonLine(context, firstPerspectivePoint);
	
	// draw the perspective points
	var colour = lineColours[0];
	drawDraggableCircle(context, firstPerspectivePoint, colour); 
	var colour = lineColours[1];
	drawDraggableCircle(context, secondPerspectivePoint, colour); 
}

function draw3PointLinearPerspective(context)
{
	let lineCount = getLineCount();
	let firstPerspectivePoint = perspectivePoints[0];
	let secondPerspectivePoint = perspectivePoints[1];
	let thirdPerspectivePoint = perspectivePoints[2];
	
	// draw perspective points
	context.lineWidth = 0.25;
	context.strokeStyle = "black";
	drawPerspectiveLinesLinear(context, firstPerspectivePoint, lineCount);
	drawPerspectiveLinesLinear(context, secondPerspectivePoint, lineCount);
	drawPerspectiveLinesLinear(context, thirdPerspectivePoint, lineCount);
	
	// draw the perspective points
	var colour = lineColours[0];
	drawDraggableCircle(context, firstPerspectivePoint, colour); 
	var colour = lineColours[1];
	drawDraggableCircle(context, secondPerspectivePoint, colour); 
	var colour = lineColours[2];
	drawDraggableCircle(context, thirdPerspectivePoint, colour); 
}

function draw4PointCurvilinearPerspective(context)
{
	let lineCount = getLineCount();
	let firstPerspectivePoint = perspectivePoints[0];
	let secondPerspectivePoint = perspectivePoints[1];
	let thirdPerspectivePoint = perspectivePoints[2];
	let fourthPerspectivePoint = perspectivePoints[3];
	
	// draw perspective points
	context.lineWidth = 0.25;
	context.strokeStyle = "black";
	
	let directionVector = thirdPerspectivePoint.position.clone();
	directionVector.minus(fourthPerspectivePoint.position);
	let angle = directionVector.getAngle();
	
	drawPerspectiveLinesLinear(context, firstPerspectivePoint, lineCount, angle-(Math.PI/2)-Math.PI/4, Math.PI/2);
	drawPerspectiveLinesLinear(context, secondPerspectivePoint, lineCount, angle+(Math.PI/2)-Math.PI/4, Math.PI/2);
	drawPerspectiveLinesCurvilinear(context, thirdPerspectivePoint, fourthPerspectivePoint, lineCount);
	
	// draw the perspective points
	var colour = lineColours[0];
	drawDraggableCircle(context, firstPerspectivePoint, colour); 
	var colour = lineColours[1];
	drawDraggableCircle(context, secondPerspectivePoint, colour); 
	var colour = lineColours[2];
	drawDraggableCircle(context, thirdPerspectivePoint, colour); 
	var colour = lineColours[3];
	drawDraggableCircle(context, fourthPerspectivePoint, colour); 
}

function draw5PointCurvilinearPerspective(context)
{
	let lineCount = getLineCount();
	let firstPerspectivePoint = perspectivePoints[0];
	let secondPerspectivePoint = perspectivePoints[1];
	let thirdPerspectivePoint = perspectivePoints[2];
	let fourthPerspectivePoint = perspectivePoints[3];
	let fifthPerspectivePoint = perspectivePoints[4];
	
	// draw perspective points
	context.lineWidth = 0.25;
	
	context.strokeStyle = "black";
	drawPerspectiveLinesCurvilinear(context, firstPerspectivePoint, secondPerspectivePoint, lineCount);
	
	context.strokeStyle = "black";
	drawPerspectiveLinesCurvilinear(context, thirdPerspectivePoint, fourthPerspectivePoint, lineCount);
	
	context.strokeStyle = "black";
	drawPerspectiveLinesLinear(context, fifthPerspectivePoint, lineCount);
	
	// draw the perspective points
	var colour = lineColours[0];
	drawDraggableCircle(context, firstPerspectivePoint, colour); 
	var colour = lineColours[1];
	drawDraggableCircle(context, secondPerspectivePoint, colour); 
	var colour = lineColours[2];
	drawDraggableCircle(context, thirdPerspectivePoint, colour); 
	var colour = lineColours[3];
	drawDraggableCircle(context, fourthPerspectivePoint, colour); 
	var colour = lineColours[4];
	drawDraggableCircle(context, fifthPerspectivePoint, colour); 
}

/* helper drawing functions */
// @param angleRadius - radius of the arc. 2PI is 360deg.
function drawPerspectiveLinesLinear(context, circle, lineCount = 32, startAngle = 0, angleRadius = Math.PI * 2)
{
	let position = circle.position;
	let x = position.x;
	let y = position.y;
		
	// add 1 final line as the endpoint
	for(let lineNumber = 0; lineNumber <= lineCount; lineNumber++)
	{
		// evenly spaced angles
		let angle = startAngle + ((angleRadius) * (lineNumber / (lineCount)));
		// // find intersection of radiating line and edge
		// quick and dirty get a vector and rotate it, but make it LOOONG. SHHHH.
		// TODO: probably change that...
		let line = new Vector(canvas.width + canvas.height, 0);
		line.rotate(angle);
		
		context.beginPath();
		context.moveTo(x,y);
		context.lineTo(x+line.x,y+line.y);
		context.closePath();
		context.stroke();
	}
}

function drawPerspectiveLinesCurvilinear(context, firstCircle, secondCircle, lineCount = 32)
{
	let x1 = firstCircle.position.x;
	let y1 = firstCircle.position.y;
	let x2 = secondCircle.position.x;
	let y2 = secondCircle.position.y;
	
	// get line and rotate 90deg
	let directionVector = (secondCircle.position.clone());
	directionVector.minus(firstCircle.position);
	let length = directionVector.getLength();
	directionVector.rotate(Math.PI / 2);
	
	// get midpoint
	let xm = (x1 + x2) / 2;
	let ym = (y1 + y2) / 2;
	
	for(let lineNumber = -lineCount/2; lineNumber < lineCount/2; lineNumber++)
	{
		// we must clone because there is a 0 scaling causing problems.
		// also error propagation and all that.
		let deltaVector = directionVector.clone();
		deltaVector.normalize();
		let maxLength = (length) / 0.75; //0.75 is not exact, but approximately good enough.
		deltaVector.scale( ((lineNumber) / (lineCount)) * maxLength); 
		
		
		// get control point
		let controlPointOne = new Vector(x1 + deltaVector.x, y1 + deltaVector.y);
		let controlPointTwo = new Vector(x2 + deltaVector.x, y2 + deltaVector.y);
		// quadratic!
		context.beginPath();
		context.moveTo(x1,y1);
		context.bezierCurveTo(controlPointOne.x, controlPointOne.y
			, controlPointTwo.x, controlPointTwo.y
			, x2, y2);
		context.stroke();
	}
	
	// for references
	context.strokeStyle = "red";
	context.beginPath();
	context.arc(xm,ym,length/2,0,Math.PI*2);
	context.stroke();
}

function drawDraggableCircle(context, circle, colour)
{
	if(colour) context.fillStyle = colour;
	context.beginPath();
	context.arc(circle.position.x,circle.position.y,circle.radius,0,Math.PI * 2);
	context.closePath();
	context.fill();
}

function drawHorizonLine(context, circle)
{
	// to the left and right of the circle to draw
	context.beginPath();
	context.moveTo(0, circle.position.y);
	context.lineTo(canvas.width, circle.position.y);
	context.stroke();
}

// draw guiding lines which are artistically accurate (TM)
function drawHorizontalGuidingLines(context, centerVanishingPoint, stationPoint, showConstructionLines = false)
{
	let lineCount = getLineCount();
	
	let constructionLineSize = Math.PI/16;
	if(densityMode === "medium") constructionLineSize = Math.PI/32;
	if(densityMode === "high") constructionLineSize = Math.PI/64;
	if(densityMode === "very-high") constructionLineSize = Math.PI/128;
	
	// abbreviated vars are all vectors, as courtesy variables
	/*
		CVP   - Center Vanishing Point
		SP    - Station Point
		VP30  - 30 Degree Vanishing Point
		VP45  - 45 Degree Vanishing Point
		FOV60 - 60 Degree Field of View
	 */
	let CVP = centerVanishingPoint.position;
	let SP = stationPoint.position;
	
	// calculate and derive everything.
	// really, all we need are CVP and SP, and the rest is courtesy.
	// we centralize the calculations here because... OCD. And good code, I guess.
	
	// lines
	let canvasBottomLine = new Line();
	canvasBottomLine.setByPointAndAngle(0, canvas.height, 0);
	let canvasLeftLine = new Line();
	canvasLeftLine.setByPointAndAngle(0,0,0);
	let canvasRightLine = new Line();
	canvasRightLine.setByPointAndAngle(canvas.width,0,0);
	// get30deg angle to horizon
	let horizonLine = new Line();
	horizonLine.setByPointAndAngle(CVP.x, CVP.y, 0);
	// right is 0, up is -Math.PI/2
	let VP30Line = new Line();
	VP30Line.setByPointAndAngle(SP.x, SP.y, -(Math.PI/3));
	let VP30 = VP30Line.getIntersection(horizonLine);
	
	let VP45Line = new Line();
	VP45Line.setByPointAndAngle(SP.x, SP.y, -(Math.PI/4));
	let VP45 = VP45Line.getIntersection(horizonLine);
	
	let FOV60Radius = VP30.getDistanceTo(CVP);
	
	// squareLines which coincide with perspective point lines
	let squareLeftLine = new Line();
	squareLeftLine.setByPointAndAngle(CVP.x, CVP.y, Math.PI/2 + constructionLineSize);
	let squareLeftLineEndPoint = squareLeftLine.getIntersection(canvasBottomLine);
	
	let squareRightLine = new Line();
	squareRightLine.setByPointAndAngle(CVP.x, CVP.y, Math.PI/2 - constructionLineSize);
	let squareRightLineEndPoint = squareRightLine.getIntersection(canvasBottomLine);
	
	/*
		we're being quite naive by literally doing as an artist does,
		using diagonal construction lines to inform our next square.
		this can introduce errors and is quite prone to propagation errors,
		but in absence of me figuring out what the formula is, it works well enough for now.
		
		programming note: most polynomials are a good enough approximation, but it'll always be off in both directions. it's not a simple polynomial.
	 */
	let previousLine = new Line();
	// init. the value was found empirically (ie, trial and error) but it shouldn't change the math.
	previousLine.setByPointAndAngle(VP45.x, VP45.y, Math.PI - Math.PI/24);
	for(let lineIndex = 0; lineIndex < lineCount; lineIndex++)
	{
		let leftIntersectionPoint = previousLine.getIntersection(squareLeftLine);
		/* 
			this will form part of our square. 
			from one diagonal to the next, 
			it will be capped by the next horizontal line
		 */
		let guidingHorizontalLine = new Line();
		guidingHorizontalLine.setByPointAndAngle(leftIntersectionPoint.x, leftIntersectionPoint.y, 0);
		
		let rightIntersectionPoint = guidingHorizontalLine.getIntersection(squareRightLine);
		// if we don't it wraps around to the top and breaks things.
		if(leftIntersectionPoint.x >= VP45.x) break;
		if(rightIntersectionPoint.x >= VP45.x) break;
		// now actually draw.
		context.beginPath();
		context.moveTo(0, leftIntersectionPoint.y);
		context.lineTo(canvas.width, rightIntersectionPoint.y);
		context.stroke();
		// draw it mirrored for the top
		var mirrorY = leftIntersectionPoint.y - CVP.y;
		mirrorY = CVP.y - mirrorY;
		context.beginPath();
		context.moveTo(0, mirrorY);
		context.lineTo(canvas.width, mirrorY);
		context.stroke();
		
		// construction lines!
		if(showConstructionLines)
		{
			// horizontal construction lines
			context.beginPath();
			context.moveTo(leftIntersectionPoint.x, leftIntersectionPoint.y);
			context.lineTo(rightIntersectionPoint.x, rightIntersectionPoint.y);
			context.stroke();
			// 45 deg construction legs
			context.beginPath();
			context.moveTo(VP45.x, VP45.y);
			context.lineTo(leftIntersectionPoint.x, leftIntersectionPoint.y);
			context.stroke();
		}
		
		// update for the next cycle
		previousLine = new Line();
		previousLine.setByTwoPoints(VP45.x, VP45.y, rightIntersectionPoint.x, rightIntersectionPoint.y);
	}
	
	// more construction lines!
	if(showConstructionLines)
	{
		context.strokeStyle = "black";
		context.lineWidth = 0.5;
		context.fillStyle = "black";
		
		// SP to CVP
		context.beginPath();
		context.moveTo(SP.x, SP.y);
		context.lineTo(CVP.x, CVP.y);
		context.stroke();
		
		// SP to VP30
		context.beginPath();
		context.moveTo(SP.x, SP.y);
		context.lineTo(VP30.x, VP30.y);
		context.stroke();
		
		// SP to VP45
		context.beginPath();
		context.moveTo(SP.x, SP.y);
		context.lineTo(VP45.x, VP45.y);
		context.stroke();
		
		// left and right square intersection for construction
		context.beginPath();
		context.moveTo(CVP.x, CVP.y);
		context.lineTo(squareLeftLineEndPoint.x, squareLeftLineEndPoint.y);
		context.stroke();
		
		context.beginPath();
		context.moveTo(CVP.x, CVP.y);
		context.lineTo(squareRightLineEndPoint.x, squareRightLineEndPoint.y);
		context.stroke();
		
		// 60 deg FOV cone circle
		context.strokeStyle = "red";
		context.beginPath();
		context.arc(CVP.x, CVP.y, FOV60Radius, 0, Math.PI * 2);
		context.stroke();
		
		// Labels
		// Offsets: Radius and Fontsize
		drawCenteredText(context, "CVP", CVP.x, CVP.y - 5 - FONT_SIZE);
		drawCenteredText(context, "SP", SP.x, SP.y - 5 - FONT_SIZE);
		drawCenteredText(context, "VP30", VP30.x, VP30.y - 5 - FONT_SIZE);
		drawCenteredText(context, "VP45", VP45.x, VP45.y - 5 - FONT_SIZE);
	}
}

// not a generalized draw function, we're just makin' a cube.
function drawTestCube(context)
{
	let cubeWidth = 250;
	let cubeHeight = 100;
	let cubeDepth = 150;
	
	if(perspectiveMode === "1-point")
	{
		let CVP = perspectivePoints[0].position;
		
		let startX = canvas.width - 100 - cubeWidth;
		let startY = 100;
		
		let TLLine = new Line();
		TLLine.setByTwoPoints(startX, startY, CVP.x, CVP.y);
		
		let TRLine = new Line();
		TRLine.setByTwoPoints(startX + cubeWidth, startY, CVP.x, CVP.y);

		let BRLine = new Line();
		BRLine.setByTwoPoints(startX + cubeWidth, startY + cubeHeight, CVP.x, CVP.y);

		let BLLine = new Line();
		BLLine.setByTwoPoints(startX, startY + cubeHeight, CVP.x, CVP.y);
		
		let directionVector = new Vector(startX, startY);
		directionVector.minus(CVP);
		directionVector.normalize();
		directionVector.scale(cubeDepth);
		directionVector.scale(-1);
		
		let BackLeftVertical = new Line();
		BackLeftVertical.setByPointAndAngle(startX + directionVector.x, 0, Math.PI/2);
		
		let TLIntersection = TLLine.getIntersection(BackLeftVertical);
		let BLIntersection = BLLine.getIntersection(BackLeftVertical);
		
		let BackTopHorizontal = new Line();
		BackTopHorizontal.setByPointAndAngle(TLIntersection.x, TLIntersection.y, 0);
		let BackBottomHorizontal = new Line();
		BackBottomHorizontal.setByPointAndAngle(BLIntersection.x, BLIntersection.y, 0);
		
		let TRIntersection = TRLine.getIntersection(BackTopHorizontal);
		let BRIntersection = BRLine.getIntersection(BackBottomHorizontal);
		
		// draw 
		let FTL = new Vector(startX, startY);
		let FTR = new Vector(startX + cubeWidth, startY);
		let FBL = new Vector(startX, startY + cubeHeight);
		let FBR = new Vector(startX + cubeWidth, startY + cubeHeight);
		
		let BTL = TLIntersection;
		let BTR = TRIntersection;
		let BBL = BLIntersection;
		let BBR = BRIntersection;
			
		drawCube(FTL, FTR, FBL, FBR, BTL, BTR, BBL, BBR);
		
		// left face
		
		if(constructionLineMode)
		{
			context.strokeStyle = "blue";
			context.lineWidth = 0.5;
			drawLineByTwoPoints(context, startX, startY, CVP.x, CVP.y);
			drawLineByTwoPoints(context, startX + cubeWidth, startY, CVP.x, CVP.y);
			drawLineByTwoPoints(context, startX + cubeWidth, startY + cubeHeight, CVP.x, CVP.y);
			drawLineByTwoPoints(context, startX, startY + cubeHeight, CVP.x, CVP.y);
		}
	}
}

function drawCube(FTL, FTR, FBL, FBR, BTL, BTR, BBL, BBR)
{
	// sometimes we lack a point, no big deal.
	if(!FTL || !FTR || !FBL || !FBR || !BTL || !BTR || !BBL || !BBR) return;
	
	context.strokeStyle = "red";
	context.lineWidth = 0.5;
	// back face
	context.fillStyle = "#027810";
	context.beginPath();
	context.moveTo(BTL.x, BTL.y);
	context.lineTo(BTR.x, BTR.y);
	context.lineTo(BBR.x, BBR.y);
	context.lineTo(BBL.x, BBL.y);
	context.closePath();
	context.fill();
	context.stroke();
	
	// right face
	context.fillStyle = "#027810";
	context.beginPath();
	context.moveTo(BTR.x, BTR.y);
	context.lineTo(FTR.x, FTR.y);
	context.lineTo(FBR.x, FBR.y);
	context.lineTo(BBR.x, BBR.y);
	context.closePath();
	context.fill();
	context.stroke();
	
	// top face
	context.fillStyle = "#013707";
	context.beginPath();
	context.moveTo(BTR.x, BTR.y);
	context.lineTo(FTR.x, FTR.y);
	context.lineTo(FTL.x, FTL.y);
	context.lineTo(BTL.x, BTL.y);
	context.closePath();
	context.fill();
	context.stroke();
	
	// bottom face
	context.fillStyle = "#05f020";
	context.beginPath();
	context.moveTo(BBL.x, BBL.y);
	context.lineTo(BBR.x, BBR.y);
	context.lineTo(FBR.x, FBR.y);
	context.lineTo(FBL.x, FBL.y);
	context.closePath();
	context.fill();
	context.stroke();
	
	// left face
	context.fillStyle = "#05e61f";
	context.beginPath();
	context.moveTo(BTL.x, BTL.y);
	context.lineTo(FTL.x, FTL.y);
	context.lineTo(FBL.x, FBL.y);
	context.lineTo(BBL.x, BBL.y);
	context.closePath();
	context.fill();
	context.stroke();
	
	// front face
	context.fillStyle = "#aafdb4";
	context.beginPath();
	context.moveTo(FTL.x, FTL.y);
	context.lineTo(FTR.x, FTR.y);
	context.lineTo(FBR.x, FBR.y);
	context.lineTo(FBL.x, FBR.y);
	context.closePath();
	context.fill();
	context.stroke();
	
}

// this is NOT a general draw font function. fontSize is baked in. We are using this mostly to be lazy.
function drawCenteredText(context, text, x, y)
{
	var textMetric = context.measureText(text);
	context.fillText(text, x - textMetric.width/2, y + FONT_SIZE/2);
}

function drawLineByTwoPoints(context, x1, y1, x2, y2)
{
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
}

// classes
function PerspectivePoint(x,y)
{
	DraggableCircle.call(this, x, y, this.DEFAULT_RADIUS);
}

PerspectivePoint.prototype.DEFAULT_RADIUS = 10;

ObjectUtilities.compositePrototype(PerspectivePoint, DraggableCircle);