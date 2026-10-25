# Enerji bölmələri — Günəş, Külək, BESS, Lazer

**Branch:** `feature/energy-sections`

Sayta 4 yeni məhsul bölməsi əlavə olunur:

| Bölmə | `section` (API) | Sayt URL |
|---|---|---|
| Günəş enerjisi | `solar-energy` | `/{az,en,ru}/solar-energy` |
| Külək enerjisi | `wind-energy` | `/{az,en,ru}/wind-energy` |
| Enerji saxlama (BESS) | `energy-storage` | `/{az,en,ru}/energy-storage` |
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
| `src/constants/enums.ts` | `ProductEnum` / `CategoryEnum`-a 4 dəyər |
| `src/api/request.ts` | `getSectionProducts(section, …)` — ümumi məhsul sorğusu |
| `src/app/[locale]/components/sections/SectionListPage.tsx` | **Yeni.** Ortaq siyahı səhifəsi (SSR ilk səhifə, filtrlər, səhifələmə) |
| `src/app/[locale]/components/sections/SectionDetailPage.tsx` | **Yeni.** Ortaq detal səhifəsi: əsas xüsusiyyətlər, "Qiymət sorğu ilə", WhatsApp sorğu düyməsi, Product JSON-LD |
| `src/app/[locale]/{solar-energy,wind-energy,energy-storage,laser-equipment}/` | **Yeni.** 4 × (siyahı + detal) route — nazik wrapper-lər |
| `src/app/[locale]/components/home/EnergySolutions.tsx` | **Yeni.** Ana səhifədə 4 bölməyə keçid kartları |
| `src/config/navigation.ts` | Menyuda "Enerji Həlləri" açılan bölməsi (3 dil) |
| `components/common/ProductItem.tsx` | Enerji məhsullarına düzgün link; kartda ilk qrupun ilk 3 xüsusiyyəti; qiymət yoxdursa "Qiymət sorğu ilə" |
| `components/products/ProductsSection.tsx` | Enerji bölmələri üçün sorğu və başlıq |
| `components/common/Footer.tsx` | Məhsullar sütununa 4 bölmə |
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
| `pages/apps/elcar/products/<section>/` | **Yeni.** 4 × 3 səhifə (charging-stations səhifələrinin surəti) |
| `store/data.js` | `productSections` — kateqoriya, brend, xüsusiyyət formalarında bölmə seçimi |

Məhsul forması, cədvəl və filtrlər artıq `section` parametri ilə işləyən ortaq
komponentlərdir (`ElcarProductsForm`, `ElcarProductsDataTable`) — yeni kod tələb olunmur.

---

## Kontent üçün növbəti addımlar (admin paneldən)

1. **Xüsusiyyətlər** (Characteristics) — hər bölmə üçün, məsələn:
   - Günəş: Güc (W), Səmərəlilik (%), Panel növü, Ölçülər, Zəmanət
   - Külək: Nominal güc, Başlanğıc külək sürəti, Ox növü, Gərginlik
   - BESS: Tutum (kWh), Güc (kW), Kimya (LiFePO4), Dövr sayı, Gərginlik
   - Lazer: Lazer gücü, Mənbə, İş sahəsi, Maks. qalınlıq
2. **Brendlər** — brend formasında yeni bölmələri seçin
3. **Məhsullar** — hər bölmədə "Əlavə et"
4. **Bloq** — hər bölmə üçün 1–2 məqalə (SEO üçün)

Yeni bölmə əlavə etmək lazım olsa: `site/src/config/sections.ts`,
`site/locales/*.json` (`sections.<key>`), `site/src/app/[locale]/<key>/` route-u,
`admin/structure/pages.json` + `admin/pages/...` və `admin/store/data.js`.
