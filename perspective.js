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

var canvas;
var context;
var needsUpdating = true;

var perspectiveMode = "1-point";
const PERSPECTIVE_MODES = ["1-point","2-point","3-point","curvilinear-4-point", "curvilinear-5-point"];

var densityMode = "low";
const DENSITY_MODES = ["low","medium","high", "very-high"];

// colours of each new point
var lineColours = ["#f745b6","#a1fc40","#3ee8fe","#f8fe3e","#fe8e3e","#fe3efe"];

function initialize()
{
	canvas = document.createElement("canvas");
	canvas.width = 800 * 3;
	canvas.height = 600 * 3;
	document.body.appendChild(canvas);
	
	canvas.addEventListener("mousedown",onmousedown, false);
	canvas.addEventListener("mouseup",onmouseup, false);
	canvas.addEventListener("mousemove",onmousemove, false);
	
	context = canvas.getContext("2d");
	
	// create more UI 
	createModeSelector(PERSPECTIVE_MODES,(event)=>
	{
		if(event.target.checked) perspectiveMode = event.target.value;
		onMode(event.target.value);
		
		needsUpdating = true;
	});
	
	createModeSelector(DENSITY_MODES,(event)=>
	{
		if(event.target.checked) densityMode = event.target.value;
		needsUpdating = true;
	});
	
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
	document.body.appendChild(modeSelector);
}

function onmousedown(event)
{
	canvasBoundingRectangle = canvas.getBoundingClientRect();
	
	var mouseX = event.clientX - canvasBoundingRectangle.x;
	var mouseY = event.clientY - canvasBoundingRectangle.y;
	
	for(let index = 0; index < perspectivePoints.length; index++)
	{
		let perspectivePoint = perspectivePoints[index];
		// mouse down should ONLY be called once per click to prevent bleeding.
		if(perspectivePoint.onmousedown(mouseX, mouseY)) return;
	}
	needsUpdating = true;
}

function onmousemove(event)
{
	canvasBoundingRectangle = canvas.getBoundingClientRect();
	
	var mouseX = event.clientX - canvasBoundingRectangle.x;
	var mouseY = event.clientY - canvasBoundingRectangle.y;
	
	for(let index = 0; index < perspectivePoints.length; index++)
	{
		let perspectivePoint = perspectivePoints[index];
		perspectivePoint.onmousemove(mouseX, mouseY);
	}
	needsUpdating = true;
}

