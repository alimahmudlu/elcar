# ELCAR — Deploy Runbook

**Branch:** `fix/security-and-seo` · 3 commit · 45 fayl

> ⚠️ Bu sənəd public repo-dadır, ona görə təhlükəsizlik detalları buraya
> daxil edilməyib. Serverin təmizlənməsi və açar rotasiyası üzrə tam
> təlimat **ayrıca, repo-dan kənar sənəddədir** — layihə sahibindən alın.

---

# 🔴 0. DEPLOY-DAN ƏVVƏL: MƏLUMAT İTKİSİ RİSKİ

## Problem

`.env` faylları əvvəl git-də **izlənirdi**. Təhlükəsizlik commit-i onları izləmədən çıxardı:

| Fayl | Köhnə commit-də | Yeni commit-də |
|---|---|---|
| `site/.env` | var | **yox** |
| `api/.env` | var | **yox** |
| `admin/.env` | var | **yox** |
| `site/.env.save`, `site/.env.swp` | var | **yox** |

`deploy-site.sh` isə bunu edir:

```bash
git reset --hard origin/frontend
```

`git reset --hard` hədəf commit-də olmayan **izlənən** faylları silir. Yəni deploy zamanı serverdəki `.env` faylları **silinəcək**.

## Nəticə

`site/.env` gedərsə `NEXT_PUBLIC_PROD_API_URL` təyin olunmur → bütün API sorğuları `undefined/products` ünvanına gedir → **sayt boş açılır**. `api/.env` gedərsə API ümumiyyətlə qalxmır.

## Həll — deploy-dan ƏVVƏL icra edin

```bash
mkdir -p ~/env-backup-$(date +%F) && cd ~/env-backup-$(date +%F)
cp /home/developer/projects/site/.env   ./site.env
cp /home/developer/projects/api/.env    ./api.env
cp /home/developer/projects/admin/.env  ./admin.env
ls -la
```

**Daha davamlı həll:** `.env` fayllarını layihə qovluğundan kənarda saxlayın (məsələn `/etc/elcar/site.env`) və pm2 `env_file` və ya symlink ilə bağlayın — bu halda `git reset --hard` onlara toxunmur.

---

# 1. HANSI BRANCH DEPLOY OLUNUR

`webhook-listener.js`-dəki uyğunluq:

| Push edilən branch | Skript | Qovluq |
|---|---|---|
| `refs/heads/frontend` | `deploy-site.sh` | site |
| `refs/heads/backend` | `deploy-api.sh` | api |
| `refs/heads/admin` | `deploy-admin.sh` | admin |

`fix/security-and-seo` **avtomatik deploy olunmayacaq** — `frontend`-ə merge edilməlidir.

`deploy-site.sh` `$BRANCH` arqumentini qəbul edir, amma daxildə həmişə `git reset --hard origin/frontend` icra edir.

---

# 2. PORT ZİDDİYYƏTİ — yoxlanmalıdır

| Mənbə | Port |
|---|---|
| `nginx_confs/elcar` → `proxy_pass` | **3113** |
| kök `ecosystem.config.js` (`elcar-site`) | **3113** ✅ |
| `site/ecosystem.config.js` | **3111** ⚠️ |
| `deploy-site.sh` → `pm2 start npm -- start` | PORT verilmir → default **3000** ⚠️ |

pm2 prosesi `deploy-site.sh` ilə yaradılıbsa, tətbiq 3000-də qalxıb, nginx 3113-ə gedir → **502**.

```bash
pm2 list
sudo ss -ltnp | grep -E '3000|3111|3113'
```

Düzgün variant:

```bash
cd /home/developer/projects
pm2 delete elcar-site 2>/dev/null || true
pm2 start ecosystem.config.js --only elcar-site
pm2 save
```

`site/ecosystem.config.js` (3111) istifadə olunmursa, silinməsi məsləhətdir.

---

# 3. DEPLOY ADDIMLARI

```bash
# 1. Kodu hazırla
git checkout frontend
git merge fix/security-and-seo

# 2. .env yedəyi — 0-cı bölmə. BURAXMAYIN.

# 3. site/.env-ə yeni dəyişənlər
#    NEXT_PUBLIC_SITE_URL=https://elcar.az
#    NEXT_PUBLIC_GTM_ID=
#    NEXT_PUBLIC_PIXEL_ID=

# 4. Push (webhook işə düşür)
git push origin frontend
```

və ya əl ilə:

```bash
cd /home/developer/projects/site
git fetch origin && git reset --hard origin/frontend
npm ci && npm run build
pm2 restart elcar-site
```

## `.env`-i geri qoyun

```bash
cp ~/env-backup-*/site.env /home/developer/projects/site/.env
# ... digərləri
```

