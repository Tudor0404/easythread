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