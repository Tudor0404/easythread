#################
Documented Design
#################

***********
Flow Charts
***********
.. figure:: /_static/images/general-system-flowchart.png
    :alt: general system flowchart
    :align: center 
    
    Abstracted general system flowchart

**************
Libraries used
**************

Libraries in web development are essential, a lot of edge cases and standards exist which need to be abstracted.

User Interface
==============

react
	Framework to create user interfaces

react-popper
	Helper module to obtain correct absolute positioning for tooltips

react-storage-hooks
	Saves data in a key key-value, which is easily accessible with react hooks 

react-usestateref
	Extension of the default use-state hook offered by react, which allows for immediate access of the data

use-resize-observer
	observer for when the window size changes, easily accessible with react hooks

tailwindcss
	Utility CSS framework, allows for quick designing of elements

headlessui
	Small collection of react tailwind components which abstracts some data handling

Conversion Algorithm
====================

element-to-path
	Converts any type of SVG shape into its path alternative

svgson 
	Transforms SVGs into a JSON object

file-saver
	Allows downloading files to a user's local drive with wide browser support 

Both 
====

paper
	Essential module which handles SVGs

**********
Algorithms
**********

The algorithms described below are the more complicated ones which make up the conversion process. Algorithms which ensure data integrity for react.js are not included, but rather in the diagrams.

Hierholzer's algorithm
======================

Description
	I used Hierholzer's algorithm to generate an eulerian circuit from the graph generated. The resultant path will then be mapped to their corresponding points and further processed.

Implementation
	src/lib/stitch/Graph.ts:62

.. code-block:: none
	:linenos:

	procedure getEulorianPath(startingVertex) {
		curVertex ← startingVertex
		cPath ← Array of int
		ePath ← Array of int
		
		While cPath.length > 0 Then
			u ← cPath[cPath.length - 1]
			
			# this.adjacencyList represents the adjacency list of a graph in the current object
			# this.adjacencyList is in the form of a 2D array of int

			If this.adjacencyList[u].length === 0 Then
				ePath.push(u)
				cPath.pop()
			ElseIf 
				cPath.push(this.adjacencyList[u][0]);
				index1 ← u;
				index2 ← this.adjacencyList[u][0];
				delete index2 from this.adjacencyList[index1] if exists
				delete index1 from this.adjacencyList[index2] if exists 
			Endif
		Endwhile
	}


Graph
=====

Description
	The graph data structure is an essential part of being able to convert fills into stitches. Most of the functions and properties are public because immediate access is needed to them from outside the object, where it would not make sense to implement that logic inside the object.

Implementation
	src/lib/stitch/Graph.ts

.. code-block:: none
	:linenos:

	Class Graph {
		public referenceTable
		public adjacencyList
		
		# Constructor
		public procedure new (points) {
			adjacencyList ← new 2D Array of int of length points.length
			referenceTable ← points
			fill adjacencyList with []
		}
		
		# Adds edges between 2 points
		public procedure addEdge(point1, point2) {
			If point1 = point2 Then
				Return False
			Endif
			
			index1 ← index of point1 in referenceTable
			index2 ← index of point2 in referenceTable
			
			If not index1 or not index2 Then
				Return False
			Endif
			
			adjacencyList[index1].push(index2)
			adjacencyList[index2].push(index1)
			
			Return True
		}
		
		# Helper function to check for sub-graphs
		public recursionCheck(i, visited, adjList) {
			visited[i] ← True
			
			For node in adjList[i] 
				If not visited[node] Then
					recursionCheck(node, visited, adjList)
				Endif
			Endfor 
		}
		
		public getEulorianPath(startingVertex=0) {
			# defined before in pseudocode undder `Hierholzer's algorithm`
		}
		
		private removeEdge(index1, index2) {
			remove index1 from adjacencyList[index2] if exists
			remove index2 from adjacencyList[index1] if exists
		}
	}

Row Guttering
=============

Description
	Row guttering is an essential part of the algorithm which creates the fill of a shape. It takes path object and returns a 2D array of the rows which intersected, with the intersection points in each row.

Implementation
	src/lib/stitch/convert/rowGutter.ts

.. code-block:: none
	:linenos:

	procedure rowGutter(path, spacing, normal) {
		bounds ← rectangle bounds of path
		hypotenuse ← square_root(bounds.width^2 + bounds.height^2)
		offset ← hypotenuse / 2
		lower ← absolute(ceil(sin(normal.angleInRadians) * hypotenuse))
		upper ← Math.ceil(-lower + bounding.height)
		
		lines ← Array of path objects
		
		For y=0 to ceil((upper-lower) / spacing)
			pStart ← new point
			pStart.x ← bounds.bottomLeft.x - offset
			pStart.y ← bounds.bottomCenter.y - y * spacing - lower
			
			pEnd ← new point
			pEnd.x ← bounds.bottomRight.x + offset
			pEnd.y ← bounds.bottomCenter.y - y * spacing - lower
			
			line ← line from pStart to pEnd
			rotate line by normal.angleInDegrees about bounding.center
			
			lines.push(line)
		Endfor
		
		gutterLines ← 2D Array of points
		
		For line in lines
			intersections ← point where path intersects with line
			
			sort intsersections by the distance from the start point of the line to the intersection in ascending order
		
			If intersectPoints.length < 2 Then
				break
			Endif
			
			If intersectPoints.length mod 2 = 1 Then
				delete intersectPoints[intersectPoints.length - 1]
			Endif
			
			gutterLines.push(line)
		Endfor
		
		Return gutterLines
	}

