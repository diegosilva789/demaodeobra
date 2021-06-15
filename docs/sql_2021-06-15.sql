-- Created by Vertabelo (http://vertabelo.com)

-- tables
-- Table: ANUNCIO
CREATE TABLE ANUNCIO (
    anu_id serial NOT NULL,
    anu_titulo varchar(50) NOT NULL CHECK (anu_titulo <> ''),
    anu_descricao varchar(4000) NULL,
    anu_preco_valor varchar(255) NULL,
    anu_preco_tipo varchar(255) NULL,
    anu_foto_capa varchar(255) NOT NULL CHECK (anu_foto_capa <> ''),
    anu_data_cadastro timestamp NOT NULL,
    anu_data_alteracao timestamp NOT NULL,
    anu_uf varchar(2) NOT NULL CHECK (anu_uf <> ''),
    anu_cidade varchar(255) NOT NULL CHECK (anu_cidade <> ''),
    usu_id int NOT NULL,
    cat_id int NOT NULL,
    CONSTRAINT ANUNCIO_pk PRIMARY KEY (anu_id)
);

-- Table: CATEGORIA
CREATE TABLE CATEGORIA (
    cat_id serial NOT NULL,
    cat_descricao varchar(255) NOT NULL CHECK (cat_descricao <> ''),
    CONSTRAINT CATEGORIA_pk PRIMARY KEY (cat_id)
);

-- Table: ENDERECO
CREATE TABLE ENDERECO (
    usu_id int NOT NULL,
    end_logradouro varchar(255) NOT NULL CHECK (end_logradouro <> ''),
    end_numero varchar(20) NOT NULL CHECK (end_numero <> ''),
    end_complemento varchar(255) NULL,
    end_bairro varchar(255) NOT NULL CHECK (end_bairro <> ''),
    end_cep varchar(10) NOT NULL CHECK (end_cep <> ''),
    end_uf varchar(2) NOT NULL CHECK (end_uf <> ''),
    end_cidade varchar(255) NOT NULL CHECK (end_cidade <> ''),
    CONSTRAINT ENDERECO_pk PRIMARY KEY (usu_id)
);

-- Table: FOTO_ANUNCIO
CREATE TABLE FOTO_ANUNCIO (
    fot_id serial NOT NULL,
    fot_descricao varchar(255) NOT NULL CHECK (fot_descricao <> ''),
    anu_id int  NOT NULL,
    CONSTRAINT FOTO_ANUNCIO_pk PRIMARY KEY (fot_id)
);

-- Table: MENSAGEM
CREATE TABLE MENSAGEM (
    men_id serial NOT NULL,
    men_enviada varchar(4000) NOT NULL CHECK (men_enviada <> ''),
    men_enviada_data timestamp NOT NULL,
    men_resposta varchar(4000) NULL,
    men_resposta_data timestamp NULL,
    usu_id_men_enviada int NOT NULL,
    usu_id_men_resposta int NOT NULL,
    anu_id int NOT NULL,
    CONSTRAINT MENSAGEM_pk PRIMARY KEY (men_id)
);

-- Table: USUARIO
CREATE TABLE USUARIO (
    usu_id serial NOT NULL,
    usu_email varchar(255) NOT NULL CHECK (usu_email <> ''),
    usu_senha varchar(255) NOT NULL CHECK (usu_senha <> ''),
    usu_nome varchar(255) NOT NULL CHECK (usu_nome <> ''),
    usu_telefone varchar(11) NOT NULL CHECK (usu_telefone <> ''),
    usu_data_cadastro timestamp NOT NULL,
    usu_data_alteracao timestamp NOT NULL,
    usu_pendente int NOT NULL,
    CONSTRAINT ak_usuario_usu_email UNIQUE (usu_email) NOT DEFERRABLE INITIALLY IMMEDIATE,
    CONSTRAINT USUARIO_pk PRIMARY KEY (usu_id)
);

-- foreign keys
-- Reference: fk_anuncio_cat_id (table: ANUNCIO)
ALTER TABLE ANUNCIO ADD CONSTRAINT fk_anuncio_cat_id
    FOREIGN KEY (cat_id)
    REFERENCES CATEGORIA (cat_id)  
    ON DELETE CASCADE
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_anuncio_usu_id (table: ANUNCIO)
ALTER TABLE ANUNCIO ADD CONSTRAINT fk_anuncio_usu_id
    FOREIGN KEY (usu_id)
    REFERENCES USUARIO (usu_id)  
    ON DELETE CASCADE
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_endereco_usu_id (table: ENDERECO)
ALTER TABLE ENDERECO ADD CONSTRAINT fk_endereco_usu_id
    FOREIGN KEY (usu_id)
    REFERENCES USUARIO (usu_id)  
    ON DELETE CASCADE
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_foto_anuncio_anu_id (table: FOTO_ANUNCIO)
ALTER TABLE FOTO_ANUNCIO ADD CONSTRAINT fk_foto_anuncio_anu_id
    FOREIGN KEY (anu_id)
    REFERENCES ANUNCIO (anu_id)  
    ON DELETE CASCADE
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_mensagem_anu_id (table: MENSAGEM)
ALTER TABLE MENSAGEM ADD CONSTRAINT fk_mensagem_anu_id
    FOREIGN KEY (anu_id)
    REFERENCES ANUNCIO (anu_id) 
    ON DELETE CASCADE 
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_mensagem_usu_id_destino (table: MENSAGEM)
ALTER TABLE MENSAGEM ADD CONSTRAINT fk_mensagem_usu_id_men_enviada
    FOREIGN KEY (usu_id_men_enviada)
    REFERENCES USUARIO (usu_id)  
    ON DELETE CASCADE
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: fk_mensagem_usu_id_origem (table: MENSAGEM)
ALTER TABLE MENSAGEM ADD CONSTRAINT fk_mensagem_usu_id_men_resposta
    FOREIGN KEY (usu_id_men_resposta)
    REFERENCES USUARIO (usu_id)  
    ON DELETE CASCADE
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.

