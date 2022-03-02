var socket = io.connect('https://employee-webserver.herokuapp.com', {
    forceNew: false,
    transports: ['websocket'],
    upgrade: false
});


function getContent(){
    var index = 3
    var category_index = localStorage.getItem("category_index") // category_index
    var sub_category_index = localStorage.getItem("sub_category_index") // sub_category_index

    var vastused_array = []

    var keys = ["name", "position", "organisation", "www"]
    var map = {}



    var node = document.querySelectorAll('[title="Ava küsimus"]');

    while (index <= node.length + 2){
        var vastusedMap = new Map()

        var user_id = localStorage.getItem("user_id")

        var category_name =
            document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[1]/div[2]/div[1]/div/div/div/div/div/div/div/ul/li[${category_index}]/a`,
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent

        var sub_category_name =
            document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[1]/div[2]/div[1]/div/div/div/div/div/div/div/ul/li[${category_index}]/ul/li[${sub_category_index}]/a`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
                .singleNodeValue.textContent.replace(/[0-9]/g, '').replace("()", "")

        var question_title =
            document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[${index}]/div[1]/div/div/div/div/div/div/div/div/div[1]/h2/span[1]/a`,
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent

        var question_description =
            document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[${index}]/div[1]/div/div/div/div/div/div/div/div/div[1]/div`,
                document, null , XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.replace(/\s+/g, " ")

        var question_date =
            document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[${index}]/div[1]/div/div/div/div/div/div/div/div/div[1]/h2/span[2]`,
                document, null , XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent

        var answer_title =
            document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[${index}]/div[1]/div/div/div/div/div/div/div/div/div[2]/h2/span`,
                document, null , XPathResult.FIRST_ORDERED_NODE_TYPE, null)
                .singleNodeValue.textContent.replace("Vastus:", "").split(",")

        var answer_description =
            document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[${index}]/div[1]/div/div/div/div/div/div/div/div/div[2]/div[1]`,
            document, null , XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.textContent.replace(/\s+/g, " ")
            .replace("loe lisaks Nõuandja tutvustus Nõuandja kõik vastused Esita küsimus", "")


        question_date = question_date.split(".")
        question_date = question_date[1] +"."+ question_date[0]+ "."+ question_date[2]

        for (var y = 0; y < 4; y++){
            map[ keys[y] ] = answer_title[y];
        }

        vastusedMap["user_id"] = user_id
        vastusedMap["category_name"] = category_name
        vastusedMap["sub_category_name"] = sub_category_name
        vastusedMap["question_title"] = question_title
        vastusedMap["question_description"] = question_description
        vastusedMap["question_date"] = question_date
        vastusedMap["answer_title"] = map
        vastusedMap["answer_description"] = answer_description
        vastusedMap["source"] = "vastused.ee"

        vastused_array.push(vastusedMap)

        index++
    }


    for (var i = 0; i < node.length; i++){
        chrome.runtime.sendMessage({message: "vastused", payload: vastused_array[i]}, function (response){
            if (!response.vastused){
                console.log("ok")
            }
            else{
                console.log("not ok")
            }
        })

    }
}


function getCategory(){

    var sub_category_index = 1 // default 1 //sub_category_index

    var category_index = 2; // default 2 // category_index

    if(localStorage.getItem("sub_category_index")){ // sub_category_index
        sub_category_index = localStorage.getItem("sub_category_index") // sub_category_index
    }else{
        localStorage.setItem("sub_category_index", sub_category_index) // sub_category_index
        localStorage.setItem("nextCategory", true.toString())
    }

    if(localStorage.getItem("category_index")){  //category_index
        category_index = localStorage.getItem("category_index") // category_index
    }else{
        localStorage.setItem("category_index", category_index) // category_index
    }

    var category_name =
        document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[1]/div[2]/div[1]/div/div/div/div/div/div/div/ul/li[${category_index}]/ul/li[${sub_category_index}]/a`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

    if (category_name === null){
        category_index++
        localStorage.setItem("category_index", category_index) // category_index
        sub_category_index = 1
        localStorage.setItem("sub_category_index", sub_category_index) // sub_category_index
        getCategory()
    }

    if (localStorage.getItem("nextCategory") === "true"){
        category_name.click()
    }
    localStorage.setItem("nextCategory", false.toString())
    getNextPage()


}
var myTimeout;

function getNextPage(){
    var sub_category_index = localStorage.getItem("sub_category_index") // sub_category_index
    var index = 1

    var all_pages =
        document.evaluate("/html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[2]/font",
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

    var number_of_page = Math.ceil(all_pages.textContent.replace(/[^0-9]/g,'') / 10)


    if(localStorage.getItem("index")){
        index = localStorage.getItem("index")
    }else{
        localStorage.setItem("index", index)
    }

    var until = 6

    if (number_of_page < until){
        until = number_of_page + 1
    }
    else if( number_of_page <= 9 ){
        until = 8
    }

    myTimeout = setTimeout(function() {
        var page =
            document.evaluate(`html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[2]/a[${index}]`,
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

        if (page === null){
            sub_category_index++
            localStorage.setItem("sub_category_index", sub_category_index) // sub_category_index
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
var newWindow;

function main(){

    chrome.storage.sync.get(['user_id'], function(items) {
        localStorage.setItem("user_id", items.user_id)
    });

    getCategory()
    getContent()

}

socket.on("start-event", function (data){
    newWindow = window.open("http://www.vastused.ee/", "_blank")

})

socket.on("stop-event", function (data){
    clearTimeout(myTimeout)
    console.log(data)
})
main()