Straight Subdivison
===================

Description
	This algorithm is used to split a line into multiple subsections of a specific length. These small sections are created because embroidery designs would not last and become loose, or even worse, not work if the sections are too large. The recommended length is 2.7mm.

Implementation
	src/lib/stitch/convert/straightSubdivison.ts

.. code-block:: none
	:linenos:

	procedure straightSubdivision(start, end, stitchLength, omitLast, percentOffset) {
		buffer ← Array of points
		totalDistance ← distance from start to end point
		
		If totalDistance <= stitchLength and 
			(percentOffset mod 100 = 0 || totalDistance <= stitchLength * (percentOffset/100)) Then
			If omitLast Then
				Return [start]
			Else 
				Return [start, end]
			EndIf
		EndIf
		
		If percentOffset mod 100 != 0 Then
			buffer.push(start)
			start ← getPointDistanceAway(start, end, stitchLength * percentOffset / 100)
			totalDistance ← distance from start to end point
		Endif
		
		For i=0 to floor(totalDistance / stitchLength) + 1
			buffer.push(getPointDistanceAway(start, end, stitchLength * i))
		Endfor
		
		If not omitLast and buffer[buffer.length - 1].x != end.x and
			buffer[buffer.length - 1].y != end.y Then
			buffer.push(end);
		Endif
		
		Return buffer
	}

	procedure getPointDistanceAway(start, end, distance) {
		totalDistance ← distance from start to end
		
		If totalDistance = 0 or distance = 0 Then
			Return start
		Endif
		
		point ← new point
		point.x ← start.x + (distance / totalDistance) * (end.x - start.x)
		point.y ← start.y + (distance / totalDistance) * (end.y - start.y)
		
		Return point
	}

Colour Normalization
====================

Description
	Thread colours do not come in all the colours, and different manufacturers have different colours. Estimates of the RGB value of different threads exist, and to give the user a vague idea of how the colours in the design will look, this algorithm approximates each colour to the closest one in a list of thread colours.

Implementation
	src/lib/svg/normaliseColours.ts

.. code-block:: none
	:linenos:

	procedure normaliseColours(element, stroke, fill) {
		If element Then
			If fill and elem.fillColor Then
				elem.fillColor ← getClosestColour(elem.fillColor)
			Endif
			
			If stroke and elem.strokeColor Then
				elem.strokeColor ← getClosestColour(elem.strokeColor)
			Endif
		Else 
			# project represents the root item, it contains all of the items dispalyed
			For element in project
				If fill and element.fillColor Then
					element.fillColor ← getClosestColour(element.fillColor)
				Endif
				
				If stroke and element.strokeColor Then
					element.strokeColor ← getClosestColour(element.strokeColor)
				Endif
			Endfor
		Endif
	}

	procedure getClosestColour(colour) {
		smallestValue ← 9999
		closestColour ← none
		
		# threadColours contains a set of thread colours
		For potentialColour in threadColours
			brightnessMultiple ← colour.brightness < 0.05 Then 100 Else -2.5 * colour.brightness + 4

			hueDifference ← colour.hue - potentialColour.hue;
			saturationDifference ← colour.saturation - potentialColour.saturation;
			brightnessDifference ← colour.brightness - potentialColour.brightness;
		
			value ← square_root(
				(hueDifference * 3.5)^ 2 +
				(saturationDifference * 360 * 1.3)^2 +
				(brightnessDifference * 360 * brightnessMultiple)^2
			)
			
			
			If value < smallestValue Then
				smallestValue ← value
				closestColour ← potentialColour
			Endif
		Endfor
		
		Return closestColour
	}


Fill Encoding
=============

Description
	Converts SVG paths into a set of points which can be easily converted into embroidery files.

Implementation
	src/lib/stitch/convert/fillPath.ts

