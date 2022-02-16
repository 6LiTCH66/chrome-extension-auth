function getContent(){
    var index = 3
    var question_title_array = []
    var node = document.querySelectorAll('[title="Ava küsimus"]');

    while (index <= node.length + 2){
        var question_title = document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[${index}]/div[1]/div/div/div/div/div/div/div/div/div[1]/h2/span[1]/a`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        question_title_array.push(question_title.textContent)
        index++
    }

    for (var i = 0; i < question_title_array.length; i++){
        console.log(question_title_array[i])
    }
}


function getCategory(){
    var index = 11
    if(localStorage.getItem("category_index")){
        index = localStorage.getItem("category_index")
    }else{
        localStorage.setItem("category_index", index)
        localStorage.setItem("nextCategory", true.toString())
    }
    // /html/body/div[2]/div[1]/div[2]/div[1]/div[2]/div[1]/div/div/div/div/div/div/div/ul/li[2]/ul/li[${index}]/a
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
        until = 3
    }

    console.log(number_of_page)


    setTimeout(function() {
        var page = document.evaluate(`html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[2]/a[${index}]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

        if (page === null){
            category_index++
            localStorage.setItem("category_index", category_index)
            localStorage.setItem("nextCategory", true.toString())
            getCategory()
            localStorage.removeItem("index")
        }
        else {
            page.click()
        }

        if(index === 1){
            index++
        }
        index++

        if (index <= until) {
            localStorage.setItem("index", index)

            getNextPage();
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



