/**
	High school trig comes back to haunt me.
	by aivct
	
	Dependencies: vector.js
 */
 
/**
	Creates a line in the form of ax + by + c = 0
	They can be left blank. Use the setSomething functions if you want to use a different form.
 */
function Line(a,b,c)
{
	this.a = a;
	this.b = b;
	this.c = c;
}

Line.prototype.setByTwoPoints = function(x1, y1, x2, y2)
{
	
}

/**
	Angle basis shall be CW with 0 at (1,0);
	That means a straight line to the right is theta zero.
 */
Line.prototype.setByPointAndAngle = function(x1, y1, theta)
{
	
}

Line.prototype.getIntersection = function(line)
{
	// coincident lines have infinite intersections! 
	if(this.equals(line)) return null;
	// parallel lines do not intersect
	if(this.isParallel(line)) return null;
	
	return new Vector(1, -2);
}

Line.prototype.isParallel = function(line)
{
	// if slope is equal, they are parallel
	// to get slope, we divide both by their own a's in case they are multiples of each other
	if(this.a / this.a === line.a / line.a
		&& this.b / this.a === line.b / line.a)
	{
		return true;
	}
	return false;
}

Line.prototype.equals = function(line)
{
	if(this.a / this.a === line.a / line.a
		&& this.b / this.a === line.b / line.a
		&& this.c / this.a === line.c / line.a)
	{
		return true;
	}
	return false;
}