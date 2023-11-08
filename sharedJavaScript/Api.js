let commentsContainer = document.getElementById('p-comment');
let pEditeContainer = document.getElementById('p-edite')

function createPost(){
    // let token = JSON.parse(localStorage.getItem('token'));
    let token = localStorage.getItem('token');
    let bodyInput = document.getElementById('body');
    let photoInput = document.getElementById('new-post-img');

    let formData = new FormData();
    formData.append("body", bodyInput.value); 
    formData.append("image", photoInput.files[0]); 

    axios.post('https://tarmeezacademy.com/api/v1/posts' , formData , {
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    })
    .then((response)=>{
        location.reload();
        bodyInput.innerHTML = '';
        photoInput.files[0] = null;
    })
    .catch((err)=>{
        document.getElementById('err').innerHTML = err.response.data.message; 
    })
    
}
function shareComment(id){
    // let token = JSON.parse(localStorage.getItem('token'));
    let token = localStorage.getItem('token');

    let inputComment = document.getElementById('comment-input');
    
    if(token != null){
        let params = {
            'body': `${inputComment.value}`
        }
        toggeleLoader(true);
        axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`,params ,{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        })
        .then((response)=>{
            showComment(id)
            inputComment.value = '';
        })
        .catch((err)=>{
            console.log(err);
        })
        .finally(()=>{
            toggeleLoader(false);
        })
    }else{
        inputComment.value = 'you need to register'
    }
    
}
function showComment(postId){
    document.body.style.overflow = 'hidden';
    commentsContainer.style.display = 'grid'
    toggeleLoader(true);
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${postId}`)
    .then((response)=>{
        let comments = response.data.data.comments;
        commentsContainer.innerHTML =
        `
        <div class="cl-btn" onclick="closeComment()">
            <i class="fa-solid fa-xmark" style="cursor: pointer;"></i>
        </div>
        <div class="commentContentBox">
            <div class="commentBox">
            </div>
            <div class="input-user-comment">
                <input type="text" id="comment-input" placeholder="your comment" autocomplete="off">
                <button id="Share-comment" onclick="shareComment(${postId})"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
        `
        let allComments = '';
        if(comments != 0){
            comments.forEach((comment)=>{
                allComments +=
                `
                <div class="usersComments">
                <img src="${comment.author.profile_image}" alt="" class="user-photo-cemment" style="height: 50px; width: 50px;">
                <div class="commentContent">
                <span class="user-cemment">${comment.author.username}</span>
                <p>${comment.body}</p>
                </div>
                </div>
                `
            })
            document.querySelector('.commentBox').innerHTML = allComments;
        }
        else{
            let commentBox = document.querySelector('.commentBox');
            commentBox.innerHTML = 
            `
            <h1>no comment yet</h1>
            `
            commentBox.style.display ='flex'
            commentBox.style.justifyContent = 'center'
            commentBox.style.alignItems = 'center'
        }
        
    })
    .finally(()=>{
        toggeleLoader(false);
    })
}
function editePost(id){
    let bodyInput = document.getElementById('body-edite-post');
    let photoInput = document.getElementById('img-edite');
    // let token = JSON.parse(localStorage.getItem('token'));
    let token = localStorage.getItem('token');


    let formData = new FormData();
    formData.append("body", bodyInput.value); 
    if(photoInput != null){
        formData.append("image", photoInput.files[0]); 
    }
    formData.append('_method','put');
    toggeleLoader(true);
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}` , formData , {
        headers:{
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    })
    .then((response)=>{
        location.reload();
        bodyInput.innerHTML = '';
        photoInput.files[0] = null;
        closeEdite();
    })
    .catch((err)=>{
        document.getElementById('err-edite').innerHTML = err.response.data.message; 
    })
    .finally(()=>{
        toggeleLoader(false);
    })
}
function showEdite(id){
    document.body.style.overflow = 'hidden';
    pEditeContainer.style.display = 'grid';
    toggeleLoader(true);
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((result) => {
        let body = result.data.data.body;
        pEditeContainer.innerHTML = 
        `
        <div class="cl-btn" onclick="closeEdite()">
            <i class="fa-solid fa-xmark" style="cursor: pointer;"></i>
        </div>
        <div class="Edite-Content-Box">
            <div class="body-content-box">
                <textarea type="text" placeholder="you can chage your body here" id="body-edite-post">${body}</textarea>
            </div>
            <div id="err-edite" style="color: red;"></div>
            <div class="photo-content-box">
                <label for="img-edite" >
                    <i class="fa-solid fa-camera" ></i>
                </label>
                <input type="file" id="img-edite">
            </div>
            <button onclick="editePost(${id})">save</button>
        </div>
        `
    }).catch((err) => {
        console.log(err);
    })
    .finally(()=>{
        toggeleLoader(false);
    })
}
function deletePost(id){
    // let token = JSON.parse(localStorage.getItem('token'));
    let token = localStorage.getItem('token');
    let deleteMsg = document.querySelector('.deleteConfirmeMsg')
    toggeleLoader(true);
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${id}`,{
        headers:{
            "Authorization": `Bearer ${token}`
        }
    })
    .then((response) =>{
        deleteMsg.style.transform = 'translateY(0%)';
        deleteMsg.style.opacity = '1';
        setTimeout(()=>{
            deleteMsg.style.transition = '1s'
            deleteMsg.style.transform = 'translateY(200%)';
            deleteMsg.style.opacity = '0';
        },2000);
        location.reload();
    })
    .finally(()=>{
        toggeleLoader(false);
    })
}
function toggeleLoader(show = true){
    if(show){
        document.querySelector('.loader').style.visibility = 'visible';
    }else{
        document.querySelector('.loader').style.visibility = 'hidden';
    }
}