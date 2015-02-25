# Documentation of the python backend modules

A documentation is very important for developers to understand and use python components such as modules, classes, functions and methods. An API reference is typically generates from the code (docstrings). It will list all publicy available interfaces, parameters and return values.


## Code Documentation Advice

In Python comments begin with a hash (#) and docstrings describe modules, classes and functions. A documentation string (docstring) is a string that describes the operation of the function or class. The docstring is a special attribute of the object (`object.__doc__`) and, for consistendy, is surrounded by triple qoutes. Docstrings who are embedded in a Python source code should be short, completed and helpful. The <a href="http://python.org/dev/peps/pep-0257/">PEP 257 - Docstring Convention</a> explains the semantics and conventions associated with Python docstrings.

### Docstring markup - reST

Python docstrings can be written in several formats. The default Epydoc docstring format is `epytext`, a javadoc like style.  Epydoc also understands docstrings written in ReStructuredText, Javadoc, and plaintext. 

In the docstring we use a subset of the `reStructuredText` (abbreviated as `reST`) features. `reST` is an extensible markup language that is often use to write Python documents. The reST is recommended by the <a href="http://python.org/dev/peps/pep-0287/">PEP 287</a>. It is more powerful than epytext and we can switch documentation generators later if we want to.
`reST` was developed in conjunction with `Docutils`. In order to parse reStructuredText docstrings, `Docutils 0.3` or higher must be installed.


### The use of Epydoc

We currently use <a href="http://epydoc.sourceforge.net/">Epydoc</a> for generating the API and reference documentation for the python modules of the vkviewer. `Epydoc`is a documentation tool for Python project and code documentation. Epydoc can convert reST documents into many different output formats inluding HTML, PDF or even plain text. 

Epydoc provides two user interfaces:

	* The command line interface `epydoc`
	* the graphical interface `epydocgui`
	
Install the following packages:

	python-epydoc (3.0.1)
	
This package contains the epydoc and epydocgui commands, their manpages, and their associated Python modules. 

After Epydoc is installed, write:

	epydoc -v --output path/to/doc --docformat reStructuredText modulename/

Configuration files, specified using the `--config` option, may be used to specify both the list of objects to document, and the options that should be used to document them. If you wish to exclude certain sub-modules or sub-packages, use the `--exclude` option.
If you have setup a configuration file, you can run the command:

	~/vkviewer/doc-pak/doc-api $ epydoc --config epydoc.config

## Example

	"""
	Module description
	:Date: 2015-02-20
	:Authors: name
	:Version: 1.0.1
	:Copyright: 
	"""
		
	def calculateTierSize(imageWidth, imageHeight, tileSize=256):
	    """The function calculate the number of tiles per tier.
	    
	    :type imageWidth: Float
	    :type imageHeight: Float
	    :type tileSize: Integer
	    :param tileSize: Default is 256 pixel
	    :return: tierSizeInTiles   
	    :rtype: Array 
	    """
	    tierSizeInTiles = []
	    while (imageWidth > tileSize or imageHeight > tileSize):
	        tileWidth = imageWidth / tileSize
	        tileHeight = imageHeight / tileSize
	        tierSizeInTiles.append([math.ceil(tileWidth), math.ceil(tileHeight)])
	        tileSize += tileSize
	    tierSizeInTiles.append([1.0, 1.0])      
	    return tierSizeInTiles
	    

The details of the reST-markup may be found <a href="http://docutils.sourceforge.net/docs/user/rst/quickref.html">here</a>.

		

