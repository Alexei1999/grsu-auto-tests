const puppeteer = require('puppeteer');
const {fileInit, readQuestions, writeQuestions} = require('./helpers/file.js')
const {parseResults, parseQuestions, parseAnswers} = require('./helpers/site.js')
const {initQuestion, setAnswer} = require('./helpers/question.js')
const yaml = require('js-yaml')

let fileContents = fs.readFileSync(__dirname + '/tokens.yaml', 'utf8');
let data = yaml.safeLoad(fileContents);

const user = data.login;
const pass = data.password;
let log = 0;

let init = async() => {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    return [browser, page]
}

let close = async(browser) => {
    await browser.close();
}

let login = async(page) => {
    await page.goto(data.loginpage);
    try {
    await page.type('#username', user);
    await page.type('#password', pass);
    await page.click('button');
    await page.waitForNavigation();
    }
    catch(e) {
        console.log('already logged')
    }
    await page.goto(data.coursepage);
    console.log('login success')
};

let doScreenshot = async(page) => {
    await page.screenshot({path: `./log/${log++}.png`});
    console.log('screenshot success')
}

let parseUsr = async(page, n) => {
    let id = data.id,
        data = readQuestions(n)

    await page.goto(data.quizpage+(id + n));
    await doScreenshot(page)
    await page.click('button');
    await doScreenshot(page)
    console.log('goto test success')

    let nextButton = await page.$("[name='next']")
    do {
        let pageQuestions = await parseQuestions(page)
        pageQuestions.forEach(question => initQuestion(data, question))
        console.log(pageQuestions)
        
        //let pageAnswers = await parseAnswers(page)
        pageQuestions.forEach(async(question) => {
            await setAnswer(page, question, Array.isArray(question.answers) ? question.answers[0] : question.answers)
            //wrotng setting i have no idea how to work with radio input in pupeeter
        })
        await doScreenshot(page)
        await page.evaluate(element => element.click(), nextButton)
        nextButton = await page.$("[name='next']")
    } while(!nextButton)

    let endButton = await $$eval('.btn.btn-secondary[type="submit"]', buttons => buttons.map(button => button.innerText))
    await Array.from(endButton).find(button => button.includes('завершить')).click()
    await doScreenshot(page)
    await $('.btn.btn-primary.m-r-1[type="button"]').click()
    await doScreenshot(page)

    let results = parseResults()

    results.forEach(res => {
        if(!res.result) {
            if (!data[res.question])
                throw new Error(`${res.question} no in \n${data.map(s => s.question).filter(s => s.startsWith(res.question.split(' ').pop()))}\n in data?`)
            data[res.question].answers.pop()
        }
        else data[res.question].answers = data[res.question].answers[0]
    })
    
    await $('.mod_quiz-next-nav').click()
    await doScreenshot(page)
    await page.goto(data.coursepage)
    await doScreenshot(page)

    writeQuestions(data, n)
};



(async () => {
    fileInit()
    let [browser, page] = await init()
    
    await login(page)
    await parseUsr(page, 4)

    await close(browser)
})()
