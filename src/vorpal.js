import vorpal from 'vorpal'
import chalk from 'chalk'
import ToyRobot from './toyrobot'

export default class VorpalInstance {
  constructor(toyRobot = new ToyRobot()) {
    this.vorpalInstance = vorpal()
    this.vorpalInstance.history('toy-robot-cli')
    this.toyRobot = toyRobot
    this.validFunctions = ['place', 'move', 'left', 'right', 'report', 'clear', 'help']

    this.vorpalInstance
      .command('place <x> <y> <facing>', 'Place the robot at x, y location and facing the direction provided. Facing valid values are: NORTH, EAST, SOUTH, WEST')
      .action(this.place.bind(this))

    this.vorpalInstance
      .command('move', 'Moves the robot 1 unit forward in the direction its facing')
      .action(this.move.bind(this))

    this.vorpalInstance
      .command('left', 'Rotate left 90 degrees anti-clockwise')
      .action(this.left.bind(this))

    this.vorpalInstance
      .command('right', 'Rotate right 90 degrees clockwise')
      .action(this.right.bind(this))

    this.vorpalInstance
      .command('report', 'Outputs current robots location and direction')
      .action(this.report.bind(this))

    this.vorpalInstance
      .mode('toyrobot')
      .description('Enters the user into a ToyRobot session with function like syntax')
      .delimiter(`${chalk.redBright('toyRobot')}.`)
      .action(this.sendCommand.bind(this))

  }

  run() {
    this.vorpalInstance.delimiter(`${chalk.cyan('toy-robot-cli')}$ `)
    this.vorpalInstance.show()
  }

  log(message, type) {
    let msg
    switch (type) {
      case 'is-success':
        msg = chalk.green(message)
        break
      case 'is-danger':
        msg = chalk.red(message)
        break
      case 'is-warning':
        msg = chalk.yellow(message)
        break
      default:
        msg = chalk.blue(message)
        break
    }
    this.vorpalInstance.activeCommand.log(msg)
  }

  callToyRobot(command, parameters) {
    try {
      const msg = this.toyRobot[command].apply(this.toyRobot, parameters)
      this.log(`Executed command: ${command}`, 'is-success')
      if (command === 'report') {
        this.log(msg)
      }
      return msg
    } catch (e) {
      this.log(`Invalid command: ${command} (${e.message})`, 'is-warning')
    }
  }

  place({ x, y, facing }, cb = () => {}) {
    this.callToyRobot('place', [x, y, facing])
    cb()
  }

  move(args, cb = () => {}) {
    this.callToyRobot('move')
    cb()
  }

  left(args, cb = () => {}) {
    this.callToyRobot('left')
    cb()
  }

  right(args, cb = () => {}) {
    this.callToyRobot('right')
    cb()
  }

  report(args, cb = () => {}) {
    this.callToyRobot('report')
    cb()
  }

  sendCommand(command, cb = () => {}) {
    // regex to match function call
    const match = /([a-zA-Z]+)\((.*?)\)/i.exec(command)
    if (match !== null) {
      const trigger = match[1]
      if (this.validFunctions.includes(trigger)) {
        const parameters = match[2].split(',')
        try {
          switch (trigger) {
            case 'help':
              this.log(`Following commands are available:
              > help() - shows available commands
              > place(x, y, facing) - place the robot at x, y location and facing the direction provided. Facing valid values are: NORTH, EAST, SOUTH, WEST
              > move() - moves the robot 1 unit forward in the direction its facing
              > left() - rotate left 90 degrees anti-clockwise
              > right() - rotate right 90 degrees clockwise
              > report() - outputs current robots location and direction
              > exit - exit toyrobot mode`, 'is-info')
              break
            default:
              this.callToyRobot(trigger, parameters.map((str) => str.trim()))
              break
          }
        } catch (e) {
          this.log(`Invalid command: ${command} (${e.message})`, 'is-warning')
        }
      } else {
        this.log(`Invalid command: ${command}`, 'is-danger')
      }
    } else {
      this.log(`Invalid input, try: help()`, 'is-danger')
    }
    cb()
  }
}
