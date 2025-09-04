# VAM — Next.js + Tailwind **(Fixed & Clarified)**

**Short summary of the problem you hit:**
- The error `SyntaxError: /index.tsx: Unexpected token (1:0)` (and the earlier `decorators` message) almost always happens when a file that the JS/TS parser expects to be JavaScript/TypeScript contains **CSS** or **`@tailwind` directives** (for example because CSS was accidentally pasted into `index.tsx`, `index.js`, or another `.tsx/.jsx` file). The JS parser sees the `@` at the start of a line and treats it as invalid JS (or experimental decorator syntax), causing the syntax error.

**What this document does now:**
- Provides a clear, **file-by-file** working example using Next.js with the classic `pages/` router (this aligns with an `index.tsx` file name).
- Shows the correct place for `@tailwind` (in `styles/globals.css` only).
- Adds a simple one-file fallback (plain HTML) so you can verify the layout immediately without Tailwind or Node if you're blocked.
- Adds a short test checklist (these act as simple "test cases").

---

## Project layout (use this exact structure)
```
vam-website/
├─ pages/
│  ├─ _app.js           <-- imports globals.css (or _app.tsx for TypeScript)
│  └─ index.js          <-- homepage (or index.tsx for TypeScript)
├─ public/
├─ styles/
│  └─ globals.css       <-- put @tailwind directives here ONLY
├─ postcss.config.js
├─ tailwind.config.js
├─ package.json
```

---

## Why this fixes your error
- **Rule:** `@tailwind` and other CSS must live in a `.css` file. Never paste `@tailwind` lines into `.js`/`.ts`/`.tsx` files. If the bundler mistakenly loads `styles/globals.css` as JS (or you accidentally paste it into a JS file), you'll get the Unexpected token / decorators errors.
- By using `pages/_app.js` (or `_app.tsx`) you centralize the single import of `styles/globals.css`, which avoids accidental duplication/pasting into component files.

---

## Files (copy into your project as separate files)

### `package.json`
```json
{
  "name": "vam-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

---

### `postcss.config.js`
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

---

### `tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: []
};
```

---

### `pages/_app.js` (JavaScript example — **import CSS here only**)
```js
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

> If you use TypeScript, name it `pages/_app.tsx` and use:
> ```ts
> import '../styles/globals.css';
> import type { AppProps } from 'next/app';
>
> export default function MyApp({ Component, pageProps }: AppProps) {
>   return <Component {...pageProps} />;
> }
> ```

---

### `pages/index.js` (homepage)
```js
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex flex-col justify-center items-center flex-1 text-center px-6">
        <h1 className="text-7xl font-bold tracking-widest">VAM</h1>
        <p className="mt-6 text-xl max-w-2xl">Designs that Speak. Creativity that Lasts.</p>
        <div className="mt-8 flex gap-6">
          <a href="#portfolio" className="px-8 py-3 bg-white text-black rounded-2xl font-semibold">View Portfolio</a>
          <a href="#contact" className="px-8 py-3 border border-white rounded-2xl font-semibold">Hire Me</a>
        </div>
      </section>

      <section id="about" className="py-24 bg-white text-black text-center px-6">
        <h2 className="text-5xl font-bold mb-8">About Me</h2>
        <p className="max-w-3xl mx-auto text-lg">I’m Mohammad, the creative mind behind <span className="font-bold">VAM</span>. I craft unique visuals that help brands stand out, connect, and grow.</p>
      </section>

      <section id="portfolio" className="py-24 text-center px-6">
        <h2 className="text-5xl font-bold mb-12">Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1,2,3,4,5,6].map(item => (
            <div key={item} className="bg-gray-800 h-64 rounded-2xl shadow-lg overflow-hidden">
              <img src={`https://via.placeholder.com/600x400?text=Project+${item}`} alt={`Project ${item}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="py-24 text-center px-6">
        <h2 className="text-5xl font-bold mb-8">Let’s Create Something Amazing</h2>
        <p className="mb-6 text-lg">Call me: <a href="tel:+97636689290" className="font-semibold">+976 36689290</a></p>
        <form className="w-full max-w-lg mx-auto space-y-4">
          <input type="text" placeholder="Your Name" className="w-full border p-3 rounded" />
          <input type="email" placeholder="Your Email" className="w-full border p-3 rounded" />
          <textarea placeholder="Your Message" className="w-full border p-3 rounded" />
          <button className="w-full bg-white text-black py-3 rounded-2xl font-semibold hover:bg-gray-200">Send Message</button>
        </form>
      </section>

      <footer className="py-6 bg-black text-center border-t border-gray-800"><p className="text-sm">© 2025 VAM. All Rights Reserved.</p></footer>
    </div>
  );
}
```

> If your project is TypeScript and the file is `index.tsx`, use the exact same code but save as `pages/index.tsx`. **Do not** import or paste any CSS text into this file.

---

### `styles/globals.css` **(VERY IMPORTANT — must be a .css file!)**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
```

