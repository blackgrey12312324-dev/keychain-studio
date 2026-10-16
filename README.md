# resincraftcode — website

A small shop website for handmade resin keychains from Phuket, in English, Thai and Russian.

Built with plain HTML, CSS and JavaScript. Nothing to install.

## The pages

| Page | What it is |
|---|---|
| `index.html` | Home page: hero, alphabet, ready-made designs, three ways to order, styles, how it works, story, reviews, Instagram, FAQ |
| `design.html` | The keychain designer (drag items, paint, Big view, Surprise me, Start over) |
| `idea.html` | "Send us your idea": customers upload a photo or sketch and send it by DM |

Handy links into the designer:
- `design.html?letter=S` opens it with the letter S
- `design.html?preset=froggy-pond` opens a ready-made design to customise

## What to edit

| File | Edit it to change… |
|---|---|
| `config.js` | Prices, colours, add-ins, ready-made designs, **reviews**, Instagram and Facebook links, idea-page sizes |
| `i18n-site.js` | Words on the home page, menu and idea page (EN / TH / RU) |
| `i18n.js` | Words inside the designer (EN / TH / RU) |
| `style.css` | Colours and fonts (top of the file) |
| `images/` | Your photos |

You don't need to touch `core.js`, `site.js` or `app.js`.

## Add your reviews

Open `config.js` and find `const REVIEWS = [`. Add one line per review:

```js
const REVIEWS = [
  { name: "Mai", place: "Phuket", text: "So pretty, my friend loved it!" },
  { name: "Ilya", place: "Moscow", text: "Perfect souvenir.", text_ru: "Идеальный сувенир.", photo: "images/review-ilya.jpg" },
];
```

The "From our customers" section appears by itself as soon as the list has a review. Only use real reviews from real customers.

## Add your Facebook link

In `config.js`, replace the `facebook:` link with your real page link.

## Open it on your Mac

In VS Code, install **Live Server**, right-click `index.html` → **Open with Live Server**.

## Put changes online

GitHub Desktop → type a short message → **Commit to main** → **Push origin**. Your site updates in about a minute at `https://YOUR-USERNAME.github.io/keychain-studio/`.
