let sideMenu = document.querySelector('.side-menu');
let links = document.querySelector('.links');
let menu = document.querySelector('.menu');


navbar();
window.addEventListener('resize' , navbar);

function navbar(){
    if(window.innerWidth < 600){
        menu.classList.remove('haden');
        links.classList.add('haden');
    }else{
        menu.classList.add('haden');
        links.classList.remove('haden');
    }
}
function showMenu(){
    sideMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function hadeMenu(){
    sideMenu.classList.remove('active');
    document.body.style.overflow = '';
}
function closeComment(){
    document.body.style.overflow = '';
    let commentBox = document.getElementById('p-comment');
    commentBox.style.display = 'none'
    commentBox.style.display = 'none'
    commentBox.innerHTML = '';
}
function closeEdite(){
    document.body.style.overflow = '';
    pEditeContainer.style.display = 'none';
}
function confirmeDelete(postId){
    let confirmation = window.confirm('are you sure you want to delete this post')
    if(confirmation){
        deletePost(postId);
    }
}
function showProfile(id){
    window.location = `../profile/profile.html?i=${id}`;
}