let userBox = document.querySelector('.user-profile-content');
let userContent = '';
let userPostContent = '';
let container = document.querySelector('.user-post')
let editeOption = '';
let userEditeBox = document.querySelector('.user-info-edite');

showUserInfo()
changingUIProfile()

function showUserInfo(){
    const url = new URLSearchParams(window.location.search);
    let id = url.get('i');
    let userIdS = JSON.parse(localStorage.getItem('user')).id;
    toggeleLoader(true)
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then((response)=>{
        if(userIdS == id){
            editeOption = `<i class="fa-solid fa-pen" onclick="showEditeUserInfoBox()"></i>`
        }else{
            editeOption = '';
        }
        let userInfo = response.data.data;
        userContent = 
        `
        <div class="cover"></div>
        <div class="user-box-profile">
            <div class="user-presonal-info">
                <div class="user-img">
                    <img src="${userInfo.profile_image}" >
                </div>
                <div class="user-name">
                    <h2 id="user-h-name">name: <span id="user-span-name">${userInfo.name}</span>${editeOption}</h2>
                    <h2 id="user-h-username">user name: <span id="user-span-username">${userInfo.username}</span></h2>
                </div>
            </div>
            <hr>
            <div class="user-more-info">
                <div class="user-posts-info">
                    <h2 id="posts-nb"><span id="user-span-post-nb">${userInfo.posts_count}</span>post(s)</h2>
                    <h2 id="comments-nb"><span id="user-span-comment-nb">${userInfo.comments_count}</span>comments(s)</h2>
                </div>
            </div>
        </div>
        `;
        userBox.innerHTML = userContent;
    })
    .catch((err)=>{
        console.log(err);
    })
    .finally(()=>{
        toggeleLoader(false);
    })
    getUserPosts(id);
}
function getUserPosts(userId){
    toggeleLoader(true)
    let userIdS = JSON.parse(localStorage.getItem('user')).id;
        axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`)
        .then((result) => {
            let posts = result.data.data;
            let showEditeBtn = '';
            posts.forEach(post => {
                if(userId == post.author.id){
                    if(userIdS != null && post.author.id == userIdS){
                        showEditeBtn = 
                        `
                        <div class="more">
                            <i class="fa-solid fa-trash-can" onclick="confirmeDelete(${post.id})"></i>
                            <i class="fa-solid fa-pen-to-square" onclick="showEdite(${post.id})" id='editeIcon'></i>
                        </div>             
                        `;
                    }else{
                        showEditeBtn = '';
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
                    userPostContent += 
                    `
                    <!-- post -->
                    <div class="post-box">
                        <div class="user-info">
                            <div class="box-i" style="display:flex; align-items:center; gap:1rem;" >
                                <img src="${post.author.profile_image}">
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
                                <p onclick="showComment(${post.id})"><i class="fa-regular fa-comment"></i> comments</p>
                                <div class="tags">
                                    ${tagsContent}
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- /post/ -->
                    `
                }
            });
            if(container != null){
                container.innerHTML = userPostContent;
            }
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(()=>{
            toggeleLoader(false);
        })
}
function changingUIProfile(){
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
                window.location = '../home page/home.html';
            })
        });
        profileLinks.forEach((profileLink)=>{
            profileLink.addEventListener('click',()=>{
                let currentUser = JSON.parse(localStorage.getItem('user')).id;
                window.location = `../profile/profile.html?i=${id}`;
            })
        })
    }else{
        window.location = '../home page/home.html'
    }
}
function logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    changingUIProfile();
    getPosts();
}
function showEditeUserInfoBox(){
    userEditeBox.style.display = 'grid';
    document.body.style.overflow = 'hidden';
}
function closeEditeUserInfoBox(){
    userEditeBox.style.display = 'none';
    document.body.style.overflow = '';
}
function EditeUserInfo(){
    let newPss = document.getElementById("password-input-edite");
    let newUserName = document.getElementById("username-input-edite");
    // let token = JSON.parse(localStorage.getItem('token'));
    let token = localStorage.getItem('token');

    console.log(newUserName.value , newPss.value);

    let params = {
        "username": `${newUserName.value}`,
        "password" : `${newPss.value}`
    }

    toggeleLoader(true);
    axios.put('https://tarmeezacademy.com/api/v1/updatePorfile' , params , {
        headers : {
            "Authorization": `Bearer ${token}`
        }
    })
    .then((response)=>{
        console.log(response);
    })
    .catch((err)=>{
        document.querySelector('.EditeError').innerHTML = err.response.data.message;
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