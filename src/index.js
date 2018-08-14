import vorpal from 'vorpal'
import ToyRobot from './toyrobot'
import chalk from 'chalk'

let toyRobot = new ToyRobot()
let vorpalInstance = vorpal()
vorpalInstance.history('toy-robot-cli')

const log = (message, type) => {
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
  vorpalInstance.activeCommand.log(msg)
}

const callToyRobot = (command, parameters) => {
  try {
    const msg = toyRobot[command].apply(toyRobot, parameters)
    log(`Executed command: ${command}`, 'is-success')
    if (command === 'report') {
      log(msg) 
    }
    return msg
  } catch (e) {
    log(`Invalid command: ${command} (${e.message})`, 'is-warning')
  }
}

vorpalInstance
  .command('place <x> <y> <facing>', 'Place the robot at x, y location and facing the direction provided. Facing valid values are: NORTH, EAST, SOUTH, WEST')
  .action(({x, y, facing}, cb) => {
    callToyRobot('place', [x, y, facing])
    cb()
  })

vorpalInstance
  .command('move', 'Moves the robot 1 unit forward in the direction its facing')
  .action((args, cb) => {
    callToyRobot('move')
    cb()
  })

vorpalInstance
  .command('left', 'Rotate left 90 degrees anti-clockwise')
  .action((args, cb) => {
    callToyRobot('left')
    cb()
  })

vorpalInstance
  .command('right', 'Rotate right 90 degrees clockwise')
  .action((args, cb) => {
    callToyRobot('right')
    cb()
  })

vorpalInstance
  .command('report', 'Outputs current robots location and direction')
  .action((args, cb) => {
    callToyRobot('report')
    cb()
  })

vorpalInstance
  .mode('toyrobot')
  .description('Enters the user into a ToyRobot session with function like syntax')
  .delimiter(`${chalk.redBright('toyRobot')}.`)
  .action((command, cb) => {
    const validFunctions = ['place', 'move', 'left', 'right', 'report', 'clear', 'help']
    // regex to match function call
    const match = /([a-zA-Z]+)\((.*?)\)/i.exec(command)
    if (match !== null) {
      const trigger = match[1]
      if (validFunctions.includes(trigger)) {
        const parameters = match[2].split(',')
        try {
          switch (trigger) {
            case 'help':
              log(`Following commands are available:
              > help() - shows available commands
              > place(x, y, facing) - place the robot at x, y location and facing the direction provided. Facing valid values are: NORTH, EAST, SOUTH, WEST
              > move() - moves the robot 1 unit forward in the direction its facing
              > left() - rotate left 90 degrees anti-clockwise
              > right() - rotate right 90 degrees clockwise
              > report() - outputs current robots location and direction
              > exit - exit toyrobot mode`, 'is-info')
              break
            default:
              callToyRobot(trigger, parameters.map((str) => str.trim()))
              break
          }
        } catch (e) {
          log(`Invalid command: ${command} (${e.message})`, 'is-warning')
        }
      } else {
        log(`Invalid command: ${command}`, 'is-danger')
      }
    } else {
      log(`Invalid input, try: help()`, 'is-danger')
    }
    cb()
  })

vorpalInstance.delimiter(`${chalk.cyan('toy-robot-cli')}$ `)
vorpalInstance.show()

export { toyRobot, vorpalInstance, log, callToyRobot }
