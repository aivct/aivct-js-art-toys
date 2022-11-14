/**
	Do some tests.
 */
window.onload = function()
{
	initialize();
}

function initialize()
{
	addVectorTests();
	addLineTests();
	//addLineTests_Performance();
	
	TestingManager.runTests();
}