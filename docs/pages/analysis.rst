########
Analysis
########

******************
Brief Introduction
******************

Currently there are very few options to consider when you want to convert vector images such as SVGs into embroidery file types (eg. PES). Most of the solutions require you to download a paid program, pay for a person to do it for you, or pay on a per file basis. 

This project targets this gap in the market. EasyThread is a client-server model which transcodes between SVG and embroidery file types. The target audience is people with embroidery machines who want to embroider SVGs easily and quickly.

The client will work on all modern browsers and will be able to be hosted on machines which support Node.js, check out `Limitations`_ for more details.

*********************
Background to Problem
*********************

Currently, there are very few options if you have limited expreience in designing embroidery graphics and want to quickly convert vector graphics which are widely available, to files that a embroidery machine can use, for free. Current alternatives can be found in the `Alternatives`_ section.

Many solutions are also dated and provide a negative UI expreience for the user due to the clutered UI which presents a high learning curve, making the user avoid the software all together if they are not willing to learn how it works. ``Figure 1`` shows the GUI of a popular embroidery software, which supports conversion of vectors, if you are willing to pay extra. As you can see, the toolbar section names are not descriptive and the icons are small, clutered and dated. This can be seen in many applications designed for professionals, where they need a high degree of customisation. However, this is not ideal for the average consumer market.


.. figure:: /_static/images/embird-GUI.png
    :alt: Bézier curve explanation
    :align: center
    :width: 100%

    ``Figure 1`` The first screen in Embird 2021 you see when you open the app

***************
Target Audience
***************

Anyone with an embroidery machine which allows for automatic embroidery should be able to use this software. This means that the level of 

************
Alternatives
************

********
Research
********

In this section, I will go through the 3 main components of the project and analyse my options and approach to accomplish the main task. I will be using javascript for the front end and back end since it is a language that I have experience in, and most frameworks use that language.

Front End
=========

I need a simple and clean front end framework which will be able to communicate with the back end effectively. I will not be using server-side rendering because the website will be small in size and will add to the complexion greatly. After looking over my options, here are my top choices:

React.js_
^^^^^^^^^

    Since I have used react.js before, it would save me some time because I would not have to learn a new framework. React.js is a framework developed by Facebook and holds the most market share in the industry, with a large open source community.

    :Advantages: 
        * Already familiar with it
        * Easy to set up event handling
        * Since it is component based, I can easily reuse chunks of code

    :Disadvantages:
        * Poor documentation of user made packages
        * Updates regularly, so some packages may not work on newer builds

Angular_
^^^^^^^^

    Anuglar is a Google-made javascript framwork which focuses on single page content. Works primarily by turning HTML dynamic by the use of directives

    :Advantages: 
        * Two-way binding
        * Strong community
        * Directives allow for dynamic content

    :Disadvantages:
        * Slower in performance 
        * Steep lurning curve 
        * Confusion between the different versions of Angular

Vue.js_
^^^^^^^

    Vue.js is the least popular amongst them. It is a progressive web interface for one page applications, and can be used on multiple platforms.

    :Advantages: 
        * Tiny size allows for fast client loading 
        * Two-way binding
        * Single file components allows for code reusability and readability

    :Disadvantages:
        * Reactivity complexity 
        * Low amounts open source contributions
        * Limited resources

In the end, I will be using react.js due to previous knowledge alongside with `Tailwind <https://tailwindcss.com/>`_ used for styling custom components. Tailwind is preferable over normal CSS beacause the classes provided are powerful and work together in unison, allowing for quick design work.

Back End
========

`Node.js <https://nodejs.org/en/>`_ is one of the most popular platforms for server side applications and it uses javascript, and has a wide selection of community driven libraries which make the process of creating a server more abstracted. Since I have experience working with Node.js and the front end will be using javascript too, the combination of the 2 will be perfect for what I need. Because of this, I have not considered other technologies such as Flask or Django.

I will be using multiple libraries alongside Node.js, the main ones being:

* `Express <https://expressjs.com/>`_ - Express is a minimalistic web framework which works as a layer on top of Node. This library is useful because it makes handling HTTP requests and responses easier.
* `MongoDB <https://www.mongodb.com/>`_ (Mongoose) - MongoDB is a document orientated database model which stores data in json, which allows for flawless integration with javascript. Mongoose is a layer on top of mongoDB which adds types, schemas and validators. These features are useful to ensure data uploaded to the database are appropiate.
* `Passport <https://www.passportjs.org/>`_ - This middleware provides authentication for Node.js. It can use many 'strategies' to log in and register a user, but passport-local and :term:`passport-JWT<JWT>` will be used so that this project does not have to rely on cloud services.


