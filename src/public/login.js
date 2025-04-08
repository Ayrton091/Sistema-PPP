const mensajeError = document.getElementsByName("error")[0]


document.getElementById("login-form").addEventListener("submit",async (e)=>{
    e.preventDefault();
    const codigo = e.target.codigo.value;
    const password = e.target.password.value;
    const res = await fetch("http://localhost:3000/api/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            codigo, password
        })
    })
    if (!res.ok) return mensajeError.classList.toggle("escondido",false);
    const resJson = await res.json();
    if (resJson.redirect){
        sessionStorage.setItem("token", resJson.token);
        window.location.href = resJson.redirect;
    }
})