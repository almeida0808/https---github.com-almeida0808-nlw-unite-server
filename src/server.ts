import fastify from 'fastify'
const app = fastify()

app.get("/",()=>{return 'vc fez um get'})



const PORT = 4444

app.listen({port: PORT}).then(() => {
    console.log(`Server is running on Port ${PORT}`)
})
