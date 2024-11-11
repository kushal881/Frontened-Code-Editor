let htmlInput=document.querySelector(".html-editor textarea")
let cssInput=document.querySelector(".css-editor textarea")
let jsInput=document.querySelector(".js-editor textarea")
let save=document.querySelector("#save")
let output=document.querySelector("#output")
let outputContainer=document.querySelector(".output-container")
let full=document.querySelector("#full")
let copy=document.querySelectorAll(".copy")


save.addEventListener("click",()=>{
    output.contentDocument.body.innerHTML=htmlInput.value
    output.contentDocument.head.innerHTML=`<style>${cssInput.value}</style>`
    output.contentWindow.eval(jsInput.value)
})

full.addEventListener("click",()=>{
    outputContainer.classList.toggle("output-full-active")
    if(outputContainer.classList.contains("output-full-active")){
        full.style.transform="rotate(180deg)"
    }else{
        full.style.transform="rotate(0deg)"
    }
})

copy.forEach((e) => {
    e.addEventListener("click",()=>{
    if(e.classList.contains("copy1")){
        navigator.clipboard.writeText(htmlInput.value)
    }
    else if(e.classList.contains("copy2")){
        navigator.clipboard.writeText(cssInput.value)
    }
    else{
        navigator.clipboard.writeText(jsInput.value)
    }
})
});