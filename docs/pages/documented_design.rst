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

***************
Data Structures
***************

All data entries in the models are required, since they are schemes, however they can take null values. Auto-generated refers to if the property is determined automatically from no user input.

File
====

+-----------------+---------+----------------+---------------+
| Property        | Type    | Auto-generated | Default value |
+=================+=========+================+===============+
| GUID            | string  | ✓              |               |
+-----------------+---------+----------------+---------------+
| filename        | string  |                |               |
+-----------------+---------+----------------+---------------+
| path            | string  | ✓              |               |
+-----------------+---------+----------------+---------------+
| dateAdded       | date    | ✓              |               |
+-----------------+---------+----------------+---------------+
| maxWaitTime     | integer | ✓              | 1200s         |
+-----------------+---------+----------------+---------------+
| maxProccessTime | integer | ✓              | 120s          |
+-----------------+---------+----------------+---------------+
| maxServeTime    | integer | ✓              | 86400s        |
+-----------------+---------+----------------+---------------+
| status          | integer | ✓              |               |
+-----------------+---------+----------------+---------------+
| owner           | object  | ✓              |               |
+-----------------+---------+----------------+---------------+

GUID
    Automatically generated, used to keep track of the file.

filename
    The user defined filename given when uploaded. Replaces GUID filename when it is served to the user. 

path
    Automatically generated, relative path to the 'public' folder.

dateAdded
    Automatically generated, date when the file was last updated (uploaded, added to queue, converted). Used to determine if the file should be deleted if it takes up too much proccessing time.

maxWaitTime
    Measured in seconds. Determinded by the authority of the user (guest, memeber, admin).

maxProccessTime
    Measured in seconds. Determinded by the authority of the user (guest, memeber, admin).

maxServeTime
    Measured in seconds. Determinded by the authority of the user (guest, memeber, admin).

status
    Automatically generated, indicates at what stage the file is at. 
    
        1. deleted
        2. waiting in queue
        3. being converted
        4. converted, being served

owner
    ObjectID of the user who owns this file. Admins can access any file, guests can access any file without an owner (if they know the GUID), members can access their own files.

User
====

+----------+---------+----------------+---------------+
| Property | Type    | Auto-generated | Default value |
+==========+=========+================+===============+
| username | string  |                |               |
+----------+---------+----------------+---------------+
| password | string  |                |               |
+----------+---------+----------------+---------------+
| isAdmin  | boolean | ✓              | false         |
+----------+---------+----------------+---------------+

username
    Unique string that identifies users.

password
    Hashed password, used to compare passwords recieved and authenticate users.

isAdmin
    Indicates if the user is to have admin priviledges.

TaskQueue
=========

+-----------+--------+----------------+---------------+
| Property  | Type   | Auto-generated | Default value |
+===========+========+================+===============+
| fileGUID  | object | ✓              |               |
+-----------+--------+----------------+---------------+
| dateAdded | Date   | ✓              |               |
+-----------+--------+----------------+---------------+
  
fileGUID
    entry ID of the file waiting.

dateAdded
    Date time added, used to make sure the file will not take up too much time in the queue, prevents congestation.


TaskHeap
========

+------------------+---------------+----------------+---------------+
| Property         | Type          | Auto-generated | Default value |
+==================+===============+================+===============+
| fileGUID         | object        | ✓              |               |
+------------------+---------------+----------------+---------------+
| dateAdded        | string        | ✓              |               |
+------------------+---------------+----------------+---------------+
| tasks            | array[string] | ✓              |               |
+------------------+---------------+----------------+---------------+
| currentTaskIndex | integer       | ✓              | -1            |
+------------------+---------------+----------------+---------------+

fileGUID
    entry ID of the file being worked on.

dateAdded
    Date time added, used to make sure the file will not take up too much processing time.

tasks
    array of the next conversion steps.

currentTaskIndex
    current task being worked on in the tasks


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