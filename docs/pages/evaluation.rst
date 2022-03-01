##########
Evaluation
##########

*****************
Objective Outcome
*****************

As shown in the test video where I tested the objectives too, I achieved all the objectives, and all but one ('The website should work well on touch based devices.') of the extension objectives. Using this measurement, I can say that the outcome has been successful.

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