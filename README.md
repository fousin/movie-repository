# Sobre o Projeto
Este projeto foi desenvolvido para atender à minha necessidade de uma biblioteca de vídeos simples, acessível dentro da minha rede local.

# Tecnologias Utilizadas
A aplicação foi construída como um monólito utilizando Laravel no backend e React no frontend, integrados por meio do Inertia.js. Para facilitar a execução e o ambiente de desenvolvimento, a aplicação roda em Docker, com configurações personalizadas para PHP, Nginx e MySQL.

# Dependencias

1. Backend (Laravel)
- PHP (versão compatível com Laravel)
- Composer
- MySQL
- Laravel Vite Plugin

2. Frontend (React)
- React 18
- Tailwind CSS
- Axios
- TypeScript
- Vite

# Como Executar
1. Buildar e iniciar os containers Docker. (docker-compose up -d --build)
2. Adicionar um arquivo .env padrão do Laravel.
3. adicionar as configuração do banco de dados no env
4. Gerar a application key do Laravel. (php artisan key:generate)
5. Instalar os pacotes do Node.js. (npm install)
6. gerar o build do node ou iniciar o servidor node de dev (npm run build ou npm run dev)

# Sobre os endpoints da aplicação que possuem uma view
[GET] / - pagina de listagem dos videos/filmes ja cadastrados
[GET] /filmes/show/{id} - pagina de exibição do videos/filmes
[GET] /register - possui o form de cadastro 
[GET] /dashboard - pagina de listagem, cadastro, atualização e exclusão dos videos/filmes
[GET] /arquivos - pagina de listagem, cadastro e exclusão de arquivos no geral, videos/filmes ou imagem


