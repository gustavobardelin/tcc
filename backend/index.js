const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3301;

app.use(cors());
app.use(express.json());

const banco = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "academia_db"
});

banco.connect((erro) => {
    if (erro) {
        console.log("Erro ao conectar ao MySQL: ");
        console.log(erro);

    } else {
        console.log("Conectado ao MySQL com sucesso");
    }
});

// LOGIN
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";

    banco.query(sql, [email, senha], (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        if (resultados.length > 0) {
            const usuario = resultados[0];
            return res.status(200).json({ message: "Login bem-sucedido", usuario });
        } else {
            return res.status(401).json({ error: "Email ou senha incorretos" });
        }
    });
});


// MEMBROS

// ROTA GET buscar p todos os membros
app.get("/membros", (req, res) => {
    const sql = "select * from membros";

    banco.query(sql, (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao consultar membros" });

        } else {
            console.log(resultados);
            return res.status(200).json(resultados);
        }
    });
});


// ROTA GET por id p buscar membro especifico
app.get("/membros/:id", (req, res) => {
    const { id } = req.params;

    const sql = "select * from membros where membro_id = ?";

    banco.query(sql, [id], (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao consultar membro" });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ message: "Membro não encontrado" });
        }


        return res.status(200).json(resultados[0]);
    });
});


// ROTA POST p cadastrar um novo membro
app.post("/membros", (req, res) => {
    const { nome, email, telefone, data_nascimento } = req.body;

    const sql = "insert into membros (nome, email, telefone, data_nascimento) values (?, ?, ?, ?)";

    banco.query(sql, [nome, email, telefone, data_nascimento], (erro, result) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao cadastrar membro" });
        }

        else {
            let mensagem = `Membro '${nome}' cadastrado com sucesso com o codigo ${result.insertId}`;
            console.log(mensagem);
            return res.status(201).json({ message: mensagem });
        }
    });
});


// ROTA PUT p atualizar um membro
app.put("/membros/:id", (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, data_nascimento } = req.body;

    const sql = "update membros set nome = ?, email = ?, telefone = ?, data_nascimento = ? where membro_id = ?";

    banco.query(sql, [nome, email, telefone, data_nascimento, id], (erro, result) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao atualizar membro" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Membro não encontrado" });
        }


        return res.status(200).json({ message: `Membro com ID ${id} atualizado com sucesso` });
    });
});


// ROTA delete p excluir um membro
app.delete("/membros/:id", (req, res) => {
    const { id } = req.params;

    const sql = "delete from membros where membro_id = ?";

    banco.query(sql, [id], (erro, result) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao excluir membro" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Membro não encontrado" });
        }


        return res.status(200).json({ message: `Membro com ID ${id} excluído com sucesso` });
    });
});


// PLANOS

//buscar todos os planos
app.get("/planos", (req, res) => {
    const sql = "select * from planos";

    banco.query(sql, (erro, resultados) => {
        if (erro) { return res.status(500).json({ error: "Erro ao consultar planos" }); }

        return res.status(200).json(resultados);
    });
});


//buscar plano especifico
app.get("/planos/:id", (req, res) => {
    const { id } = req.params;

    const sql = "select * from planos where plano_id = ?";

    banco.query(sql, [id], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ error: "Erro ao consultar plano" });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ message: "Plano não encontrado" });
        }

        return res.status(200).json(resultados[0]);
    });
});


// adicionar novo plano
app.post("/planos", (req, res) => {
    const { nome_plano, valor } = req.body;

    const sql = "insert into planos (nome_plano, valor) values (?, ?)";

    banco.query(sql, [nome_plano, valor], (erro, result) => {
        if (erro) {
            return res.status(500).json({ error: "Erro ao cadastrar plano" });
        }

        return res.status(201).json({ message: `Plano '${nome_plano}' cadastrado com sucesso` });
    });
});


