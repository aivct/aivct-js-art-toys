/**
	High school trig comes back to haunt me.
	by aivct
	
	TODO: implement/integrate fractions from somewhere
	
	Dependencies: vector.js
 */
 
/**
	Creates a line in the form of ax + by + c = 0
	They can be left blank. Use the setSomething functions if you want to use a different form.
	When a is 0 (ie by = -c), then tis a horizontal line.
	When b is 0 (ie ax = -c), then tis a vertical line
 */
function Line(a,b,c)
{
	this.a = a;
	this.b = b;
	this.c = c;
}

Line.prototype.getIntersection = function(line)
{
	// coincident lines have infinite intersections! 
	if(this.equals(line)) return null;
	// parallel lines do not intersect
	if(this.isParallel(line)) return null;

	// TODO: special case for solid vertical and solid horizontal lines

	// algebraically, we normalize both lines and eliminate x, solve for y, and substitute back in for x
	let y = ((this.a * line.c) - (line.a * this.c)) / ((line.a * this.b) - (this.a * line.b));
	let x = -(this.c + (this.b * y))/this.a
	
	return new Vector(x, y);
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

/*
	This is going to be slow because of the fudging, which is necessary due to floating point errors.
	Comparisons WILL break down at infinity, which are NOT valid states. Use 0's instead.
 */
Line.prototype.equals = function(line)
{
	if(!line) 
	{
		console.warn(`Line.equals(line): line is null.`);
		return false;
	}
	const PRECISION = 15;
	// special case for when a is 0
	if(this.a === 0 || line.a === 0)
	{
		// to be clear, negative 0 is equal to positive 0.
		if(
			this.a === line.a
			&&(this.b / this.b).toPrecision(PRECISION) === (line.b / line.b).toPrecision(PRECISION)
			&& (this.c / this.b).toPrecision(PRECISION) === (line.c / line.b).toPrecision(PRECISION))
		{
			return true;
		}
		return false;
	}
	// fudge because floating point errors.
	// remember floating point, is, well, floating.
	// that means if you have more than 16 digits to the left of the decimal point, than there is no decimal.
	// ie, 1e16 + 1/3 has no decimal, while 1e15 + 1/3 results in 1000000000000000.4
	// thus, we use toPrecision() in our fudging instead of toFixed(), as you might expect.
	if((this.a / this.a).toPrecision(PRECISION) === (line.a / line.a).toPrecision(PRECISION)
		&& (this.b / this.a).toPrecision(PRECISION) === (line.b / line.a).toPrecision(PRECISION)
		&& (this.c / this.a).toPrecision(PRECISION) === (line.c / line.a).toPrecision(PRECISION))
	{
		return true;
	}
	return false;
}

Line.prototype.setByTwoPoints = function(x1, y1, x2, y2)
{
	// get slope
	let m = (y2 - y1) / (x2 - x1);
	// get intercept by substitution
	let b = y1 - (m * x1);
	// set a b c
	this.a = -m;
	this.b = 1;
	this.c = -b;
	
	// special case for vertical lines
	if(x1 === x2)
	{
		this.a = 1;
		this.b = 0;
		this.c = -x1;
	}
}

/**
	Angle basis shall be clockwise with 0 at (1,0);
	That means a straight line to the right is theta zero, 
		and we go down and to the left at first as theta increases.
 */
Line.prototype.setByPointAndAngle = function(x1, y1, theta)
{
	let m = -Math.tan(theta); // but we must make it a negative because js angles are... weird?
	// Math.tan(Math.PI) is ever slightly off zero, so we must fudge it.
	if(theta === Math.PI) m = 0;
	let b = y1 - (m * x1);
	
	// set a b c
	this.a = -m;
	this.b = 1;
	this.c = -b;
	
	// Normalize the angle, because -30deg is equal to 360deg, 
	// and extra steps just in case someone has -14139deg or something...
	let normalizedAngle = (((theta % Math.PI) + (2 * Math.PI)) % (2 * Math.PI));
	if(normalizedAngle === Math.PI/2 || normalizedAngle === 3 * Math.PI / 2)
	{
		this.a = 1;
		this.b = 0;
		this.c = -x1;
	}
}
/*
	NOT SUPPORTED
	// TODO: Horizontal and vertical normalization
Line.prototype.normalize = function()
{
	let a = this.a;
	this.a = this.a / a;
	this.b = this.b / a;
	this.c = this.c / a;
}
 */