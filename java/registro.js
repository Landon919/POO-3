console.log("JS registro cargado")

const form = document.getElementById("registroForm")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { data, error } = await window.db.auth.signUp({
        email,
        password
    })

    if (error) {
        alert("Error: " + error.message)
        return
    }

    alert("Registro exitoso, revisa tu correo")
    window.location.href = "index.html"
})