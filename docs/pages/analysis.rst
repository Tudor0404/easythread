########
Analysis
########

.. |br| raw:: html

   <br />

******************
Brief Introduction
******************

Currently, there are very few options to consider when you want to convert vector images such as SVGs into embroidery file types (e.g. PES). Most of the solutions require you to download a paid program, pay for a person to do it for you, or pay on a per-file basis. 

This project targets this gap in the market. EasyThread is a client-server model which transcodes between SVG and embroidery file types. The target audience is people with embroidery machines who want to embroider SVGs easily and quickly.

The client will work on all modern browsers and will be able to be hosted on machines which support Node.js, check out `Limitations`_ for more details.

*********************
Background to Problem
*********************

Currently, there are very few options if you have limited experience in designing embroidery graphics and want to quickly convert vector graphics which are widely available, to files that a embroidery machine can use, for free. Current alternatives can be found in the `Alternatives`_ section.

Many solutions are also dated and provide a negative UI experience for the user due to the cluttered UI which presents a high learning curve, making the user avoid the software all together if they are not willing to learn how it works. ``Figure 1`` shows the GUI of a popular embroidery software, which supports conversion of vectors, if you are willing to pay extra. As you can see, the toolbar section names are not descriptive, and the icons are small and dated. This can be seen in many applications designed for professionals, where they need a high degree of customization. However, this is not ideal for the average consumer market.


.. figure:: /_static/images/embird-GUI.png
    :alt: Bézier curve explanation
    :align: center
    :width: 100%

    ``Figure 1`` The first screen in Embird 2021 you see when you open the app

***************
Target Audience
***************

Anyone with an embroidery machine which allows for automatic embroidery should be able to use this software. This means that the level of technology literacy will vary widely, so a minimalistic approach, with the option to expand upon the initial abilities of the program would be favourable.

I will work directly with Mrs Popescu, to gain an understanding of what a potential end user would want in such a program.

Interview
=========

* Interviewer = I
* User = U

| **I What are some of the issues that you have faced with software which already exists?**
| **U** They are all very expensive, or have a short trial. Also, most of the conversion processes do not even work with my machine, the stitches get very tight | or very loose, I have not been able to get a good result on any so far
| 
| **I On what type of device would you use the software?**
| **U** A desktop or laptop.
| 
| **I What embroidery file type do you need the software to export to?**
| **U** .ART files preferably since I have a Bernina machine, but .EXP files would work well too.
| 
| **I What features are you looking for in this project?**
| **U** First of all, if the program creates a design that works with my machine, I will be very happy. Apart from that, I would like access to some tools to | see how the design might look like as a finished product.
| 
| **I What type of stitches/patterns would you need?**
| **U** Satin, running and fill stitching
| 
| **I How much level of control do you want in such a program?**
| **U** As much as possible in a clean way, most of the programs that already exist look very old
| 
| **I How comfortable are you with technology?**
| **U** I wouldn't say that I am very capable, but I know the basics


From this interview, I will adapt the `Objectives`_ to fit the needs of Mrs. Popescu.


************
Alternatives
************

Since most of the alternatives cost money, I was not able to test the conversion algorithms of them, however, there are some example videos which show how they work 

InkStitch_
==========
**Price** 
	Free
**Use** 
	It is mainly used to convert vector files into embroidery files, and embroidery files between them. It also allows the adjusting of particular stitches. This combined with the powerful tool that is Inkscape (vector illustration software), makes it a comparable choice. 
**Platform** 
	Inkscape (Windows/Mac/Linux)
**Pros**
	* Free
	* Can convert easily between embroidery file types
**Cons**
	* When converting, stitch direction is always the same
	* Unintuitive design
	* Hard to learn

.. figure:: /_static/images/inkstitch_conversion_example.jpg
    :alt: inkstitch conversion example
    :align: center
    :width: 50%

    InkStitch example


Wilcom_
=======
**Price**
	Need to enquire
