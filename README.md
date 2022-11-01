# Usof backend

To start this solution you need to install MySQL database, execute db.sql, and make changes to config.json according to your database settings.

```sh
mysql -u{user} -p{password} < db.sql
```

After setting up database - install dependecies and run the application with:

```sh
npm install
npm start
```

You can get admin token with:

```sh
curl -d "login=admin&password=admin" -X POST http://localhost:8080/api/auth/login
```

Use it with your requests to endpoints that require authorization in request header `x-access-token`, query parameter `token`, or inside body using JSON field `token`.

> Note: email confirmation hasn't been implemented.

> Note: I had no time to write detailed documentation.

> Note: No more notes.

&copy; asamsonov