Conversion Algorithm
====================

What are and why SVGs?
^^^^^^^^^^^^^^^^^^^^^^

SVGs, short for Scalable Vector Graphics are mathematically defined graphics which can be zoomed in or out as to an infinite degree without losing resolution, SVGs are used throughout design and illustration market because primarily of this feature, and because they can be easily manipulated afterwards. 

Because SVGs are mathematically based and work on a coordinate grid, finding points of intersection and getting the length of a section of a path is much easier compared to bitmap images. Since bitmap images are pixel based, there is no mathematical way of finding out where two lines intersect due to the limited resol8tion. In the image below, the difference between SVG and PNG can be seen. To find the intersection coordinate of the left slope of the 'A' to the horizontal in bitmap, coordinates can only be found to an integer, in this case (0,4). However with the SVG, the exact coordinate to an appropiate amount of decimal points can be found ((0.7, 4.4) to 1 decimal points), this chain of reasoning can also be applied to why it is easier to get the distance of a section of a path in SVGs. Another problem SVGs remove, is the ambiguity of what the object in the image is. For exmaple, on the left side of the diagram, we as humans recognise the image is depiciting 2 angled slopes meeting at an acute angle with a horizontal line connecting these 2 slopes below the intersection, or an 'A', but a computer does not know that. However on the right, the computer knows the equation of each line. This means that it understands the content, but not the context, which is enough for the project to work.

.. figure:: /_static/images/bitmap-vs-svg.png
    :alt: bitmap vs png diagram
    :align: center
    :width: 70%

    credit: https://commons.wikimedia.org/wiki/File:Bitmap_vs_vector.svg

SVGs are written in XML, and each object in the graphic is a seperate element in the XML 
with a corresponding tag. Tags are used to indicate what type of shape is the object being shown. Some exmaples include:

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

To simplify the problem, all shapes will be converted to paths to prevent writing code for intersections between themselves. Paths are described as a list of commands which are followed by a set amount of parameters. Each command comes in 2 varirants, as an uppercase which specifies absolute positioning and lower case letter which uses relative positioning. There are 4 types of commands, but we will only be using the main 3. 

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

However for quadratic Bézier curves or Nth Bézier curves, it is resource intensive and complex. The 2 main methods used are:

#. Numerical Quadrature
	The more popular out of the 2, numerical quadrature refers to any numerical method of approximating a definite integral, in our case, a Bézier curve. Arc length parameterization is one such method, which divides the curve ``N`` times, which gives ``N + 1`` points. Then the distance between every 2 subsequent points can be found using the formula found above, to calculate the distance of a linear path. Then, all the lengths of the divisions are added together to get the total length of the path. A specific arc length can be calculated given a range of ``t`` values, where the subdivison occures between the range. This method will yeild a result much faster than the alternate method at the cost of accuracy, but accuracy to such a high degree is not needed for this project, so arc length parameterization will be used.

#. Definite Integration
	The alternate method used is definite integration of a curve, which is defined by a radical (Nth root of an expression) integral, which means that it is very hard to compute and most importantly, resource intensive. Only quadratic Bézier curves have a closed integral which limits this method only to them. The result from the integral can be found `here <https://gamedev.stackexchange.com/a/125321>`_. At the cost of high computational complexity, the length of a quadratic Bézier can be found precisely, but the costs do not outweigh the benefits to use this method.

Intersections
-------------

Finding the point of intersection will be vital for the conversion to work as shown in `Transcoding SVG Fills`_. The maths behind intersections are already established.

Since the equation of each path is known, substitution can be used, then the roots can be found of the combined equation. When dealing with linear equations, matrices can be used to find the soltion of system of equations.

However, to find the intersections of Bézier curves is more complex as they can be either quadratic or cubic. Bézier curves can be described in the standard form ``y = ax^2 + bx + c`` as ``B(t) = (1-t)^2P0 + 2(1-t)tP1 + t^2P2 , 0 <= t <= 1``, where ``P0`` is the starting point, ``P1`` is the anchor, and ``P2`` is the end point. Quadratic equations can be solved using the following formula:

Assuming the quadratic ``y = ax^2 + bx + c``.

The amount of roots the equation has by using ``b^2-4ac``. If the result is more than 1, it has 2 solutions. It has 1 solution if it equals 0, and none if it equals less than 0.

The solution of ``x`` as the roots can be found using ``x = 0.5(b +- (b^2 - 4ac)^0.5)``. The ``y`` component can then be found by substituting the solution back into the equation.

For cubics, the general formula is much more complex and can be found `here <https://math.vanderbilt.edu/schectex/courses/cubic/>`_. But, the same principal is applied.