**Use** 
	An all-round tool used to create embroidery files, including digitizing. It mainly focuses on B2B sales, which means that the tools that it offers are directly for that target demographic. Separate modules can be purchased to expand on top of the main product.
**Platform** 
	Windows/Mac/Linux
**Pros**
	* Very mature
	* Professional-grade
	* Works with most file types
**Cons**
	* Very costly
	* Not aimed at hobbyists 

.. figure:: /_static/images/wilcom_conversion_example.png
    :alt: Wilcom conversion example
    :align: center
    :width: 50%

    Wilcom example

********
Research
********

In this section, I will go through the 3 main components of the project and analyse my options and approach to accomplish the main task. I will be using JavaScript for the front end and back end since it is a language that I have experience in, and most frameworks use that language.

Website
=======

I need a simple and clean front end framework which will be able to load quickly, with features such as hooks and events available to use. Server-side rendering will not be used because the website will be small and will add to the complexion greatly. After looking over my options, here are my top choices:

React.js_
^^^^^^^^^

    Since I have used React.js before, it would save me some time because I would not have to learn a new framework. React.js is a framework developed by Facebook and holds the most market share in the industry, with a large open source community.

    :Advantages: 
        * Already familiar with it
        * Easy to set up event handling
        * Since it is component based, I can easily reuse chunks of code

    :Disadvantages:
        * Poor documentation of user made packages
        * Updates regularly, so some packages may not work on newer builds

Angular_
^^^^^^^^

    Angular is a Google-made JavaScript framework which focuses on single page content. Works primarily by turning HTML dynamic by the use of directives.

    :Advantages: 
        * Two-way binding
        * Strong community
        * Directives allow for dynamic content

    :Disadvantages:
        * Slower in performance 
        * Steep learning curve 
        * Confusion between the different versions of Angular

Vue.js_
^^^^^^^

    Vue.js is the least popular amongst them. It is a progressive web interface for one-page applications, and can be used on multiple platforms.

    :Advantages: 
        * Tiny size allows for fast client loading 
        * Two-way binding
        * Single file components allows for code reusability and readability

    :Disadvantages:
        * Reactivity complexity 
        * Low amounts open source contributions
        * Limited resources

In the end, I will be using react.js due to previous knowledge alongside with `Tailwind <https://tailwindcss.com/>`_ used for styling custom components. Tailwind is preferable over normal CSS because the classes provided are powerful and work together in unison, allowing for quick design work.


Conversion Algorithm
====================

What are and why SVGs?
^^^^^^^^^^^^^^^^^^^^^^

SVGs, short for Scalable Vector Graphics are mathematically defined graphics which can be zoomed in or out as to an infinite degree without losing resolution, SVGs are used throughout design and illustration market because primarily of this feature, and because they can be easily manipulated afterwards. 

Because SVGs work on a coordinate grid, finding points of intersection and getting the length of a section of a path is much easier compared to bitmap images. Since bitmap images are pixel based, there is no mathematical way of finding out where two lines intersect due to the limited resol8tion. In the image below, the difference between SVG and PNG can be seen. To find the intersection coordinate of the left slope of the 'A' to the horizontal in bitmap, coordinates can only be found to an integer, in this case (0,4). However, with the SVG the exact coordinate to an appropriate amount of decimal points can be found ((0.7, 4.4) to 1 decimal points). This chain of reasoning can also be applied to why it is easier to get the distance of a section of a path in SVGs. Another problem SVGs remove, is the ambiguity of what the object in the image is. For example, on the left side of the diagram, we as humans recognize the image is depicting 2 angled slopes meeting at an acute angle with a horizontal line connecting these 2 slopes below the intersection, or an 'A'. But a computer does not know that. However on the right, the computer knows the equation of each line. This means that it understands the content, but not the context, which is enough for the project to work.

.. figure:: /_static/images/bitmap-vs-svg.png
    :alt: bitmap vs png diagram
    :align: center
    :width: 70%

    credit: https://commons.wikimedia.org/wiki/File:Bitmap_vs_vector.svg

