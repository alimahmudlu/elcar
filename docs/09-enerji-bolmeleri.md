# Enerji bölmələri — Günəş, Külək, BESS, İnvertorlar, Lazer

**Branch:** `feature/energy-sections`

Sayta 5 yeni məhsul bölməsi əlavə olunur:

| Bölmə | `section` (API) | Sayt URL |
|---|---|---|
| Günəş enerjisi | `solar-energy` | `/{az,en,ru}/solar-energy` |
| Külək enerjisi | `wind-energy` | `/{az,en,ru}/wind-energy` |
| Enerji saxlama (BESS) | `energy-storage` | `/{az,en,ru}/energy-storage` |
| İnvertorlar | `inverters` | `/{az,en,ru}/inverters` |
| Lazer avadanlıqları | `laser-equipment` | `/{az,en,ru}/laser-equipment` |

API-də kod dəyişikliyi **yoxdur**: məhsul, kateqoriya, brend, xüsusiyyət
modellərində `section` sərbəst mətn sahəsidir, yeni dəyərləri olduğu kimi qəbul edir.

---

## Deploy ardıcıllığı

1. **Baza** (backup-dan sonra):
   ```bash
   mongosh "<MONGO_URI>" db/migrations/2026-10-energy-sections.mongosh.js
   ```
   - admin/user rollarına yeni bölmələr üçün hüquqlar əlavə edir
     (`charging-stations` hüquqları kopyalanır; root/owner onsuz da hər şeyə malikdir)
   - hər bölmə üçün başlanğıc kateqoriyalar yaradır (AZ/EN/RU)
   - təkrar işə salmaq təhlükəsizdir (idempotent)
2. **Admin** — `deploy-admin.sh` (Nuxt build)
3. **Sayt** — `deploy-site.sh` (Next build)

Baza addımı admin-dən əvvəl olmalıdır, əks halda admin/user rolundakı
istifadəçilər yeni menyu bəndlərində 404 görəcək.

---

## Sayt (`site/`)

| Fayl | Dəyişiklik |
|---|---|
| `src/config/sections.ts` | **Yeni.** Enerji bölmələrinin siyahısı — yeni bölmə üçün tək mənbə |
| `src/constants/enums.ts` | `ProductEnum` / `CategoryEnum`-a 5 dəyər |
| `src/api/request.ts` | `getSectionProducts(section, …)` — ümumi məhsul sorğusu |
| `src/app/[locale]/components/sections/SectionListPage.tsx` | **Yeni.** Ortaq siyahı səhifəsi (SSR ilk səhifə, filtrlər, səhifələmə) |
| `src/app/[locale]/components/sections/SectionDetailPage.tsx` | **Yeni.** Ortaq detal səhifəsi: əsas xüsusiyyətlər, "Qiymət sorğu ilə", WhatsApp sorğu düyməsi, Product JSON-LD |
| `src/app/[locale]/{solar-energy,wind-energy,energy-storage,inverters,laser-equipment}/` | **Yeni.** 5 × (siyahı + detal) route — nazik wrapper-lər |
| `src/app/[locale]/components/home/EnergySolutions.tsx` | **Yeni.** Ana səhifədə 4 enerji bölməsinə keçid kartları (lazer menyuda ayrıca baş bölmədir) |
| `src/config/navigation.ts` | Menyuda "Enerji Həlləri" açılan bölməsi (3 dil) |
| `components/common/ProductItem.tsx` | Enerji məhsullarına düzgün link; kartda ilk qrupun ilk 3 xüsusiyyəti; qiymət yoxdursa "Qiymət sorğu ilə" |
| `components/products/ProductsSection.tsx` | Enerji bölmələri üçün sorğu və başlıq |
| `components/common/Footer.tsx` | Məhsullar sütununa 5 bölmə |
| `src/app/sitemap.ts` | Yeni statik səhifələr + enerji məhsullarının düzgün URL-i |
| `locales/{az,en,ru}.json` | `sections.*` mətnləri (başlıq, təsvir, SEO title/description); footer təsviri genişləndirildi |

