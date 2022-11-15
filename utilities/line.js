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

Line.prototype.PRECISION = 15; // constant for floating point significant figures.

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
	const PRECISION = this.PRECISION;
	// special case for horizontal lines 
	if(this.sigFig15Equals(this.a, 0) || this.sigFig15Equals(line.a, 0))
	{
		if(this.sigFig15Equals(this.a, line.a)
			&& this.sigFig15Equals(this.b / this.b, line.b / line.b))
		{
			return true;
		}
		return false;
	}
	
	// if slope is equal, they are parallel
	// to get slope, we divide both by their own a's in case they are multiples of each other
	if(this.sigFig15Equals(this.a / this.a, line.a / line.a)
		&& this.sigFig15Equals(this.b / this.a, line.b / line.a))
	{
		return true;
	}
	return false;
}

// We do not support infinities. Use 0 instead.
Line.prototype.isHorizontal = function()
{
	if(this.a === 0) return true;
	return false;
}

Line.prototype.isVertical = function()
{
	if(this.b === 0) return true;
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
	// special case for when a is 0
	if(this.sigFig15Equals(this.a, 0) || this.sigFig15Equals(line.a, 0))
	{
		// we keep b/b comparisons to suss out NaN and Infinities (hopefully)
		if(this.sigFig15Equals(this.a, line.a)
			&& this.sigFig15Equals(this.b / this.b, line.b / line.b)
			&& this.sigFig15Equals(this.c / this.b, line.c / line.b))
		{
			return true;
		}
		return false;
	}
	
	if(this.sigFig15Equals(this.a / this.a, line.a / line.a)
		&& this.sigFig15Equals(this.b / this.a, line.b / line.a)
		&& this.sigFig15Equals(this.c / this.a, line.c / line.a))
	{
		return true;
	}
	return false;
}

/**
	So called because we only compare 15 significant figures,
		effectively shaving off the last digit in floating point calculations.
	Remember floating point, is, well, floating, and keeps only a limited amount (16) of sig figs.	
		1e16 + 1/3 has no decimal, while 1e15 + 1/3 results in 1000000000000000.4
	It is relatively slow for a simple function.
 */
Line.prototype.sigFig15Equals = function(a, b)
{	
	let precision = 15;
	return (a).toPrecision(precision) === (b).toPrecision(precision);
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