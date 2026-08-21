# ELCAR — Developer üçün təhvil sənədi

**Branch:** `fix/security-and-seo` — 3 commit, 45 fayl, +1366/−461
**Vəziyyət:** `next build` tam keçir, `tsc --noEmit` təmizdir

> ⚠️ **Bu repo publikdir.** Təhlükəsizlik tapıntıları (server təmizliyi,
> açar rotasiyası) burada **yoxdur** — onlar ayrıca, repo-dan kənar
> sənəddədir. Layihə sahibindən alın və deploy-dan əvvəl icra edin.

---

## Sənədlər

| # | Fayl | Nə üçün |
|---|---|---|
| 01 | `01-BASLA-BURADAN.md` | Bu fayl |
| 02 | `02-sayt-auditi.md` | Problemlərin niyə problem olduğu, ölçülərlə |
| 04 | `04-deploy-runbook.md` | **Deploy edən üçün əsas sənəd** |
| 05 | `05-hazir-metnler.md` | Yeni səhifələrin mətnləri, schema nümunələri |
| 06 | `06-mehsul-tesvirleri-arxiv.md` | Məhsul təsvirləri (artıq CMS-ə yazılıb) |
| 08 | `08-diff-xulase.txt` | Dəyişən faylların siyahısı |

---

## Nə edilib

### Commit 1 — təhlükəsizlik

- `site/package.json`-dakı `scripts` təmizləndi
- `.env`, `.env.save`, `.env.swp` git izləməsindən çıxarıldı (diskdə qalır)
- `.env.example` şablonları + kök `.gitignore`

> Detallar ayrıca təhlükəsizlik sənədindədir.

### Commit 2 — metadata və SEO əsasları

| Problem | Həll |
|---|---|
| Bütün səhifələrdə `title=ELCAR`, `description=Elcar` | Hər səhifə tipinə `generateMetadata` |
| `robots.txt` və `sitemap.xml` boş | `app/robots.ts`, `app/sitemap.ts` (3 dil × məhsul + bloq + statik) |
| 404 səhifəsi yox — boş cavab | `app/[locale]/not-found.tsx` |
| `/az/about` → `/about` redirect (duplicate content) | `localePrefix: 'as-needed'` → `'always'` |
| Breadcrumb: 5 ayrı bug 10 səhifədə | Vahid `components/common/Breadcrumb.tsx` |
| EN/RU "Russian distributor / delivered to Russia" | → Azerbaijani / Azerbaijan |
| Struktur data yox | Organization, BreadcrumbList, Product+Offer |

### Commit 3 — SSR, UX və analitika

| Problem | Həll |
|---|---|
| Kateqoriya səhifələri server HTML-də boş | İlk səhifə server-render olunur |
| 34 məhsuldan 22-si kəşf edilə bilən linksiz | Real `<a href="?page=N">` səhifələmə |
| Mount-da eyni API sorğusu 3 dəfə | 1-ə endirildi |
| `localePrefix` dəyişikliyi köhnə linkləri sındırır | `next.config.ts`-də 301 redirect-lər |
| Kartda "Yanacaq növü / Maks. sürət / Maks. at gücü" | "Çıxış gücü / Şəbəkə gərginliyi / Faza sayı" |
| Rəy yoxdur, amma 5 dolu ulduz | Rəy olmadıqda gizlədilir |
| Siyahı bitəndə "Məhsul tapılmadı" | "Bütün məhsullar göstərildi" |
| Bloqda `dayjs(undefined)` → bugünkü tarix | Tarix yoxdursa render olunmur |
| Server HTML-də "Loading..." qalığı | Silindi |
| Telefon/e-poçt kliklənmir, footer boş, analitika yox | `tel:`/`mailto:`, WhatsApp, tam footer, GA4 + Pixel |

### Kod xaricində — CMS-ə yazılıb

- 20 şarj stansiyası + 7 aksesuarın təsviri, AZ + EN + RU (81 mətn). Təkrar təsvir sıfırdır
- `WallBox Type 2 22kW` konnektoru `GBT/AC` → `Type 2`
- 4 yeni bloq məqaləsi × 3 dil = 12 səhifə (bloq 2 → 6 məqalə)

---

## Nə qalıb

### API sahələri

`04-deploy-runbook.md`, 7-ci bölmə.

### Admin panelinin bug-ları (ayrıca Nuxt layihəsi)

1. Yan menyuda "ELCAR" bölməsi alt menyunu açmır, `/elcar` **404** verir — məhsullara menyudan çatmaq mümkün deyil (route-lar işləyir: `charging-stations`, `accessories`, `vehicles`, `blog`, `brands`, `categories`, `characteristics`, `orders`, `messages`)
2. Bloq formasında **şəkil seçəndən sonra dil seçicisi sıfırlanır**, lokal sahələr formadan yox olur → "Yadda saxla" heç bir xəta göstərmədən işləmir
3. Bloq formasında başlıq sahələrinin sırası dil panellərinə uyğun deyil — AZ paneldə ingilis başlığı görünür
4. Başlıq **rəqəmlə başlayanda kəsilir** ("7 kVt, yoxsa 22 kVt?" → yalnız "7" qalır)
5. `/elcar/settings` boş stub — ana səhifə mətnləri redaktə oluna bilmir
6. Bloq media seçicisi ayrı sahəyə bağlıdır — məhsulların 370 şəkli görünmür
7. Aksesuar xüsusiyyət sxemi pozulub: xüsusiyyətin **adı** "Type 2 to GB/T AC", **dəyəri** "3 Faza"

**Validasiya limitləri:** məhsul təsviri 130–170 simvol · bloq başlığı maks. 70 · bloq təsviri 130–170.

### Biznes qərarı tələb edən

| # | Sual |
|---|---|
| 1 | `ELCAR M4FDC` (14 670 AZN) istehsalı bitib, amma sifariş edilə bilir. Silinsin, yoxsa `status` sahəsi əlavə olunsun? |
| 2 | Qalan 33 məhsulun hamısı istehsaldadırmı? |
| 3 | İki ədəd `32A Charging Cable Type 1` var, hər ikisinin fotosunda **Type 2** konnektoru görünür. Adlar səhvdir, yoxsa fotolar? |
| 4 | Aksesuarların ölçüləri: kabel uzunluğu, IP dərəcəsi, çəki |
| 5 | Zəmanət müddəti, quraşdırma qiyməti, çatdırılma müddəti, taksit tərəfdaşı, VÖEN |

### Mətni hazır, tətbiq edilməmiş

`05-hazir-metnler.md`-də mətnlər var, [YOXLA] sahələri doldurulmalıdır:

- Yeni səhifələr: quraşdırma xidməti, FAQ, çatdırılma/ödəniş, zəmanət, qaytarma, B2B
- "Hansı şarj mənə uyğundur?" 3 addımlı seçim köməkçisi
- DC stansiyalar üçün ana səhifədə giriş nöqtəsi (6 məhsul, 2 994 – 14 670 AZN, hazırda siyahının sonunda qalır)
