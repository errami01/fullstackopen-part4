const dummy = (blogs)=>{
    return 1
}
const totalLikes = (blogs)=>{
    return blogs.reduce((total, blog)=>{
        return total + blog.likes
    },0) 
}
const favoriteBlog =(blogs)=>{
    return blogs.reduce((a, b)=>{
        return a.likes >= b.likes ? a : b
    }, 0)
}
module.exports={
    dummy,
    totalLikes,
    favoriteBlog
}