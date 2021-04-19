const app = angular.module("myapp", ["ngRoute"]);
app.config(($routeProvider) => {
    $routeProvider.when("/",
        {
            templateUrl: "monhoc.html"
        })
        .when("/cauhoi", {
            templateUrl: "cauhoi.html"

        })
        .when("/gioithieu", {
            templateUrl: "gioithieu.html"
        })
        .when("/lienhe", {
            templateUrl: "lienhe.html"
        })
        .when("/show/:name", {
            templateUrl: "cauhoi.html"
        })
        .when("/hoidap", {
            templateUrl: "hoidap.html"
        })
})


app.controller("ctrlListMonHoc", ($scope, $http, $routeParams, $rootScope) => {
    $http.get("http://localhost:3000/subjects").then((data) => {
        $scope.listMon = data.data;
    })
    $scope.showQuiz = () => {
        $rootScope.showHome = false;
    }

})
app.controller("menu", ($scope, $rootScope) => {
    $scope.showQuiz = () => {
        $rootScope.showHome = false;
    }
    $scope.showIndex = () => {
        $rootScope.showHome = true;
    }

})

//show 10 câu hỏi của môn học
app.controller("cauhoictrl", ($scope, $http, $routeParams, $rootScope) => {
    $scope.diem = 0;
    let dsQuiz = [];
    $scope.soCauDaLam = 0;
    $scope.index = 0;
    $scope.quiz = {};
    $scope.start = false;
    $scope.showDiem = false;
    $scope.giay = 59;
    $scope.phut = 9;

    $scope.ck = false;

   

    $http.get("http://localhost:3000/" + $routeParams.name).then((resp) => {
        dsQuiz = resp.data;
    }).then(() => {
        dsQuiz.sort(() => {
            return .5 - Math.random()
        })
    }).then(() => {
        $scope.quiz = dsQuiz[$scope.index]
    })



    $scope.startTest = () => {

        $scope.inter = setInterval(() => {

            if ($scope.giay > 0) {
                $scope.giay--;
            } else {
                $scope.giay = 59;
                $scope.phut--;
            }
            document.getElementById("time").innerHTML = `<h3><i>THỜI GIAN CÒN LẠI LÀ </i>${$scope.phut} : ${$scope.giay}</h3>`
            if ($scope.phut === 0 && $scope.giay === 0) {
                $scope.end()
                document.getElementById("quizContainer").innerHTML = `
                <button  type="button" name="" id="ll" class="btn btn-primary" btn-lg btn-block">Lam Lai</button>
          
            <div>
                Ban da hoang thanh bai test 
                Diem : ${$scope.diem}
            </div>`;
            document.getElementById("ll").addEventListener("click",((e)=>{
                window.location="#!show/"+$routeParams.name;
            }))
          
                clearInterval($scope.inter)
            }

        }, 1000)
        $scope.start = true;
       
    }



    $scope.end = () => {
        clearInterval($scope.inter)

        $scope.start = false;
        $scope.showDiem = true;
        $scope.giay = 59;
        $scope.phut = 9;

    }
    $scope.next = () => {


        if ($scope.quiz.AnswerId == $scope.tl) {
            $scope.diem += 1
        }
        if ($scope.soCauDaLam == 10) {
            $scope.start = false;
            $scope.showDiem = true;
        } else {
            $scope.soCauDaLam++;
            $scope.index += 1
            $scope.quiz = dsQuiz[$scope.index]
            console.log($scope.index)
        }

    }
    $scope.back = () => {
        $scope.soCauDaLam--;
        if ($scope.quiz.AnswerId == $scope.tl) {
            $scope.diem += 1
        }
        if ($scope.soCauDaLam < 0) {
            $scope.index = 0
        } else {
            $scope.index -= 1
        }
        $scope.quiz = dsQuiz[$scope.index]
        console.log($scope.index)
    }

})


//danh sách môn học
app.controller("monhocCtrl", ($scope, $http, $rootScope) => {
    $scope.list = [];
    $rootScope.showHome = true;
    $http.get("http://localhost:3000/subjects").then((resp) => {
        $scope.list = resp.data;
    })
    $scope.prop = "name";
    $scope.sortBy = (prop) => {
        $scope.prop = prop;
    }

    $scope.begin = 0;
    $scope.pageCount = Math.ceil($scope.list.length / 6);


    $scope.first = () => {

        $scope.begin = 0;
        console.log($scope.begin)
    }
    $scope.back = () => {
        if ($scope.begin > 0) {
            $scope.begin -= 6
        } else {
            $scope.begin = ($scope.pageCount - 1) * 6;
        }

    }
    $scope.next = () => {
        if ($scope.begin < $scope.list.length - 6) {
            $scope.begin += 6;
        } else {
            $scope.begin = 0
        }
        console.log($scope.begin)
    }
    $scope.last = () => {
        $scope.begin = $scope.list.length - 6;
        console.log($scope.begin)
    }


})

//login controller
app.controller("loginCtrl", ($scope,$rootScope, $http) => {
    $scope.user = {}
    let ck=false;
    $scope.login = () => {
        $http.get("http://localhost:3000/user?username=" + $scope.username).then((resp) => {

            if (resp.data[0] == undefined) {
                ck=false;
            } else {
                $scope.user = resp.data[0];
            }
        }).then(() => {
            if ($scope.user.username == $scope.username && $scope.user.password == $scope.password) {
                $rootScope.tendangnhap=$scope.username;
                $rootScope.login=true;
                ck=true;
                
            } else {
                
                $rootScope.login=false;
                ck=false;
            }
        }).then(()=>{
            if (ck) {
                alert("Dang nhap thanh cong")
                
                $('#loginForm').modal('hide')
            }else{
                alert("dang nhap trhat bai")
            }
        })


    }
   
})

app.controller("dkCtrl",($scope,$http)=>{
    $scope.dangki = () => {
        let user = {
            id: new Date().getTime,
            username: $scope.username_dk,
            password: $scope.password_dk
        }
        $http.post("http://localhost:3000/user", JSON.stringify(user), {
            "Content-Type": "application/json"
        }).then(()=>{
            alert("tao thanh cong tai khoan")
        })
    }
})
