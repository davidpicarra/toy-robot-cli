import VorpalInstance from '../vorpal'
import chalk from 'chalk'

describe('vorpal.js', () => {
  it('should have a data with command, size, robot and messages', () => {
    const defaultData = new VorpalInstance()
    expect(defaultData.vorpalInstance).toBeDefined()
    expect(defaultData.toyRobot).toBeDefined()
    expect(defaultData.validFunctions).toEqual(['place', 'move', 'left', 'right', 'report', 'clear', 'help'])
  })

  it('should execute the sample test correctly', () => {
    let instance = new VorpalInstance()
    instance.log = jest.fn()
    instance.sendCommand('place(0, 0, NORTH)')
    expect(instance.log).toBeCalledWith('Executed command: place', 'is-success')
    instance.log.mockReset()
    instance.sendCommand('move()')
    expect(instance.log).toBeCalledWith('Executed command: move', 'is-success')
    instance.log.mockReset()
    instance.sendCommand('report()')
    expect(instance.log.mock.calls[0][0]).toEqual('Executed command: report')
    expect(instance.log.mock.calls[1][0]).toEqual('Robot.x: 0 Robot.y: 1 Robot.facing: NORTH')
    
    instance.log.mockReset()
    instance.sendCommand('place(0, 0, NORTH)')
    expect(instance.log).toBeCalledWith('Executed command: place', 'is-success')
    instance.log.mockReset()
    instance.sendCommand('left()')
    expect(instance.log).toBeCalledWith('Executed command: left', 'is-success')
    instance.log.mockReset()
    instance.sendCommand('report()')
    expect(instance.log.mock.calls[0][0]).toEqual('Executed command: report')
    expect(instance.log.mock.calls[1][0]).toEqual('Robot.x: 0 Robot.y: 0 Robot.facing: WEST')

    instance.log.mockReset()
    instance.sendCommand('place(1, 2, EAST)')
    expect(instance.log).toBeCalledWith('Executed command: place', 'is-success')
    instance.log.mockReset()
    instance.sendCommand('move()')
    expect(instance.log).toBeCalledWith('Executed command: move', 'is-success')
    instance.log.mockReset()
    instance.sendCommand('move()')
    expect(instance.log).toBeCalledWith('Executed command: move', 'is-success')
    instance.log.mockReset()
    instance.sendCommand('left()')
    expect(instance.log).toBeCalledWith('Executed command: left', 'is-success')
    instance.log.mockReset()
    instance.sendCommand('move()')
    expect(instance.log).toBeCalledWith('Executed command: move', 'is-success')
    instance.log.mockReset()
    instance.sendCommand('report()')
    expect(instance.log.mock.calls[0][0]).toEqual('Executed command: report')
    expect(instance.log.mock.calls[1][0]).toEqual('Robot.x: 3 Robot.y: 3 Robot.facing: NORTH')
  })

  describe('methods', () => {
    let instance

    beforeEach(() => {
      instance = new VorpalInstance()
    })

    describe('run', () => {
      it('should exist', () => {
        expect(instance.run).toBeDefined()
      })
      it('should set delimiter and show vorpal', () => {
        instance.vorpalInstance = {
          delimiter: jest.fn(),
          show: jest.fn()
        }
        instance.run()
        expect(instance.vorpalInstance.delimiter).toHaveBeenCalled()
        expect(instance.vorpalInstance.show).toHaveBeenCalled()
      })
    })

    describe('log', () => {
      beforeEach(() => {
        instance.vorpalInstance = {
          activeCommand: {
            log: jest.fn()
          }
        }
      })

      it('should exist', () => {
        expect(instance.log).toBeDefined()
      })
      it('should call activeCommand.log with default blue', () => {
        instance.log('foo', 'bar')
        expect(instance.vorpalInstance.activeCommand.log).toBeCalledWith(chalk.blue('foo'))
      })
      it('should call activeCommand.log with green when type == is-success', () => {
        instance.log('foo', 'is-success')
        expect(instance.vorpalInstance.activeCommand.log).toBeCalledWith(chalk.green('foo'))
      })
      it('should call activeCommand.log with red when type == is-danger', () => {
        instance.log('foo', 'is-danger')
        expect(instance.vorpalInstance.activeCommand.log).toBeCalledWith(chalk.red('foo'))
      })
      it('should call activeCommand.log with yellow when type == is-warning', () => {
        instance.log('foo', 'is-warning')
        expect(instance.vorpalInstance.activeCommand.log).toBeCalledWith(chalk.yellow('foo'))
      })
    })

    describe('sendCommand', () => {
      beforeEach(() => {
        instance.log = jest.fn()
      })

      it('should exist', () => {
        expect(instance.sendCommand).toBeDefined()
      })
      it('should execute command and show success', () => {
        instance.sendCommand('place(1, 2, NORTH)')
        expect(instance.log).toHaveBeenCalledWith('Executed command: place', 'is-success')
      })
      it('should execute help', () => {
        instance.sendCommand('help()')
        expect(instance.log).toHaveBeenCalledWith(`Following commands are available:
              > help() - shows available commands
              > place(x, y, facing) - place the robot at x, y location and facing the direction provided. Facing valid values are: NORTH, EAST, SOUTH, WEST
              > move() - moves the robot 1 unit forward in the direction its facing
              > left() - rotate left 90 degrees anti-clockwise
              > right() - rotate right 90 degrees clockwise
              > report() - outputs current robots location and direction
              > exit - exit toyrobot mode`, 'is-info')
      })
      it('should show invalid input if it doesnt match a function input like', () => {
        instance.sendCommand('foobar')
        expect(instance.log).toBeCalledWith('Invalid input, try: help()', 'is-danger')
      })
      it('should show invalid command if command is function but not within this.validFunctions', () => {
        instance.sendCommand('test()')
        expect(instance.log).toBeCalledWith('Invalid command: test()', 'is-danger')
      })
      it('should show invalid command if command if exception thrown when calling valid function', () => {
        instance.callToyRobot = jest.fn()
        instance.callToyRobot.mockImplementation(() => {
          throw new Error('foobar')
        })
        instance.sendCommand('place()')
        expect(instance.log).toBeCalledWith('Invalid command: place() (foobar)', 'is-warning')
      })
    })

    describe('callToyRobot', () => {
      beforeEach(() => {
        instance.log = jest.fn()
      })
      it('should exist', () => {
        expect(instance.callToyRobot).toBeDefined()
      })
      it('should trigger toyRobot command with parameters and return result of command', () => {

        instance.toyRobot.foo = jest.fn().mockImplementation(() => 'foobar')
        const msg = instance.callToyRobot('foo', ['bar'])
        expect(instance.toyRobot.foo).toBeCalledWith('bar')
        expect(msg).toBe('foobar')
      })
      it('should trigger toyRobot and call log with result if command == report', () => {
        instance.toyRobot.report = jest.fn().mockImplementation(() => 'bar')
        instance.callToyRobot('report')
        expect(instance.toyRobot.report).toBeCalled()
        expect(instance.log).toBeCalledWith('bar')
      })
      it('should report invalid command if toyRobot function throws Error', () => {
        instance.toyRobot.foo = jest.fn().mockImplementation(() => { throw new Error('bar') })
        instance.callToyRobot('foo')
        expect(instance.toyRobot.foo).toBeCalled()
        expect(instance.log).toBeCalledWith('Invalid command: foo (bar)', 'is-warning')
      })
    })

    describe('place', () => {
      it('should exist', () => {
        expect(instance.place).toBeDefined()
      })
      it('should call this.callToyRobot with place and arguments', () => {
        instance.callToyRobot = jest.fn()
        instance.place({
          x: 1,
          y: 2,
          facing: 3
        })
        expect(instance.callToyRobot).toHaveBeenCalledWith('place', [1, 2, 3])
      })
    })

    describe('move', () => {
      it('should exist', () => {
        expect(instance.move).toBeDefined()
      })
      it('should call this.callToyRobot with move', () => {
        instance.callToyRobot = jest.fn()
        instance.move()
        expect(instance.callToyRobot).toHaveBeenCalledWith('move')
      })
    })

    describe('left', () => {
      it('should exist', () => {
        expect(instance.left).toBeDefined()
      })
      it('should call this.callToyRobot with left', () => {
        instance.callToyRobot = jest.fn()
        instance.left()
        expect(instance.callToyRobot).toHaveBeenCalledWith('left')
      })
    })

    describe('right', () => {
      it('should exist', () => {
        expect(instance.right).toBeDefined()
      })
      it('should call this.callToyRobot with right', () => {
        instance.callToyRobot = jest.fn()
        instance.right()
        expect(instance.callToyRobot).toHaveBeenCalledWith('right')
      })
    })

    describe('report', () => {
      it('should exist', () => {
        expect(instance.report).toBeDefined()
      })
      it('should call this.callToyRobot with report', () => {
        instance.callToyRobot = jest.fn()
        instance.report()
        expect(instance.callToyRobot).toHaveBeenCalledWith('report')
      })
    })
  })
})