// atualizar plano
app.put("/planos/:id", (req, res) => {
    const { id } = req.params;
    const { nome_plano, valor } = req.body;

    const sql = "update planos set nome_plano = ?, valor = ? where plano_id = ?";

    banco.query(sql, [nome_plano, valor, id], (erro, result) => {
        if (erro) {
            return res.status(500).json({ error: "Erro ao atualizar plano" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Plano não encontrado" });
        }


        return res.status(200).json({ message: `Plano com ID ${id} atualizado com sucesso` });
    });
});


// deletar plano
app.delete("/planos/:id", (req, res) => {
    const { id } = req.params;

    const sql = "delete from planos where plano_id = ?";

    banco.query(sql, [id], (erro, result) => {
        if (erro) {
            return res.status(500).json({ error: "Erro ao excluir plano" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Plano não encontrado" });
        }


        return res.status(200).json({ message: `Plano com ID ${id} excluído com sucesso` });
    });
});


//MATRICULAS

// consultar todas matriculas
app.get("/matriculas", (req, res) => {
    const sql =
        `select m.matricula_id, m.data_inicio, m.status, me.nome, p.nome_plano from matriculas m
        join membros me on m.membro_id = me.membro_id
        join planos p on m.plano_id = p.plano_id`;

    banco.query(sql, (erro, resultados) => {

        if (erro) {
            return res.status(500).json({ error: "Erro ao consultar matrículas" });
        }

        return res.status(200).json(resultados);
    });
});


//consultar matricula especifica
app.get("/matriculas/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT m.*, me.nome AS nome_membro 
        FROM matriculas m
        JOIN membros me ON m.membro_id = me.membro_id
        WHERE m.matricula_id = ?
    `;

    banco.query(sql, [id], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ error: "Erro ao consultar matricula" });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ message: "Matricula não encontrada" });
        }

        return res.status(200).json(resultados[0]);
    });
});


// cadastrar matricula
app.post("/matriculas", (req, res) => {
    const { membro_id, plano_id, data_inicio, status } = req.body;

    const sql = "insert into matriculas (membro_id, plano_id, data_inicio, status) values (?, ?, ?, ?)";

    banco.query(sql, [membro_id, plano_id, data_inicio, status], (erro, result) => {
        if (erro) {
            return res.status(500).json({ error: "Erro ao cadastrar matrícula" });
        }


        return res.status(201).json({ message: "Matricula realizada com sucesso" });
    });
});


//atualizar matricula
app.put("/matriculas/:id", (req, res) => {
    const { id } = req.params;
    const { data_inicio, status } = req.body;

    const sql = "update matriculas set data_inicio = ?, status = ? where matricula_id = ?";

    banco.query(sql, [data_inicio, status, id], (erro, result) => {
        if (erro) {
            return res.status(500).json({ error: "Erro ao atualizar matricula" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Matricula não encontrada" });
        }


        return res.status(200).json({ message: `Matrícula com ID ${id} atualizada com sucesso` });
    });
});


//deletar matricula
app.delete("/matriculas/:id", (req, res) => {
    const { id } = req.params;

    const sql = "delete from matriculas where matricula_id = ?";

    banco.query(sql, [id], (erro, result) => {

        if (erro) {
            return res.status(500).json({ error: "Erro ao excluir matricula" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Matrícula não encontrada" });
        }

        return res.status(200).json({ message: `Matricula com ID ${id} excluída com sucesso` });
    });
});


// PAGAMENTOS

// Rota para LISTAR pagamentos de uma matrícula específica
app.get("/matriculas/:id/pagamentos", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM pagamentos WHERE matricula_id = ?";

    banco.query(sql, [id], (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao consultar pagamentos" });
        }
        return res.status(200).json(resultados);
    });
});


// Rota para REGISTRAR um novo pagamento
app.post("/pagamentos", (req, res) => {
    const { matricula_id, data_pagamento, valor_pago, data_vencimento } = req.body;

    const sql = "INSERT INTO pagamentos (matricula_id, data_pagamento, valor_pago, data_vencimento) VALUES (?, ?, ?, ?)";

    banco.query(sql, [matricula_id, data_pagamento, valor_pago, data_vencimento], (erro, result) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao registrar pagamento" });
        }

        else {
            let mensagem = `Pagamento referente a matrícula ${matricula_id} cadastrado com sucesso com o codigo ${result.insertId}`;
            console.log(mensagem);
            return res.status(201).json({ message: mensagem });
        }
    });
});


// Rota para BUSCAR um pagamento específico por ID
app.get("/pagamentos/:id", (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM pagamentos WHERE pagamento_id = ?";

    banco.query(sql, [id], (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao consultar pagamento" });
        }
        if (resultados.length === 0) {
            return res.status(404).json({ message: "Pagamento não encontrado" });
        }
        return res.status(200).json(resultados[0]);
    });
});


// ROTA PUT para atualizar um pagamento
app.put("/pagamentos/:id", (req, res) => {
    const { id } = req.params;
    const { data_pagamento, valor_pago, data_vencimento } = req.body;

    const sql = "UPDATE pagamentos SET data_pagamento = ?, valor_pago = ?, data_vencimento = ? WHERE pagamento_id = ?";

    banco.query(sql, [data_pagamento, valor_pago, data_vencimento, id], (erro, result) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao atualizar pagamento" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pagamento não encontrado" });
        }
        return res.status(200).json({ message: `Pagamento com ID ${id} atualizado com sucesso` });
    });
});


// ROTA DELETE para excluir um pagamento
app.delete("/pagamentos/:id", (req, res) => {
    const { id } = req.params;
    
    const sql = "DELETE FROM pagamentos WHERE pagamento_id = ?";
    
    banco.query(sql, [id], (erro, result) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({ error: "Erro ao excluir pagamento" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pagamento não encontrado" });
        }
        return res.status(200).json({ message: `Pagamento com ID ${id} excluído com sucesso` });
    });
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});