#######
Testing
#######

*****
Video
*****

Testing was done in video format to convey more information efficiently. It contains testing from the main objectives and test plan. Link: 

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
      - _______
    * - 1.2
      - 
      - Success
      - _______
    * - 1.3
      -
      - Success
      - _______

    * - **2.1**
      - Movement of canvas
      - Success
      - _______
    * - 2.2
      - 
      - Success
      - _______
    * - 2.3
      - 
      - Success
      - _______

    * - **3.1**
      - Selecting elements and changing properties
      - Success
      - _______
    * - 3.2
      - 
      - Success
      - _______
    * - 3.3
      - 
      - n/a
      - n/a

    * - **4.1**
      - Saving canvas as SVG
      - Success
      - _______
    * - 4.2
      - 
      - Success
      - _______
    * - 4.3
      - 
      - n/a
      - n/a

    * - **5.1**
      - Tooltips to appear on hover
      - Success
      - _______
    * - 5.2
      - 
      - Success
      - _______
    * - 5.3
      - 
      - n/a
      - n/a

    * - **6.1**
      - Smoothness of program
      - Success
      - _______
    * - 6.2
      - 
      - n/a
      - n/a
    * - 6.3
      - 
      - Success
      - _______

    * - **7.1**
      - Changing dimensions of items
      - Success
      - _______
    * - 7.2
      - 
      - Success
      - _______
    * - 7.3
      - 
      - Success
      - _______

    * - **8.1**
      - Changing the name of a file
      - Success
      - _______
    * - 8.2
      - 
      - n/a
      - n/a
    * - 8.3
      - 
      - Success
      - _______

    * - **9.1**
      - Converting designs
      - Success
      - _______
    * - 9.2
      - 
      - Success
      - _______
    * - 9.3
      - 
      - Success
      - _______

    * - **10.1**
      - Converting compound shapes
      - Success
      - _______
    * - 10.2
      - 
      - n/a
      - n/a
    * - 10.3
      - 
      - Success
      - _______

    * - **11.1**
      - Flatten SVGs 
      - Success
      - _______
    * - 11.2
      - 
      - Success
      - _______
    * - 11.3
      - 
      - Success
      - _______

    * - **12.1**
      - Change conversion settings
      - Success
      - _______
    * - 12.2
      - 
      - Success
      - _______
    * - 12.3
      - 
      - Success
      - _______

    * - **13.1**
      - Saving as EXP 
      - Success
      - _______
    * - 13.2
      - 
      - Success
      - _______
    * - 13.3
      - 
      - n/a
      - n/a

    * - **14.1**
      - Undo and redo of graphics 
      - Success
      - _______
    * - 14.2
      - 
      - Success
      - _______
    * - 14.3
      - 
      - Success
      - _______


********************
Reason For Each Test
********************

1 Upload SVG File
	For the program to do its intended function of converting SVG files, it must first have access to the file in memory. This test ensures I am able to load a SVG file.

2 Movement of canvas 
	For the user to inspect the design, the user must be able to move around the graphics. This is essential to check if a conversion has completed correctly.

3 Selecting elements and changing properties
	The user should have access to basic tools to change the properties of shapes, this is to prevent users having to use other programs instead of EasyThread and decreasing user satisfaction.

4 Saving canvas SVG 
	In some cases, the user may want to save a the state of the current canvas so that they can work on it later, after changing the properties of the design.

5 Tooltips to appear on hover 
	If users do not know what a button does, it is instinctive for them to hover over them to get some more information. These floating tooltips accommodate this.

6 Smoothness of program 
	If the program is not running smoothly to a point which it is not usable, the user may not choose the software. To ensure user satisfaction, the program must run smoothly in most cases.

7 Changing dimensions if items 
	Since SVGs are scalable, the uploaded SVG may be smaller or bigger than the user wants. To prevent having to edit the SVG in another program, basic functionality to change the dimensions which maintaining aspect ratio is essential.

8 Changing the name of a file 
	The user may want to change the name of the file to a different one after conversion, for easy differentiation.

9 Converting designs
	The main purpose of the software, ensures the program works as intended.

10 Converting compound shapes 
	The difficulty of converting shapes increases greatly if a shape is made up of multiple ones with a specific fill rule. To make sure the program can handle more edge cases, compound shapes are tested.

11 Flatten SVGs
	SVGs may be made up of multiple overlaying shapes. While this is not an issue for SVGs, as the user cannot see them. During embroidery, the stitches of the ones below it may lead to big clusters, or even blockages if the shapes are not subtracted from each other, to only reveal the visible areas.

12 Changing conversion settings 
	Different fabrics and conditions require different settings (eg. close up logos require low stitch length and low gutter width). The user must be able to change these settings for the program to be useful.

13 Saving as EXP
	For the user to use the converted graphic in an embroidery machine, the file must be one which can be read by those machines. EXP is a file type which is widely used. Without this function, the user would have no use for this software 

14 Undo and redo of graphics
	The user may make mistakes when altering the graphics. To prevent the user from starting from scratch, undo and redo functionality should be implemented and made sure it works.