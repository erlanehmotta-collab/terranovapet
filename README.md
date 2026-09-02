# Terranova Pet — Sistema de Produção de Memoriais & Plaquinhas NFC

Ferramenta desenvolvida para a equipe da **Terranova Pet Memorial e Crematório** (Montes Claros - MG) para cadastrar atendimentos e gerar automaticamente páginas de homenagem pós-morte padronizadas, emocionantes e conectadas a plaquinhas físicas NFC.

---

## 🚀 Como Funciona a Ferramenta

1. **Acesso da Equipe Terranova Pet:**
   - Abra o arquivo `index.html` em qualquer navegador (Chrome, Edge, Safari, Firefox).
   - O painel exibe todos os memoriais ativos e o botão **`+ Criar Novo Memorial`**.

2. **Cadastro e Personalização em 3 Passos:**
   - **Passo 1: Dados do Pet & Tutor:** Nome do cãozinho/gato, raça, ano de nascimento/chegada, ano de partida e código da plaquinha.
   - **Passo 2: Upload das Fotos:** Foto principal de rosto (que recebe a auréola celestial de anjo automaticamente) e até 4 fotos do álbum de dias felizes.
   - **Passo 3: Textos Reconfortantes:** Clique no botão **`✨ Gerar Carta com IA Terranova`** para preencher instantaneamente a *Carta do seu Anjinho* e o poema da *Ponte do Arco-Íris* em português brasileiro comovente e sensível.

3. **Geração Automática da Página Oficial:**
   - O sistema compila e salva o memorial com o template aprovado:
     - Fundo oficial Terranova Pet em Laranja Terracota (`#E67E22`).
     - Vela virtual interativa (*Luz da Saudade*).
     - Álbum fotográfico e mural de recados de apoio para os tutores.
     - Melodia instrumental suave em Web Audio API.

4. **Gravação na Plaquinha Física NFC:**
   - No painel, clique no ícone **🏷️ Plaquinha NFC**.
   - O sistema exibe o **QR Code oficial** e o **Link exclusivo** do pet (ex: `https://terranovapet.com.br/memorial/thor-2026`).
   - Pelo aplicativo gratuito **NFC Tools** (no Android ou iPhone):
     - Escolha `Escrever` -> `Adicionar um registro` -> `URL / URI`.
     - Cole o link e encoste a plaquinha no verso do celular. A plaquinha está pronta para ser fixada na urna!

5. **Envio para a Família:**
   - Botão para enviar a homenagem diretamente no WhatsApp do tutor com mensagem de acolhimento pronta.

---

## 🛠️ Arquivos do Projeto

- `index.html`: Painel completo de produção e gestão de memoriais (não requer instalação de servidor, roda direto no navegador com persistência em `localStorage`).
- Suporta download avulso do arquivo HTML de cada pet (`memorial-[nome].html`) pronto para hospedagem ou envio.
