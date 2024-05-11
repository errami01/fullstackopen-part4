const { test, describe } = require('node:test')
const assert = require('node:assert')
const favoriteBlog = require('../utils/list_helper').favoriteBlog

describe('favorite blog', ()=>{
    const oneBlogList = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
          }
    ]
    const threeBlogsList = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
          },
          {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0
          },
          {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
          }
    ]
    test('one blog', ()=>{
        const result = favoriteBlog(oneBlogList)
        assert.deepEqual(result, oneBlogList[0])
    })
    test('three blogs', ()=>{
        const result = favoriteBlog(threeBlogsList)
        assert.deepEqual(result, threeBlogsList[2])
    })
})