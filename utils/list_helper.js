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
const mostBlogs = (blogs)=>{
    if(!blogs.length) return 
    const authors = {}
    blogs.map((blog)=>{
        authors[blog['author']] = authors[blog['author']]? authors[blog['author']]+1 : 1 
    })
    const max = Math.max(...Object.values(authors))
    const author = Object.keys(authors).find((author)=>{
        return authors[author] === max
    })
    return {author: author, blogs: max}
}
module.exports={
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}