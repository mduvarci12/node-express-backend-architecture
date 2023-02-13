Node express backend

sequelize orm used for mySQL database
    migrations work by: 'sequelize db:migrate'
    migration example for User:  npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string
    sequelize migration docs: https://sequelize.org/docs/v6/other-topics/migrations/

PORT = 8000

simple architecture for node js express backend
- MySQL
- Sequelize with Migrations
- Bearer Token Validation