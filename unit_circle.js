/*
 *  Because angles also have to be weird in JS.
 *  
 *  by aivct
 *  MIT License.
 *  
 *  NOTE: if you are reading this, this is quick and dirty code.
 *  For sake of your own sanity, I suggest you read eloquent JS.
 */

var canvas;
var context;
var needsUpdating = true;
var unitMode = "Radians";
var draggables = [];

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
	createModeSelector(["Radians","Degrees","PI"],(event)=>
	{
		if(event.target.checked) unitMode = event.target.value;
		needsUpdating = true;
	});
	// init 
	var angleSelector = new DraggableCircle(canvas.width/2+200,canvas.height/2,10);
	angleSelector.ondrag = (x,y) => 
	{
		let centerVector = new Vector(canvas.width/2, canvas.height/2);
		let positionVector = new Vector(x,y);
		
		positionVector.minus(centerVector);
		positionVector.normalize();
		positionVector.scale(200);
		positionVector.add(centerVector);
		
		angleSelector.position.set(positionVector);
	}
	draggables.push(angleSelector);
	// draw for output
	window.requestAnimationFrame(draw);
}


function draw()
{
	if(needsUpdating)
	{
		// prep the canvas
		context.clearRect(0,0,canvas.width,canvas.height);
		
		let fontSize = 18;
		let font = "Times New Roman";
				
		var centerX = canvas.width / 2;
		var centerY = canvas.height / 2;
		
		context.fillStyle = "black";
		context.font = fontSize + "px " + font;
		context.lineWidth = 0.5;
		
		// draw the basis vectors
		context.strokeStyle = "grey";
		
		context.beginPath();
		context.moveTo(centerX, 0);
		context.lineTo(centerX, canvas.height);
		context.stroke();
		
		context.beginPath();
		context.moveTo(0, centerY);
		context.lineTo(canvas.width, centerY);
		context.stroke();
		
		var text = "(1,0)";
		var textMetric = context.measureText(text);
		context.fillText(text, canvas.width - textMetric.width - 5, centerY - fontSize/2);
		
		var text = "(-1,0)";
		var textMetric = context.measureText(text);
		context.fillText(text, 0 + 5, centerY - fontSize/2);
		
		var text = "(0,-1)";
		var textMetric = context.measureText(text);
		context.fillText(text, centerX + 5, 0 + fontSize);
		
		var text = "(0,1)";
		var textMetric = context.measureText(text);
		context.fillText(text, centerX + 5, canvas.height - fontSize/2);
		// draw the unit circle
		let radius = 200;
		let segmentCount = 360/15;
		
		for(let count = 0; count < segmentCount; count++)
		{
			// draw the arc section
			
			let angleStart = (count / segmentCount) * (2 * Math.PI);
			let angleEnd = ((count + 1) / segmentCount) * (2 * Math.PI);
			
			context.strokeStyle = count % 2 === 0 ? "red" : "blue";
			context.beginPath();
			context.arc(centerX, centerY, radius, angleStart, angleEnd);
			context.stroke();
			
			// draw the lines
			let vector = new Vector(200, 0); // we use a fresh vector to prevent accumulated errors of the rotate function
			vector.rotate(angleStart);
			
			context.strokeStyle = "black";
			context.beginPath();
			context.moveTo(centerX, centerY);
			context.lineTo(centerX + vector.x, centerY + vector.y);
			context.stroke();
			
			// draw the numbers
			vector = new Vector(235, 0); // use a little bigger angle to move the text away
			vector.rotate(angleStart);
			var text = angleStart;
			if(unitMode === "Radians")
			{
				text = (angleStart).toFixed(2) + "rad";
			}
			else if(unitMode === "Degrees")
			{
				text = ((angleStart / Math.PI) * 180).toFixed(0) + "°";
			}
			else if(unitMode === "PI")
			{
				text = (angleStart / Math.PI).toFixed(2) + "π";
			}
			var textMetric = context.measureText(text);
			context.fillText(text, centerX + vector.x - (textMetric.width/2)
				, centerY + vector.y + (fontSize/2));
		}
		// draw the angle selector
		var angleSelector = draggables[0];
		drawCircle(context, angleSelector, "red");
		
		context.lineWidth = 2;
		context.strokeStyle = "red";
		context.beginPath();
		context.moveTo(centerX, centerY);
		context.lineTo(angleSelector.position.x, angleSelector.position.y);
		context.stroke();
		
		let angleVector = new Vector(angleSelector.position.x - centerX, angleSelector.position.y - centerY);
		var text = angleVector.getAngle().toFixed(2);
		var textMetric = context.measureText(text);
		// draw a white patch first for text visibility 
		context.fillStyle = "white";
		context.fillRect(angleSelector.position.x + 12
			,angleSelector.position.y-fontSize/2
			,textMetric.width
			,fontSize);
		context.fillStyle = "black";
		context.fillText(text, angleSelector.position.x + 12, angleSelector.position.y + fontSize/2 - 2);
		
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

function drawCircle(context, circle, colour)
{
	if(colour) context.fillStyle = colour;
	context.beginPath();
	context.arc(circle.position.x,circle.position.y,circle.radius,0,Math.PI * 2);
	context.closePath();
	context.fill();
}
