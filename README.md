# CoBuilt Solutions website — setup guide

Your website now has two parts:

| | Address | Who uses it |
|---|---|---|
| **Public website** | `https://www.cobuiltsolutions.com` | Your customers |
| **Admin panel** | `https://www.cobuiltsolutions.com/admin` | Only you (needs your access key) |

In the admin panel you change any text, number, list or picture and press **Publish**. Your changes are saved to GitHub, and Render puts them on the live website in about **1–2 minutes**. Every publish is kept in history, so nothing is ever lost.

---

## Step 1 — Put the new files on GitHub (one time)

1. Unzip **CoBuilt_Website_new.zip** on your computer.
2. Open <https://github.com/africatechnologyet/CoBuilt_Website> and sign in.
3. Click **Add file → Upload files**.
4. Open the unzipped folder, select **everything inside it** (`admin`, `assets`, `content.json`, `index.html`, `README.md`, `robots.txt`, `sitemap.xml`) and drag it all onto the GitHub page.
5. Wait until all files finish uploading, then click **Commit changes**.

The old `index.html`, `style.css` and `script.js` are replaced automatically. The old file `assets/img/hero/hero-bg.jpg` is no longer used; you can leave it or delete it.

## Step 2 — Check Render (one time)

Open your site in the Render dashboard and check **Settings**:

- **Type:** Static Site
- **Branch:** `main`
- **Build command:** empty
- **Publish directory:** `.` (or empty)
- **Auto-Deploy:** Yes

After Step 1, Render rebuilds the site by itself. Open your website — you should see the new dark "READY MIX CONCRETE" design.

## Step 3 — Create your admin access key (one time, 2 minutes)

The key is like a password that lets the admin panel save changes to your website.

1. On GitHub, click your profile picture (top right) → **Settings**.
2. At the bottom of the left menu: **Developer settings → Personal access tokens → Fine-grained tokens**.
3. Click **Generate new token** and fill in:
   - **Token name:** `CoBuilt Admin`
   - **Expiration:** 1 year (GitHub will email you before it expires)
   - **Resource owner:** `africatechnologyet`
   - **Repository access:** *Only select repositories* → `CoBuilt_Website`
   - **Permissions → Repository permissions → Contents:** *Read and write*
4. Click **Generate token** and **copy** it (it starts with `github_pat_`). GitHub shows it only once.

> If `africatechnologyet` is an organization and you don't see it as an owner, an organization admin must allow fine-grained tokens under the organization's **Settings → Personal access tokens**.

## Step 4 — Sign in to the admin panel

1. Go to `https://www.cobuiltsolutions.com/admin`
2. Paste your access key and press **Sign in**.
3. Leave **Keep me signed in on this device** ticked on your own computer or phone.

---

## Using the admin panel

- **Choose a section** on the left (on a phone: the *Section* menu at the top).
- **Change text** by typing in the boxes.
- **Change a picture:** press **Replace picture** (or drag a photo onto it). Big photos are resized automatically.
- **Lists** (services, grades, testimonials, logos…): use **+ Add**, **↑ ↓** to reorder, **Remove** to delete.
- **Hide a section:** untick *Show this section on the website*.
- **Preview** shows your changes before anyone else sees them.
- **Publish** puts them on the live site (about 1–2 minutes). Shortcut: Ctrl + S.
- **⋯ menu:** discard unpublished changes, see publish history, sign out.

Your unpublished changes are kept on your device, so you can close the page and continue later.

## Quote requests

When a customer fills in the quote form, it opens **WhatsApp** (to the number set in *Contact & quote form*) or their **email app** with the request already written. Change the WhatsApp number or email in the admin panel any time.

## Keep it safe

- Never share your access key. Anyone with it can change the website.
- Lost a phone or laptop? On GitHub go to **Settings → Developer settings → Fine-grained tokens**, delete **CoBuilt Admin**, and create a new one.
- To undo a change: in the admin panel open **⋯ → Publish history**, or ask your developer to restore an earlier version from GitHub.

## Files (for developers)

```
index.html            public page (layout is built from content.json)
content.json          ALL texts, lists and picture paths — edited by the admin panel
assets/css/style.css  design
assets/js/script.js   page rendering + animations + quote form
assets/img/           pictures (new uploads go to assets/img/uploads/)
admin/                admin panel (static; publishes via the GitHub API)
```
