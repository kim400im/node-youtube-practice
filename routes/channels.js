const express = require('express')
// const app = express()
// app.listen(7777)
const router = express.Router()
router.use(express.json())

let db = new Map()
var id = 1

// 채널 생성
router.post('/', function(req, res){
    if (req.body.channelTitle){
        let channel = req.body
        console.log(channel)
        db.set(id++, channel)
        res.status(201).json({
            message : `${channel.channelTitle}님 채널을 응원합니다`
        })
    } else {
        res.status(400).json({
            message : "입력 값이 잘못되었습니다."
        })
    }
})

// 채널 개별 수정
router.put('/:id', function(req, res){
    console.log(req.body)
    let {id} = req.params
    id = parseInt(id)

    //newTitle = req.body.channelTitle
    // 
    // console.log(newTitle)
    // console.log(oldTitle)

    // const channel = req.body
    // 
    var channel = db.get(id)
    var oldTitle = channel.channelTitle
    if (channel){
        var newTitle = req.body.channelTitle

        channel.channelTitle = newTitle
        db.set(id, channel)
        res.status(200).json({
            message : `채널명이 성공적으로 수정되었습니다. 기존 ${oldTitle} -> 수정 ${newTitle}`
        })
    } else {
        notFoundChannel()
    }
})

// 채널 개별 삭제
router.delete('/:id', function(req, res){
    let {id} = req.params
    id = parseInt(id)

    var channel = db.get(id)
    if (channel){
        //console.log(db.get(id))
        db.delete(id)
        res.status(200).json({
            message : "삭제 되었습니다"
        })
    }else {
        res.status(404).json({
            message : "삭제할 항목이 없습니다."
        })
        
    }

    
})

// 채널 전체 조회
router.get('/', function(req, res){
    var channelObject = {}
    db.forEach(function(channel){
        console.log(channel)
    })

    if (db.size){
        var {uid} = req.body
        var channels = []

        if (uid){
            db.forEach(function(value, key){
                if (value.uid === uid){
                    channels.push(value)
                }
            })
            if (channels.length){
                res.status(200).json(channels)
            } else {
                notFoundChannel()
                
            }
        } else {
            res.status(404).json({
                message : "로그인이 필요한 페이지입니다"
            })
        }

        
    } else {
        notFoundChannel()
    }

    // if (db.size) {
    //     var channels = []

    //     db.forEach(function(value, key) {
    //         channels.push(value)
    //     })
    //     res.json(channels)
    // }
})

// 채널 개별 조회
router.get('/:id', function(req, res){
    let {id} = req.params
    id = parseInt(id)

    //console.log(db.get(id).channelTitle)
    //res.json(db.get(id))
    var channel = db.get(id)
    if (channel){
        res.status(200).json(db.get(id))
        
    } else {
        notFoundChannel()
    }
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

function notFoundChannel() {
    res.status(404).json({
        message : "이런 항목은 없습니다"
    })
}

module.exports = router