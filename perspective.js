// TODO: add option for 1, 2, or 3 point perspective 
	// TODO: add regular grid lines for 1, 2 point 
// TODO: add 4, 5, 6 point perspective of arcing

window.onload = function()
{
	initialize();
}

var canvas;
var context;
var needsUpdating = true;
// colours of each new point
var lineColours = ["#f745b6","#a1fc40","#3ee8fe","#f8fe3e","#fe8e3e","#fe3efe"];

function initialize()
{
	canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 600;
	document.body.appendChild(canvas);
	
	canvas.addEventListener("mousedown",onmousedown, false);
	canvas.addEventListener("mouseup",onmouseup, false);
	canvas.addEventListener("mousemove",onmousemove, false);
	
	context = canvas.getContext("2d");
	// setup init 
	perspectivePoints.push(new PerspectivePoint(15,100));
	perspectivePoints.push(new PerspectivePoint(canvas.width-15,100));
	perspectivePoints.push(new PerspectivePoint(canvas.width/2,canvas.height-15));
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
	for(let index = 0; index < perspectivePoints.length; index++)
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
		const LINE_COUNT = 100;
		for(let lineNumber = 0; lineNumber < LINE_COUNT; lineNumber++)
		{
			// evenly spaced angles
			let angle = (Math.PI * 2) * (lineNumber / LINE_COUNT);
			// // find intersection of radiating line and edge
			// quick and dirty get a vector and rotate it, but make it LOOONG. SHHHH.
			// TODO: probably change that...
			let line = new Vector(1000,0);
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

ObjectUtilities.compositePrototype(PerspectivePoint, DraggableCircle)
{
	
}