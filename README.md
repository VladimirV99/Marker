# Marker

Marker is a forum designed for college students to help each other in solving problems and learning.

## Features

- **Authentication** - Users can register and log in to create and reply to threads and to vote on others posts
- **Administration** - Moderators can create and delete categories, forums, threads or posts made by anyone
- **Profile** - Registered users have and editable profile, including a photo
- **Categories** - Groups of forums all belonging to the same field
- **Forums** - Collection of topics all on the same subject
- **Threads** - Discussions on a certain topic
- **Posts** - User written comment in a thread
- **Voting** - Every post has a vote balance to suggest how helpful it was
- **Responsive** - Webpages adapt to the size of the screen
- **Dark mode** - Logged in users can switch between the light and dark theme
- **Caching** - Most common pages are cached to ease the load on the server

## Programming

The entire application is written in javascript. The back end is a node server that uses express for routing, passport and jwt for authentication, sequelize as an object-relation mapper and redis as cache. The front end is a react app with redux as the global state manager. We use a MySQL database in a docker container, but it can be changed just by changing the dialect in the sequelize configuration.

## Required software

- nodejs - JavaScript runtime environment
- npm - package manager for nodejs applications
- podman/docker - container technology for packaging applications
- redis - distributed, in-memory key–value database with optional durability

Note: if you use docker instead of podman you'll need to change the dbstart and dbstop commands in package.json

## Environment variables

- NODE_ENV - Set to 'production' to use production mode
- PORT - Port to run the server on (default 5000)
- REDIS_PORT - Port of the redis cache server (default 6379)
- DB_HOST - Database connection URL (default 'localhost')
- DB_NAME - Name of the database (default 'marker')
- DB_USER - Database username (default 'root')
- DB_PASSWORD - Database password (default 'marker')
- PASSPORT_SECRET - Key used for authentication (default 'marker')

## Starting the website

First if you don't have a MySQL database  docker/podman container set up run

    npm run dbmake

then start it

    npm run dbstart

and start the redis server we use for caching common pages

    npm run redisstart

Now you can start the back end server. It will automatically restart itself on when a file is changed

    npm run dev

and finally start the react development server

    npm run start --prefix client

That will open the home page in your default browser. To close the app shut down the servers in the reverse order.

## Building for production

Build the client to get served from the back end server

    npm install --prefix client
    npm run build --prefix client

or use the heroku postbuild script which will do the same

    npm run heroku-postbuild

then install server-side dependencies and start the server in production mode

    npm install
    env NODE_ENV=production npm run start

you can also set other environment variables to fit your environment

## License

Marker is licensed under the GNU GPL v3.0 license. That means you are free to modify and distribute the software for commercial purposes or use is privately, but you have to make the source code available and under the same license.

## Contributing

Feel free to contribute to the project either by submitting issues or making pull requests.

Thank you for the help :blush: