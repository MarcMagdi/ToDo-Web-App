var express = require('express');
var app = express();
//app.use(require('connect').bodyParser());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var fs = require("fs");
var path = require("path");
var session = require('express-session');

//var cookieSession = require('cookie-session');
//app.use(cookieSession())
app.use(session({ secret: 'We are the best', cookie: { maxAge: 60000000
}
}))

app.use(express.static(path.join(__dirname, 'public')));

app.post('/addUser', function (req, res) {

    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        var newId = 1;
        var keys = Object.keys(data);
        if (keys.length != 0) {
            var last = keys[keys.length - 1].substring(4);
            newId = parseInt(last) + 1;
        }
        //console.log(newId);

        var username = req.body.reg_username;
        var givenMail = req.body.reg_email;
        var pass = req.body.reg_password;

        var exist = false;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var val = data[key];
                if (val.email == givenMail) {
                    exist = true;
                    break;
                }
            }
        }

        if (exist == true) {
            console.log("exist");
            res.end("0");
        } else {
            console.log("Don't exist");
            var newUser = "user" + newId;
            var user = {
                "newUser": {
                        "name": username,
                        "password": pass,
                        "email": givenMail,
                        "id": newId
                }
            }

            data[newUser] = user["newUser"];
            fs.writeFile('users.json', JSON.stringify(data), function (err) {
                if (err) throw err;
                console.log('It\'s saved!\n');
            });
            res.end("1");
        }
    });
})

app.post('/loginUser', function (req, res) {
    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse(data);

        var givenEmail = req.body.login_email;
        var givenPassword = req.body.login_password;
        // console.log(givenEmail);
        // 0 user found & correct,
        // 1 user found and password incorrect
        // 2 user not found
        var found = 2;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var val = data[key];
                if (val.email == givenEmail) {
                    found = 1;
                    if (val.password == givenPassword) {
                        found = 0;
                        req.session.userName = val.name;
                    }
                    break;
                }
            }
        }

        switch (found) {
            case 0:
                req.session.userEmail = givenEmail;
                // res.sendFile(__dirname + "/" + "index.html");
                //if (req.session.userEmail) {
                //    console.log("Session Must Be Here!!!!!");
                //}
                req.session.save(function (err) {
                    res.end("0");
                    // session saved
                })
                break;
            case 1:
                res.end("1");
                console.log("user found & password incorrect");
                break;
            case 2:
                res.end("2");
                console.log("user not found");
                break;
            default:
        }
        /* res.end(JSON.stringify(data));*/
    });
})

app.get('/', function (req, res) {
    //console.log(req.session.userEmail);
    if (req.session.userEmail) {
        res.sendFile(__dirname + "/" + "index.html");
        //console.log(req.session.userName);
    } else {
        res.sendFile(__dirname + "/login.html");
    }
})

app.get('/index.html', function (req, res) {
    if (req.session.userEmail) {
        res.sendFile(__dirname + "/" + "index.html");
    } else {
        res.sendFile(__dirname + "/login.html");
    }
})

app.get('/userName', function (req, res) {
    res.end(req.session.userName);
})

app.get('/login.html', function (req, res) {
    if (req.session.userEmail) {
        res.sendFile(__dirname + "/" + "index.html");
    } else {
        res.sendFile(__dirname + "/login.html");
    }
})

app.get('/ErrorPage.html', function (req, res) {
    res.sendFile(__dirname + "/ErrorPage.html");
})

app.get('/addTask', function (req, res) {
    var tableName = JSON.stringify(req.query.table);
    //console.log(tableName.substring(1,tableName.length-1));
    //var userEmail = 'user';
    var userEmail = req.session.userEmail;

    // First read existing users.
    fs.readFile(__dirname + "/" + tableName.substring(1, tableName.length-1) + ".json", 'utf8', function (err, data) {
        data = JSON.parse(data);

        var taskTitle = req.query.title;
        var taskDesc = req.query.description;
        var taskDate = req.query.date;

        var exist = false;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (key == userEmail) {
                    exist = true;
                    break;
                }
            }
        }
        if (exist == true) {

            var userTasks = [];
            userTasks = data[userEmail];

            var found = false;
            for (var i = 0; i < userTasks.length; i++) {
                if (userTasks[i].title == taskTitle) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                // add the new data
                console.log("User Exist");
                userTasks.push({ title: taskTitle, desc: taskDesc, date: taskDate });
                data[userEmail] = userTasks;
            } else {
                res.end("error");
            }
        } else {
            // create the user and add the data
            console.log("Don't exist");
            var userTasks = [];
            userTasks.push({ title: taskTitle, desc: taskDesc, date: taskDate });
            data[userEmail] = userTasks
            //console.log(JSON.stringify(data[newUser]));
        }

        fs.writeFile(tableName.substring(1, tableName.length - 1) + ".json", JSON.stringify(data), function (err) {
            if (err) throw err;
            console.log('It\'s saved!\n');
        });

        res.end("succeed");
    });
})

