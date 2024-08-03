const express = require('express')
// const app = express()
// app.listen(7777)
const router = express.Router()
router.use(express.json())

const conn = require('../mariadb')
const {body, param, validationResult} = require('express-validator')
conn.query(
    'SELECT * FROM `channels`',
    function(err, results, fields){
    
    }
  );

let db = new Map()
var id = 1

const validate = (req, res, next) => {
    const err = validationResult(req)

    if (err.isEmpty()){
        return next(); // 다음 할 일을 찾아가도록 함. 
    } else {
        
        return res.status(400).json(err.array())
    }
}

// 채널 생성
// router.post('/', function(req, res){
//     if (req.body.name){
//         //let channel = req.body
//         // console.log(channel)
//         // db.set(id++, channel)
//         const {name, userId} = req.body

//         let sql =  `Insert into channels (name, user_id)
//                 values (?, ?)`
//         let values = [name, userId]
//         conn.query(
//             sql, values,
//             function(err, results, fields){
//                 res.status(201).json(results)
//             }
//         )
//         // res.status(201).json({
//         //     message : `${channel.channelTitle}님 채널을 응원합니다`
//         // })
//     } else {
//         res.status(400).json({
//             message : "입력 값이 잘못되었습니다."
//         })
//     }
// })

// 이런 형식으로 작성하자
// app
//     .route('/channels')
//     .get((req, res) => {
//         res.send(" ")
//     })
//     .post((req, res) => {
//         res.send(" ")
//     })

router
    .route('/')
    // 채널 생성
    .post(
        [body('userId').notEmpty().isInt().withMessage("숫자 입력하시오"),
        body('name').notEmpty().isString().withMessage("문자 입력하시오"),
        validate
        ],
        (req, res) => {
            const {name, userId} = req.body

            let sql =  `Insert into channels (name, user_id)
                        values (?, ?)`
            let values = [name, userId]
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

            // if (req.body.name){
            //     //let channel = req.body
            //     // console.log(channel)
            //     // db.set(id++, channel)
            //     const {name, userId} = req.body
        
            //     let sql =  `Insert into channels (name, user_id)
            //             values (?, ?)`
            //     let values = [name, userId]
            //     conn.query(
            //         sql, values,
            //         function(err, results, fields){
            //             res.status(201).json(results)
            //         }
            //     )
            //     // res.status(201).json({
            //     //     message : `${channel.channelTitle}님 채널을 응원합니다`
            //     // })
            // } else {
            //     res.status(400).json({
            //         message : "입력 값이 잘못되었습니다."
            //     })
            // }
    })
    // 채널 전체 조회
    .get(
        [
            body('userId').notEmpty().isInt().withMessage("숫자 입력 필요"),
            validate
        ],
        (req, res) => {
            //var channelObject = {}
            // db.forEach(function(channel){
            //     console.log(channel)
            // })
            //validate(req, res)

            var {userId} = req.body

            let sql = `SELECT * from channels WHERE user_id = ?`
            // uid && conn.query(sql, uid,
            //     function(err, results) {
            //         if(results.length)
            //             res.status(200).json(results)
            //         else
            //             notFoundChannel(res)
            //     }
            // )
            conn.query(sql, userId,
                function(err, results) {
                    if(err){
                        console.log(err)
                        return res.status(400).end()
                    }
                    if(results.length)
                        res.status(200).json(results)
                    else
                        notFoundChannel(res)
                }
            )

            // if (uid){
            //     conn.query(sql, uid,
            //         function(err, results) {
            //             if(results.length)
            //                 res.status(200).json(results)
            //             else
            //                 notFoundChannel(res)
            //         }
            //     )
            // } else {
            //     res.status(400).end()
            // }

            //res.status(400).end()

            // if (db.size){
            //     var {uid} = req.body
            //     var channels = []

            //     if (uid){
            //         db.forEach(function(value, key){
            //             if (value.uid === uid){
            //                 channels.push(value)
            //             }
            //         })
            //         if (channels.length){
            //             res.status(200).json(channels)
            //         } else {
            //             notFoundChannel()
                        
            //         }
            //     } else {
            //         res.status(404).json({
            //             message : "로그인이 필요한 페이지입니다"
            //         })
            //     }

                
            // } else {
            //     notFoundChannel()
            // }

            // if (db.size) {
            //     var channels = []

            //     db.forEach(function(value, key) {
            //         channels.push(value)
            //     })
            //     res.json(channels)
            // }
    })


router
    .route('/:id')
    // 채널 개별 수정
    .put(
        [param('id').notEmpty().isInt().withMessage("채널 아이디 필요"),
        body('name').notEmpty().isString().withMessage("채널명 오류"),
        validate],
        (req, res) => {
            // const err = validationResult(req)

            // if (!err.isEmpty()){
            //     return res.status(400).json(err.array())
            // }
            //console.log(req.body)
            let {id} = req.params
            let {name} = req.body
            id = parseInt(id)

            //newTitle = req.body.channelTitle
            // 
            // console.log(newTitle)
            // console.log(oldTitle)

            // const channel = req.body
            // 

            let sql = `UPDATE channels SET name=? WHERE id = ?`
            let values = [name, id]
            conn.query(sql, values,
                function(err, results) {
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


            // var channel = db.get(id)
            // var oldTitle = channel.channelTitle
            // if (channel){
            //     var newTitle = req.body.channelTitle

            //     channel.channelTitle = newTitle
            //     db.set(id, channel)
            //     res.status(200).json({
            //         message : `채널명이 성공적으로 수정되었습니다. 기존 ${oldTitle} -> 수정 ${newTitle}`
            //     })
            // } else {
            //     notFoundChannel()
            // }
    })
    // 채널 개별 삭제
    .delete([
        param('id').notEmpty().withMessage('채널 id 필요'),
        validate
    ],(
        req, res) => {
        let {id} = req.params
        id = parseInt(id)

        let sql = `DELETE FROM channels where id = ?`
        conn.query(
            sql, id,
            function(err, results, fields){
                if(err){
                    console.log(err)
                    return res.status(400).end
                }
                if(results.affectedRows == 0)
                    return res.status(400).end()
                else
                    res.status(200).json(results)
            }
        )

        // var channel = db.get(id)
        // if (channel){
        //     //console.log(db.get(id))
        //     db.delete(id)
        //     res.status(200).json({
        //         message : "삭제 되었습니다"
        //     })
        // }else {
        //     res.status(404).json({
        //         message : "삭제할 항목이 없습니다."
        //     })
            
        // }
    })
    // 채널 개별 조회
    .get(
        [param('id').notEmpty().withMessage('채널 id 필요'),
            validate
        ],
        (req, res) => {

            let {id} = req.params
            id = parseInt(id)

            //console.log(db.get(id).channelTitle)
            //res.json(db.get(id))

            let sql = `SELECT * from channels WHERE id = ?`
            conn.query(sql, id,
                function(err, results) {
                    if(err){
                        console.log(err)
                        return res.status(400).end()
                    }
                    if(!results.length)
                        return res.status(400).end()
                    else
                        res.status(200).json(results)
                }
            )

            // var channel = db.get(id)
            // if (channel){
            //     res.status(200).json(db.get(id))
                
            // } else {
            //     notFoundChannel()
            // }
    })


// 이런 형식으로 작성하자
// app
//     .route('/channels')
//     .get((req, res) => {
//         res.send(" ")
//     })
//     .post((req, res) => {
//         res.send(" ")
//     })

function notFoundChannel(res) {
    res.status(404).json({
        message : "이런 항목은 없습니다"
    })
}

module.exports = router