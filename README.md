# Express Knex Boilerplate
This is a boilerplate project used for starting new projects with Knex and a PostgreSQL database!

## Set up
You can start a new project using this template with 1 command using my `exp` script! 🤩<br>
Learn more [here](https://github.com/malcolmkiano/exp).

If you prefer the manual way, could complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-knex-boilerplate",`

## Scripts
Start the application `npm start`<br>
Start nodemon for the application `npm run dev`<br>
Run the tests `npm test`

## Deploying
When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
