const openBtn = document.getElementById("openBtn");
const envelope = document.getElementById("envelope");
const letter = document.querySelector(".letter");

openBtn.addEventListener("click", () => {

    openBtn.style.opacity = "0";
    openBtn.style.pointerEvents = "none";

    envelope.classList.add("opening");

    setTimeout(() => {

        letter.innerHTML = `
            <h1>Hey You ❤️</h1>
            <p>
            I made this little world just for you...
            </p>
        `;

        envelope.classList.add("opened");

    }, 1200);

});
