import ToyRobot from '../toyrobot'

describe('toyrobot.js', () => {
  it('should have a data with command, size, robot and messages', () => {
    const defaultData = new ToyRobot()
    expect(defaultData).toMatchObject({
      size: {
        x: 5,
        y: 5
      },
      robot: {
        facing: null,
        x: 0,
        y: 0
      },
      directions: ['NORTH', 'EAST', 'SOUTH', 'WEST']
    })
  })

  describe('methods', () => {
    let instance

    beforeEach(() => {
      instance = new ToyRobot()
    })


    describe('mod', () => {
      it('should exist', () => {
        expect(instance.mod).toBeDefined()
      })
      it('should return correct mod on positive number', () => {
        expect(instance.mod(3, 4)).toEqual(3)
      })
      it('should return correct mod on negative number', () => {
        expect(instance.mod(-1, 4)).toEqual(3)
      })
    })

    describe('robotPlaced', () => {
      it('should exist', () => {
        expect(instance.robotPlaced).toBeDefined()
      })
      it('should throw Error if this.robot.facing === null', () => {
        expect(() => {
          instance.robotPlaced()
        }).toThrow()
      })
      it('should NOT throw Error if this.robot.facing !== null', () => {
        instance.robot.facing = 1
        expect(() => {
          instance.robotPlaced()
        }).not.toThrow()
      })
    })

    describe('report', () => {
      it('should exist', () => {
        expect(instance.report).toBeDefined()
      })
      it('should call this.robotPlaced(), calculate which direction correctly and return the output message ', () => {
        instance.robot = {
          x: 1,
          y: 2,
          facing: 3
        }
        instance.robotPlaced = jest.fn()
        instance.mod = jest.fn()
        instance.mod.mockReturnValue(3)
        let msg = instance.report()
        expect(instance.robotPlaced).toHaveBeenCalled()
        expect(instance.mod).toHaveBeenCalledWith(3, 4)
        expect(msg).toEqual(`Robot.x: 1 Robot.y: 2 Robot.facing: WEST`)
      })
    })


    describe('right', () => {
      it('should exist', () => {
        expect(instance.right).toBeDefined()
      })
      it('should call this.robotPlaced() and increment facing', () => {
        instance.robot = {
          x: 1,
          y: 2,
          facing: 3
        }
        instance.robotPlaced = jest.fn()
        instance.right()
        expect(instance.robotPlaced).toHaveBeenCalled()
        expect(instance.robot.facing).toEqual(4)
      })
    })

    describe('left', () => {
      it('should exist', () => {
        expect(instance.left).toBeDefined()
      })
      it('should call this.robotPlaced() and decrement facing', () => {
        instance.robot = {
          x: 1,
          y: 2,
          facing: 3
        }
        instance.robotPlaced = jest.fn()
        instance.left()
        expect(instance.robotPlaced).toHaveBeenCalled()
        expect(instance.robot.facing).toEqual(2)
      })
    })

    describe('move', () => {
      beforeEach(() => {
        instance.size = {
          x: 5,
          y: 5
        }
      })

      it('should exist', () => {
        expect(instance.move).toBeDefined()
      })
      it('should call this.robotPlaced()', () => {
        instance.robot = {
          x: 1,
          y: 2,
          facing: 0
        }
        instance.robotPlaced = jest.fn()
        instance.move()
      })

      describe('NORTH', () => {
        it('should move within boundaries', () => {
          instance.robot = {
            x: 1,
            y: 2,
            facing: 0
          }
          instance.move()
          expect(instance.robot).toEqual({
            x: 1,
            y: 3,
            facing: 0
          })
        })
        it('should NOT move outside boundaries', () => {
          instance.robot = {
            x: instance.size.x,
            y: instance.size.y,
            facing: 0
          }
          expect(() => {
            instance.move()
          }).toThrow()
        })
      })

      describe('EAST', () => {
        it('should move within boundaries', () => {
          instance.robot = {
            x: 1,
            y: 2,
            facing: 1
          }
          instance.move()
          expect(instance.robot).toEqual({
            x: 2,
            y: 2,
            facing: 1
          })
        })
        it('should NOT move outside boundaries', () => {
          instance.robot = {
            x: instance.size.x,
            y: instance.size.y,
            facing: 1
          }
          expect(() => {
            instance.move()
          }).toThrow()
        })
      })

      describe('SOUTH', () => {
        it('should move within boundaries', () => {
          instance.robot = {
            x: 1,
            y: 2,
            facing: 2
          }
          instance.move()
          expect(instance.robot).toEqual({
            x: 1,
            y: 1,
            facing: 2
          })
        })
        it('should NOT move outside boundaries', () => {
          instance.robot = {
            x: 0,
            y: 0,
            facing: 2
          }
          expect(() => {
            instance.move()
          }).toThrow()
        })
      })

      describe('WEST', () => {
        it('should move within boundaries', () => {
          instance.robot = {
            x: 1,
            y: 2,
            facing: 3
          }
          instance.move()
          expect(instance.robot).toEqual({
            x: 0,
            y: 2,
            facing: 3
          })
        })
        it('should NOT move outside boundaries', () => {
          instance.robot = {
            x: 0,
            y: 0,
            facing: 3
          }
          expect(() => {
            instance.move()
          }).toThrow()
        })
      })
    })

    describe('place', () => {
      it('should exist', () => {
        expect(instance.place).toBeDefined()
      })
      it('should set robot.x, robot.y and robot.facing', () => {
        instance.place(1, 2, instance.directions[0])
        expect(instance.robot).toEqual({
          x: 1,
          y: 2,
          facing: 0
        })
      })
      it('should throw error if invalid facing', () => {
        instance.robot = {
          x: 1,
          y: 2,
          facing: 3
        }
        expect(() => {
          instance.place(1, 2, 3)
        }).toThrow()
        expect(instance.robot.facing).toBeNull()
      })
      it('should throw error if outside boundaries', () => {
        instance.robot = {
          x: 1,
          y: 2,
          facing: 3
        }
        expect(() => {
          instance.place(-1, 2, 'NORTH')
        }).toThrow()
        expect(instance.robot.facing).toBeNull()
      })
    })
  })
})
