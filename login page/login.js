function checkUser(){
    let user = document.getElementById('username');
    let password = document.getElementById('password');

    let params = {
        "username" : user.value,
        "password" : password.value
    }

    axios.post('https://tarmeezacademy.com/api/v1/login' , params)
    .then((response)=>{
        let token = response.data.token;
        let user = response.data.user;
        localStorage.setItem("token" , JSON.stringify(token))
        localStorage.setItem("user" , JSON.stringify(user))
        window.location.href = `../home page/home.html`;
    
    })
    .catch((err) =>{
        let error = err.response.data.message;
        document.getElementById('err').innerHTML = error;
    })
}