SVGs are written in XML, and each object in the graphic is a separate element in the XML 
with a corresponding tag. Tags are used to indicate what type of shape is the object being shown. Some examples include:

* ``circle`` defines a circle
* ``ellipse`` defines an ellipse
* ``g`` groups multiple objects together
* ``line`` defines a straight line
* ``path`` generic element to define a shape, any shape can be defined as a path
* ``polygon`` a closed shape made up of straight segments
* ``polyline`` defines a line made up of multiple straight segments
* ``rect`` defines a rectangle

This limited list of tags will be encountered throughout the project, the full list of tags can be found `here <https://developer.mozilla.org/en-US/docs/Web/SVG/Element>`_. Attributes are used to describe how each element is to be displayed. Since elements differ, each tag has specific `attributes <https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute>`_. However, here are some universal attributes which conversion process will be using:

* ``fill`` defines the colour inside the shape
* ``stroke`` defines the colour of the perimeter of the shape
* ``stroke-width`` defines the width of the perimeter of the shape

Since XML is made to be parsed, the shapes in the file can easily be interpreted and worked on individually.

To simplify the problem, all shapes will be converted to paths to prevent writing code for intersections between themselves. Paths are described as a list of commands which are followed by a set amount of parameters. Each command comes in 2 variants, as an uppercase which specifies absolute positioning and lower case letter which uses relative positioning. There are 4 types of commands, but we will only be using the main 3. 

Path commands
^^^^^^^^^^^^^

Movement
--------

The 'Move' command tells the computer where to move to without drawing.

:Definition: ``M x y`` or ``m dx dy``
:Example: ``M 10 10`` moves to the coordinate (10,10) 

Lines
-----

'Line' is used to draw straight lines, it is defined by an end point. It can be abbreviated to vertical (V) and horizontal (H).

:Definition: ``L x y`` or ``l dx dy``
:Definition (horizontal): ``H x`` or ``h dx``
:Definition (vertical): ``V y`` or ``v dy`` 
:Example: ``L 10 10`` draws a line to (10,10) | ``v 20`` draws a vertical line 20 units high from the start point

Curves
------

'Curves' are used for curvatures. SVGs use Bézier curves with 1 or 2 anchors, which take a value of *t* (0 <= *t* <= 1). Bézier curves are a parametric way of describing curves, defined by the start and end point and the anchors. Say that there is a Bézier curve with 1 anchor. First, lines are created from the start point to the anchor, and from the anchor to the end point. *t* starts at 0 and increments to 1. 2 points are obtained by using a :term:`lerp<Lerp>` function on each of the lines, using *t* as the lerp percent. From these 2 points, a new line is created. The final point is obtained from the composite line by lerping on that line, again using *t* as the lerp percent. As *t* is increased little by little, a smooth curve is obtained from the final points. The diagram below explains this. If the Bézier instead has 2 anchors, the step of getting a new line from lerping across 2 lines is repeated, this means that all quadratic (1 anchor) Bézier curves can be defined as cubics (2 anchors), and can be more complex than quadratics.

:Definition (quadratic): ``Q x1 y1 x y`` or ``q dx1 dy1 dx dy``
:Definition (cubic): ``C x1 y1 x2 y2 x y`` or ``c dx1 dy1 dx2 dy2 dx dy``
:Example: ``q 3 9 4 10`` draws a quadratic Bézier curve with an end point ``(4, 10)`` units away from the start, with an anchor ``(3, 9)`` units away from the start

.. figure:: /_static/images/bezier-diagram.png
    :alt: Bézier curve explanation
    :align: center
    :width: 50%

    Bézier curve explanation

Math Behind Paths
^^^^^^^^^^^^^^^^^

Distance of a Path
------------------

