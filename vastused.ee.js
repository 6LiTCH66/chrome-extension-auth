// function getContent(){
//
//     var index = 3
//     var question_title_array = []
//     while (index <= 12){
//         var question_title = document.evaluate(`/html/body/div[2]/div[1]/div[2]/div[2]/div[2]/div/div[${index}]/div[1]/div/div/div/div/div/div/div/div/div[1]/h2/span[1]/a`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
//         question_title_array.push(question_title.textContent)
//         index++
//     }
//     for (var i = 0; i < question_title_array.length; i++){
//         console.log(question_title_array[i])
//     }
// }
//
// function main(){
//     var category_name = document.evaluate("/html/body/div[2]/div[1]/div[2]/div[1]/div[2]/div[1]/div/div/div/div/div/div/div/ul/li[2]/a", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
//     category_name.click()
//
//     window.addEventListener("DOMContentLoaded", function(event) {
//         console.log("All resources finished loading!");
//     });
//
//     //getContent()
//
// }
// main()
//
//
//
