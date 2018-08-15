# David Piçarra - Toy Robot Cli
[![CircleCI](https://img.shields.io/circleci/project/github/davidpicarra/toy-robot-cli.svg)](https://circleci.com/gh/davidpicarra/toy-robot-cli)
[![Coverage Status](https://img.shields.io/codecov/c/github/davidpicarra/toy-robot-cli.svg)](https://codecov.io/github/davidpicarra/toy-robot-cli?branch=master)

> A Node.js project to solve the Toy Robot challenge

## Table of Contents
- [What was done](#what-was-done)
- [How to run the app](#how-to-run-the-app)
- [Build setup](#build-setup)

## What was done

A class named `ToyRobot` was created to allow a Robot to be place in a 5x5 grid.
The interaction with that Robot is made via the class `VorpalInstance` which uses the [vorpal](https://github.com/dthree/vorpal/) framework. It is possible to send the commands directly as normal cli by using the following syntax:

```bash
  help [command...]       Provides help for a given command.
  exit                    Exits application.
  place <x> <y> <facing>  Place the robot at x, y location and facing the direction provided. Facing valid values are: NORTH, EAST, SOUTH, WEST
  move                    Moves the robot 1 unit forward in the direction its facing
  left                    Rotate left 90 degrees anti-clockwise
  right                   Rotate right 90 degrees clockwise
  report                  Outputs current robots location and direction
  toyrobot                Enters the user into a ToyRobot session with function like syntax
```

To enter the `toyrobot` mode just type `toyrobot` and it will change the mode to accept a function like syntax with the below commands being available:

```javascript
  > help() - shows available commands
  > place(x, y, facing) - place the robot at x, y location and facing the direction provided. Facing valid values are: NORTH, EAST, SOUTH, WEST
  > move() - moves the robot 1 unit forward in the direction its facing
  > left() - rotate left 90 degrees anti-clockwise
  > right() - rotate right 90 degrees clockwise
  > report() - outputs current robots location and direction
  > exit - exit toyrobot mode
```

Created unit test with 100% coverage and added specific test to try the scenario provided:
> [should execute the sample test correctly](https://github.com/davidpicarra/toy-robot-cli/blob/master/src/__tests__/vorpal.spec.js#L12)

## How to run the app

In order to run the app locally, the following commands must be executed:
```bash
# npm
$ npm install
$ npm start

# yarn
$ yarn
$ yarn start
```
