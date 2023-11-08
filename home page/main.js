let postContent = '';
let content = document.querySelector('.content');
let tagsContent = '';
let currentPage = 1;
let lastPage = 1;

window.addEventListener("scroll", ()=>{
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    if (endOfPage && currentPage < lastPage) {
        currentPage = currentPage + 1;
        getPosts(currentPage);
    }
});
function getPosts(page = 1){
    toggeleLoader(true);
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=10&page=${page}`)
        .then((result) => {
            let imgURl;
            let posts = result.data.data;
            lastPage = result.data.meta.last_page;
            let showEditeBtn = '';
            let idOfCurrentUser = JSON.parse(localStorage.getItem('user'))
            posts.forEach(post => {
                imgURl = '';
                if(idOfCurrentUser != null && post.author.id == idOfCurrentUser.id){
                    showEditeBtn = `
                    <div class="more">
                        <i class="fa-solid fa-trash-can" onclick="confirmeDelete(${post.id})"></i>
                        <i class="fa-solid fa-pen-to-square" onclick="showEdite(${post.id})" id='editeIcon'></i>
                    </div>             
                    `;
                }else{
                    showEditeBtn = '';
                }

                if(post.author.profile_image.length != undefined){
                    imgURl = post.author.profile_image;
                }

                let tags = post.tags;
                tagsContent = '';
                tags.forEach((tag)=>{
                    tagsContent += 
                    `
                    <div class="tag">
                    <p>${tag}</p>
                    </div>   
                    `
                })
                postContent += 
                `
                <!-- post -->
                <div class="post-box">
                    <div class="user-info">
                        <div class="box-i" style="display:flex; align-items:center; gap:1rem;" >
                            <img src="${imgURl}">
                            <p onclick="showProfile(${post.author.id})">${post.author["username"]}</p>
                        </div>
                        ${showEditeBtn}
                    </div>
                    <div class="post-info" style="width: 100%;">
                        <div class="content-box" style="width: 100%;">
                            <img src="${post["image"]}">
                        </div>
                        <div class="time" style="width: 100%; margin: 10px 0;">
                            <span>${post.created_at}</span>
                        </div>
                        <div class="post-text" style="width: 100%;">
                            <p>${post["body"]}</p>
                        </div>
                        <div class="comment">
                            <p onclick="showComment(${post.id})" ><i class="fa-regular fa-comment"></i> comments</p>
                            <div class="tags">
                                ${tagsContent}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /post/ -->
                `
            });
            if(content != null){
                content.innerHTML = postContent;
            }
        }).catch((err) => {
            console.log(err);
        })
        .finally(()=>{
            toggeleLoader(false);
        })
}
getPosts();
changingUI()
function changingUI(){
    const token = localStorage.getItem("token");
    let loginBtns = document.querySelectorAll('.login-btn');
    let registerBtns = document.querySelectorAll('.register-btn');
    let logoutBtns = document.querySelectorAll('.logout-btn');
    let homeLinks = document.querySelectorAll('.homeLink');
    let profileLinks = document.querySelectorAll('.profileLink');
    let newPost = document.querySelector('.newPost');
    let content = document.querySelector('.content');
    
    if(token != null){
        loginBtns.forEach((loginBtn)=>{ loginBtn.style.display = 'none'; })
        registerBtns.forEach((registerBtn)=>{ registerBtn.style.display = 'none'; })
        logoutBtns.forEach((logoutBtn)=>{ logoutBtn.style.display = 'block'; })
        homeLinks.forEach((homeLink)=>{ homeLink.addEventListener('click' , () => {
                window.location = 'home.html' 
            })
        });
        let userPhoto = JSON.parse(localStorage.getItem('user')).profile_image;
        if(newPost != null){
            newPost.innerHTML = 
            `
            <div class="imgU-body">
                <img src="${userPhoto}" id="user-img">
                <input type="text" placeholder="what's on your mind ?" id="body">
            </div>
            <div class="post-Img">
                <div class="input">
                    <label for="new-post-img" id="new-post-label">
                        <i class="fa-solid fa-camera" id="icon"></i>
                    </label>
                    <input type="file" id="new-post-img">
                </div>
                <div id="err" style="color: red;"></div>
                <div class="btn">
                    <button onclick="createPost()">share new post</button>
                </div>
            </div>
            `;
        }
        profileLinks.forEach((profileLink)=>{
            profileLink.addEventListener('click',()=>{
                let currentUser = JSON.parse(localStorage.getItem('user')).id;
                window.location = `../profile/profile.html?i=${currentUser}`;
            })
        })
    }else{
        homeLinks.forEach((homeLink)=>{ homeLink.addEventListener('click' , () => { window.location = 'home.html' }) });
        profileLinks.forEach((profileLink)=>{ profileLink.addEventListener('click' , () => { window.location = '../login page/login.html' }) });
        loginBtns.forEach((loginBtn)=>{ loginBtn.style.display = ''; });
        registerBtns.forEach((registerBtn)=>{ registerBtn.style.display = ''; });
        logoutBtns.forEach((logoutBtn)=>{ logoutBtn.style.display = 'none'; })
        if(newPost != null){
            newPost.innerHTML = '';
        }
        newPost.style.display = 'none';
        editeIcon.style.display = 'none';
        content.style.marginTop = '5rem';
    }
}
function logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    changingUI();
    location.reload();
}
function goLogin(){
    window.location = '../login page/login.html';
}
function goRegister(){
    window.location = '../rigester page/register.html';
}
function toggeleLoader(show = true){
    if(show){
        document.querySelector('.loader').style.visibility = 'visible';
    }else{
        document.querySelector('.loader').style.visibility = 'hidden';
    }
}