> `npm run build` `.env`-i **build zamanı** oxuyur. Ona görə düzgün sıra:
> **.env bərpa → `npm run build` → pm2 restart**. Əks halda `NEXT_PUBLIC_*`
> dəyərləri bundle-a düşməyəcək.

### `GTM_ID` / `PIXEL_ID` haqqında

Faylda artıq var, amma **server tərəfdir**. Brauzerdə işləməsi üçün `NEXT_PUBLIC_` prefiksli variant lazımdır. Boş qalsa analitika sadəcə yüklənmir — xəta vermir.

---

# 4. BUILD-İN ŞƏBƏKƏ TƏLƏBİ

`next/font/google` səbəbindən build **fonts.googleapis.com** və **fonts.gstatic.com** ünvanlarına çıxış tələb edir:

```bash
curl -sI https://fonts.googleapis.com/css2?family=Roboto | head -1
```

Bağlıdırsa build `Failed to fetch font 'Roboto'` ilə dayanır. Ya çıxış açılmalı, ya da fontlar `public/fonts/`-ə endirilib `next/font/local` ilə istifadə edilməlidir.

---

# 5. DEPLOY-DAN SONRA YOXLAMA

```bash
curl -sI https://elcar.az/az | head -1                      # 200
curl -s  https://elcar.az/robots.txt
curl -s  https://elcar.az/sitemap.xml | head -20

# 301 yönləndirmə
curl -sI https://elcar.az/charging-stations | grep -i "^HTTP\|^location"

# SSR — məhsullar HTML-də görünməlidir
curl -s https://elcar.az/az/charging-stations | grep -c "WallBox"    # > 0

# Səhifələmə
curl -s https://elcar.az/az/charging-stations | grep -o 'page=2' | head -1

# 404
curl -sI https://elcar.az/az/bu-sehife-yoxdur | head -1      # 404

# Meta unikallığı
for p in "" "/charging-stations" "/blog" "/contact"; do
  echo -n "$p -> "; curl -s "https://elcar.az/az$p" | grep -o '<title>[^<]*' | head -1
done
```

Brauzerdə:

- [ ] EN və RU ana səhifədə "Russian / Российский" sözü yoxdur
- [ ] Breadcrumb linkləri düzgün gedir, sonuncu element link deyil
- [ ] Məhsul kartında ulduz görünmür (rəy yoxdur)
- [ ] Kartda "Çıxış gücü / Şəbəkə gərginliyi / Faza sayı" yazır
- [ ] Kateqoriya səhifəsinin altında nömrəli səhifələmə var
- [ ] WhatsApp düyməsi işləyir, telefon mobil cihazda zəng açır
- [ ] Bloqda "Bənzər məqalələr" tarixləri düzgündür

[Rich Results Test](https://search.google.com/test/rich-results) — `Product` və qiymət tanınmalıdır.

Sonra Google Search Console: sayt təsdiqi → sitemap göndərişi.

---

# 6. GERİ QAYTARMA

`deploy-site.sh` yalnız `node_modules` və `package.json` yedəkləyir — bu rollback deyil.

```bash
cd /home/developer/projects/site
git log --oneline -5
git reset --hard <əvvəlki-commit>
npm ci && npm run build
pm2 restart elcar-site
```

> ⚠️ Əvvəlki commit-ə qayıtmaq `site/package.json`-a **təhlükəsizlik commit-indən əvvəlki vəziyyəti** geri gətirir. Rollback edirsinizsə, `scripts` bölməsini yoxlayın və yalnız `next dev` / `next start` qaldığına əmin olun.

---

# 7. API TƏRƏFİNDƏ QALAN İŞLƏR

Frontend hazırdır, bu sahələr gözlənilir:

| Sahə | Frontend vəziyyəti |
|---|---|
| `slug: {az,en,ru}` | `lib/seo.ts`-də hreflang məntiqi hazır, bir sətirlə açılır |
| `metaTitle`, `metaDescription` | Hazırda `description` fallback işləyir |
| `rating`, `reviewCount` | Tip əlavə olunub, dəyər gələn kimi göstərilir |
| `inStock`, `sku`, `updatedAt` | `productJsonLd` və sitemap hazırdır |
| `status` / `active` | **Yoxdur** — istehsalı bitmiş məhsulu gizlətmək mümkün deyil |

---

# 8. QISA YOXLAMA SİYAHISI

- [ ] `.env` faylları yedəklənib
- [ ] `frontend` branch-inə merge edilib
- [ ] `NEXT_PUBLIC_SITE_URL` əlavə edilib
- [ ] Google Fonts çıxışı yoxlanılıb
- [ ] pm2 portu nginx ilə uyğundur (3113)
- [ ] `.env` bərpa edilib **və build təkrar icra olunub**
- [ ] 5-ci bölmədəki `curl` yoxlamaları keçib
- [ ] Ayrıca təhlükəsizlik sənədindəki addımlar icra olunub
- [ ] Search Console-a sitemap göndərilib
