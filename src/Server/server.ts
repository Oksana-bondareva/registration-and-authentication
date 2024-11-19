import Koa, { Context } from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cors from '@koa/cors';
import jwt from 'jsonwebtoken';

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

router.post('/sign-in', async (ctx: Context) => {
    const { email, password } = ctx.request.body as { email: string, password: string };
    if (!email || !password) {
      ctx.status = 400; ctx.body = 'All fields are required';
      return;
    } try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = (rows as any[])[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            ctx.status = 401;
            ctx.body = 'Invalid email or password';
            return; }
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
            ctx.status = 200; ctx.body = { token };
    } catch (err) {
        console.error('Error signing in:', err);
        ctx.status = 500; ctx.body = 'Error signing in';
    }
});

router.get('/users', async (ctx: Context) => {
    try { const [rows] = await db.query('SELECT id, username, email, status, last_login FROM users');
        ctx.body = rows;
    } catch (err) {
        console.error('Error fetching users:', err);
        ctx.status = 500;
        ctx.body = 'Error fetching users';
    }
});

router.put('/users/block', async (ctx: Context) => {
    const { ids } = ctx.request.body as { ids: number[] };
    try {
        await db.query('UPDATE users SET status = ? WHERE id IN (?)', ['blocked', ids]);
        ctx.status = 200;
        ctx.body = 'Users blocked successfully';
    } catch (err) {
        console.error('Error blocking users:', err);
        ctx.status = 500; ctx.body = 'Error blocking users';
    }
});

router.put('/users/unblock', async (ctx: Context) => {
    const { ids } = ctx.request.body as { ids: number[] };
    try {
        await db.query('UPDATE users SET status = ? WHERE id IN (?)', ['active', ids]);
        ctx.status = 200;
        ctx.body = 'Users unblocked successfully';
    } catch (err) {
        console.error('Error unblocking users:', err);
        ctx.status = 500; ctx.body = 'Error unblocking users';
    }
});

router.delete('/users/delete', async (ctx: Context) => {
    const { ids } = ctx.request.body as { ids: number[] };
    try {
        await db.query('DELETE FROM users WHERE id IN (?)', [ids]);
        ctx.status = 200;
        ctx.body = 'Users deleted successfully';
    } catch (err) {
        console.error('Error deleting users:', err);
        ctx.status = 500; ctx.body = 'Error deleting users';
    }
});

router.put('/users/block', async (ctx: Context) => {
    const { ids } = ctx.request.body as { ids: number[] };
    try {
        await db.query('UPDATE users SET status = ? WHERE id IN (?)', ['blocked', ids]);
        ctx.status = 200;
        ctx.body = 'Users blocked successfully';
    } catch (err) {
        console.error('Error blocking users:', err);
        ctx.status = 500;
        ctx.body = 'Error blocking users';
    }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
