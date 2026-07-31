const envelope = document.getElementById("envelope");
const button = document.getElementById("openBtn");

button.addEventListener("click", function(e){

    e.stopPropagation();

    envelope.classList.toggle("open");

    if(button.innerText==="Open My Surprise 💌"){

        button.innerText="Close Envelope 💜";

    }else{

        button.innerText="Open My Surprise 💌";

    }

});
