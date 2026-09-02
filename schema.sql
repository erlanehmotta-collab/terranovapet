-- TABELA DE ACESSOS MESTRES
CREATE TABLE IF NOT EXISTS acessos_mestres (
  email TEXT PRIMARY KEY,
  senha TEXT NOT NULL,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  super_admin INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE TUTORES
CREATE TABLE IF NOT EXISTS tutores (
  email TEXT PRIMARY KEY,
  senha TEXT NOT NULL,
  nome TEXT NOT NULL,
  pet_nome TEXT,
  pet_raca TEXT,
  pet_foto TEXT,
  cidade TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE PETS (MEMORIAIS E IDENTIFICAÇÃO)
CREATE TABLE IF NOT EXISTS pets (
  id TEXT PRIMARY KEY,
  tag_code TEXT,
  nfc_code TEXT,
  nome TEXT NOT NULL,
  raca TEXT,
  tutor_nome TEXT,
  tutor_email TEXT,
  cidade TEXT,
  status TEXT DEFAULT 'memorial',
  nasc TEXT,
  partida TEXT,
  subtitulo TEXT,
  historias TEXT,
  carta_pet TEXT,
  foto_principal TEXT,
  galeria_json TEXT,
  velas INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE POSTS DO FEED SOCIAL
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  pet_nome TEXT NOT NULL,
  tutor TEXT,
  pet_foto TEXT,
  midia_url TEXT,
  legenda TEXT,
  patinhas INTEGER DEFAULT 0,
  horario TEXT,
  cidade TEXT,
  comentarios_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- INSERE CONTA MESTRE PRINCIPAL OFICIAL
INSERT OR IGNORE INTO acessos_mestres (email, senha, nome, cargo, super_admin) 
VALUES ('erlanehmotta@gmail.com', 'Emia2026', 'Erlane Motta', 'Administrador Mestre Principal', 1);

-- INSERE PET INICIAL THOR
INSERT OR IGNORE INTO pets (id, tag_code, nfc_code, nome, raca, tutor_nome, cidade, nasc, partida, subtitulo, historias, carta_pet, foto_principal, velas)
VALUES (
  'thor', 
  'TN-THOR-3620', 
  'TN-THOR-3620', 
  'Thor', 
  'Golden Retriever', 
  'Família Miranda', 
  'Montes Claros - MG', 
  '2012', 
  '2026', 
  'Nosso leal companheiro e eterno anjo da família', 
  'Ele adorava correr pelo quintal com a bolinha amarela...', 
  'Mãe, Pai... Por favor, não chorem com tristeza ao pensar em mim. Estou em paz no céu dos animaizinhos!', 
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=95', 
  12
);
