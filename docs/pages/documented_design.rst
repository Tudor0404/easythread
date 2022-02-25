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
    

**********
Algorithms
**********

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
			
			# this.adjacencyList represents the adjacencyList of a graph in the current object
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
		
		return gutterLines
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
				return [start]
			Else 
				return [start, end]
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
		
		return buffer
	}

	procedure getPointDistanceAway(start, end, distance) {
		totalDistance ← distance from start to end
		
		If totalDistance = 0 or distance = 0 Then
			return start
		Endif
		
		point ← new point
		point.x ← start.x + (distance / totalDistance) * (end.x - start.x)
		point.y ← start.y + (distance / totalDistance) * (end.y - start.y)
		
		return point
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
		
		return closestColour
	}


Path encoding
=============

Description
	aaa

Implementation
	src/lib/stitch/convert/fillPath.ts

Stroke Fill
===========

Description
	aaa

Implementation
	src/lib/stitch/convert/strokePath.ts


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