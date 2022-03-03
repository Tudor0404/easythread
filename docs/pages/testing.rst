#######
Testing
#######

*****
Video
*****

Testing was done in viedo format to convery more information efficiently. It contains testing from the main objectives and test plan. Link: LINK

Summary 
=======

.. list-table:: Test Plan 
    :widths: 10, 40,30,20
    :header-rows: 1

    * - **Number**
      - **Name**
      - **Outcome**
      - **Timestamp**

    * - **1.1**
      - Upload SVG File
      - Success
      - 00:00
    * - 1.2
      - 
      - Success
      - 00:00
    * - 1.3
      -
      - Success
      - 00:00

    * - **2.1**
      - Movement of canvas
      - Success
      - 00:00
    * - 2.2
      - 
      - Success
      - 00:00
    * - 2.3
      - 
      - Success
      - 00:00

    * - **3.1**
      - Selecting elements and changing properties
      - Success
      - 00:00
    * - 3.2
      - 
      - Success
      - 00:00
    * - 3.3
      - 
      - n/a
      - n/a

    * - **4.1**
      - Saving canvas as SVG
      - Success
      - 00:00
    * - 4.2
      - 
      - Success
      - 00:00
    * - 4.3
      - 
      - n/a
      - n/a

    * - **5.1**
      - Tooltips to appear on hover
      - Success
      - 00:00
    * - 5.2
      - 
      - Success
      - 00:00
    * - 5.3
      - 
      - n/a
      - n/a

    * - **6.1**
      - Smoothness of program
      - Success
      - 00:00
    * - 6.2
      - 
      - n/a
      - n/a
    * - 6.3
      - 
      - Success
      - 00:00

    * - **7.1**
      - Changing dimensions of items
      - Success
      - 00:00
    * - 7.2
      - 
      - Success
      - 00:00
    * - 7.3
      - 
      - Success
      - 00:00

    * - **8.1**
      - Changing the name of a file
      - Success
      - 00:00
    * - 8.2
      - 
      - n/a
      - n/a
    * - 8.3
      - 
      - Success
      - 00:00

    * - **9.1**
      - Converting designs
      - Success
      - 00:00
    * - 9.2
      - 
      - Success
      - 00:00
    * - 9.3
      - 
      - Success
      - 00:00

    * - **10.1**
      - Converting compound shapes
      - Success
      - 00:00
    * - 10.2
      - 
      - n/a
      - n/a
    * - 10.3
      - 
      - Success
      - 00:00

    * - **11.1**
      - Flatten SVGs 
      - Success
      - 00:00
    * - 11.2
      - 
      - Success
      - 00:00
    * - 11.3
      - 
      - Success
      - 00:00

    * - **12.1**
      - Change conversion settings
      - Success
      - 00:00
    * - 12.2
      - 
      - Success
      - 00:00
    * - 12.3
      - 
      - Success
      - 00:00

    * - **13.1**
      - Saving as EXP 
      - Success
      - 00:00
    * - 13.2
      - 
      - Success
      - 00:00
    * - 13.3
      - 
      - n/a
      - n/a

    * - **14.1**
      - Undo and redo of graphics 
      - Success
      - 00:00
    * - 14.2
      - 
      - Success
      - 00:00
    * - 14.3
      - 
      - Success
      - 00:00


********************
Reason For Each Test
********************

1 Upload SVG File
	For the program to do its intended function of converting SVG files, it must first have access to the file in memory. This test ensures I am able to load a SVG file.

2 Movement of canvas 
	For the user to inspect the design, the user must be able to move around the graphics. This is essentail to check if a conversion has completed correctly.

3 Selecting elements and changing properties
	The user should have accesss to basic tools to change the properties of shapes, this is to prevent users having to use other programs instead of EasyThread and decreasing user satisfaction.

4 Saving canvas SVG 
	In some cases, the user may want to save a the state of the current canvas so that they can work on it later, after changing the properties of the design.

5 Tooltips to appear on hover 
	If users do not know what a button does, it is instinctive for them to hover over them to get some more information. These floating tooltips accommodate this.

6 Smoothness of program 
	If the program is not running smoothly to a point which it is not usable, the user may not choose the software. To ensure user satisfaction, the program must run somoothly in most cases.

7 Changing dimensions if items 
	Since SVGs are scalable, the uploaded SVG may be smaller or bigger than the user wants. To prevent having to edit the SVG in another program, basic functionality to change the dimensions which maintaining aspect ratio is essential.

8 Changing the name of a file 
	The user may want to change the name of the file to a different one after conversion, for easy differentiation.

9 Converting designs
	The main purpose of the software, ensures the program works as intended.

10 Converting compound shapes 
	The difficulty of converting shapes increases greatly if a shape is made up of multiple ones with a specific fill rule. To make sure the program can handle more edge cases, compound shapes are tested.

11 Flatten SVGs
	SVGs may be made up of multiple overlaying shapes. While this is not an issue for SVGs, as the user cannot see them. During embroidery, the stitches of the ones below it may lead to big clusters, or even blockages if the shapes are not subtracted from eachother, to only reveal the visible areas.

12 Changing conversion settings 
	Different fabrics and conditions require different settings (eg. close up logos require low stitch length and low gutter width). The user must be able to change these settings for the program to be useful.

13 Saving as EXP
	For the user to use the converted graphic in an embroidery machine, the file must be one which can be read by those machines. EXP is a file type which is widely used. Without this function, the user would have no use for this software 

14 Undo and redo of graphics
	The user may make mistakes when altering the graphics. To prevent the user from starting from scratch, undo and redo functionality should be implemented and made sure it works.