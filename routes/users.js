// express 모듈 세팅
const express = require('express')
// const app = express()
// app.listen(7777)
// app.js가 위 두 역할을 할 것이므로 필요없다.
// app.js가 이 파일을 사용하도록 하자 
const router = express.Router() // 이 파일을 express에 라우터로 사용 가능
// app.use(express.json())
router.use(express.json())

// 로그인 => req : body(id, pwd) res : 환영 메시지
// 회원가입 => req: body(id, pwd, name) res : 환영 메시지
// 회원 개별 조회 => req : url (id) res : id, name
// 회원 개별 탈퇴 => req : url(id) res : 탈퇴 메시지

// db 만들기
let db = new Map()
var id = 1 


// 로그인
router.post('/login', (req, res) => {
    console.log(req.body)

    // db.forEach(function(a, b, c){
    //     // a : value, b : key, c : Map 객체
    //     console.log(`a: ${a} b : ${b} c : ${C}`)
    // })
    const {uid, pwd} = req.body
    var loginUser = {}

    db.forEach(function(user, id){
        //console.log(user.uid)
        if (user.uid == uid){
            console.log(user.uid)
            console.log(uid)
            loginUser = user
        }
    })

    if (isExist(loginUser)){
        console.log("같은 걸 찾았다")
            if (loginUser.pwd === pwd){
                console.log(`서버는 ${loginUser.pwd} , 입력은 ${pwd}이다`)
                console.log("패스워드도 같다")
            } else {
                console.log(`서버는 ${loginUser.pwd} , 입력은 ${pwd}이다`)
                console.log("패스워드는 틀렸다.")
            }
    } else{
        console.log("입력하신 아이디는 없는 아이디입니다")
    }
})

function isExist(obj){
    if (Object.keys(obj).length){
        return false
    } else {
        return true
    }
}

// 회원가입
router.post('/join', function(req, res){
    console.log(req.body.uid)
    console.log(req.body.pwd)
    console.log(req.body)

    if (req.body.name == undefined){
        db.set(id++, req.body)
        console.log(db)

        res.status(400).json({
            message : "입력 값을 확인해주세요"
        })
    } else {
        const {uid} = req.body
        db.set(uid, req.body)
        console.log(db)

        res.status(201).json({
            message : `${db.get(uid).name}님 회원가입을 환영합니다.`
        })
    }
})

// 회원 전체 조회
// router.get('/users', function(req, res){
//     console.log("hello")
//     console.log(db)
//     db.forEach(function(member){
//         console.log(member)
//     })
// })

// 회원 개별 조회
// app.get('/users/:id', function(req, res){
//     let {id} = req.params
//     id = parseInt(id)

//     const user = db.get(id)
//     if (user == undefined){
//         res.status(404).json({
//             message : "회원 정보가 없습니다."
//         })
//     }else {
//         res.status(200).json({
//             uid : user.uid,
//             name : user.name
//         })
//     }

// })

// 회원 탈퇴
// app.delete('/users/:id', function(req, res){
//     let {id} = req.params
//     id = parseInt(id)

//     const user = db.get(id)
//     //const name = db.get(id).name
//     if (user == undefined){
//         res.status(404).json({
//             message : "회원 정보가 없습니다."
//         })
//     }else {
//         db.delete(id)
//         res.status(200).json({
//             message : `${user.name}님 다음에 또 뵙겠습니다.`
//         })
//     }
// })

router
    .route('/users')
    .get(function(req, res){
        let {uid} = req.body
        //id = parseInt(id)
    
        const user = db.get(uid)
        if (user){
            res.status(200).json({
                uid : user.uid,
                name : user.name
            })
            
        }else {
            res.status(404).json({
                message : "회원 정보가 없습니다."
            })
        }
    
    })
    .delete(function(req, res){
        let {uid} = req.body
        //id = parseInt(id)
    
        const user = db.get(id)

        //const name = db.get(id).name
        if (user){
            db.delete(id)
            res.status(200).json({
                message : `${user.name}님 다음에 또 뵙겠습니다.`
            })
        }else {
            res.status(404).json({
                message : "회원 정보가 없습니다."
            })
        }
    })

module.exports = router