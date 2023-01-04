const formulario = document.querySelector('form');

formulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let el of formulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(({msg, token}) => {
        if (msg) {
            return console.error(msg);
        }
        
        localStorage.setItem('token', token);
        window.location = '../../../index.html';
    })
    .catch(err => {
        console.log(err);
    })
});