var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');

var app = express();
app.use(bodyParser.json());

app.listen(3000, function () {
    console.log('Server listening on', 3000)
});

var GitHubApi = require("github");

var github = new GitHubApi({
    version: "3.0.0",
    debug: true,
    protocol: "https",
    host: "api.github.com",
    pathPrefix: "",
    timeout: 10000
});

// usage: http://localhost:3000/contributors?user=shulamyt&repo=break-the-code
app.get('/contributors', function (req, res) {
    var user = req.param("user");
    var repo = req.param("repo");

    var page = 1; //TODO: foreach page..
    getContributors(user, repo, page);

});


var canBeMore = function(res, per_page){
    return false;
};

var getUserDetails = function(username){
    //github.authenticate({
    //    type: "basic",
    //    username: username//,
    //    //password: "mysecretpass"
    //});
    //
    //github.user.get({
    //    //user: username
    //}, function(err, res){
    //    console.log(JSON.stringify(err));
    //    console.log(JSON.stringify(res));
    //});

};

var handleContributors = function(contributors){
    for(i in contributors){
        var contributor = contributors[i];
        var username = contributor.login;
        getUserDetails(username);
        console.log(JSON.stringify(contributor));
    }
};

var getContributors = function(user, repo, page){
    var per_page = 100;
    github.repos.getContributors({
        user: user,
        repo: repo,
        per_page: per_page
    }, function(err, res){
        if(err){
            console.log(JSON.stringify(err));
        }
        handleContributors(res);

        if(canBeMore(res, per_page)){
            var page = page + 1;
            getContributors(user, repo, page);
        }
    });
};