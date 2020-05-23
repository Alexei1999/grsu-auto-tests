const {readFromBank, writeInTheBank} = require('./file.js')

let initQuestion = (data, qst) => {
    if (!(qst.text in data))
        data[qst.text] = qst.answers
    else{
        compareAnswers(data,qst)
        qst.answers = data[qst.text].answers
    }
}

let setAnswer = async(page, question, text) => {
    let rawAnswers = await page.evaluate(element => element.querySelectorAll('.r0,.r1 label'), question)
    
    answers.find(ans => ans.text.includes(text))
    if (!answer) return false
    console.log(`click on the ${answer.text} button`)
    await page.evaluate(element => element.querySelector('input[type="radio"]').click(), answer.button)
    return true
}

let compareAnswers = (data, qst)=>{
    let all = readFromBank()
    for (let answ in qst.answers)
        if (!answ in all[qst.text]){
            data[qst.text].push(answ)
            all[qst.text].push(answ)
        }
    writeInTheBank(all)
}

module.exports = {initQuestion, setAnswer}