To find the length of a linear path, it is easy. The formula ``s = ((X1-X0)^2 - (Y1-Y0)^2)^0.5`` can be used to get the distance between point ``P0 (X0, Y0)`` and ``P1 (X1, Y1)``.

However, for quadratic Bézier curves or Nth Bézier curves, it is resource intensive and complex. The 2 main methods used are:

#. Numerical Quadrature
	The more popular out of the 2, numerical quadrature refers to any numerical method of approximating a definite integral, in our case, a Bézier curve. Arc length parameterization is one such method, which divides the curve ``N`` times, which gives ``N + 1`` points. Then the distance between every 2 subsequent points can be found using the formula found above, to calculate the distance of a linear path. Then, all the lengths of the divisions are added together to get the total length of the path. A specific arc length can be calculated given a range of ``t`` values, where the subdivision occurs between the range. This method will yield a result much faster than the alternate method at the cost of accuracy, but accuracy to such a high degree is not needed for this project, so arc length parameterization will be used.

#. Definite Integration
	The alternate method used is definite integration of a curve, which is defined by a radical (Nth root of an expression) integral, which means that it is very hard to compute and most importantly, resource intensive. Only quadratic Bézier curves have a closed integral which limits this method only to them. The result from the integral can be found `here <https://gamedev.stackexchange.com/a/125321>`_. At the cost of high computational complexity, the length of a quadratic Bézier can be found precisely, but the costs do not outweigh the benefits to use this method.

Intersections
-------------

Finding the point of intersection will be vital for the conversion to work as shown in `Transcoding SVG Fills`_. The maths behind intersections are already established.

Since the equation of each path is known, substitution can be used, then the roots can be found of the combined equation. When dealing with linear equations, matrices can be used to find the solution of system of equations.

However, to find the intersections of Bézier curves is more complex as they can be either quadratic or cubic. Bézier curves can be described in the standard form ``y = ax^2 + bx + c`` as ``B(t) = (1-t)^2P0 + 2(1-t)tP1 + t^2P2 , 0 <= t <= 1``, where ``P0`` is the starting point, ``P1`` is the anchor, and ``P2`` is the end point. Quadratic equations can be solved using the following formula:

Assuming the quadratic ``y = ax^2 + bx + c``.

The amount of roots the equation has by using ``b^2-4ac``. If the result is more than 1, it has 2 solutions. It has 1 solution if it equals 0, and none if it equals less than 0.

The solution of ``x`` as the roots can be found using ``x = 0.5(b += (b^2 - 4ac)^0.5)``. The ``y`` component can then be found by substituting the solution back into the equation.

For cubics, the general formula is much more complex and can be found `here <https://math.vanderbilt.edu/schectex/courses/cubic/>`_. But, the same principal is applied.


To gain an understanding on how embroidery files are made, `Embird <https://www.embird.net/>`_ was used to view an example file and analyse it.

.. figure:: /_static/images/squirrel-3D.png
    :alt: squirrel 3D render
    :align: center
    :width: 70%

    ``Figure 1`` 3D render of squirrel.dst 

.. figure:: /_static/images/squirrel-Stitches.png
    :alt: squirrel stitch render
    :align: center
    :width: 70%

    ``Figure 2`` stitches in squirrel.dst 

.. figure:: /_static/images/squirrel-density.png
    :alt: squirrel density render
    :align: center
    :width: 70%

    ``Figure 3`` Denisty map of squirrel.dst 

Encoding SVGs to Embroidery
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Transcoding SVG fills
---------------------

Blocks of :term:`stitches<Stitch>` are more or less aligned to the normal at which the thread hits the block in ``Figure 1`` and ``Figure 2``. For implementation, the average normal will be taken of the :term:`SVG` path on one side from the start to the further point away, to get the equation of the threads that will be used to fill the block with in a diagonal pattern. Finally, the end and start of the next diagonal will be connected to form a block of stitches. This can be seen below in ``Figure 4``.

.. figure:: /_static/images/simple-fill-diagram.png
    :alt: simple fill diagram
    :align: center
    :width: 60%

    ``Figure 4`` SVG fill steps

