/**
	High school trig comes back to haunt me.
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