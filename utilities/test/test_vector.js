/**
	Disable when used in other settings...
 */
function addVectorTests()
{
	console.log(`Adding vector tests...`);
	
	function fudgeEquals(value, comparison, fudge)
	{
		if(Math.abs(value - comparison) <= fudge) return true;
		return false;
	}
	
	function TestVectorRotate_RotateZeroIsSame()
	{
		var testVector = new Vector(1,0);
		var theta = 0;
		testVector.rotate(0);
		var expected = new Vector(1,0);
		return fudgeEquals(testVector.x, expected.x, 0.01) && fudgeEquals(testVector.y, expected.y, 0.01);
	}
	TestingManager.addTest("TestVectorRotate_RotateZeroIsSame",TestVectorRotate_RotateZeroIsSame, true, "assertEquals");
	
	function TestVectorRotate_RotateQuarterOnce()
	{
		var testVector = new Vector(1,0);
		var theta = 0;
		testVector.rotate(Math.PI/2);
		var expected = new Vector(0,1);
		return fudgeEquals(testVector.x, expected.x, 0.01) && fudgeEquals(testVector.y, expected.y, 0.01);
	}
	TestingManager.addTest("TestVectorRotate_RotateQuarterOnce",TestVectorRotate_RotateQuarterOnce, true, "assertEquals");
	
	function TestVectorRotate_RotateQuarterTwice()
	{
		var testVector = new Vector(1,0);
		var theta = 0;
		testVector.rotate(Math.PI/2);
		testVector.rotate(Math.PI/2);
		var expected = new Vector(-1,0);
		return fudgeEquals(testVector.x, expected.x, 0.01) && fudgeEquals(testVector.y, expected.y, 0.01);
	}
	TestingManager.addTest("TestVectorRotate_RotateQuarterTwice",TestVectorRotate_RotateQuarterTwice, true, "assertEquals");
	
	function TestVectorRotate_RotateQuarterThrice()
	{
		var testVector = new Vector(1,0);
		var theta = 0;
		testVector.rotate(Math.PI/2);
		testVector.rotate(Math.PI/2);
		testVector.rotate(Math.PI/2);
		var expected = new Vector(0,-1);
		return fudgeEquals(testVector.x, expected.x, 0.01) && fudgeEquals(testVector.y, expected.y, 0.01);
	}
	TestingManager.addTest("TestVectorRotate_RotateQuarterThrice",TestVectorRotate_RotateQuarterThrice, true, "assertEquals");
	
	function TestVectorRotate_RotateQuarterQuadrice()
	{
		var testVector = new Vector(1,0);
		var theta = 0;
		testVector.rotate(Math.PI/2);
		testVector.rotate(Math.PI/2);
		testVector.rotate(Math.PI/2);
		testVector.rotate(Math.PI/2);
		var expected = new Vector(1,0);
		return fudgeEquals(testVector.x, expected.x, 0.01) && fudgeEquals(testVector.y, expected.y, 0.01);
	}
	TestingManager.addTest("TestVectorRotate_RotateQuarterQuadrice",TestVectorRotate_RotateQuarterQuadrice, true, "assertEquals");
}