// express 모듈 세팅
const express = require('express')
// const app = express()
// app.listen(7777)
// app.js가 위 두 역할을 할 것이므로 필요없다.
// app.js가 이 파일을 사용하도록 하자 
const router = express.Router() // 이 파일을 express에 라우터로 사용 가능
// app.use(express.json())
router.use(express.json())
const conn = require('../mariadb')
const {body, param, validationResult, cookie} = require('express-validator')

// jwt 모듈
const jwt = require('jsonwebtoken')
// dotenv 모듈
const dotenv = require('dotenv')
dotenv.config();

const validate = (req, res, next) => {
    const err = validationResult(req)

    if (err.isEmpty()){
        return next(); // 다음 할 일을 찾아가도록 함. 
    } else {
        
        return res.status(400).json(err.array())
    }
}

conn.query(
    'SELECT * FROM `users`',
    function(err, results, fields){
        // var {id, email, name, created_at} = results[0];
        // console.log(id);
        // console.log(email);
        // console.log(name);
        // console.log(created_at);
    }
  );
// 로그인 => req : body(id, pwd) res : 환영 메시지
// 회원가입 => req: body(id, pwd, name) res : 환영 메시지
// 회원 개별 조회 => req : url (id) res : id, name
// 회원 개별 탈퇴 => req : url(id) res : 탈퇴 메시지

// db 만들기
// let db = new Map()
// var id = 1 


// 로그인
router.post(
    '/login', 
    [
        body('email').notEmpty().isEmail().withMessage("이메일 확인필요"),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        validate
    ]
    ,(req, res) => {
        console.log(req.body)

        // db.forEach(function(a, b, c){
        //     // a : value, b : key, c : Map 객체
        //     console.log(`a: ${a} b : ${b} c : ${C}`)
        // })
        const {email, password} = req.body
        //var loginUser = {}

        let sql =`SELECT * FROM users where email = ?`
        conn.query(
            sql, email,
            function(err, results, fields){
                if(err){
                    console.log(err)
                    return res.status(400).end()
                }
                var loginUser = results[0]

                if (loginUser && loginUser.password == password){
                    // token 발급
                    const token = jwt.sign({
                        email : loginUser.email,
                        name : loginUser.name
                    }, process.env.PRIVATE_KEY, {
                        expiresIn : "30m",
                        issuer : "kim"
                    });

                    res.cookie("token", token, {
                        httpOnly : true
                    })
                    // httpOnly 가 false면 프론트엔드 공격으로 api 가 공격 받는다.

                    console.log(token)
                    // 서버가 jwt를 쿠키에 동봉해서 보낸다. 
                    res.status(200).json({
                        message : `${loginUser.name}님 로그인 되었습니다.`,
                        //token : token
                    })
                }
                else {
                    // 403은 인증이 안되는 것이다.
                    res.status(403).json({
                        message : "이메일 또는 비밀번호가 틀렸습니다."
                    })
                }
                // if(results.length){
                //     loginUser = results[0];
                //     if(loginUser.password == password){
                //         res.status(200).json({
                //             message : `${loginUser.name}님 로그인 되었습니다.`
                //         })
                //     } else {
                //         res.status(404).json({
                //             message : "비밀번호가 틀렸습니다"
                //         })
                //     }
                // } else {
                //     res.status(404).json({
                //         message : "회원 정보가 없습니다."
                //     })
                // }
            }
        )

        // db.forEach(function(user, id){
        //     //console.log(user.uid)
        //     if (user.uid == uid){
        //         console.log(user.uid)
        //         console.log(uid)
        //         loginUser = user
        //     }
        // })

        // if (isExist(loginUser)){
        //     console.log("같은 걸 찾았다")
        //         if (loginUser.pwd === pwd){
        //             console.log(`서버는 ${loginUser.pwd} , 입력은 ${pwd}이다`)
        //             console.log("패스워드도 같다")
        //         } else {
        //             console.log(`서버는 ${loginUser.pwd} , 입력은 ${pwd}이다`)
        //             console.log("패스워드는 틀렸다.")
        //         }
        // } else{
        //     console.log("입력하신 아이디는 없는 아이디입니다")
        // }
})

// function isExist(obj){
//     if (Object.keys(obj).length){
//         return false
//     } else {
//         return true
//     }
// }

// 회원가입
router.post('/join', 
    [
        body('email').notEmpty().isEmail().withMessage("이메일 확인필요"),
        body('name').notEmpty().isString().withMessage('이름 확인 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        body('contact').notEmpty().isString().withMessage('연락처 확인 필요'),
        validate
    ],
    function(req, res){
        console.log(req.body.uid)
        console.log(req.body.pwd)
        console.log(req.body)


        // res.status(400).json({
        //     message : "입력 값을 확인해주세요"
        // })

        // const {uid} = req.body
        // db.set(uid, req.body)
        // console.log(db)
        const {email, name, password, contact} = req.body

        let sql =  `Insert into users (email, name, password, contact)
                values (?, ?, ?, ?)`
        let values = [email, name, password, contact]
        conn.query(
            sql, values,
            function(err, results, fields){
                if(err){
                    console.log(err)
                    return res.status(400).end()
                }
                res.status(201).json(results)
            }
        )

        // res.status(201).json({
        //     message : `${db.get(uid).name}님 회원가입을 환영합니다.`
        // })
        
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
    // 회원 개별 조회
    .get(
        [
            body('email').notEmpty().isEmail().withMessage("이메일 확인필요"),
            validate
        ],
        function(req, res){
            let {email} = req.body
            //id = parseInt(id)

            conn.query(
                `SELECT * FROM users where email = ?`, email,
                function(err, results, fields){
                    if (results.length)
                        res.status(200).json(results)
                    else {
                        res.status(404).json({
                            message : "회원 정보가 없습니다."
                        })
                    }
                }
            )
        
            // const user = db.get(uid)
            // if (user){
            //     res.status(200).json({
            //         uid : user.uid,
            //         name : user.name
            //     })
                
            // }else {
            //     res.status(404).json({
            //         message : "회원 정보가 없습니다."
            //     })
            // }
    
    })
    // 회원 탈퇴
    .delete(
        [
            body('email').notEmpty().isEmail().withMessage("이메일 확인필요"),
            validate
        ],
        function(req, res){
            //let {uid} = req.body
            //id = parseInt(id)
        
            //const user = db.get(id)

            //const name = db.get(id).name

            let {email} = req.body
            //id = parseInt(id)

            conn.query(
                `DELETE FROM users where email = ?`, email,
                function(err, results, fields){
                    if(err){
                        console.log(err)
                        return res.status(400).end()
                    }
                    if(results.affectedRows == 0)
                        return res.status(400).end()
                    else
                        res.status(200).json(results)
                }
            )



            // if (user){
            //     db.delete(id)
            //     res.status(200).json({
            //         message : `${user.name}님 다음에 또 뵙겠습니다.`
            //     })
            // }else {
            //     res.status(404).json({
            //         message : "회원 정보가 없습니다."
            //     })
            // }
    })

module.exports = router