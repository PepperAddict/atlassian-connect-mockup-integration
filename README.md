# Atlassian Connect's Mockup Integration 

Welcome to Mockup Integration brought to you by Jenearly and Yenith. 

This plugin allows users to be able to enter links to their mockup/prototype and integrate it with their issue ticket. 

## Design Services
Design services that are supported are: Figma, Anima(Adobe XD, Sketch, Figma), Image links, Google drive, and Adobe XD. Please contact me through a **Github Issue** if you would like a service added.

Some services unfortunately don't offer thumbnail, but in the very least a link will be available for users to access. 

## Jira Notification
This plugin also supports notification and a setting to set the correct owner (Jira user) of the mockup that was created. A notification will be sent when a mockup has been added. 

## Upload to Attachment 

This Jira plugin also allows uploading to the issue attachments. It allows what file types Atlassian allows which doesn't seem to have a limit that I'm aware of. If the file is an image file, there will be a thumbnail available. Atlassian's attachments seem to trigger a download when accessing the original file after attaching even whether it's a download

## Install 

If you would like to install this on your Jira environment, add this app: 
`https://jira-design.herokuapp.com/atlassian-connect.json`


## Why Mockup Integration

Mockup integration is an addon that shows right on the current Jira issue ticket. Which ever Mockup URL you may have and users would be able to correlate it to the current task. 

## How was it built?

The Mockup Integration was built with React and Atlassian Connect's API. 