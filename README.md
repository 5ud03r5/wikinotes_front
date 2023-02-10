## General info

You are currently at frontend of wikinotes application. 
If you wanna display backed part of this app please navigate to my wikinotes_back repository

## Problem

A lot of knowledge obtained during troubleshooting process is forgotten and usually not shared across the team because of multiple reasons like not enough time to do structure this knowledge accordingly to be readable bo others, not being sure if that information can be useful etc.. It also becames a problem when shared knowledge became out of data or if similar data already exists in the database.

I created a tool which helps store that raw note and convert it to actual article with help of comparision mechanism and expiry verification.

## Project purpose
![main_pic](https://user-images.githubusercontent.com/94323029/217826562-ff6ba809-bf46-47b9-bc49-324008e17abf.png)

Purpose of the project was to create a space where engineer can put their 'dirty notes', share them accross the group and then transform to article while also being able to create articles. 

## Project features

It is a combination of wiki and notes where you can add note, share your note across the team with posibility to create article from note:

![2023-02-08 10_15_22-SIEM WIKI](https://user-images.githubusercontent.com/94323029/217827063-c3466cb1-04c1-4574-83af-ae800641e3ac.png)

Articles can be voted as helpful with thumb up, so it can be better positioned in search engine. Articles can also be added to favorite articles. 
After article creation and before publishing it, it needs to be manually approved by administrator. For more information please take a look on backend section.
Articles have expiration date set to 6 months from creation. When they expires, they receive expiration tag which means that it needs to be reviewed. You can also filter you articles by tag and search inside of this tag group


![2023-02-08 10_24_40-SIEM WIKI](https://user-images.githubusercontent.com/94323029/217827702-102298e8-fc19-4c49-9d1f-70bbeef2d6e1.png)

Tags plays very important role here. They describe a group of articles to which Article belongs to. Tags can be added on Tags page and they filtered and displayed there:


![2023-02-08 10_17_45-SIEM WIKI](https://user-images.githubusercontent.com/94323029/217827856-a1ac6624-8fac-4724-91cc-94aa5994d38e.png)