app.get('/deleteTask', function (req, res) {
    var tableName = JSON.stringify(req.query.table);
    //console.log(tableName.substring(1,tableName.length-1));
    //var user = 'user';
    var user = req.session.userEmail;

    fs.readFile(__dirname + "/" + tableName.substring(1, tableName.length-1) +".json", 'utf8', function (err, data) {
        data = JSON.parse(data);

        console.log("Deleting a task");
        var userTasks = [];
        userTasks = data[user];

        var found = false;
        for (var i = 0; i < userTasks.length; i++) {
            if (userTasks[i].title == req.query.title) {
                found = true;
                break;
            }
        }

        if (found) {
            findAndRemove(userTasks, 'title', req.query.title);
            data[user] = userTasks;

            fs.writeFile(tableName.substring(1, tableName.length - 1) + ".json", JSON.stringify(data), function (err) {
                if (err) throw err;
                console.log('It\'s saved!\n');
            });

            res.end("succeed");
        } else {
            res.end("error");
        }
    });
})

app.get('/editTask', function (req, res) {
    var tableName = JSON.stringify(req.query.table);
    //console.log(tableName.substring(1,tableName.length-1));
    //var user = 'user';
    var user = req.session.userEmail;

    fs.readFile(__dirname + "/" + tableName.substring(1, tableName.length-1) +".json", 'utf8', function (err, data) {
        data = JSON.parse(data);

        var oldTitle = req.query.oldTitle;
        var taskTitle = req.query.title;
        var taskDesc = req.query.description;
        var taskDate = req.query.date;

        console.log("Editing a task");
        var userTasks = [];
        userTasks = data[user];

        var found = false;
        for (var i = 0; i < userTasks.length; i++) {
            if (userTasks[i].title == oldTitle) {
                userTasks[i].title = taskTitle;
                userTasks[i].desc = taskDesc;
                userTasks[i].date = taskDate;
                found = true;
                break;
            }
        }

        if (found) {
            data[user] = userTasks;

            fs.writeFile(tableName.substring(1, tableName.length - 1) + ".json", JSON.stringify(data), function (err) {
                if (err) throw err;
                console.log('It\'s saved!\n');
            });

            res.end("succeed");
        } else {
            console.log("can'tEdit !!");
            res.end("error");
        }
    });
})

app.get('/getData', function (req, res) {

    var tableName = JSON.stringify(req.query.table);
    //console.log(tableName.substring(1,tableName.length-1));
    //var user = 'user';
    var user = req.session.userEmail;

    // First read existing users.
    fs.readFile(__dirname + "/" + tableName.substring(1, tableName.length - 1) + ".json", 'utf8', function (err, data) {
        var data = JSON.parse(data);

        var found = false;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (key == user) {
                    found = true;
                    break;
                }
            }
        }

        if (found) {
            //console.log("Getting tasks from" + req.body.table);
            var userTasks = [];
            userTasks = data[user];
            //console.log(JSON.stringify(userTasks));
            res.end(JSON.stringify(userTasks));
        } else {
            //console.log("not found");
            res.end("notFound");
        }

    });
})

app.get('/logout', function (req, res) {
    req.session.destroy();
    console.log("Logged out successfully");

    res.sendFile(__dirname + "/" + "login.html");
})

app.post('/test', function (req, res) {
    console.log("test successfully");
    res.end("ended test");
})

function findAndRemove(array, property, value) {
    array.forEach(function (result, index) {
        if (result[property] === value) {
            //Remove from array
            array.splice(index, 1);
        }
    });
}

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

app.get('/*', function (req, res) {
    //console.log("404 found");
    //console.log(req.url);
    //res.writeHead(404, {"Context-Type":"Plain/text"});
    res.sendFile(__dirname + "/ErrorPage.html");
    //fs.createReadStream("./ErrorPage.html").pipe(res);;
})
