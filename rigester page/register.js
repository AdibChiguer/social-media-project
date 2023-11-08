let photoBox = document.querySelector('.userPhoto');
let img = document.getElementById('img'); // is an input of type file


img.onchange = function(){

    let file = new FileReader();
    file.readAsDataURL(img.files[0]);
    file.onload = function(){
        photoBox.innerHTML = 
        `
            <label for="img" class="userPhoto"><img src="${file.result}"></label>
        `
    }
}

function registerNewUser(){
    let name = document.getElementById('name').value
    let userName = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let userImg = img.files[0];
    
    let formData = new FormData();

    formData.append("name",name);
    formData.append("username",userName);
    formData.append("password",password);
    formData.append("image",userImg);

    axios.post('https://tarmeezacademy.com/api/v1/register', formData , {
        headers:{
            'Content-Type': 'multipart/form-data',
        }
    })
    .then((response) =>{
        let token = response.data.token;
        let user = response.data.user;

        localStorage.setItem('user',JSON.stringify(user));
        localStorage.setItem('token',token);
        window.location = '../home page/home.html';
    })
    .catch((err)=>{
        let errorMsg = err.response.data.message;
        document.getElementById('err').innerHTML = errorMsg;
    })
}