However, this method does not work if during the 2nd step, there are more than 2 solutions to the line intersecting with the path. There are multiple approaches to this problem, them being:,

#.  Branch out and carry out the same method in each branch, then do a :term:`jump stitch<Jump stitch>` to the other branch. 
#.  Or, create gutters (slicing using multiple parallel equidistant lines) in the shape to create an eulerian graph, then visit each edge.

The first 2 methods can be seen below in ``Figure 5``.

.. figure:: /_static/images/complex-fill-diagram.png
    :alt: complex fill diagram
    :align: center
    :width: 60%

    ``Figure 5`` SVG fill steps in concave shapes

For the last method, to create a :term:`eulerian graph<Eulerian graph>` all vertices in a graph must be even (even number of edges connecting to it). And from that, a :term:`eulerian circuit<Eulerian circuit>` can be created using Hierholzer's algorithm. After guttering, all vertices will have an odd degree of edges (gutter edge, and 2 edges to the adjacent points on the outline of the shape), to make them all even, edges can be added between every other outline connection, following this, all vertices will either have 2 or 4 edges, allowing for an eulerian circuit. This can be seen in ``Figure 6``.

.. figure:: /_static/images/graph_diagram.png
    :alt: example of constructed graph
    :align: center
    :width: 60%

    ``Figure 6`` example of constructed graph

Since there is ambiguity in how to achieve a good result with the first 2 methods, the third method will be used, where the main challenge will be to create the gutter lines and generate the graph using the intersections of the gutter lines.

Transcoding SVG paths
---------------------

SVG paths will be easier to encode. After a certain stroke width, the algorithm should encode a satin stitch to give the outline a width, otherwise a running stitch should be used.

Running Stitch
""""""""""""""

To achieve a running stitch, the path can be sampled at set intervals in order from start to finish.

Satin Stitch
""""""""""""

For satin stitches (zigzag along a path), the normal of the path can be sampled at a dense rate, much like a running stitch. The normal is then stored as a unit vector. From that vector, 2 are created:

#. `Normal * stroke_width/2`
#. `-Normal * stroke_width/2`

Each of the vector is then added to the point at which the normal was sampled to create 2 points. The first point is connected to the second point, while the second point is connected to the first point of the next sample. This can be seen in `Figure 7`.

.. figure:: /_static/images/satin_path.png
    :alt: satin path explanation
    :align: center
    :width: 60%

    ``Figure 7`` satin path explanation

**********
Objectives
**********

The objectives are split in 3 main parts of the project, as each of the sections will be contained in separate frameworks. The parts are: 

#. Front end
#. Back end
#. Conversion algorithm

The following objectives act as a checklist for what the final program should be able to accomplish, with extension objectives in *italics*.

Website
=======
#. The user should be able to upload SVG files.
#. A canvas should cover the majority of the webpage.
	#. Movement of graphics in the canvas should be facilitated by dragging in the canvas.
	#. Zooming should be allowed if mouse wheel scrolling while the mouse is in the canvas.
	#. The user should be able to select items in a graphic by left-clicking the item. All other selections should be removed
	#. If the user selects another item while holding control, the other selections should not disappear.
	#. If the user left-clicks nothing, all selections should be removed.
	#. Selections should be displayed using an outline around the item selected.
	#. *directional rulers should be shown at the top and left side to give an idea to the user how large the graphic is.*
#. A side panel on the right-hand side should be shown, displaying colour information
	#. In the panel, the user should be able to navigate a list of DMC (thread colours) threads.
	#. Given a colour is selected, the user should be able to change the colour of the selected item's fill or stroke. 
	#. Given the user presses a labelled button, the user should be able to normalize all the colours in the graphic to DMC colours.
