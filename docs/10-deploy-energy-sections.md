# ELCAR — Deploy: enerji bölmələri və yeni funksiyalar

**Branch:** `feature/energy-sections` · 19 commit · API + admin + sayt + DB miqrasiyası

> Bu sənəd public repo-dadır — şifrə, açar və ya şəxsi məlumat yoxdur.
> Ümumi deploy qaydaları və `.env` riskləri: [04-deploy-runbook.md](04-deploy-runbook.md).
> Funksiyaların təsviri: [09-enerji-bolmeleri.md](09-enerji-bolmeleri.md).

---

## 0. Developer üçün suallar (deploydan əvvəl cavab lazımdır)

1. Server kodu hansı repodan çəkir? Bu repoda (`alimahmudlu/elcar`) yalnız `master`
   və `feature/energy-sections` var; webhook isə `frontend` / `backend` / `admin`
   branch-larını gözləyir. Bu branch-lar başqa repodadırsa, `feature/energy-sections`
   ora köçürülməlidir.
2. Layihə qovluqları hələ də `/home/developer/projects/{site,api,admin}`-dir?
3. Serverdə `mongosh` (və ya `mongo`) qurulubmu? `MONGO_URI` / `DB` dəyəri `api/.env`-dədir?
4. API nginx konfiqurasiyasının serverdəki fayl adı (`/etc/nginx/sites-available/...`)?
5. Layihə sahibinin SSH açarının serverə əlavə edilməsi (açarı ayrıca göndərir).

---

## 1. Nə dəyişir

| Hissə | Dəyişiklik |
|---|---|
| **API** | Yeni `reviews` xidməti; `products`-da `q` (axtarış) və `_id` (müqayisə) filtrləri; yeni sahələr `sku`, `warranty`, `documents`, `rating`, `reviewCount`, `bundleItems`; qiymət filtri düzəlişi; mesajlarda Azərbaycan/kiril hərfli adlar; sayt formaları üçün rate limit; bildiriş ünvanı `NOTIFY_EMAIL` |
| **Admin** | Məhsul formasında SKU, zəmanət, sənədlər (PDF), dəstin tərkibi; yeni **Rəylər** səhifəsi; enerji bölmələri + invertorlar |
| **Sayt** | Enerji bölmələri, yeni menyu, axtarış, müqayisə, sənədlər, günəş hesablayıcısı (qənaət ilə), təklif sorğusu, rəylər, hazır dəstlər, XSS düzəlişi |
| **DB** | `db/migrations/2026-10-energy-sections.mongosh.js` — rol icazələri (enerji bölmələri, `reviews`) və başlanğıc kateqoriyalar. İdempotentdir. |
| **nginx (API)** | `proxy_set_header X-Real-IP $remote_addr;` |

---

## 2. Sıra vacibdir

API → miqrasiya → admin → sayt. API əvvəl getməsə saytda axtarış 0 nəticə,
müqayisə və rəylər boş görünür.

### 2.1. Yedək (BURAXMAYIN)

```bash
STAMP=$(date +%F-%H%M)
mkdir -p ~/backup-$STAMP && cd ~/backup-$STAMP
cp /home/developer/projects/site/.env  ./site.env
cp /home/developer/projects/api/.env   ./api.env
cp /home/developer/projects/admin/.env ./admin.env
mongodump --uri "$MONGO_URI" --out ./db      # bazanın tam yedəyi
for d in site api admin; do (cd /home/developer/projects/$d && git rev-parse HEAD) > ./$d.commit; done
```

### 2.2. API

```bash
cd /home/developer/projects/api
git fetch origin && git reset --hard origin/<api-branch>     # feature/energy-sections merge edilmiş
cp ~/backup-*/api.env .env                                   # .env silinibsə
echo 'NOTIFY_EMAIL=info@elcar.az' >> .env                    # istəyə bağlı — default da budur
npm ci
pm2 restart elcar-api
pm2 logs elcar-api --lines 30
```

### 2.3. nginx (API) — rate limit üçün

`location / { ... }` blokuna əlavə edin:

