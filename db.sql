CREATE TABLE membros (
  membro_id int NOT NULL AUTO_INCREMENT,
  nome varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  telefone varchar(20) DEFAULT NULL,
  data_nascimento date NOT NULL,
  PRIMARY KEY (membro_id),
  UNIQUE KEY email (email)
);

CREATE TABLE planos (
  plano_id int NOT NULL AUTO_INCREMENT,
  nome_plano varchar(50) NOT NULL,
  valor decimal(10,2) NOT NULL,
  PRIMARY KEY (plano_id)
);


CREATE TABLE matriculas (
  matricula_id int NOT NULL AUTO_INCREMENT,
  membro_id int DEFAULT NULL,
  plano_id int DEFAULT NULL,
  data_inicio date NOT NULL,
  status varchar(20) NOT NULL,
  PRIMARY KEY (matricula_id),
  KEY membro_id (membro_id),
  KEY plano_id (plano_id),
  CONSTRAINT matriculas_ibfk_1 FOREIGN KEY (membro_id) REFERENCES membros (membro_id),
  CONSTRAINT matriculas_ibfk_2 FOREIGN KEY (plano_id) REFERENCES planos (plano_id)
);