### Yol üstü düzəldilən bug-lar

- **`DetailSection.tsx`** — xüsusiyyət qrupunda şəkil olmadıqda (`image: []`)
  `group.image[0].src` səhifəni tam çökdürürdü (client-side exception).
  İndi şəkilsiz qrup sadəcə şəkilsiz göstərilir. Bu, aksesuar səhifələrinə də aiddir.
- **`MobileSidebar.tsx`** — mobil menyuda alt menyu açmaq mümkün deyildi:
  ana bəndə toxunanda menyu bağlanıb ana səhifəyə keçirdi və bütün alt menyular
  bir ortaq state-ə bağlı idi. İndi hər alt menyu ayrıca açılır.

### Məhsul kartında xüsusiyyətlər

Enerji məhsullarında xüsusiyyət açarları fərqlidir (güc, tutum, səmərəlilik…),
ona görə kart və detal səhifəsi **birinci xüsusiyyət qrupunun ilk görünən
xüsusiyyətlərini** göstərir. Admin-də ən vacib 3–4 göstəricini birinci qrupun
əvvəlinə qoymaq kifayətdir (məs. panel üçün: Güc, Səmərəlilik, Növ).

### Qiymətsiz məhsullar

Qiymət sahəsi boş və ya 0 olduqda kartda və detal səhifəsində
"Qiymət sorğu ilə" göstərilir. Sənaye BESS, lazer dəzgahları kimi layihə
əsaslı məhsullar üçün nəzərdə tutulub.

---

## Admin (`admin/`)

| Fayl | Dəyişiklik |
|---|---|
| `structure/pages.json` | Hər bölmə üçün 3 səhifə (siyahı / əlavə et / redaktə), "ELCAR" altında, öz ikonu ilə |
| `pages/apps/elcar/products/<section>/` | **Yeni.** 5 × 3 səhifə (charging-stations səhifələrinin surəti) |
| `store/data.js` | `productSections` — kateqoriya, brend, xüsusiyyət formalarında bölmə seçimi |

Məhsul forması, cədvəl və filtrlər artıq `section` parametri ilə işləyən ortaq
komponentlərdir (`ElcarProductsForm`, `ElcarProductsDataTable`) — yeni kod tələb olunmur.

---

## Kontent üçün növbəti addımlar (admin paneldən)

1. **Xüsusiyyətlər** (Characteristics) — hər bölmə üçün, məsələn:
   - Günəş: Güc (W), Səmərəlilik (%), Panel növü, Ölçülər, Zəmanət
   - Külək: Nominal güc, Başlanğıc külək sürəti, Ox növü, Gərginlik
   - BESS: Tutum (kWh), Güc (kW), Kimya (LiFePO4), Dövr sayı, Gərginlik
   - İnvertor: Nominal güc (kW), Növ (hibrid/şəbəkə/avtonom), Faza, MPPT sayı, Maks. DC gərginlik, Səmərəlilik (%)
   - Lazer: Lazer gücü, Mənbə, İş sahəsi, Maks. qalınlıq
2. **Brendlər** — brend formasında yeni bölmələri seçin
3. **Məhsullar** — hər bölmədə "Əlavə et"
4. **Bloq** — hər bölmə üçün 1–2 məqalə (SEO üçün)

Yeni bölmə əlavə etmək lazım olsa: `site/src/config/sections.ts`,
`site/locales/*.json` (`sections.<key>`), `site/src/app/[locale]/<key>/` route-u,
`admin/structure/pages.json` + `admin/pages/...` və `admin/store/data.js`.

---

## Əlavə funksiyalar (eyni branch)