.. code-block:: none 
	:linenos:

	procedure fillPath(path, stitchLength, fillGutterSpacing) {
		normal ← getDirectionVector(path)
		
		# rowGutter defined as pseudocode before
		rows ← rowGutter(path, fillGutterSpacing, normal)
		flattenedRows ← flatten rows to 1D Array
		
		# Graph defined as pseudocode before
		graph ← new Graph(flattenedRows)
		
		# add vertices to graph
		For row in rows
			For i=0 to row.length
				If i mod 2 = 1 Then
					Continue
				Endif
				graph.addEdge(row[i], row[i + 1])
			Endfor
		Endfor
		
		clByOutline ← new Dictionary
		
		# Categorize vertices by what curve they intersected with
		For point of flattenedRows
			parentCurve ← get curve closest to point
			If clByOutline contains key parentCurve Then
				clByOutline[key of parentCurve].push(point)
			Else
				clByOutline[key of parentCurve] = [point]
			Endif
		Endfor
		
		# add edges around the outline
		For points in clByOutline
			sort points by curve offset in ascending order
			
			For i=0 to points.length - 1
				edge1 ← points[i]
				edge2 ← points[i + 1]
				
				graph.addEdge(edge1, edge2)
				
				# even vertex corrector
				If i % 2 = 1 Then
					graph.addEdge(edge1, edge2)
				Endif
			Endfor
		Endfor
		
		blocks ← new 2D Array of points
		
		# handling connected sub-graphs
		visitedIndexed ← new Array of int of length graph vertex count
		fill visitedIndexed with 0
		counter ← 1
		
		While visitedIndexed contains 0
			startIndex ← first index of element in visitedIndexed which is 0
			
			currentVisited ← new Array of boolean of length graph vertex count
			fill currentVisited with false
			
			graph.recursionCheck(startIndex, currentVisited)
			
			For i=0 to currentVisited.length
				If currentVisited[i] Then
					visitedIndexed[i] = counter
				Endif
			Endfor
			
			counter ← counter + 1
		Endwhile
		
		# generate paths in each sub-graph
		For i=1 to counter - 1
			availableVertices ← new Array of int
			
			For j=0 to visitedIndexed.length 
				If visitedIndexed[j] = i Then
					availableVertices.push(j)
				Endif
			Endfor
			
			startPoint ← 0
			
			# jump the smallest distance away
			If i > 1 Then 
				startPoint ← index of the closest point in the current subgraph to the last point in the previous block
			Endif
			
			result ← graph.getEulorianPath(availableVertices[startPoint])
			buffer ← new Array of point 
			
			# convert path into intermediate points that are no longer than stitchLength 
			For i=0 to result.length - 2
				
				# defined in pseduocode before
				divisions = straightSubdivisions(result[i].point, result[i + 1].point, stitchLength, true)
				
				buffer.push(elements of divisions)
			Endfor
			
			buffer.push(result[result.length - 1].point)
			blocks.push(buffer)
		Endfor
		
		Return blocks
	}

	procedure getDirectionVector(path) {
		halfDistance ← path.length / 2
		totalX ← 0
		totalY ← 0
		
		For i=0 to floor(halfDistance) + 1
			point ← normal vector at path offset i
			totalX ← totalX + point.x
			totalY ← totalY + point.y
		Endfor
		
		result ← new point
		result.x ← totalX / halfDistance
		result.y ← totalY / halfDistance
	}


Running Stitch Encoding
=======================

Description
	Converts the outline of SVG paths into a set of points which can be easily converted into embroidery files. Running stitches are used only for slim width outlines because it is only 1 thread thick.

Implementation
	src/lib/stitch/convert/strokePath.ts

.. code-block:: none
	:linenos:

	procedure runningPath(path, stitchLength) {
		buffer ← new Array of points
		totalDistance ← length of path 
		anchorDistances ← new Array of int
		
		For segment to path.segments 
			anchorDistances.push(offset of path at segment)
		Endfor
		
		For i=0 to floor(totalDistance / stitchLength) + 1
			currentDistance ← stitchLength * i
			
			# Add anchor points if passed
			While anchorDistances.length > 0 and currentDistance > anchorDistances[0]
				buffer.push(point on path at offset anchorDistances[0])
				anchorDistances.shift()
			Endwhile
			
			buffer.push(point on path at offset currentDistance)
		Endfor
		
		# tie-in, prevents threads from coming loose
		If buffer.length > 2 Then
			buffer.unshift(buffer[0], buffer[1], buffer[0], buffer[1])
		Endif
		
		# add point at end of path if it doesn't exist already
		If buffer[buffer.length - 1] != point on path at offset totalDistance Then
			buffer.push(point on path at offset totalDistance)
			
		# tie-out
		If buffer.length > 2 Then
			buffer.push(buffer[buffer.length - 2],
				buffer[buffer.length - 1],
				buffer[buffer.length - 2],
				buffer[buffer.length - 1])
		Endif
		
		Return buffer
	}


Satin Stitch Encoding
=====================

Description
	Converts the outline of SVG paths into a set of points which can be easily converted into embroidery files. Satin stitches are used for outlines which are wide, this zigzag pattern of satin represents the width of the stroke.

Implementation
	src/lib/stitch/convert/satinPath.ts

.. code-block:: none
	:linenos:

	

**************
Class Diagrams
**************

**************
User Interface
**************

.. //TODO: add how I resolved problems I encountered
.. exp offset accumulating over time issue (took into account offset when I set the new current point when calculating difference)
.. resolved sub graphs issue where a non connected graph was produced due to the compound paths not being part of a full shape (differentiated the sub graphs by tracking which ones I visited and tag them according to the sub graph they are, then set the starting vertex to one in the list). Hard to create new graphs from each due to how the data is stored (array based), which could cause conflitions and very resource intensive
.. path finding algorithm going twice over edges; forgot to delete edge from other vector too