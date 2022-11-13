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
	
	TestingManager.runTests();
}