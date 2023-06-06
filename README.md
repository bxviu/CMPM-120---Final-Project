# CMPM-120---Final-Project

Team Members:
Benthan Vu

Michael Law

Dexter Zhang

Kyler Mekmorakoth


## Scene Flow Prototype Requirements: 

Scene Types 
- We have Main title screen, 
- a cinematic scene introducing backstory
- the gameplay scene
- transitions
- A stat screen that displays things the player did so unique for each person
- Ending Scene 
- Credit Scene

Communication between scenes: 
- Transitions we have one called 20 years later and one 40 years later we do this by including a global variable 
- Also the stat screen (not implemented yet) will take global variable of the player and display it

Reachability:
- Our game doesn't have a win or lose so you can reach everything just my clicking around. 

Transitions: 
- Scenes fade to black when you get to new scene. 

## Core Gameplay Prototype Requirements

Audio
- Continuously looping placeholder background music
- Placeholder noise that plays when player picks up an item or opens their inventory

Visual
- Placeholder images for player and items
- Placeholder tilemap for the level

Motion
- Player movement using the arrows
- Inventory animating in when player taps on the inventory
- Camera moves slightly ahead of player in the direction they are moving

Progression
- Player can pick up items, which will be added to their inventory
- A timer shows how much time the player has left in the world
- Additionally, in [scene flow](https://bxviu.github.io/CMPM-120---Final-Project/scene-flow-1.html), there is progression of the story 

Prefabs
- Created a class "entity" that extends Phaser.GameObject.Sprite
- "Player" and "item" classes extend the "entity" class
- Created a class "menu" that extends Phaser.Scene
- "Inventory" class extends the "menu" class