function onmouseup(event)
{
	canvasBoundingRectangle = canvas.getBoundingClientRect();
	
	var mouseX = event.clientX - canvasBoundingRectangle.x;
	var mouseY = event.clientY - canvasBoundingRectangle.y;
	
	for(let index = 0; index < perspectivePoints.length; index++)
	{
		let perspectivePoint = perspectivePoints[index];
		perspectivePoint.onmouseup(mouseX, mouseY);
	}
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
	switch(mode)
	{
		// todo: snap for 5-point
		case "curvilinear-4-point":
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
			}
			
			perspectivePoints[2].ondrag = snapLeftRight;
			perspectivePoints[3].ondrag = snapLeftRight;
			// init
			snapLeftRight();
			break;
		case "3-point":
			break;
		case "2-point":
			let snap2PointY = (x,y) => {
				perspectivePoints[0].position.y = y;
				perspectivePoints[1].position.y = y;
			}
			// for a 'SNAP' effect
			perspectivePoints[0].ondrag = snap2PointY;
			perspectivePoints[1].ondrag = snap2PointY;
			break;
		case "1-point":
			let snap2PointX = (x,y) => {
				perspectivePoints[0].position.x = x;
				perspectivePoints[1].position.x = x;
			}
			perspectivePoints[0].ondrag = snap2PointX;
			perspectivePoints[1].ondrag = snap2PointX;
			// init 
			perspectivePoints[1].position.x = perspectivePoints[0].position.x;
			perspectivePoints[1].position.y = perspectivePoints[0].position.y + 400;
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
	let showMoreLines = true;
	let mirrorVertical = true;
	
	let lineCount = getLineCount();
	let firstPerspectivePoint = perspectivePoints[0];
	let stationPoint = perspectivePoints[1];
	
	let canvasBottomLine = new Line();
	canvasBottomLine.setByPointAndAngle(0, canvas.height, 0);
	let canvasLeftLine = new Line();
	canvasLeftLine.setByPointAndAngle(0,0,0);
	let canvasRightLine = new Line();
	canvasRightLine.setByPointAndAngle(canvas.width,0,0);
	
	// get30deg angle to horizon
	let horizonLine = new Line();
	horizonLine.setByPointAndAngle(firstPerspectivePoint.position.x, firstPerspectivePoint.position.y, 0);
	
	// right is 0, up is -Math.PI/2
	let VP30Line = new Line();
	VP30Line.setByPointAndAngle(stationPoint.position.x, stationPoint.position.y, -(Math.PI/3));
	// get intersection 
	let VP30Point = VP30Line.getIntersection(horizonLine);
	
	let VP45Line = new Line();
	VP45Line.setByPointAndAngle(stationPoint.position.x, stationPoint.position.y, -(Math.PI/4));
	// get intersection 
	let VP45Point = VP45Line.getIntersection(horizonLine);
	let FOV60Radius = VP30Point.getDistanceTo(firstPerspectivePoint.position);
	
	// squareLines which coincide with perspective point lines
	let constructionLineSize = Math.PI/16;
	if(densityMode === "medium") constructionLineSize = Math.PI/32;
	if(densityMode === "high") constructionLineSize = Math.PI/64;
	if(densityMode === "very-high") constructionLineSize = Math.PI/128;
	
	let squareLeftLine = new Line();
	squareLeftLine.setByPointAndAngle(firstPerspectivePoint.position.x, firstPerspectivePoint.position.y, Math.PI/2 + constructionLineSize);
	
	let squareLeftLine_BottomIntersectionPoint = squareLeftLine.getIntersection(canvasBottomLine);
	
	let squareRightLine = new Line();
	squareRightLine.setByPointAndAngle(firstPerspectivePoint.position.x, firstPerspectivePoint.position.y, Math.PI/2 - constructionLineSize);
	
	let squareRightLine_BottomIntersectionPoint = squareRightLine.getIntersection(canvasBottomLine);
	
	// draw perspective points
	context.lineWidth = 0.25;
	context.strokeStyle = "black";
	drawPerspectiveLinesLinear(context, firstPerspectivePoint, lineCount);
	
	// draw guiding lines up and down
	// drawGuidingLines(context, firstPerspectivePoint, lineCount, -1);
	// drawGuidingLines(context, firstPerspectivePoint, lineCount, 1);
	
	// temp
	let previousY = 0;
	
	let previousLine = new Line();
	previousLine.setByPointAndAngle(VP45Point.x, VP45Point.y, Math.PI - Math.PI/24);
	for(let lineNumber = 0; lineNumber < lineCount; lineNumber++)
	{
		// intersection of previousLine and the left
		let leftIntersectionPoint = previousLine.getIntersection(squareLeftLine);
		
		// when the the leftmost intersection is actually GREATER than the VP X, then it's time to pack it up.
		// we do not grow eyes on the back of our head. Save that for 6-point perspective.
		if(leftIntersectionPoint.x >= VP45Point.x) break;
		
		// horizontal
		let guidingHorizontalLine = new Line();
		guidingHorizontalLine.setByPointAndAngle(leftIntersectionPoint.x, leftIntersectionPoint.y, 0);
		
		let rightIntersectionPoint = guidingHorizontalLine.getIntersection(squareRightLine);
		
		if(rightIntersectionPoint.x >= VP45Point.x) break;
		
		// get nextLine
		previousLine = new Line();
		previousLine.setByTwoPoints(VP45Point.x, VP45Point.y, rightIntersectionPoint.x, rightIntersectionPoint.y);
		// draw guidingLines
		context.beginPath();
		context.moveTo(0, leftIntersectionPoint.y);
		context.lineTo(canvas.width, rightIntersectionPoint.y);
		context.stroke();
		if(mirrorVertical)
		{
			var mirrorY = leftIntersectionPoint.y - firstPerspectivePoint.position.y;
			mirrorY = firstPerspectivePoint.position.y - mirrorY;
			context.beginPath();
			context.moveTo(0, mirrorY);
			context.lineTo(canvas.width, mirrorY);
			context.stroke();
		}
		
		if(showMoreLines)
		{
			// horizontal construction lines
			context.beginPath();
			context.moveTo(leftIntersectionPoint.x, leftIntersectionPoint.y);
			context.lineTo(rightIntersectionPoint.x, rightIntersectionPoint.y);
			context.stroke();
			// 45 deg construction legs
			context.beginPath();
			context.moveTo(VP45Point.x, VP45Point.y);
			context.lineTo(leftIntersectionPoint.x, leftIntersectionPoint.y);
			context.stroke();
		}
		//console.log(leftIntersectionPoint.y - previousY);
		//console.log(leftIntersectionPoint.y/previousY);
		previousY = leftIntersectionPoint.y;
	}
	
	// draw the horizon line
	context.lineWidth = 1.0;
	context.strokeStyle = "red";
	drawHorizonLine(context, firstPerspectivePoint);
	
	// show additional lines 
	if(showMoreLines)
	{
		// SP to CVP
		context.strokeStyle = "black";
		context.beginPath();
		context.moveTo(stationPoint.position.x, stationPoint.position.y);
		context.lineTo(firstPerspectivePoint.position.x, firstPerspectivePoint.position.y);
		context.stroke();
		
		// SP to VP30
		context.beginPath();
		context.moveTo(stationPoint.position.x, stationPoint.position.y);
		context.lineTo(VP30Point.x, VP30Point.y);
		context.stroke();
		
		// SP to VP45
		context.beginPath();
		context.moveTo(stationPoint.position.x, stationPoint.position.y);
		context.lineTo(VP45Point.x, VP45Point.y);
		context.stroke();
		
		// left and right square intersection for construction
		context.beginPath();
		context.moveTo(firstPerspectivePoint.position.x, firstPerspectivePoint.position.y);
		context.lineTo(squareLeftLine_BottomIntersectionPoint.x, squareLeftLine_BottomIntersectionPoint.y);
		context.stroke();
		
		context.beginPath();
		context.moveTo(firstPerspectivePoint.position.x, firstPerspectivePoint.position.y);
		context.lineTo(squareRightLine_BottomIntersectionPoint.x, squareRightLine_BottomIntersectionPoint.y);
		context.stroke();
		
		// 60 deg FOV cone circle
		context.strokeStyle = "red";
		context.beginPath();
		context.arc(firstPerspectivePoint.position.x, firstPerspectivePoint.position.y, FOV60Radius, 0, Math.PI * 2);
		context.stroke();
	}
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
	context.lineWidth = 1.0;
	context.strokeStyle = "red";
	drawHorizonLine(context, firstPerspectivePoint);
	
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
	
	drawPerspectiveLinesLinear(context, firstPerspectivePoint, lineCount);
	drawPerspectiveLinesLinear(context, secondPerspectivePoint, lineCount);
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

function drawPerspectiveLinesLinear(context, circle, lineCount = 32)
{
	let position = circle.position;
	let x = position.x;
	let y = position.y;
	
	for(let lineNumber = 0; lineNumber < lineCount; lineNumber++)
	{
		// evenly spaced angles
		let angle = (Math.PI * 2) * (lineNumber / lineCount);
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
	let radius = 2000;
	
	context.beginPath();
	context.moveTo(circle.position.x - radius, circle.position.y);
	context.lineTo(circle.position.x + radius, circle.position.y);
	context.stroke();
}

function drawGuidingLines(context, circle, lineCount, direction = 1)
{
	// to the left and right of the circle to draw
	let radius = 2000;
	// up and down too
	let initialOffset = 100;
	
	for(var index = 0; index < lineCount; index++)
	{
		let y = direction * (index * index * (100 / lineCount) + initialOffset);
		
		context.beginPath();
		context.moveTo(circle.position.x - radius, circle.position.y + y);
		context.lineTo(circle.position.x + radius, circle.position.y + y);
		context.stroke();
	}
}

// classes
function PerspectivePoint(x,y)
{
	DraggableCircle.call(this, x, y, this.DEFAULT_RADIUS);
}

PerspectivePoint.prototype.DEFAULT_RADIUS = 10;

ObjectUtilities.compositePrototype(PerspectivePoint, DraggableCircle);