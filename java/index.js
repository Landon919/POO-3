const supabaseUrl = 'https://xbyfvborkprxklsjcprv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhieWZ2Ym9ya3ByeGtsc2pjcHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTExMjcsImV4cCI6MjA5MDA2NzEyN30.BCYPFyn1Km8rM6iB7T2idVVlu1UENe6PPPc6JDIw4Kk'

const db = window.supabase.createClient(supabaseUrl, supabaseKey)

console.log("JS login cargado")

const form = document.getElementById("loginForm")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    console.log("Intentando iniciar sesión:", email)

    const { data, error } = await db.auth.signInWithPassword({
        email: email,
        password: password
    })

    console.log(data, error)

    if (error) {
        alert("Error: " + error.message)
        return
    }

    alert("Inicio de sesión exitoso")

    window.location.href = "dashboard.html"
})
