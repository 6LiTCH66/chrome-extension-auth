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

    var category_name = document.evaluate("/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/font[1]/a[3]",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent


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

    vastusedMap["user_id"] = localStorage.getItem("user_id")
    vastusedMap["category_name"] = category_name
    vastusedMap["question_name"] = localStorage.getItem("question_name")
    vastusedMap["question_title"] = question_title
    vastusedMap["question_date"] = formatDate(new Date(question_date))
    vastusedMap["answer_title"] = answer_title_array.join(' ')
    if (answer_date_array.length > 0){
        var last_date = answer_date_array.pop()
        vastusedMap["answer_date"] = formatDate(new Date(last_date))
    }else{
        vastusedMap["answer_date"] = null
    }


    chrome.runtime.sendMessage({message: "infolex", payload: vastusedMap}, function (response){
        if (!response.infolex){
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

    var next_page = document.evaluate("/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/center[1]/font",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue


    if (next_page){
        if (next_page.children.item(next_page.children.length -1).outerHTML.includes("<b>")){
            var go_back = document.evaluate("/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/font/a[1]",
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

            if (go_back){
                go_back.click()
            }
        }
        else {
            next_page.children.item(next_page.children.length -1).click()
        }
    }
}

function getQuestion(){

    var question_index = 3 // default 3

    if (localStorage.getItem("question_index")){
        question_index = localStorage.getItem("question_index")
    }else {
        localStorage.setItem("question_index", question_index)
    }


    setTimeout(function (){
        var question_name = document.evaluate(`/html/body/table/tbody/tr[2]/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table/tbody/tr/td/be/form/table/tbody/tr/td/table/tbody/tr[${question_index}]/td[2]/font/a`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

        if (question_name){
            localStorage.setItem("question_name", question_name.textContent)
            var question_amount = document.querySelectorAll('tr[align=center]').length // default 52
            localStorage.setItem("question_amount", question_amount)
            question_name.click()
        }

        if (parseInt(localStorage.getItem("question_index")) > parseInt(localStorage.getItem("question_amount")) + 1){
            getNextPage()
            localStorage.removeItem("question_index")
            console.log("getNextPage is called")
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
    chrome.storage.sync.get(['user_id'], function(items) {
        localStorage.setItem("user_id", items.user_id)
    });
    getCategory()


}
main()