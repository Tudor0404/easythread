#################
Documented Design
#################

*********
UI Design
*********

React uses JSX, which is a way of merging html, css and JavaScript into a single component. These components can then be contained and used in composition, inheritance and aggregation is not used since nearly everything can be created those 2 concepts. The diagram below shows the composition of components from the root

.. figure:: /_static/images/JSX-structure.png
    :alt: JSX structure
    :align: center 
    
    JSX structure from the root

The following are screenshots of the website, while in multiple scenarios

.. figure:: /_static/images/screenshots/normal.png
    :alt: screenshot entry
    :align: center 

    First thing you see

    
.. figure:: /_static/images/screenshots/conversion-menu.png 
    :alt: screenshot conversion menu
    :align: center 

    Conversion menu

.. figure:: /_static/images/screenshots/svg.png 
    :alt: screenshot svg
    :align: center 

    Sample SVG scene

.. figure:: /_static/images/screenshots/dragged.png 
    :alt: screenshot dragged SVG entry
    :align: center 

    Dragged SVG scene

.. figure:: /_static/images/screenshots/toolbar-menu.png 
    :alt: screenshot toolbar menu
    :align: center 

    toolbar menu (notice disabled buttons)

.. figure:: /_static/images/screenshots/converted.png 
    :alt: screenshot converted
    :align: center 

    converted scene (made the blue a different colour for better contrast)

.. figure:: /_static/images/screenshots/zoomed.png 
    :alt: screenshot zoomed in converted
    :align: center 

    converted scene zoomed in

.. figure:: /_static/images/screenshots/hover.png 
    :alt: screenshot hover button
    :align: center 

    buttons when hovered (notice zoom out button)



**************
Libraries used
**************

Libraries in web development are essential, a lot of edge cases and standards exist which need to be abstracted. Here is a list of direct (exlcuding dependencies) libraries I have used:

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

    procedure satinPath(path, width, stitchLength, spaceBetweenNormals) {
        preBuffer ← new Array of tuple (point, point, number)
        buffer ← new Array of point
        
        For i=0 to floor(path.length / spaceBetweenNormals)
            offset ← spaceBetweenNormals * i
            vector ← normal of path at offset
            
            preBuffer.push(
                (point on path at offset) + (vector * -width/2),
                (point on path at offset) + (vector * width/2),
                offset
            )
        Endfor
        
        lastOffset ← 0
        
        For entry in preBuffer
            start ← entry[0]
            end ← entry[1]
            
            If distance from start to end > stitchLength Then 
                lastOffset ← (lastOffset + 20) % 100
            Else 
                lastOffset ← 0
            Endif
            
            buffer.push(points in straightSubdivision(start, end, stitchLength, false, lastOffset))
        Endfor
        
        If buffer.length > 8 Then 
            buffer.unshift(buffer[0], buffer[1],buffer[0], buffer[1])
            buffer.push(buffer[buffer.length - 2],
                buffer[buffer.length - 1],
                buffer[buffer.length - 2],
                buffer[buffer.length - 1])
        Endif
        
        Return buffer
    }


***********************
Diagrams and flowcharts
***********************

Event Bus Structure
===================

The event bus works similarly to a socket connection, specific components can subscribe to specific events by using a string key, then other components can omit dispatches to those strings. The diagram below shows what components are subscribed to specific events and what they dispatch. Most of the events are self-explanatory and revolve around updating the canvas and the conversion process. When a component is no longer rendered, they remove themselves from the subscription list using the remove() function.

The event bus is also used to **maintain data integrity** by keeping all the components in sync with each other. This is explained in the `Communication Between Components`_ section.

.. figure:: /_static/images/eventBus-diagram.png
    :alt: eventBus diagram
    :align: center
    :width: 100%

    eventBus diagram


UML class diagrams 
==================

This diagram shows the relationship between different classes involved in the conversion algorithm (not design). **Most of the functions involved in the conversion algorithm are not included in the diagram because convention in TypeScript is to componentize sections which do a specific function in different files**. OOP is used, but it is not as integral as it is in C#.

.. figure:: /_static/images/UML-diagram.png
    :alt: UML diagram
    :align: center
    :width: 60%

    UML diagram


Simple Conversion Flowchart
===========================

This flowchart shows the basic process of converting SVGs into embroidery a `Container`_ which than can be used to convert into an embroidery file type.

.. figure:: /_static/images/conversion-flowchart.png
    :alt: Conversion Flowchart
    :align: center
    :width: 50%

    Conversion Flowchart

