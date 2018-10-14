var express = require('express');
var path = require('path');
var app = express();
var passport1 = require('./../app');
var passport = require('passport');




 var likeAdd=function(pid){
    
        console.log("hereee");
        var userid1 = session.passport.user;
                console.log(userid1);

        connection.query("insert into like_info(likerid,postid) values ("+userid1+","+pid+")",(err,result,fields)=>{
                if(result) 
                    console.log("Followed");
                else
                    console.log("ERROR");
            }             
        );
    }