Understanding the problem
^^^^^^^^^^^^^^^^^^^^^^^^^

.. todo

To gain an understanding on how embroidery files are made, `Embird <https://www.embird.net/>`_ was used to view an example file and analyse it.

.. figure:: /_static/images/squirrel-3D.png
    :alt: squirrel 3D render
    :align: center
    :width: 70%

    ``Firgure 1`` 3D render of squirrel.dst 

.. figure:: /_static/images/squirrel-Stitches.png
    :alt: squirrel stitch render
    :align: center
    :width: 70%

    ``Firgure 2`` stitches in squirrel.dst 

.. figure:: /_static/images/squirrel-density.png
    :alt: squirrel density render
    :align: center
    :width: 70%

    ``Firgure 3`` Denisty map of squirrel.dst 

Transcoding SVG fills
---------------------

Blocks of :term:`stitches<Stitch>` are more or less aligned to the normal at which the thread hits the block in ``Figure 1`` and ``Figure 2``. For implementation, the average normal will be taken of the :term:`SVG` path on one side from the start to the further point away, to get the equation of the threads that will be used to fill the block with in a diagonal pattern. Finally, the end and start of the next diagonal will be connected to form a block of stitches. This can be seen below in ``Figure 4``.

.. figure:: /_static/images/simple-fill-diagram.png
    :alt: simple fill diagram
    :align: center
    :width: 60%

    ``Firgure 4`` SVG fill steps

However, this method does not work if during the 2nd step, there are more than 2 solutions to the line intersecting with the path. There are multiple approaches to this problem, them being:,

#.  Seperate the SVG path into multiple individual ones, where each shape will not encounter the issue
#.  Or, branch out and carry out the same method in each branch, then do a :term:`jump stitch<Jump stitch>` to the other branch. 

These 2 methods can be seen below in ``Figure 5``.

.. figure:: /_static/images/complex-fill-diagram.png
    :alt: complex fill diagram
    :align: center
    :width: 60%

    ``Firgure 5`` SVG fill steps in concave shapes

Both methods seem to be complex, but method 1 could be done more easily if there is a wat to find the minimum point at which the line has more than 2 solutions, then divide the shape there. If that is hard to do, method 2 is to be used and treat the multiple branches as a tree, and use depth-first traversal to do the jump stitches. As a result, method 2 would create a cleaner result because the jump stitches would be the closest together.

Transcoding SVG paths
---------------------

**********
Objectives
**********

the objectives are split in 3 main parts of the project, as each of the sections will be contained in seperate frameworks. The parts are: 

#. Front end
#. Back end
#. Conversion algorithm

The following objectives act as a checklist for what the final program should be able to accomplish, with extension objectives in *italics*.

Front End
=========
#. UI/UX
    #. The user should be able to access the website and navigate through all the pages.
    #. Given the user enters their username and password, clicking the login button logs them in, or clicking the register button registers them with the given credentials.
    #. The user should be able to upload their file by clicking the button.
		#. After clicking the button, a loading spinner stage should be shown to show the file's progress before allowing the file to be downloaded.
    	#. Capability to drag and drop files.
    #. The user should be able to download their converted files, given they click the download button on the respective file.
    #. The user should be able to see a preview of their uploaded and converted file.
    #. The user should be able to login, register, modify and see their profile.
    	#. A list of the user's files that are currently on the server should be displayed.
    #. The user should be able to delete all information and data related to them at any point in time by logging in, and clicking the Delete User button.
    #. The UI/UX should be optimised for all screen sizes and devices, with proper scaling of text; All the content of a page should be able to be understood without leaning in to look closer.
    #. *A socket connection, or http calls at set intervals should be established to communicate information about the status of a conversion to the user.*
    #. *A progress bar should be able to show to an extent how much longer the conversion will take.*
#. Optimisation
    #. The website should have a Google lighthouse score of at least 90.
    #. The website should load in under half a second on a good connection.
    #. Best practices such as minifying the bundles should be in place to reduce loading time.
#. *Other*
    #. *The front end should be able to be run using a Docker container easily.*
    #. *Scripts should be created to allow for easy installation of all packages, and initialisation of developer environment tools.*

Back End
========
#. API
    #. The API structure should be created and documented using Swaggerhub, to allow users to understand how to use the API.
    #. The API should not crash all together if any children tasks fail (file conversion). 
    #. Asynchronous tasks should be spawned whenever a user requests a file to be converted
    #. The API should have its functions split into controllers, models and routers to allow for code to be reused outside the API effectively.
    #. A task queue should be in place to allow only a certain amount of conversions to take place at once.
    #. *The user should be notified when a file they own has its status changed.*
