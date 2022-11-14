// TODO: add option for 1, 2, or 3 point perspective 
	// TODO: add regular grid lines for 1, 2 point 
// TODO: add 4, 5, 6 point perspective of arcing
// TODO: add THESE as defaults 
	// TODO: https://www.sketchlikeanarchitect.com/blog/what-type-of-perspective-should-you-choose

// different methods for perspective: https://www.artistsnetwork.com/art-mediums/learn-to-draw-perspective/
// notes: implement this instead: https://learn.toonboom.com/modules/stay-on-point-with-new-rulers-and-guides/topic/3-point-perspective-horizontal-pan

window.onload = function()
{
	initialize();
}

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
	canvas.width = 800 * 2;
	canvas.height = 600 * 2;
	document.body.appendChild(canvas);
	
	canvas.addEventListener("mousedown",onmousedown, false);
	canvas.addEventListener("mouseup",onmouseup, false);
	canvas.addEventListener("mousemove",onmousemove, false);
	
	context = canvas.getContext("2d");
	
	// create more UI 
	createModeSelector(PERSPECTIVE_MODES,(event)=>
	{
		if(event.target.checked) perspectiveMode = event.target.value;
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
	
	// draw for output
	window.requestAnimationFrame(draw);
}

function draw()
{
	if(needsUpdating)
	{
		context.clearRect(0,0,canvas.width,canvas.height);
		
		drawPerspective(context);
		drawCubes(context);
		
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

var perspectivePoints = [];

function drawPerspective(context)
{
	// I shall commit a sin and use decimals in canvas, but it's okay because it's not frequently updated
	context.lineWidth = 0.25;
	
	let pointsToDisplay = 3;
	if(perspectiveMode === "1-point")
	{
		pointsToDisplay = 1;
	}
	else if(perspectiveMode === "2-point")
	{
		pointsToDisplay = 2;
	}
	else if(perspectiveMode === "3-point")
	{
		pointsToDisplay = 3;
	}
	else if(perspectiveMode === "curvilinear-4-point")
	{
		pointsToDisplay = 4;
	}
	else if(perspectiveMode === "curvilinear-5-point")
	{
		pointsToDisplay = 5;
	}
	
	for(let index = 0; index < pointsToDisplay; index++)
	{
		let colour = lineColours[index];
		context.fillStyle = colour;
		context.strokeStyle = colour;
		
		let perspectivePoint = perspectivePoints[index];
		let x = perspectivePoint.position.x;
		let y = perspectivePoint.position.y;
		let radius = perspectivePoint.radius;
		
		context.beginPath();
		context.arc(x,y,radius,0,Math.PI * 2);
		context.closePath();
		context.stroke();
		context.fill();
		
		// draw lines radiating to edge from origin
		let lineCount = 80;
		if(densityMode === "very-high")
		{
			lineCount = 256;
		}
		else if(densityMode === "high")
		{
			lineCount = 128;
		}
		else if(densityMode === "medium")
		{
			lineCount = 64;
		}
		else if(densityMode === "low")
		{
			lineCount = 32;
		}
		
		context.strokeStyle = "black";
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
}

function drawCubes(context)
{
	
}

// classes
function PerspectivePoint(x,y)
{
	DraggableCircle.call(this, x, y, this.DEFAULT_RADIUS);
}

PerspectivePoint.prototype.DEFAULT_RADIUS = 10;

ObjectUtilities.compositePrototype(PerspectivePoint, DraggableCircle);