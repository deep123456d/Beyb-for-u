const openBtn = document.getElementById("openBtn");
const envelope = document.getElementById("envelope");

openBtn.addEventListener("click", () => {

    envelope.classList.add("open");

    setTimeout(() => {
        document.querySelector(".letter").innerHTML = `

        <h1>Hey You ❤️</h1>

        <p>
        I made something special for you...
        </p>

        `;

    },800);

});