| Funksiya | Harada | Qeyd |
|---|---|---|
| Axtarış | Header-də 🔍, `/{az,en,ru}/search?q=` | API: `products?q=` — hər söz məhsul adında olmalıdır. Nəticə səhifəsi `noindex`. |
| Qiymət və model filtrləri | Bütün siyahı səhifələri | Qiymət filtri API-də heç vaxt nəticə qaytarmırdı (əlavə `discountedPrice` şərti) — düzəldildi. |
| Xüsusiyyət filtrləri | Admin → Xüsusiyyətlər | Kod dəyişikliyi lazım deyil: xüsusiyyətdə **showOnFilter** işarələnəndə filtr kimi görünür. |
| SKU, zəmanət, sənədlər | Admin məhsul forması → saytda "Əsas məlumatlar" və "Sənədlər" | Sənədlər media kitabxanasından seçilir (PDF dəstəklənir). Ölçü/çəki xüsusiyyətlərdə qalır. |
| Müqayisə | Kartda və detalda ⇄ düyməsi, `/compare?ids=` | Maks. 4 məhsul, brauzerdə saxlanılır, link paylaşıla bilir. |
| Günəş hesablayıcısı | `/{az,en,ru}/solar-calculator` | İlkin ölçü (qiymətsiz). Sorğu forması "Mesajlar"a düşür. |
| Rəylər | Detal səhifəsi; Admin → Rəylər | Hər rəy "gözləmədə" yaranır, təsdiqdən sonra görünür və reytinqə düşür. |
| Hazır dəstlər | Admin məhsul forması → "Dəstin tərkibi" | Dəst adi məhsuldur (məs. Günəş → "Hazır dəstlər"); tərkibi və qənaət detalda göstərilir. |

Düzəldilən köhnə xətalar: Azərbaycan/kiril hərfli adlarla mesaj göndərmək olmurdu,
xətada isə forma "göndərildi" göstərirdi; JSON-LD `<script>` XSS; sabit 5 ulduz.

### Deploy ardıcıllığı (bu funksiyalar üçün)

1. **API** əvvəl deploy olunur (yeni `reviews` xidməti, `q`/`_id` filtrləri, yeni sahələr).
   API deploy olunmayınca axtarış 0 nəticə, müqayisə boş, rəylər boş göstərir.
2. **Miqrasiya**: `mongosh "<MONGO_URI>" db/migrations/2026-10-energy-sections.mongosh.js`
   (admin/user rollarına `reviews` və enerji bölmələri hüquqları; kateqoriyalar).
3. **Admin**, sonra **sayt**.

### Spam qoruması və bildirişlər

- Saytdan bir IP-dən 10 dəqiqədə ən çox **5 mesaj/təklif sorğusu** və **3 rəy** qəbul olunur
  (artıq olanlar 429 alır). Rəydə əlavə olaraq bot tələsi var.
- Limit üçün API müştərinin IP-sini nginx-in `X-Real-IP` başlığından oxuyur. **Serverdə API
  nginx konfiqurasiyasına bu sətir əlavə edilməlidir** (repodakı `nginx_confs/nginx_elcar-api.conf.txt`
  artıq yenilənib):
  `proxy_set_header X-Real-IP $remote_addr;` → sonra `sudo nginx -t && sudo systemctl reload nginx`.
  Başlıq olmasa IP-si bilinməyən bütün sorğular bir ortaq limitlə sayılır (20 qat yüksək:
  100 mesaj / 60 rəy / 10 dəq) və API logunda xəbərdarlıq çıxır. Limit REST və Socket.IO
  üçün eyni işləyir.
- Mesaj bildirişləri `NOTIFY_EMAIL` ünvanına gedir (API `.env`), boşdursa `info@elcar.az`.
  Əvvəl şəxsi ünvana gedirdi.

### Açıq qalan məsələlər

- Limit yaddaşda saxlanılır — API yenidən başlayanda sıfırlanır və yalnız bir API prosesi
  üçün düzgündür (hazırkı PM2 fork rejimi). Bir neçə nüsxəyə keçilərsə Redis lazım olacaq.
- Yeni rəy gələndə e-poçt bildirişi yoxdur — rəylər admin → Rəylər-dən izlənilir.
- Admin dəyişiklikləri (forma sahələri, Rəylər səhifəsi) lokal olaraq işə salınıb
  yoxlanılmayıb — API və baza olmadan admin açılmır.

> Developer üçün addım-addım deploy bələdçisi: [10-deploy-energy-sections.md](10-deploy-energy-sections.md)
