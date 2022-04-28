function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        date.getFullYear(),
    ].join('.');
}

function getContent(){
    var category_index = 3 // from localStorage.getItem
    var question_index = localStorage.getItem("question_index")
    var answer_index = 2

    var vastused_array = []
    var vastusedMap = new Map()

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

        answer_date = document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/table[1]/tbody/tr/td/font/table[${answer_index}]/tbody/tr/td/table/tbody/tr[1]/td[2]/font`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue

        answer_title = document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/table[1]/tbody/tr/td/font/table[${answer_index}]/tbody/tr/td/table/tbody/tr[2]/td/font`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue




    }

    // 03.29.2021

    // var last_date = answer_date_array.pop()
    // var new_date = new Date(last_date).getMonth() + 1 + "." + new Date(last_date).getDate() + "." + new Date(last_date).getFullYear()
    // console.log(formatDate(new Date(last_date)))


    vastusedMap["question_title"] = question_title
    vastusedMap["question_date"] = question_date
    vastusedMap["answer_title"] = answer_title_array.join(' ')
    if (answer_date_array.length > 0){
        var last_date = answer_date_array.pop()
        // var new_date = new Date(last_date).getMonth() + 1 + "." + new Date(last_date).getDate() + "." + new Date(last_date).getFullYear()
        vastusedMap["answer_date"] = formatDate(new Date(last_date))
    }else{
        vastusedMap["answer_date"] = null
    }

    vastused_array.push(vastusedMap)



    chrome.runtime.sendMessage({message: "testinfolex", payload: vastused_array}, function (response){
        if (response.testinfolex){
            console.log("ok")
        }
        else{
            console.log("not ok")
        }
    })


    question_index++
    localStorage.setItem("question_index", question_index)
    window.history.go(-1)



}

function getNextPage(){
    var count_click = 0

    // var index = 7
    //
    // if(localStorage.getItem("index")){
    //     index = localStorage.getItem("index")
    // }else{
    //     localStorage.setItem("index", index)
    // }

    if(localStorage.getItem("count_click")){
        count_click = localStorage.getItem("count_click")
    }else{
        localStorage.setItem("count_click", count_click)
    }


    var next_page = document.evaluate("/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/center[1]/font",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue


    if (next_page){
        next_page.children.item(next_page.children.length -1).click()

        count_click++
        localStorage.setItem("count_click", count_click)

    }
}

function getQuestion(){

    var count_click = localStorage.getItem("count_click")

    var question_index = 50 // default 3

    if (localStorage.getItem("question_index")){
        question_index = localStorage.getItem("question_index")
    }else {
        localStorage.setItem("question_index", question_index)
    }

    if (parseInt(count_click) === 3){
        localStorage.removeItem("count_click")

        var go_back = document.evaluate("/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/font/a[1]",
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

        if (go_back){
            go_back.click()
        }
    }


    setTimeout(function (){
        var question_name = document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/form/table/tbody/tr/td/table/tbody/tr[${question_index}]/td[2]/font/a`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

        if (question_name){
            var question_amount = document.querySelectorAll('tr[align=center]').length // default 52
            localStorage.setItem("question_amount", question_amount)
            question_name.click()
        }

        if (parseInt(localStorage.getItem("question_index")) > parseInt(localStorage.getItem("question_amount")) + 1){
            getNextPage()
            localStorage.removeItem("question_index")
        }
        else {
            getContent()
        }


    }, 3000)


}


function getCategory(){

    var category_index = 3
    var sub_category_index = 1

    if (localStorage.getItem("category_index")){
        category_index = localStorage.getItem("category_index")
    }else {
        localStorage.setItem("category_index", category_index)
    }

    if (localStorage.getItem("sub_category_index")){
        sub_category_index = localStorage.getItem("sub_category_index")
    }else {
        localStorage.setItem("sub_category_index", sub_category_index)
    }



    var category_name =
        document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/table[${sub_category_index}]/tbody/tr/td/table/tbody/tr[${category_index}]/td[2]/font/a`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

    if (category_name){
        category_name.click()

        category_index++
        localStorage.setItem("category_index", category_index)

        var category_amount = document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/table[${sub_category_index}]/tbody/tr/td/table/tbody`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.childElementCount
        localStorage.setItem("category_amount", (parseInt(category_amount)).toString())
    }

    if (parseInt(localStorage.getItem("category_index")) > parseInt(localStorage.getItem("category_amount"))){
        sub_category_index++
        localStorage.setItem("sub_category_index", sub_category_index)
        localStorage.removeItem("category_index")
    }

    getQuestion()



}

function main(){
    // if (window.location.toString().includes("https://www.infolex.lt/")){
    //     console.log("https://www.infolex.lt/")
    // }

    getCategory()


}
main()