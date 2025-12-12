# CS3202-GroupJ-Project 
Project from 2025 Fall CS 3202 Software Engineering / Group J 
# 📆 Student Life Web App✏️ 

A productivity web app created to help students organize assignments, homework, and exams with a calendar, study with an AI assistant, and help find financial aid. 

## Description 

The Smart Study Planner is a tool created to make studying more structured and effective. Users can create tasks, set deadlines, and receive adaptive reminders that adjust based on progress. By integrating features like a dynamic calendar, subject categorization, and smart recommendations, the web app aims to reduce procrastination and help learners stay on top of their goals. This project is developed as part of CS 3203 (Fall 2025), with a focus on practical software engineering principles and teamwork. 

## Tech Stack
Frontend: React Native, Expo  
Backend: SQL, Azure

## Getting Started 

### Dependencies 

React Naive CLI (https://reactnative.dev/docs/getting-started)

Android Studio (https://developer.android.com/studio)

Xcode 

Node.js (comes with npm) or Yarn (https://nodejs.org/en/download)

Expo (https://expo.dev)

## Our domain

This is the domain of our web app, if you do not want to install all the stuff to help work on the code.

https://yellow-ocean-0e950841e.3.azurestaticapps.net/

### Installing 

During early development, the web app will not be available on the App store or Play Store. The web app must be installed through the git repository and installed within an emulator or Expo GO mobile environment.  

Requirements for Installation: 

React Native CLI 

Node.js

Expo CLI

For Android install - Android Studio 

For IOS install – Xcode 

OPTIONAL: Expo GO Mobile App


### Step 1: Clone the Repository  

git clone https://github.com/GroupJ-CS3202/CS3203-GroupJ-Project

### Step 2: Install dependencies 

In Terminal:

cd into StudentLife directory

npx expo install

### Step 3: Installing Calendar package

Go to the terminal and

If using npm:

$ npm install --save react-native-calendars

If using Yarn:

$ yarn add react-native-calendars

RN (React Native) Calendars is implemented in JavaScript, so no native module is required. 

### Step 4: Start Metro bundler

npx expo start 

### Executing Program 

The build process slightly differs for IOS and Android. 

Step 1: Download a program that simulates IOS and Android environments such as Xcode or Android Studio. 

Step 2: Install and execute app within simulated environment 

If installing within IOS: npx react-native run-ios  

If installing within Android: npx react-native run-android 

# Features

These are all the core functions accessible via tabs at the bottom of the page:

## Home Screen

### Event Panel:

Shows all coming events in the near future on the bottom of the screen.

### AI Section (Smart Summary):

Located in the middle, this provides a smart summary of your weekly schedule, highlighting important events and any urgent or emerging tasks.

### Bulletin Board:

The section under "welcome" displays important announcements, updates, reminders, or messages relevant to the user. (Still work in progress)

## Calendar

### Current Date View:

The current date, matching your system's date, is highlighted with a blue circle.

### Date Selection: 

Users can select any other date by clicking on it, which will also display a blue circle.

### Add Event: 

Select a date and click the "+ ADD EVENT" blue rectangle to create a new event, including an event name and description.

### Event List:

A list of all created events for the selected day is displayed.

### Edit Event: 

An "Edit" button allows users to return to the event creation page to make changes.

### Delete Event:

A "Delete" button on the right side of an event allows for its removal.

## AI Helper

To be honest, it's basically just ChatGPT

## Other Sections

Finance, Events, and Settings pages are still a work in progress, although so far, toggling dark mode in the settings work though. 

## Help 

If encountering issues while setting up the project: 

Ensure all prerequisites are installed (Node.js, npm or yarn, Android Studio/Xcode, Expo) 

Try reinstalling dependencies 

Refer to React Native, Expo, or NPM Documentation for setup help.  

## Authors  

[Sabrin Ahmed](https://github.com/SabrinAhmed1) 

Role : SQL Service Development 

[Chih-Yu Chu](https://github.com/chihyu702) 

Role : Homepage & Finance Page 

[Inha Kim](https://github.com/Jokeren1) 

Role : Azure LLM Service Development	 

[AJ Redding]() 

Role : SQL Service Development 

[Seongmin Roh](https://github.com/RohSeongmin) 

Role : Calendar Page & Homepage 

[Cayden Sargent]() 

Role : Azure LLM Service Development & AI Page 

[Daniel Yeaman](https://github.com/dyeam05) 

Role : AI Page 

 

If you have any question, feel free to contact us 

## Version History  

 

## License  

 

## Acknowledgements   
