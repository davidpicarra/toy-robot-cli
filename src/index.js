import VorpalInstance from './vorpal'
import chalk from 'chalk'
import figlet from 'figlet'
import clear from 'clear'

clear()

console.log(
  chalk.yellow(
    figlet.textSync('Toy Robot CLI', { horizontalLayout: 'full' })
  )
)

let vorpalInstace = new VorpalInstance()
vorpalInstace.run()
