
function getContent(){
    var category_index = 3 // from localStorage.getItem
    var question_index = localStorage.getItem("question_index")
    var answer_index = 2

    var answer_title_array = []
    var answer_date_array = []

    var question_title = document.evaluate("/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/table[1]/tbody/tr/td/font/table[1]/tbody/tr/td/table/tbody/tr[2]/td/font",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue.textContent.replace(/\s+/g, ' ').trim()

    var question_date = document.evaluate("/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/table[1]/tbody/tr/td/font/table[1]/tbody/tr/td/table/tbody/tr[1]/td[2]/font",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue.textContent.replace(/\s+/g, ' ').trim()


    var answer_title = document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/table[1]/tbody/tr/td/font/table[${answer_index}]/tbody/tr/td/table/tbody/tr[2]/td/font`,
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue

    var answer_date = document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/table[1]/tbody/tr/td/font/table[${answer_index}]/tbody/tr/td/table/tbody/tr[1]/td[2]/font`,
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue

    while (answer_title){
        answer_title_array.push(answer_title.textContent.replace(/\s+/g, ' ').trim())
        answer_date_array.push(answer_date.textContent.replace(/\s+/g, ' ').trim())

        answer_index++

        answer_title = document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/table[1]/tbody/tr/td/font/table[${answer_index}]/tbody/tr/td/table/tbody/tr[2]/td/font`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue

        answer_date = document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/table[1]/tbody/tr/td/font/table[${answer_index}]/tbody/tr/td/table/tbody/tr[1]/td[2]/font`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue

    }

    console.log(question_title)
    console.log(question_date)
    console.log("Answer title: " + answer_title_array.join(' '))
    console.log(answer_date_array.pop())

    var index = 1
    setTimeout(function (){

        index++
        console.log(index)
    if (index <= 5){
        question_index++
        localStorage.setItem("question_index", question_index)
        window.history.go(-1)
    }

    }, 5000)



}
function getNextPage(){

    var index = 7

    if(localStorage.getItem("index")){
        index = localStorage.getItem("index")
    }else{
        localStorage.setItem("index", index)
    }


    var next_page = document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/center[1]/font/a[${index}]`,
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue


    if (next_page){
        next_page.click()
        if (index >= 8){
            index = 8
            localStorage.setItem("index", index)
        }
        else{
            index++
            localStorage.setItem("index", index)
        }


    }
}



function getCategory(){
    var question_amount = document.querySelectorAll('tr[align]').length // default 52
    console.log(question_amount)

    var category_index = 3

    var question_index = 50 // default 3

    if (localStorage.getItem("question_index")){
        question_index = localStorage.getItem("question_index")
    }else {
        localStorage.setItem("question_index", question_index)
    }


    var category_name =
        document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/table[1]/tbody/tr/td/table/tbody/tr[${category_index}]/td[2]/font/a`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

    if (category_name){
        category_name.click()
    }

    // getNextPage()
    var index = 3;
    setTimeout(function (){
        var question_name = document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/form/table/tbody/tr/td/table/tbody/tr[${question_index}]/td[2]/font/a`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

        if (question_name){
            question_name.click()
        }
        if (question_amount < parseInt(localStorage.getItem("question_index"))){
            getNextPage()
            localStorage.removeItem("question_index")
        }

        index++
        if (index <= question_index){
            getCategory()
        }

    }, 2000)



}

function main(){
    // if (window.location.toString().includes("https://www.infolex.lt/")){
    //     console.log("https://www.infolex.lt/")
    // }
    getCategory()
    getContent()
}
main()