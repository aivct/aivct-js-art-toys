/**
	Semi-abstract base class for a draggable object.
	Override isInBounds for specific shape implementations.
	We use (x,y) in most pointer related contexts because that's what we are given, 
		but where possible, we use a vector because it's got the calculation utils baked in.
		
	Dependencies: vector.js
 */
function Draggable(x,y)
{
	this.position = new Vector(x,y);
	
	this.pointerdown = null;
	this.isBeingDragged = false;
	
	this.ondrag;
}

Draggable.prototype.isInBounds = function(point){};

Draggable.prototype.onpointerdown = function(x,y)
{
	if(this.isInBounds(x,y))
	{
		this.pointerdown = new Vector(x,y);
		this.isBeingDragged = true;
		return true; // pointer down can ONLY apply to one at a time. This is set a flag to let the caller know.
	}
	// just in case 
	this.pointerdown = null;
	this.isBeingDragged = false;
	return false;
}

Draggable.prototype.onpointermove = function(x,y)
{
	if(!(this.pointerdown && this.isBeingDragged))
	{
		return;
	}
	// TODO: fix
	// // Consider a rectangle. We don't want a 'jump' to cursor when the user clicks on it. Therefore, we use the difference from pointerdown as an offset.
	//let offsetX =  this.pointerdown.x - this.position.x;
	//let offsetY =  this.pointerdown.y - this.position.y;

	this.position.x = (x);
	this.position.y = (y);
	
	if(this.ondrag) this.ondrag(x,y);
}

Draggable.prototype.onpointerup = function(x,y)
{
	this.isBeingDragged = false;
}

function DraggableCircle(x,y,radius)
{
	Draggable.call(this,x,y);
	this.radius = radius;
}

ObjectUtilities.inheritPrototype(DraggableCircle,Draggable);

DraggableCircle.prototype.isInBounds = function(x,y)
{
	let point = new Vector(x,y);
	let distance = point.getDistanceTo(this.position);
	if(distance <= this.radius) return true;
	return false;
}