***************
Data Structures
***************

Data structures are used intensively throughout the conversion algorithm. 

Graph
=====

A graph stored in adjacency list form (due to the large amount of vertices, but small vertex degree), this data structure is used to encode fills using Hierholzer's algorithm to generate an eulerian circuit.



Block 
=====

A structure holding an array of points, detailing a connected block of stitch locations. They also contain the colour of the thread. Jump commands are put in place between blocks during conversion.


Container 
=========

A container is used to store and process graphics into blocks of points which can then be encoded into .exp files for embroidery machine use, or SVG to be used as a preview for the user. 


.EXP
====

Exp files are the most basic machine embroidery files which exist. It contains a sequence of instructions, each 2 bytes of signed integers, with no metadata, where the sequence has 4 commands at its disposal:

* **Stitch** - signal to create a stitch (XXXXXXXX XXXXXXXX)
* **Jump** - signal to not stitch, used to go from one section another (10000000 00000100) 
* **Stop** - stops machine for a colour change (10000000 00000001)
* **End** - end of program (10000000 10000000)

If the first byte in a command is -128, it signals a control event (jump, stop, end), otherwise it is a stitch command. Because of this, the longest distance the machine can move in one command is +-127 in the x and y direction. Because of this, small designs may not be as accurate because it only allows for a precision of 1 decimal point of a milimeter (12.7 mm to -12.7 mm).

Exp files can be generated from a Container. A preview of the exp file is generated in SVG form when the conversion finishes and is displayed.


**************************
Maintaining Data Integrity
**************************

React Components
================

React components update on specific occasions, may this be the user interacted with the component or the state of a variable in the component has changed. Because of this, objects with methods such as the `Container`_ cannot be stored as a normal object, as the component will only have access to the initial state of the object. Also, the container in this case will not be able to be stored as a hook because it holds methods which change the object's properties, which would make it not update alongside the rest of the component since it would not trigger an update if a function is to be called of it. This is because hooks can be read or set directly. The object can be accessed using the read method, but calling a function which changes its properties will do nothing because it has not been set using the set method of the hook, so the next time you read the object, nothing would have changed.

A way around this, is to create a short-lived object in a function which you can call methods which affect the properties of it, then extract the properties and put them in a hook or object which updates alongside the component, and finally delete the object after the function finishes running.


Communication Between Components
================================

Since components are held in separate files, communication between them outside the props (parameter of react components) of react components is essential to avoid cluttering of the props and unnecessary components being passed to react components which may not use the communication stream. A fix for this is to create separate callbacks for components which want to communicate. Callbacks are like promises, a way to think of them is when you are in a queue at a restaurant, you may be handed a ticket with a number, when a monitor displays your number, you go and collect your food. This means that callbacks can be used asynchronously, and multiple components can receive the same information from a dispatch if they have the same 'ticket'. Also, keeping with the analogy, you do not need to get rid of your ticket, so that means you can go back and get food again if the monitor displays your ticket number again. You can see all of these 'tickets' in the `Event Bus Structure`_ section.

This is useful because any type of file can use these callbacks and communicate (including TSX and normal TypeScript files).


****************
Validating Input
****************

Number Inputs 
=============

Inputs that require only floats need to have their input cleaned to prevent errors. To allow only numbers in the `NumberInput.tsx` react component, I used Regex on the `onKeyPress` and `onPaste` event.

Pseduocode for onKeyPress:

.. code-block:: none 
    :linenos: 
    
    procedure onKeyPress(key, inputValue) {
        If (inputValue matches /[0-9]*\.[0-9]*/ and key = "." or
          key not matches /[0-9]|\./) Then 
            prevent input 
        Endif
    }

`/[0-9]*\.[0-9]*/` matches with any amount numbers followed by a fullstop, followed by any amount of numbers. This is used to prevent multiple fullstops being used 

`/[0-9]|\./` matches with a number or a fullstop. This is to prevent any non-numeric value being used

Pseduocode for onPaste:

.. code-block:: none 
    :linenos: 
    
    procedure onPaste(pasteString) {
        If inputValue matches /^-?[0-9]+.?[0-9]*$/ Then 
            Return True
        Endif

        prevent input
    }

`/^-?[0-9]+.?[0-9]*$/` matches against the whole line, making sure that it contains one or more numbers, followed by an optional fullstop and followed by any amount of numbers. This is to make sure the pasted value is a float or integer