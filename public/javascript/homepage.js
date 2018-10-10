var profile = document.getElementById('#profile');

profile.addEventListener('click',()=>{
    
    fetch('/profile',{
        method:'GET'
    }).then((res)=>{
        window.location=res.url;
        console.log(res,'before');
            alert('fine')
    })
    
});