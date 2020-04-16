// usei o express pra criar e configurar meu servidor
const express = require("express")
const server = express()

const db = require("./db")
 
// const ideas = [
//     {
//         img: "https://image.flaticon.com/icons/svg/1995/1995515.svg",
//         title: "Cursos de programação",
//         category: "Estudo",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam qui mollitia quis atque, amet accusamus blanditiis ratione impedit ipsam, in tempora vitae a sapiente corrupti rerum explicabo soluta iste odio?",
//         url: "https://rocketseat.com.br"
//     },
//     {
//         img: "https://image.flaticon.com/icons/svg/625/625455.svg",
//         title: "Exercícios",
//         category: "Saúde",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam qui mollitia quis atque, amet accusamus blanditiis ratione impedit ipsam, in tempora vitae a sapiente corrupti rerum explicabo soluta iste odio?",
//         url: "https://rocketseat.com.br"
//     },
//     {
//         img: "https://image.flaticon.com/icons/svg/1830/1830774.svg",
//         title: "Meditação",
//         category: "Mentalidade",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam qui mollitia quis atque, amet accusamus blanditiis ratione impedit ipsam, in tempora vitae a sapiente corrupti rerum explicabo soluta iste odio?",
//         url: "https://rocketseat.com.br"
//     },
//     {
//         img: "https://image.flaticon.com/icons/svg/2317/2317993.svg",
//         title: "Karaokê",
//         category: "Diversão em família",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam qui mollitia quis atque, amet accusamus blanditiis ratione impedit ipsam, in tempora vitae a sapiente corrupti rerum explicabo soluta iste odio?",
//         url: "https://rocketseat.com.br"
//     },
// ]

//configurar arquivos estaticos (css, scripts, imagens)
server.use(express.static("public"))

//habilitr uso do re.body
server.use(express.urlencoded({ extended: true }))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

// criei uma rota /
// e capturo o pedido dp cliente para responder 
server.get("/", function(req, res) {
    
    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }
 
        const reversedIdeas = [...rows].reverse()
        
        let lastIdeas = []
        for (let idea of reversedIdeas) {
            if (lastIdeas.length < 2)
                lastIdeas.push(idea)    
        }
    
        return res.render("index.html", { ideas: lastIdeas })
        
    })

  
})

server.get("/ideias", function(req, res) {

    

    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }

        const reversedIdeas = [...rows].reverse()
        return res.render("ideias.html", { ideas: reversedIdeas})
    })  
})  

server.post("/", function(req, res) {
    // Inserir dados na tabela
    const query= `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES (?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]

    db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }

        return res.redirect("/ideias")
    })
})

// liguei meu servidor na porta 3000
server.listen(3000)