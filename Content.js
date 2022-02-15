function getContent(){
    var index = 3
    var question_title_array = []
    while (index <= 12){
        var question_title = document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[${index}]/div[1]/div/div/div/div/div/div/div/div/div[1]/h2/span[1]/a`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        question_title_array.push(question_title.textContent)
        index++
    }
    for (var i = 0; i < question_title_array.length; i++){
        console.log(question_title_array[i])
    }
}


function getCategory(){
    var index = 1
    if(localStorage.getItem("category_index")){
        index = localStorage.getItem("category_index")
    }else{
        localStorage.setItem("category_index", index)
        localStorage.setItem("nextCategory", true.toString())
    }

    var category_name = document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[1]/div[2]/div[1]/div/div/div/div/div/div/div/ul/li[2]/ul/li[${index}]/a`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    if (localStorage.getItem("nextCategory") === "true"){
        category_name.click()
    }
    localStorage.setItem("nextCategory", false.toString())
    getNextPage()


}
function getNextPage(){
    var category_index = localStorage.getItem("category_index")
    var index = 1
    var all_pages = document.evaluate("/html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[2]/font", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    var number_of_page = Math.round(all_pages.textContent.replace(/[^0-9]/g,'') / 10)

    if(localStorage.getItem("index")){
        index = localStorage.getItem("index")
    }else{
        localStorage.setItem("index", index)
    }
    var until = 6

    if (number_of_page < until){
        until = 4
    }

    console.log(number_of_page)

    setTimeout(function() {
        var page = document.evaluate(`html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[2]/a[${index}]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

        if (parseInt(page.textContent) <= number_of_page){
            page.click()
        }

        if(parseInt(page.textContent) === number_of_page){
            category_index++
            localStorage.setItem("category_index", category_index)
            localStorage.setItem("nextCategory", true.toString())
            getCategory()
        }


        if(index === 1){
            index++
        }
        index++

        if (index <= 6) {
            localStorage.setItem("index", index)

            getNextPage(index);
        }
        else if(parseInt(page.textContent) === number_of_page){
            localStorage.removeItem("index")
        }



    }, 5000)
}

function main(){

    getCategory()
    //getNextPage();
    //
    getContent()




}
main()



