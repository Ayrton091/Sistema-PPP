document.getElementById('CerrarSesion').addEventListener('click', () => {
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure';
    window.location.href = "/";  
});
