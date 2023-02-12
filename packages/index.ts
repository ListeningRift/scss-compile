import fs from 'fs'
import path from 'path'
import parse from './parse'
import generate from './generate'
import { createCommand } from 'commander'

const commander = createCommand('scss-compile')
commander
  .description('compile scss to css')
  .option('-i, --input [input]', 'input file path')
  .option('-o, --output [output]', 'output file path')
  .option('-m, --minify [minify]', 'is minify enabled')
  .parse(process.argv)

const {
  input,
  output,
  minify = false
}= commander.opts()


fs.readFile(path.resolve(process.cwd(), commander.args[0] || input), 'utf8', function(err, data) {
  const ast = parse(data)
  fs.writeFile(path.resolve(process.cwd(), commander.args[1] || output), generate(ast, minify), () => {
    console.log('Finished!')
  })
})
