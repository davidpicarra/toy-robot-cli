export default class ToyRobot {
  constructor(size = {x: 5, y: 5}, robot = {x: 0, y: 0, facing: null}) {
    this.size = size
    this.robot = robot
    this.directions = ['NORTH', 'EAST', 'SOUTH', 'WEST']
  }

  place(x, y, facing) {
    this.robot.x = x
    this.robot.y = y
    this.robot.facing = this.directions.indexOf(facing)
    if (this.robot.facing === -1 ||
      this.robot.x < 0 || this.robot.x > this.size.x ||
      this.robot.y < 0 || this.robot.y > this.size.x) {
      this.robot.facing = null
      throw new Error(`Invalid facing: ${facing}`)
    }
  }
  move() {
    this.robotPlaced()
    const outsideBoundaries = () => { throw new Error('Cannot move outside boundaries') }
    switch (this.mod(this.robot.facing, 4)) {
      // NORTH
      case 0:
        if (this.robot.y >= this.size.y) {
          outsideBoundaries()
        }
        this.robot.y++
        break
      // EAST
      case 1:
        if (this.robot.x >= this.size.x) {
          outsideBoundaries()
        }
        this.robot.x++
        break
      // SOUTH
      case 2:
        if (this.robot.y <= 0) {
          outsideBoundaries()
        }
        this.robot.y--
        break
      // WEST
      case 3:
        if (this.robot.x <= 0) {
          outsideBoundaries()
        }
        this.robot.x--
        break
    }
  }
  left() {
    this.robotPlaced()
    this.robot.facing--
  }
  right() {
    this.robotPlaced()
    this.robot.facing++
  }
  report() {
    this.robotPlaced()
    const facing = this.directions[this.mod(this.robot.facing, 4)]
    return `Robot.x: ${this.robot.x} Robot.y: ${this.robot.y} Robot.facing: ${facing}`
  }
  mod(n, m) {
    // define mod function to allow for negative mod
    // -1 % 4 == -1
    // mod(-1, 4) == 3
    return ((n % m) + m) % m
  }
  robotPlaced() {
    if (this.robot.facing === null) {
      throw new Error('Robot has not been placed yet, use place command')
    }
  }
}