```nginx
proxy_set_header X-Real-IP $remote_addr;
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Bu sətir olmasa limit IP-yə görə işləmir: bütün sorğular bir ortaq limitə düşür
və API logunda `[rate-limit] client IP unknown` görünür.

### 2.4. DB miqrasiyası

Fayl repoda `db/migrations/2026-10-energy-sections.mongosh.js`-dədir. Serverdə
`db/` qovluğu yoxdursa, faylı repodan (GitHub → Raw) götürün:

```bash
mongosh "$MONGO_URI" /path/to/2026-10-energy-sections.mongosh.js
```

Gözlənilən çıxış: `module_permissions ...: +solar-energy, ...`, `+reviews`,
`categories: + ...` və sonda `Hazırdır.` Təkrar işə salmaq təhlükəsizdir.

### 2.5. Admin

```bash
cd /home/developer/projects/admin
git fetch origin && git reset --hard origin/<admin-branch>
cp ~/backup-*/admin.env .env      # silinibsə
npm ci && npm run build
pm2 restart elcar-admin
```

### 2.6. Sayt

```bash
cd /home/developer/projects/site
git fetch origin && git reset --hard origin/<site-branch>
cp ~/backup-*/site.env .env       # build-dən ƏVVƏL
npm ci && npm run build
pm2 restart elcar-site
```

> `rm -rf .next` lazım deyil, amma build qəribə xəta verərsə ilk yoxlanılacaq yer odur.

---

## 3. Deploydan sonra yoxlama

```bash
# Yeni səhifələr
for p in solar-energy wind-energy energy-storage inverters laser-equipment solar-calculator search compare; do
  echo -n "$p -> "; curl -s -o /dev/null -w "%{http_code}\n" "https://elcar.az/az/$p"
done                                                             # hamısı 200

# Axtarış API-si (0-dan çox nəticə)
curl -s "https://api.elcar.az/site/products?q=wallbox&\$limit=1" | grep -o '"total":[0-9]*'

# Rəylər API-si (boş siyahı, xəta yox)
curl -s "https://api.elcar.az/site/reviews?product=000000000000000000000000" | head -c 120

# Sitemap-də yeni səhifələr
curl -s https://elcar.az/sitemap.xml | grep -c "solar-calculator\|inverters"
```

Brauzerdə:

- [ ] Menyu: Şarj Stansiyaları ▾ (Bağlayıcılar daxil), Enerji Həlləri ▾ (+ İnvertorlar, Hesablayıcı), Lazer Avadanlıqları
- [ ] Header-də axtarış işləyir
- [ ] Siyahıda qiymət slayderi və model filtri nəticəni dəyişir
- [ ] Müqayisə: 2 məhsul seç → cədvəl açılır
- [ ] Hesablayıcı: Ev / Biznes / Sənaye üçün qənaət, örtmə slayderi
- [ ] Təklif sorğusu göndər → admin → Mesajlar-da görünür, `info@elcar.az`-a e-poçt gəlir
- [ ] Rəy yaz → admin → **Rəylər**-də "Gözləmədə" → Təsdiqlə → saytda görünür, reytinq yenilənir → test rəyini sil
- [ ] Admin məhsul formasında SKU, Zəmanət, Sənədlər, Dəstin tərkibi sahələri; köhnə məhsul açılıb saxlanılır
- [ ] Əlaqə formasında "Elçin Əliyev" kimi adla mesaj gedir
- [ ] API logunda `[rate-limit] client IP unknown` **yoxdur**

> Admin dəyişiklikləri lokal olaraq işə salınıb yoxlanılmayıb (API/baza tələb edir) —
> bu siyahının admin hissəsi deploydan sonra mütləq yoxlanmalıdır.

---

## 4. Geri qaytarma

```bash
# Kod
for d in site api admin; do
  cd /home/developer/projects/$d && git reset --hard $(cat ~/backup-*/$d.commit)
done
cd /home/developer/projects/site  && npm ci && npm run build && pm2 restart elcar-site
cd /home/developer/projects/admin && npm ci && npm run build && pm2 restart elcar-admin
cd /home/developer/projects/api   && npm ci && pm2 restart elcar-api

# Baza (yalnız miqrasiya problem yaradıbsa)
mongorestore --uri "$MONGO_URI" --drop ~/backup-*/db
```

Miqrasiya yalnız əlavə edir (icazə bölmələri, kateqoriyalar) — köhnə kod bu
əlavələrlə də işləyir, ona görə adətən bazanı geri qaytarmaq lazım olmur.

---

## 5. Bilinən məhdudiyyətlər

- Rate limit yaddaşdadır: API restartında sıfırlanır, bir API prosesi üçün düzgündür.
- Yeni rəy üçün e-poçt bildirişi yoxdur — admin → Rəylər-dən izlənilir.
- Hesablayıcıda tariflər `site/src/lib/solarCalc.ts`-dədir; dəyişəndə orada yenilənməlidir.
- Detal səhifəsi başqa dildəki slug ilə açılanda 404 əvəzinə 500 verir (əvvəldən var).
