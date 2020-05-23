const fs = require('fs')

let parseQuestions = async(page) => {
    let questions = await page.$$eval('.formulation.clearfix', questions => questions.map(question => question.innerText))

    return Array.from(questions).map(s => {
        let text = s.split('\n'); 
        return { 
            text : text[1],
            answers : text.splice(3).map(q => q.slice(3))
        }
    })
}

let parseAnswers = async(page) => {
    let answers = Array.from(await page.$$('.r0,.r1 label'))
    let ret = []

    for (let i = 0; i < answers.length; i++){
        let text = await page.evaluate(element => element.innerText, answers[i])
        ret.push({"text" : text, "button" : answers[i]})
    }

    return ret
}

let parseResults = async(page) => {
    console.log('goto parseResults')
    let results = await page.$$('.que.multichoice.deferredfeedback.complete')
    let ret = []

    for (let i = 0; i < results.length; i++){
        let question = await page.evaluate(element => element.querySelector('.qtext').innerText, results[i])
        let res = await page.evaluate(element => element.querySelector('.grade').innerText, results[i])
        ret.push({
            "question" : question, 
            "button" : Boolean(+res.match(/\d,\d\d из \d,\d\d/).toString()[0])
        })
    }
    return ret
}

module.exports = {parseQuestions, parseAnswers, parseResults}