import Koa, { Context } from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cors from '@koa/cors';

dotenv.config();

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 5000;

app.use(bodyParser());
app.use(cors());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

router.post('/sign-up', async (ctx: Context) => {
  const { username, email, password } = ctx.request.body as { username: string, email: string, password: string };
  if (!username || !email || !password) {
    ctx.status = 400;
    ctx.body = 'All fields are required';
    return;
  }

  try {
    console.log('Received data:', { username, email, password });
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    ctx.status = 201;
    ctx.body = 'User registered successfully';
  } catch (err) {
    console.error('Error registering user:', err);
    ctx.status = 500;
    ctx.body = 'Error registering user';
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
