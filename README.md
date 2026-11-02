# GazeVeil website

Two static pages, plain HTML and CSS. No build step, no JavaScript, no cookies, no forms.

```
index.html          gazeveil.com
method/index.html   gazeveil.com/method   (the link printed in every report)
style.css
CNAME               gazeveil.com
```

To look at it on your machine (this only serves files from this folder):

```
cd website
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish it: use a separate small repo

GitHub Pages can publish only the root of a branch or a folder called `docs/`. It
cannot publish a `website/` subfolder, and this repo's `docs/` already holds the
methodology page. This repo also holds your scanner code and grant files. So the
simplest and safest way is a separate public repo that holds only these files.

### 1. Create the repo and push the files

Run these from the project folder. Use the GitHub account you want to own the site;
the commands below assume `Sntrix12`.

```
cp -R website /tmp/gazeveil-site
cd /tmp/gazeveil-site
rm -rf screenshots README.md
git init -b main
git add .
git commit -m "GazeVeil website"
gh repo create Sntrix12/gazeveil-site --public --source=. --push
```

(No `gh`? Create an empty public repo called `gazeveil-site` on GitHub's website, then
run the `git remote add origin ...` line GitHub shows you for it, followed by
`git push -u origin main`.)

### 2. Turn on Pages

On GitHub's website, open the `gazeveil-site` repo, then **Settings > Pages**.

- **Source:** Deploy from a branch
- **Branch:** `main`, folder `/ (root)`
- **Custom domain:** `gazeveil.com`, then Save. (The `CNAME` file already says this.)

### 3. Add the DNS records at GoDaddy

In GoDaddy: **My Products > gazeveil.com > DNS > Manage DNS.** Delete any existing
`A` record for `@` that points at a GoDaddy parking page, and any `www` record, then add:

| Type  | Name  | Value                  | TTL     |
|-------|-------|------------------------|---------|
| A     | `@`   | `185.199.108.153`      | default |
| A     | `@`   | `185.199.109.153`      | default |
| A     | `@`   | `185.199.110.153`      | default |
| A     | `@`   | `185.199.111.153`      | default |
| CNAME | `www` | `Sntrix12` + `.github.io` | default |

The CNAME value is your GitHub username followed by GitHub's Pages suffix (the
username, then a dot, `github`, a dot, `io`), with no repo name and no `https://`. Check the four addresses against GitHub's own list before you
save, in case they change: search "GitHub Pages apex domain A records" in GitHub Docs.

### 4. Wait, then turn on HTTPS

DNS can take from a few minutes to a few hours. When the Pages settings page shows
"DNS check successful", tick **Enforce HTTPS**. If the box is greyed out, wait
until GitHub has issued the certificate (up to an hour) and reload.

### 5. Check it

Open `https://gazeveil.com` and `https://gazeveil.com/method`. The second address is
the one in `gazeveil.toml` (`methodology_url`), so reports point at it.

## Updating the site later

Edit the files in the `gazeveil-site` repo, commit and push. Pages republishes in a
minute or so. If you change the text here first, copy it across the same way as in step 1.
