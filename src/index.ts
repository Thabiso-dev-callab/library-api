import app from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`Library API listening on http://localhost:${PORT}`);
});
"// Example comment for error-handling branch" 
