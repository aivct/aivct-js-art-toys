/**
	Dependencies: vector.js
 */
function addLineTests()
{
	console.log(`Adding line tests...`);
	
	/* Test the function Line.isEqual(line) */
	function TestLine_IsEqualWhenABCAreEqual()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(5, 6, 7);

		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsEqualWhenABCAreEqual",TestLine_IsEqualWhenABCAreEqual, true, "assertEquals");
	
	function TestLine_IsNotEqualWhenNotEqual()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(5, 6, 8);

		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsNotEqualWhenNotEqual",TestLine_IsNotEqualWhenNotEqual, false, "assertEquals");
	
	function TestLine_IsEqualWhenIsMultiple()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(10, 12, 14);

		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsEqualWhenIsMultiple",TestLine_IsEqualWhenIsMultiple, true, "assertEquals");
	
	/* Test the function Line.isParallel(line) */
	
	// again in JS we shall fudge a little. TECHNICALLY speaking, in regular math coincident lines are not parallel. 
	// for practical purposes, they are, especially when we're using it.
	// this is not an accidental mistake. this is an intentional design decision.
	function TestLine_IsParallelWhenCoincident()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(5, 6, 7);

		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsParallelWhenCoincident",TestLine_IsParallelWhenCoincident, true, "assertEquals");
	
	function TestLine_IsParallelWhenSlopeIsEqual()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(5, 6, 17);
		
		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsParallelWhenSlopeIsEqual",TestLine_IsParallelWhenSlopeIsEqual, true, "assertEquals");
	
	function TestLine_IsNotParallelWhenSlopeIsNotEqual()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(5, 7, 7);
		
		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsNotParallelWhenSlopeIsNotEqual",TestLine_IsNotParallelWhenSlopeIsNotEqual, false, "assertEquals");
	
	function TestLine_IsParallelWhenABIsMultiple()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(10, 12, 7);
		
		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsParallelWhenABIsMultiple",TestLine_IsParallelWhenABIsMultiple, true, "assertEquals");
	
	function TestLine_IsParallelWhenIsNegative()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(-5, -6, 7);
		
		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsParallelWhenIsNegative",TestLine_IsParallelWhenIsNegative, true, "assertEquals");
	/* Test the function Line.getIntersection(line) */
	
	// while technically there are infinite intersections
	// in practice we want ONE intersection, and so we give up and return null
	function TestLine_GetIntersectionReturnsNullIfCoincident()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(5, 6, 7);
		
		// guard statement just in case we screw up writing the test (somehow)
		if(!firstLine.equals(secondLine)) throw new Error(`Lines not coincident!`);
		
		return firstLine.getIntersection(secondLine);
	}	
	TestingManager.addTest("TestLine_GetIntersectionReturnsNullIfCoincident",TestLine_GetIntersectionReturnsNullIfCoincident, null, "assertEquals");
	
	// parallel lines never meet
	function TestLine_GetIntersectionReturnsNullIfParallel()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(10, 12, 7);
		
		// guard statement just in case we screw up writing the test (somehow)
		if(!firstLine.isParallel(secondLine)) throw new Error(`Lines not coincident!`);
		
		return firstLine.getIntersection(secondLine);
	}
	TestingManager.addTest("TestLine_GetIntersectionReturnsNullIfParallel",TestLine_GetIntersectionReturnsNullIfParallel, null, "assertEquals");
	
	function TestLine_GetIntersectionTwoLines()
	{
		// numbers come from a graphing calculator, so it should be correct
		var firstLine = new Line(1, 2, 3);
		var secondLine = new Line(2, 3, 4);
		
		return firstLine.getIntersection(secondLine);
	}
	TestingManager.addTest("TestLine_GetIntersectionTwoLines",TestLine_GetIntersectionTwoLines, new Vector(1, -2), "assertObjectEquals");
	
	function TestLine_GetIntersectionPerpendicularLines()
	{
		var firstLine = new Line(1, 2, 3);
		var secondLine = new Line(-2, 1, -6);
		
		return firstLine.getIntersection(secondLine);
	}
	TestingManager.addTest("TestLine_GetIntersectionPerpendicularLines",TestLine_GetIntersectionPerpendicularLines, new Vector(-3, 0), "assertObjectEquals");

}