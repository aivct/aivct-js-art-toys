/*
 *  A toy for figuring out quadratic and bezier intuitively in JS.
 *  Click and drag is FUN!
 *  
 *  by aivct
 *  MIT License.
 *  
 *  NOTE: if you are reading this, this is quick and dirty code.
 *  For sake of your own sanity, I suggest you read eloquent JS.
 */

var draggables = [];
var canvas;
var context;
var needsUpdating = true;
var mode = "quadratic";

window.onload = function()
{
	initialize();
}
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
	// make more UI
	createModeSelector();
	// setup init 
	draggables.push(new DraggableCircle(50,20,10));
	draggables.push(new DraggableCircle(230,30,10));
	draggables.push(new DraggableCircle(230,70,10));
	draggables.push(new DraggableCircle(50,100,10));
	// draw for output
	window.requestAnimationFrame(draw);
}

function createModeSelector()
{
	let modeSelector = document.createElement("form");

	let modeSelectorQuadratic = document.createElement("input");
	modeSelectorQuadratic.setAttribute("type","radio");
	modeSelectorQuadratic.setAttribute("id","modeSelector_quadratic");
	modeSelectorQuadratic.setAttribute("name","mode");
	modeSelectorQuadratic.setAttribute("value","quadratic");
	modeSelector.appendChild(modeSelectorQuadratic);
	modeSelectorQuadratic.setAttribute("checked",true);
	modeSelectorQuadratic.addEventListener("click",(event)=>
	{
		if(event.target.checked) mode = event.target.value;
		needsUpdating = true;
	});
	
	let modeSelectorQuadraticLabel = document.createElement("label");
	modeSelectorQuadraticLabel.innerHTML = "Quadratic";
	modeSelectorQuadraticLabel.setAttribute("for","modeSelector_quadratic");
	modeSelector.appendChild(modeSelectorQuadraticLabel);
	
	modeSelector.appendChild(document.createElement("br"));
	
	let modeSelectorBezier = document.createElement("input");
	modeSelectorBezier.setAttribute("type","radio");
	modeSelectorBezier.setAttribute("id","modeSelector_bezier");
	modeSelectorBezier.setAttribute("name","mode");
	modeSelectorBezier.setAttribute("value","bezier");
	modeSelector.appendChild(modeSelectorBezier);
	modeSelectorBezier.addEventListener("click",(event)=>
	{
		if(event.target.checked) mode = event.target.value;
		needsUpdating = true;
	});
	
	let modeSelectorBezierLabel = document.createElement("label");
	modeSelectorBezierLabel.innerHTML = "Bezier";
	modeSelectorBezierLabel.setAttribute("for","modeSelector_bezier");
	modeSelector.appendChild(modeSelectorBezierLabel);

	document.body.appendChild(modeSelector);
	
}

function draw()
{
	if(needsUpdating)
	{
		context.clearRect(0,0,canvas.width,canvas.height);
		
		drawCurve(context);
		
		needsUpdating = false;
	}
	window.requestAnimationFrame(draw);
}

function drawCurve(context)
{
	// these curves are fixed
	let originPoint = draggables[0];
	let controlPointOne = draggables[1];
	let controlPointTwo = draggables[2];
	let endPoint = draggables[3];
	
	let directionVector = originPoint.position.clone();
	directionVector.minus(endPoint.position);
	let length = directionVector.getLength();
	let midPointVector = originPoint.position.clone();
	midPointVector.add(endPoint.position);
	midPointVector.scale(1/2);
	// draw red guideline
	context.strokeStyle = "red";
	context.beginPath();
	context.arc(midPointVector.x, midPointVector.y, length/2, 0, Math.PI * 2);
	context.stroke();
	
	// draw the points
	drawCircle(context,originPoint,"blue");
	drawCircle(context,controlPointOne,"red");
	if(mode === "bezier") drawCircle(context,controlPointTwo,"red");
	drawCircle(context,endPoint,"blue");
	
	if(mode === "quadratic")
	{
		// draw the quadratic curve
		context.strokeStyle = "black";
		context.beginPath();
		context.moveTo(originPoint.position.x, originPoint.position.y);
		context.quadraticCurveTo(controlPointOne.position.x, controlPointOne.position.y, endPoint.position.x, endPoint.position.y);
		context.stroke();
	}
	else if(mode === "bezier")
	{
		// draw the bezier curve
		context.strokeStyle = "black";
		context.beginPath();
		context.moveTo(originPoint.position.x, originPoint.position.y);
		context.bezierCurveTo(controlPointOne.position.x, controlPointOne.position.y, controlPointTwo.position.x, controlPointTwo.position.y, endPoint.position.x, endPoint.position.y);
		context.stroke();
	}
	
}

function drawCircle(context, circle, colour)
{
	if(colour) context.fillStyle = colour;
	context.beginPath();
	context.arc(circle.position.x,circle.position.y,circle.radius,0,Math.PI * 2);
	context.closePath();
	context.fill();
}

function onmousedown(event)
{
	canvasBoundingRectangle = canvas.getBoundingClientRect();
	
	var mouseX = event.clientX - canvasBoundingRectangle.x;
	var mouseY = event.clientY - canvasBoundingRectangle.y;
	
	for(let index = 0; index < draggables.length; index++)
	{
		let draggable = draggables[index];
		// mouse down should ONLY be called once per click to prevent bleeding.
		if(draggable.onmousedown(mouseX, mouseY)) return;
	}
	needsUpdating = true;
}

function onmousemove(event)
{
	canvasBoundingRectangle = canvas.getBoundingClientRect();
	
	var mouseX = event.clientX - canvasBoundingRectangle.x;
	var mouseY = event.clientY - canvasBoundingRectangle.y;
	
	for(let index = 0; index < draggables.length; index++)
	{
		let draggable = draggables[index];
		draggable.onmousemove(mouseX, mouseY);
	}
	needsUpdating = true;
}

function onmouseup(event)
{
	canvasBoundingRectangle = canvas.getBoundingClientRect();
	
	var mouseX = event.clientX - canvasBoundingRectangle.x;
	var mouseY = event.clientY - canvasBoundingRectangle.y;
	
	for(let index = 0; index < draggables.length; index++)
	{
		let draggable = draggables[index];
		draggable.onmouseup(mouseX, mouseY);
	}
	needsUpdating = true;
}
