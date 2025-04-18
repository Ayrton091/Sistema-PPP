// Init the form
    const mensajeError = document.getElementsByClassName("error")[0];


    document.getElementById("register-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log(e.target.children.codigo.value);  
            const res = await fetch("http://localhost:3000/api/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    codigo: e.target.children.codigo.value,
                    password: e.target.children.password.value,
                }),
            });
        if (!res.ok) return mensajeError.classList.toggle("escondido", false);
        const resJson = await res.json();
        if (resJson.redirect) {
            window.location.href = resJson.redirect;
        }
    });

