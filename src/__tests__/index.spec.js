import { toyRobot, vorpalInstance, log, callToyRobot } from '../index'

describe('toyrobot.js', () => {
  it('should exist', () => {
    jest.mock('../index', () => {
      callToyRobot: jest.fn()
    })
    // console.log(toyRobot)
    console.log(log)
    console.log(callToyRobot)
    console.log(vorpalInstance.left)
    vorpalInstance.left()
    expect(callToyRobot).toHaveBeenCalled()
  })
})