#. A toolbar at the top should be shown, where the user can run operations.
	#. The toolbar should be similar to existing programs such as Google Docs or Microsoft Word, so that users can navigate the program easily.
	#. All items in this toolbar should always be visible
	#. If the user types in the filename input, the filename should change throughout to the user specified name.
	#. Dropdowns should open when clicking on the menu buttons, which are:
		#. The 'File' dropdown should show a menu of items which associate to the graphic that the user is working on, or will be. This includes saving and opening files.
		#. The 'Edit' dropdown should show a menu of items which associate to the current graphic.
		#. The 'View' dropdown should show a menu of items which associate to how the graphic is displayed in the canvas.
	#. Below the dropdown, multiple buttons and inputs should be shown which change how the graphic is displayed, or that change attributes of the graphic.
		#. Buttons should be shown that undo or redo the graphic when pressed
		#. Inputs should be shown that change the dimensions of the graphic when submitted
		#. Buttons should be shown that change how the canvas looks when pressed.
		#. A button which is different from the other in the toolbar should be shown only when the graphic has not been converted yet, that converts the graphic to an embroidery graphic.
		#. A settings button which opens a list of inputs in a dropdown should be shown which changes how the conversion process behaves
	#. The user should be able to save any graphic displayed to their local device in whatever state it is in the conversion process (SVG or embroidery), given they click the descriptive buttons.
	#. The user should be able to open any SVG graphic, such that it can be used in the conversion process.
#. The size of the icons and text should be big enough that all users can see them clearly, while preventing overflow
#. The website should run smoothly (>30fps) with little to no stuttering while dragging a 500kb sized graphic around, when using most computers. 
#. The website should load in under half a second on a good connection.
#. The website should be able to display all elements of it and be functional, on all screens with a viewport 800x1024 or higher (standard tablet size).
#. *The website should work well on touch based devices.*
#. *tooltips should be shown on some elements, such as buttons after hovering over them after a short while, to show a descriptive message about what the element does.*


Conversion algorithm
====================
#. The conversion should output an .exp file
#. A Conversion should be able to take place between SVG files to embroidery file types
	#. The stroke of an SVG path (given it has one) should be converted to a set of points resembling a satin stitch or running stitch, with the result being affected by the stroke width of the path
	#. The fill of the SVG path (given it has one) should be filled such that when embroidered, the fabric below should be hard to be seen.
	#. The colour of the stitch should be determined by the SVG path attribute, with the colours of different paths within the SVG file being done first to avoid the number of times the user has to switch the threads on the embroidery machine.
	#. *Given the user said so, flatten the SVG, so there are no underlying paths. This can prevent too many threads being on top of each other.*
#. Conversion should be able to take place between embroidery file types and PNG, by rendering embroidery file in SVG, then rendering it to bitmap.
#. Conversion from any step to another must resemble the original input.
#. Conversion should take a reasonable amount of time, maximum 10 seconds per conversion step 

***********
Limitations
***********

Since the website will contain a lot of information, only medium to large screens should be able to view the webpage (>= 800x650 viewport). If the viewport of the device does not suffice the requirement, another webpage should be shown that prompts the user to use another device. The website should be able to run on most devices at least 5 years old, because of this, the website must match all the objectives on my 6-year-old laptop with the tech specs given below. Also, it should be accessible to anyone who knows how to use a browser. Most of my user base will be artists and people who are not as computer-literate, so the website should be familiar to other tools that they might have used before, such as Illustrator, Google Docs or Microsoft PowerPoint.

* CPU: Intel i5-6200U 
* RAM: 8GB
* Main storage: 256GB SSD

Other secondary limitations include:

* Time schedule - The project must be finished by March 2022
* Knowledge - The project must not be too complicated such that I can not complete it due to complexity, even with additional learning.


.. Website Links

.. _React.js: https://reactjs.org/
.. _Angular: https://angular.io/
.. _Vue.js: https://vuejs.org/
.. _InkStitch: https://inkstitch.org/
.. _Wilcom: https://www.wilcom.com/Products/EmbroideryStudioe4Designing.aspx