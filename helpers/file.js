const fs = require('fs')

//  usr1 = [
//      {
//          question : string
//          answers : [answer1 : string, answer2 : string, ...] | string
//      },
//      {...},
//  ]

// bank = [string1, string2, ...]

let fileInit = () => {
    if (fs.readFileSync('./questions/bank').length != 0) return
    let emptArrJs = JSON.stringify([]);
    for (let i = 1; i <= 5; i++)
        fs.writeFileSync('./questions/usr'+ i, emptArrJs)
    fs.writeFileSync('./questions/bank', emptArrJs)
}

let readQuestions = (n) => {
    let name = './questions/usr'+ n
    let file = fs.readFileSync(name)
    let data = JSON.parse(file)
    return data
}

let readFromBank = () => JSON.parse(fs.readFileSync('./questions/bank'))

let writeQuestions = (arr, n) => {
    let name = './questions/usr'+ n
    let data = JSON.stringify(arr)
    fs.writeFileSync(name, data)
}

let writeInTheBank = (arr) => {
    let data = readFromBank()
    fs.writeFileSync(JSON.stringify(new Set(data.concat(arr))))
}

module.exports = {fileInit, readQuestions, writeQuestions, readFromBank, writeInTheBank}