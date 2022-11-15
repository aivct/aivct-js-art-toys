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
	
	function TestLine_IsEqualWhenFloatingPoint()
	{
		var firstLine = new Line(5, 6, 7);
		// to simulate floating point error from a reproduced bug
		let m = (-7 - 3) / (7 - -5);
		let b = 3 - (m * -5);
		var secondLine = new Line(-m, 1, -b);
		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsEqualWhenFloatingPoint",TestLine_IsEqualWhenFloatingPoint, true, "assertEquals");
	
	// it should not crash, at the very least
	function TestLine_IsEqualWhenNull()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = null;
		
		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsEqualWhenNull",TestLine_IsEqualWhenNull, false, "assertEquals");
	
	function TestLine_IsEqualWhenZeroA()
	{
		var firstLine = new Line(0, 6, 7);
		var secondLine = new Line(0, 6, 7);

		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsEqualWhenZeroA",TestLine_IsEqualWhenZeroA, true, "assertEquals");
	
	function TestLine_IsEqualWhenZeroAMultiples()
	{
		var firstLine = new Line(0, 6, 7);
		var secondLine = new Line(0, 12, 14);

		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsEqualWhenZeroAMultiples",TestLine_IsEqualWhenZeroAMultiples, true, "assertEquals");
	
	function TestLine_IsNotEqualWhenZeroA()
	{
		var firstLine = new Line(0, 6, 7);
		var secondLine = new Line(5, 6, 7);

		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsNotEqualWhenZeroA",TestLine_IsNotEqualWhenZeroA, false, "assertEquals");
	
	function TestLine_IsEqualWhenZeroB()
	{
		var firstLine = new Line(5, 0, 7);
		var secondLine = new Line(5, 0, 7);

		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsEqualWhenZeroB",TestLine_IsEqualWhenZeroB, true, "assertEquals");
	
	function TestLine_IsEqualWhenZeroBMultiples()
	{
		var firstLine = new Line(5, 0, 7);
		var secondLine = new Line(10, 0, 14);

		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsEqualWhenZeroBMultiples",TestLine_IsEqualWhenZeroBMultiples, true, "assertEquals");
	
	function TestLine_IsEqualWhenZeroAll()
	{
		var firstLine = new Line(0, 0, 0);
		var secondLine = new Line(0, 0, 0);

		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsEqualWhenZeroAll",TestLine_IsEqualWhenZeroAll, true, "assertEquals");
	
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
	
	function TestLine_IsParallelTwoVertical()
	{
		var firstLine = new Line(1, 0, -5);
		var secondLine = new Line(1, 0, -4);
		
		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsParallelTwoVertical",TestLine_IsParallelTwoVertical, true, "assertEquals");
	
	function TestLine_IsParallelTwoVerticalMultiples()
	{
		var firstLine = new Line(1, 0, -5);
		var secondLine = new Line(2, 0, -10);
		
		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsParallelTwoVerticalMultiples",TestLine_IsParallelTwoVerticalMultiples, true, "assertEquals");
	
	function TestLine_IsParallelTwoHorizontal()
	{
		var firstLine = new Line(0, 1, -5);
		var secondLine = new Line(0, 1, -4);
		
		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsParallelTwoHorizontal",TestLine_IsParallelTwoHorizontal, true, "assertEquals");
	
	function TestLine_IsParallelTwoHorizontalMultiples()
	{
		var firstLine = new Line(0, 1, -5);
		var secondLine = new Line(0, 2, -10);
		
		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsParallelTwoHorizontalMultiples",TestLine_IsParallelTwoHorizontalMultiples, true, "assertEquals");
	
	function TestLine_IsNotParallelVerticalHorizontal()
	{
		var firstLine = new Line(1, 0, -5);
		var secondLine = new Line(0, 1, -5);
		
		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsNotParallelVerticalHorizontal",TestLine_IsNotParallelVerticalHorizontal, false, "assertEquals");
	
	function TestLine_IsNotParallelOneVertical()
	{
		var firstLine = new Line(1, 0, -5);
		var secondLine = new Line(1, 2, -5);
		
		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsNotParallelOneVertical",TestLine_IsNotParallelOneVertical, false, "assertEquals");
	
	function TestLine_IsNotParallelOneHorizontal()
	{
		var firstLine = new Line(0, 1, -5);
		var secondLine = new Line(1, 2, -5);
		
		return firstLine.isParallel(secondLine);
	}
	TestingManager.addTest("TestLine_IsNotParallelOneHorizontal",TestLine_IsNotParallelOneHorizontal, false, "assertEquals");
	
	/* Test isHorizontal and isVertical */
	function TestLine_IsHorizontalZeroA()
	{
		var firstLine = new Line(0, 1, -5);
		
		return firstLine.isHorizontal();
	}
	TestingManager.addTest("TestLine_IsHorizontalZeroA",TestLine_IsHorizontalZeroA, true, "assertEquals");
	
	function TestLine_IsNotHorizontalNotZeroA()
	{
		var firstLine = new Line(7, 1, -5);
		
		return firstLine.isHorizontal();
	}
	TestingManager.addTest("TestLine_IsNotHorizontalNotZeroA",TestLine_IsNotHorizontalNotZeroA, false, "assertEquals");
	
	function TestLine_IsVerticalZeroB()
	{
		var firstLine = new Line(7, 0, -5);
		
		return firstLine.isVertical();
	}
	TestingManager.addTest("TestLine_IsVerticalZeroB",TestLine_IsVerticalZeroB, true, "assertEquals");
	
	function TestLine_IsNotVerticalNotZeroB()
	{
		var firstLine = new Line(7, 1, -5);
		
		return firstLine.isVertical();
	}
	TestingManager.addTest("TestLine_IsNotVerticalNotZeroB",TestLine_IsNotVerticalNotZeroB, false, "assertEquals");
	
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
		
	function TestLine_GetIntersectionTwoHorizontalReturnsNull()
	{
		var firstLine = new Line(0, 1, -3);
		var secondLine = new Line(0, 1, -4);
		
		return firstLine.getIntersection(secondLine);
	}
	TestingManager.addTest("TestLine_GetIntersectionTwoHorizontalReturnsNull",TestLine_GetIntersectionTwoHorizontalReturnsNull, null, "assertEquals");
	
	function TestLine_GetIntersectionTwoVerticalReturnsNull()
	{
		var firstLine = new Line(1, 0, -3);
		var secondLine = new Line(1, 0, -4);
		
		return firstLine.getIntersection(secondLine);
	}
	TestingManager.addTest("TestLine_GetIntersectionTwoVerticalReturnsNull",TestLine_GetIntersectionTwoVerticalReturnsNull, null, "assertEquals");
	
	function TestLine_GetIntersectionOneVertical()
	{
		var firstLine = new Line(2, -3, 5);
		var secondLine = new Line(2, 0, -4);
		
		return firstLine.getIntersection(secondLine);
	}
	TestingManager.addTest("TestLine_GetIntersectionOneVertical",TestLine_GetIntersectionOneVertical, new Vector(2, 3), "assertObjectEquals");
	
	function TestLine_GetIntersectionOneHorizontal()
	{
		var firstLine = new Line(2, -3, 5);
		var secondLine = new Line(0, 3, -9);
		
		return firstLine.getIntersection(secondLine);
	}
	TestingManager.addTest("TestLine_GetIntersectionOneHorizontal",TestLine_GetIntersectionOneHorizontal, new Vector(2, 3), "assertObjectEquals");
	
	function TestLine_GetIntersectionHorizontalVertical()
	{
		var firstLine = new Line(2, 0, -4);
		var secondLine = new Line(0, 3, -9);
		
		return firstLine.getIntersection(secondLine);
	}
	TestingManager.addTest("TestLine_GetIntersectionHorizontalVertical",TestLine_GetIntersectionHorizontalVertical, new Vector(2, 3), "assertObjectEquals");
	
	/* Test the function Line.setByTwoPoints(x1, y1, x2, y2) */
	function TestLine_SetByTwoPoints()
	{
		var firstLine = new Line();
		
		firstLine.setByTwoPoints(-5, 3, 7, -7);
		
		// note, assertObjectEquals uses the Line.equals function since we have provided it.
		// even though we rely on the equals function, we already tested it and any bugs will be reflected in the earlier tests.
		return firstLine;
	}
	TestingManager.addTest("TestLine_SetByTwoPoints",TestLine_SetByTwoPoints, new Line(5, 6, 7), "assertObjectEquals");
	
	// special case where the line is vertical. 
	// any infinities are NOT a valid solution, we take only x=7 as a solution (that means b = 0)
	function TestLine_SetByTwoPointsVertical()
	{
		var firstLine = new Line();
		
		firstLine.setByTwoPoints(7, 7, 7, -5);
		
		return firstLine;
	}
	TestingManager.addTest("TestLine_SetByTwoPointsVertical",TestLine_SetByTwoPointsVertical, new Line(1, 0, -7), "assertObjectEquals");
	
	// ditto for horizontal, y=-5
	function TestLine_SetByTwoPointsHorizontal()
	{
		var firstLine = new Line();
		
		firstLine.setByTwoPoints(1, -5, 7, -5);
		return firstLine;
	}
	TestingManager.addTest("TestLine_SetByTwoPointsHorizontal",TestLine_SetByTwoPointsHorizontal, new Line(0, 1, 5), "assertObjectEquals");
	
	/* Test the function Line.setByPointAndAngle(x1, y1, theta) */
	function TestLine_SetByPointAndAngle()
	{
		var firstLine = new Line();
		firstLine.setByPointAndAngle(1, 4, Math.PI/6);
		
		return firstLine;
	}
	TestingManager.addTest("TestLine_SetByPointAndAngle",TestLine_SetByPointAndAngle, new Line(1/Math.sqrt(3),1,-(4+1/(Math.sqrt(3)))), "assertObjectEquals");
	
	// Add 180deg should still produce the same line.
	function TestLine_SetByPointAndAnglePlusPi()
	{
		var firstLine = new Line();
		firstLine.setByPointAndAngle(1, 4, Math.PI/6 + Math.PI);
		
		return firstLine;
	}
	TestingManager.addTest("TestLine_SetByPointAndAnglePlusPi",TestLine_SetByPointAndAnglePlusPi, new Line(1/Math.sqrt(3),1,-(4+1/(Math.sqrt(3)))), "assertObjectEquals");
	
	function TestLine_SetByPointAndAngleNegativeAngle()
	{
		var firstLine = new Line();
		firstLine.setByPointAndAngle(1, 4, -(Math.PI/6));
		
		return firstLine;
	}
	TestingManager.addTest("TestLine_SetByPointAndAngleNegativeAngle",TestLine_SetByPointAndAngleNegativeAngle, new Line(-1/Math.sqrt(3),1,-(4-1/(Math.sqrt(3)))), "assertObjectEquals");
	
	function TestLine_SetByPointAndAngleVerticalHalfPi()
	{
		var firstLine = new Line();
		firstLine.setByPointAndAngle(1, 4, Math.PI/2);
		
		return firstLine;
	}
	TestingManager.addTest("TestLine_SetByPointAndAngleVerticalHalfPi",TestLine_SetByPointAndAngleVerticalHalfPi, new Line(1,0,-1), "assertObjectEquals");
	
	function TestLine_SetByPointAndAngleVerticalNegativeHalfPi()
	{
		var firstLine = new Line();
		firstLine.setByPointAndAngle(1, 4, -(Math.PI/2));
		
		return firstLine;
	}
	TestingManager.addTest("TestLine_SetByPointAndAngleVerticalNegativeHalfPi",TestLine_SetByPointAndAngleVerticalNegativeHalfPi, new Line(1,0,-1), "assertObjectEquals");
	
	function TestLine_SetByPointAndAngleHorizontalPi()
	{
		var firstLine = new Line();
		firstLine.setByPointAndAngle(1, 4, Math.PI);
		
		return firstLine;
	}
	TestingManager.addTest("TestLine_SetByPointAndAngleHorizontalPi",TestLine_SetByPointAndAngleHorizontalPi, new Line(0,1,-4), "assertObjectEquals");
	
	function TestLine_SetByPointAndAngleZero()
	{
		var firstLine = new Line();
		firstLine.setByPointAndAngle(1, 4, 0);
		
		return firstLine;
	}
	TestingManager.addTest("TestLine_SetByPointAndAngleZero",TestLine_SetByPointAndAngleZero, new Line(0,1,-4), "assertObjectEquals");
	
	// Note bene: sigFig15Equals should be factored out into its own module.
	// Yet, for sake for convenience we will not, for now, until we have enough functions that can be factored out.
	// Thus, we will not test it for now, assuming that present tests are enough coverage (there IS a floating point test somewhere here).
}

// these are stress tests and should not be used in production
function addLineTests_Performance()
{
	console.log(`Adding line tests for performance...`);
	
	function TestLine_IsEqualPerformance1000()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(5, 6, 7);

		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsEqualPerformance1000",TestLine_IsEqualPerformance1000, true, "assertEquals", 1000);
	
	
	function TestLine_IsEqualPerformance10000()
	{
		var firstLine = new Line(5, 6, 7);
		var secondLine = new Line(5, 6, 7);

		return firstLine.equals(secondLine);
	}
	TestingManager.addTest("TestLine_IsEqualPerformance10000",TestLine_IsEqualPerformance10000, true, "assertEquals", 10000);
}