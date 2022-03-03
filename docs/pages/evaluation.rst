##########
Evaluation
##########

*****************
Objective Outcome
*****************

In this table, I went back through my objectives, and check through all of them if I met the objective or not. The extension objectives are in **bold**

.. list-table:: Website Objective Outcomes
    :widths: 10, 70, 20
    :header-rows: 1

    * - Number
      - Objective 
      - Achieved?

    * - 1 
      - The user should be able to upload SVG files.
      - Yes
    * - 2
      - A canvas should cover the majority of the webpage.
      - Yes
    * - 2.1
      - Movement of graphics in the canvas should be facilitated by dragging in the canvas.
      - Yes
    * - 2.2 
      - Zooming should be allowed if mouse wheel scrolling while the mouse is in the canvas.
      - Yes
    * - 2.3 
      - The user should be able to select items in a graphic by left-clicking the item. All other selections should be removed.
      - Yes
    * - 2.4
      - If the user selects another item while holding control, the other selections should not disappear.
      - Yes
    * - 2.5 
      - If the user left-clicks nothing, all selections should be removed.
      - Yes
    * - 2.6 
      - Selections should be displayed using an outline around the item selected.
      - Yes
    * - 2.7
      - **Directional rulers should be shown at the top and left side to give an idea to the user how large the graphic is.**
      - Yes

    * - 3
      - A side panel on the right-hand side should be shown, displaying colour information
      - Yes
    * - 3.1
      - In the panel, the user should be able to navigate a list of DMC (thread colours) threads.
      - Yes
    * - 3.2
      - Given a colour is selected, the user should be able to change the colour of the selected item’s fill or stroke.
      - Yes
    * - 3.3
      - Given the user presses a labelled button, the user should be able to normalize all the colours in the graphic to DMC (set of thread colours from a manufacturer) colours.
      - Yes

    * - 4
      - A toolbar at the top should be shown, where the user can run operations.
      - Yes
    * - 4.1
      - The toolbar should be similar to existing programs such as Google Docs or Microsoft Word, so that users can navigate the program easily.
      - Yes
    * - 4.2
      - All items in this toolbar should always be visible
      - Yes
    * - 4.3
      - If the user types in the filename input, the filename should change throughout to the user specified name.
      - Yes
    * - 4.4.1
      - The ‘File’ dropdown should show a menu of items which associate to the graphic that the user is working on, or will be. This includes saving and opening files.
      - Yes
    * - 4.4.2
      - The ‘Edit’ dropdown should show a menu of items which associate to the current graphic.
      - Yes
    * - 4.4.3
      - The ‘View’ dropdown should show a menu of items which associate to how the graphic is displayed in the canvas.
      - Yes
    * - 4.5
      - Below the dropdown, multiple buttons and inputs should be shown which change how the graphic is displayed, or that change attributes of the graphic.
      - Yes
    * - 4.5.1
      - Buttons should be shown that undo or redo the graphic when pressed.
      - Yes
    * - 4.5.2
      - Inputs should be shown that change the dimensions of the graphic when submitted.
      - Yes
    * - 4.5.3
      - Buttons should be shown that change how the canvas looks when pressed.
      - Yes
    * - 4.5.4
      - A button which is different from the other in the toolbar should be shown only when the graphic has not been converted yet, that converts the graphic to an embroidery graphic.
      - Yes
    * - 4.5.5
      - A settings button which opens a list of inputs in a dropdown should be shown which changes how the conversion process behaves.
      - Yes
    * - 4.5.6
      - The user should be able to save any graphic displayed to their local device in whatever state it is in the conversion process (SVG or embroidery), given they click the descriptive buttons.
      - Yes
    * - 4.5.7
      - The user should be able to open any SVG graphic, such that it can be used in the conversion process.
      - Yes

    * - 5
      - The size of the icons and text should be big enough that all users can see them clearly, while preventing overflow.
      - Yes
    * - 6
      - The website should run smoothly (>30fps) with little to no stuttering while dragging a 500kb sized graphic around, when using most computers.
      - Yes
    * - 7
      - The website should load in under half a second on a good connection.
      - Yes
    * - 8
      - The website should be able to display all elements of it and be functional, on all screens with a viewport 800x1024 or higher (standard tablet size).
      - Yes
    * - 9
      - **The website should work well on touch based devices.**
      - Nearly - tooltips do not work properly
    * - 10
      - Tooltips should be shown on some elements, such as buttons after hovering over them after a short while, to show a descriptive message about what the element does.
      - Yes

.. list-table:: Conversion Algorithm Objective Outcomes
    :widths: 10, 70, 20
    :header-rows: 1

    * - Number
      - Objective 
      - Achieved?

    * - 1 
      - The conversion should output an .exp file.
      - Yes
    * - 2
      - A Conversion should be able to take place from SVG files to embroidery file types.
      - Yes
    * - 2.1
      - The stroke of an SVG path (given it has one) should be converted to a set of points resembling a satin stitch or running stitch, with the result being affected by the stroke width of the path.
      - Yes
    * - 2.2 
      - The fill of the SVG path (given it has one) should be filled such that when embroidered, the fabric below should be hard to be seen.
      - Yes
    * - 2.3 
      - The colour of the stitch should be determined by the SVG path attribute, with the colours of different paths within the SVG file being done first to avoid the number of times the user has to switch the threads on the embroidery machine.
      - Yes
    * - 2.4
      - The options given to the user should affect the conversion, for example, a shorter stitch length should result in a more accurate conversion.
      - Yes
    * - 2.5 
      - **Given the user said so, flatten the SVG, so there are no underlying paths. This can prevent too many threads being on top of each other.**
      - Yes
    * - 3
      - The converted file should be able to be saved as SVG (preview of the conversion).
      - Yes
    * - 4
      - Conversion from any step to another must resemble the original input.
      - Yes
    * - 5
      - Conversion should take a reasonable amount of time, around 30 seconds for a 100 mm by 100 mm graphic.
      - Yes



*****************
End-User Feedback
*****************

Mrs. Popescu has been very pleased with the project, and has been able to convert graphics she was not able to before into embroidery files that she used with success on embroidery machines. One thing she said she would have liked, but understood it was not feasible, was to include ART grade A or B Bernina files `https://blog.bernina.com/en/2019/07/lesson-14-bernina-embroidery-software-v8/ <https://blog.bernina.com/en/2019/07/lesson-14-bernina-embroidery-software-v8/>`_ as a potential output, but that is out of the scope of my project.

**********************
Potential Improvements
**********************

One issue I came across many times when converting larger files, is a stack overflow. Each tab in a website have a limited amount of RAM they can work with, so the stack frame limit for browsers is smaller, meaning processes which take up a lot of RAM (including my project in some cases) will run into issues. A workaround for this would be to not use a browser, and rather a native application. 

Another problem I encountered was using workers. React runs on a single threaded loop, so using workers to run asynchronous tasks is hard to set up. Each item in the encoding process does not rely on the result of the previous conversion, so using workers would have greatly increased performance on multicore CPUs. This would have again been solved if I were to not use a browser.

**********
Conclusion
**********

Overall, I am very happy with the outcome of the project, given how niche machine embroidery is, and how little proven methods exist in the open-source community. I am happy with the 