**Make absolutely sure:**
- This content lives in `styles/globals.css` and not in any `.js`, `.ts`, `.jsx`, `.tsx` file.
- Your import of this CSS should only occur once in `pages/_app.js` or the app-level layout — do not import the CSS in `pages/index.js` or other components.

---

## Quick one-file fallback (no Node, no Tailwind) — useful if you want to *confirm* JS tooling isn't the issue
Create a file `fallback.html` and open it in the browser directly.
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>VAM - Fallback</title>
    <style>
      html,body{height:100%;margin:0;font-family:Arial,Helvetica,sans-serif}
      .center{display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;background:black;color:white}
      .btn{background:white;color:black;padding:12px 24px;border-radius:18px;margin:8px;text-decoration:none}
    </style>
  </head>
  <body>
    <div class="center">
      <h1 style="font-size:64px;margin:0">VAM</h1>
      <p style="max-width:600px;text-align:center">Designs that Speak. Creativity that Lasts.</p>
      <div style="margin-top:20px">
        <a class="btn" href="#">View Portfolio</a>
        <a class="btn" href="#">Hire Me</a>
      </div>
    </div>
  </body>
</html>
```

Open `fallback.html` in your browser — if it displays, your system can render the layout without any build tooling.

---

## Test checklist (simple test cases)
1. **Start dev server**: `npm run dev` → expected: Next starts without syntax errors and you can access `http://localhost:3000`.
2. **Index file parse**: If a syntax error points to `index.tsx` (or `index.js`), open that file and ensure the first lines are JavaScript/TypeScript code (not CSS). Expected: the file begins with `import` or `export` or `function`, not `@tailwind`.
3. **CSS position test**: Confirm `styles/globals.css` contains `@tailwind` directives and that `_app.js` imports it. Expected: directives are only in `styles/globals.css`, import only in `_app.js`.
4. **Fallback test**: Open `fallback.html`. Expected: simple VAM page renders in browser; this confirms the visual design works without Node.

---

## Common fixes when you still see `Unexpected token` or `decorators` errors
- You pasted `@tailwind` (or any CSS) into a `.js` / `.ts` / `.tsx` file — move it to `styles/globals.css`.
- You created a file called `index.tsx` but accidentally saved CSS to it. Open the file and check the first 10 lines.
- If using an editor that auto-inserts file content during copy/paste, be careful to create the right file type before pasting.

---

## Still failing? I need two things from you
1. **Exact file path** shown in the error stack trace (for example: `/home/mohammad/projects/vam/pages/index.tsx` or `C:\work\vam\index.tsx`).
2. **Paste the first 12 lines** of that file here — do not paste the full file if it contains sensitive data; first 12 lines are enough to confirm whether CSS got pasted into a JS file.

Also tell me: **what do you expect the page to display** when the error is fixed? (e.g., "I expect to see the VAM hero with two buttons and the phone number visible in the contact section").

Once you paste the file lines, I will point out exactly what to change and (if needed) update the project files for you.

---

If you want I can also:
- Create a small GitHub repo with these files and a deploy-ready Vercel config.
- Or convert the project to the `app/` router pattern if you prefer that structure.



