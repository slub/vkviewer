Tips, Tricks and Documentation for the development
==================================================

## Run in development mode

	./python_env/bin/pserve development.ini --reload

## Run Tests

Running the test of your pyramid application.
	
	./python_env/bin/python setup.py test	## runs all tests
	./python_env/bin/python setup.py test --test-module vkviewer.python.tests.views.utils.TestSuite ## runs specific TestSuite


## Tips & Tricks

PYRAMID_RELOAD_TEMPLATES=1 ./python_env/bin/pserve development.ini --reload 
