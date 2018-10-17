

var like =function(pid){
    fetch('/like',{
        method:post,
        body:{
            pid
        }
    }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
                console.log(JSON.stringify(myJson));
});