#. Database
    #. The back end should have a connection established with a MongoDB instance
    #. A model and schema should be created for:
        * A user.
        * A file.
    #. The database should not be able to be accessed by non-admins
    #. Mongoose should be used with MongoDB, to allow for schemas.
#. File management
    #. Files should be stored for a set amount of time on the server, then deleted.
    #. Uploaded files
        #. Must be moved to a different working directory, so that they are ready to be converted, and be renamed with a GUID.
        #. The files should be deleted after a certain amount of time in the queue (around 1hr), alongside with the task
    #. Converted files
        #. The file database should be updated with the file’s new status, given the GUID.
        #. Converted files should be stored for 24hrs for a user without an account, 48hrs for a user with an account.
    #. Files should be able to be served to the user, and only to users with sufficient access.
#. Authentication and Access management
    #. Users should be able to create an account using a username and password.
    #. JWTs should be used to keep a session alive.
    #. Users should not be able to create duplicate accounts.
    #. A limit should be in place to not spam conversion attempts.
    #. There should be a limit on file sizes allowed to be uploaded to the server for conversion.
    #. Only certain file types should be able to allowed to be saved on the server.
    #. Users with accounts should be able to convert more files with in the same time period, compared to users without an account. 
    #. User passwords should be stored on the database in an encrypted fassion.
    #. Files converted should only be able to be accessed by the user/computer that uploaded the file.
    #. *The admin should be able to access a dashboard, with the following information*
        #. *Current task queue.*
        #. *All files and their owner.*
        #. *Basic statistics such as (and not limited to) user count, total file conversions, total size of files converted.*

Conversion algorithm
====================
#. Algorithms should be in place to convert between these embroidery file types:
    * .pes (and .pec subsequently)
    * .exp
    * *.dst*
    * *.xxx*
    * *.jef*
#. Conversion should be able to take place between SVG files and .pes files. Then from pes can be used an intermediate step for other embroidery files.
	#. The stroke of a SVG path (given it has one) should be converted to a set of points resembling a satin stitch or running stitch, with the result being affected by the stroke width of the path
	#. The fill of the SVG path (given it has one) should be filled such that when embroidered, the fabric below should be hard to be seen.
		#. *The opacity attribute of the fill should make the stitch fill more sparse if the opacity is lower.*
		#. *The fill should be reinforced before it is filled to prevent the stiches from coming loose.*
	#. The colour of the stitch should be determined by the SVG path attribute, with the colours of different paths within the SVG file being done first to avoid the number of times the user has to switch the threads on the embroidery machine.
	#. *Given the user said so, flatten the SVG so there are no underlying paths. This can prevent too many threads being on top of each other.*
#. Conversion should be able to take place between embroidery file types and PNG, by rendering embroidery file in SVG, then rendering it to bitmap.
#. Conversion should take place from a starting point to the end point (example: bitmap/SVG to embroidery), by converting the file multiple times in a given order. This can be modelled using a node graph and traversing it in the most efficient manner.
#. Conversion from any step to another must resemble the original input.
#. Conversion should take a reasonable amount of time, around 10 seconds per conversion step 

***********
Limitations
***********

The backend will be running on a `Raspberry Pi 4 Model B (4GB)`_, and the front end on multiple devices to check for compatibility with different screen sizes and internals. The Raspberry Pi 4 was chosen to be used for the server, because it is widely available and cheap, this means that most users would be able to host it themselves. Also, it will force myself to write more efficient code, as the PC I will be developing the program on is a lot more powerful, and my perception on the efficiency of the program could be skewed.

Raspberry Pi 4 Model B Tech Specs:

* Broadcom BCM2711, Quad core Cortex-A72 (ARM v8) 64-bit SoC @ 1.5GHz
* 4GB LPDDR4-3200 SDRAM
* 2.4 GHz and 5.0 GHz IEEE 802.11ac wireless, Bluetooth 5.0, BLE Gigabit Ethernet
* 2 USB 3.0 ports; 2 USB 2.0 ports.

For the frontend, it should be accessible to anyone who knows how to use a browser. Most of my user base will be artists and people who are not as computer literate, so the website should be minimalistic.

Other secondary limitations include:

* Time schedule - The project must be finished by March 2022
* Knowledge - The project must not be too complicated such that I can not complete it due to complexity, even with additional learning.


.. Website Links

.. _Raspberry Pi 4 Model B (4GB): https://www.raspberrypi.com/products/raspberry-pi-4-model-b/specifications/
.. _React.js: https://reactjs.org/
.. _Angular: https://angular.io/
.. _Vue.js: https://vuejs.org/
