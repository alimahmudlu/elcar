# elcar.az — Sayt Auditi

**Tarix:** 12 avqust 2026
**Metod:** AZ / EN / RU versiyalarında ana səhifə, kateqoriya, məhsul, bloq, haqqımızda və əlaqə səhifələrinin canlı yoxlanışı + texniki fayl yoxlaması (robots.txt, sitemap.xml, 404, dil marşrutlaşdırması)

---

## Ümumi qiymət

Sayt dizayn və məhsul spesifikasiyası baxımından yaxşı qurulub — WallBox məhsul səhifəsindəki güc, qoruma və ətraf mühit cədvəlləri rəqiblərdən güclüdür. Amma **satış və Google-dan gələn trafik demək olar ki, tam bloklanıb**: hər səhifənin başlığı eyni, sitemap yoxdur, kateqoriya səhifələri server tərəfdə boş qayıdır, EN və RU versiyalarında isə şirkət özünü "Rusiya distribütoru" adlandırır.

**Ən böyük 3 problem:**

1. EN/RU versiyalarda şirkət "Rusiya distribütoru" kimi təqdim olunur (şablondan qalma mətn)
2. Bütün səhifələrdə `title = ELCAR`, `description = Elcar` — Google-da fərqlənmək mümkün deyil
3. Kateqoriya səhifələri HTML-də "Məhsul tapılmadı" qaytarır — məhsullar yalnız brauzerdə yüklənir

---

# 1. KRİTİK — dərhal düzəldilməli (bu həftə)

### 1.1 EN və RU versiyalarda "Rusiya distribütoru" mətni

| Dil | Saytdakı mətn |
|---|---|
| EN | *"ELCAR - Russian distributor of electric cars … delivered to **Russia**"* |
| RU | *"ELCAR — **Российский** дистрибьютор электромобилей … доставляемые в **Россию**"* |
| AZ | "ELCAR — Azərbaycanda Elektrikli Avtomobillərin Distribüteri" ✅ |

Şablondan kopyalanıb və heç vaxt dəyişdirilməyib. Xarici və rusdilli müştəri üçün bu, saytın etibarlılığını sıfırlayır.
**Düzəliş:** hər iki mətni "Azerbaijan / Азербайджан" ilə əvəz et.

### 1.2 Bütün səhifələrdə eyni title və meta description

Yoxlanan **8 səhifənin hamısında** eyni: `<title>ELCAR</title>`, `<meta description="Elcar">`.
Google bunları "duplicate" sayır və heç birini normal sıralamır.

**Düzəliş şablonu:**

| Səhifə | Title | Description |
|---|---|---|
| Ana | Elektromobil Şarj Cihazları və Stansiyaları — ELCAR Bakı | Evə və biznesə 7kW–22kW EV şarj stansiyaları, Type 2 / GB/T kabel və adapterlər. Quraşdırma və zəmanət daxil. |
| Şarj stansiyaları | EV Şarj Stansiyaları — Qiymətlər və Modellər \| ELCAR | AC, DC və daşına bilən şarj stansiyaları. 7kW-dan 22kW-a qədər, Bakıda çatdırılma. |
| Məhsul | ELCAR WallBox Type 2 22kW — 810 AZN \| ELCAR | 3 fazalı 22kW WallBox, IP65, Wi-Fi + RFID. Zəmanətli, Bakıda quraşdırma ilə. |
| Bloq məqaləsi | {Məqalə adı} \| ELCAR Bloq | {Məqalənin ilk 150 simvolu} |

Qayda: title 50–60 simvol, description 140–160 simvol, hər səhifə unikal.

### 1.3 robots.txt və sitemap.xml boşdur

`elcar.az/robots.txt` və `elcar.az/sitemap.xml` — hər ikisi boş cavab qaytarır.
Google saytın strukturunu bilmir, yeni məhsullar aylarla indekslənmir.

**Düzəliş:**
- Next.js-də `app/sitemap.ts` ilə dinamik sitemap (bütün məhsul + bloq + kateqoriya URL-ləri, üç dildə)
- `robots.txt`-də `Sitemap: https://elcar.az/sitemap.xml` sətri
- Google Search Console-a sayt əlavə et və sitemap-ı göndər

### 1.4 Kateqoriya səhifələri server tərəfdə boşdur

`/charging-stations`, `/connectors-accessories`, `/electric-vehicles` — HTML-də **"Məhsul tapılmadı"** yazır. Məhsullar yalnız JavaScript işlədikdən sonra görünür.

Nəticə: Google bu səhifələri "boş" görür, sosial media paylaşımında məhsul görünmür, zəif internetdə istifadəçi boş səhifə görür.

**Düzəliş:** kateqoriya səhifələrində məhsul siyahısını server tərəfdə render et (SSR/ISR). Filtrlər client-side qala bilər.

#### Admin panelində yoxlandıqdan sonra (12.08.2026 — yenilənmiş)

Bazada **34 şarj stansiyası** var və hamısı saytda mövcuddur — sonsuz sürüşdürmə (infinite scroll) ilə yüklənir. Bu, problemi aradan qaldırmır, əksinə dəqiqləşdirir:

- Səhifə açılanda API-dən yalnız **12 məhsul** çəkilir (`site/products?...&$limit=12`), qalan **22-si** yalnız istifadəçi aşağı sürüşdürdükcə gəlir
- **Səhifələmə linkləri yoxdur** — Google sürüşdürmür. Deməli 22 məhsulun saytda heç bir kəşf edilə bilən daxili linki yoxdur və indekslənə bilməz
- Server HTML-də hələ də "Məhsul tapılmadı" yazır — JS işləməyəndə səhifə tamamilə boşdur

**Əlavə düzəliş:** infinite scroll saxlanılsa belə, altda nömrəli səhifələmə (`?page=2`) və ya bütün məhsulların linkini saxlayan blok olmalıdır. Ən təmiz variant — SSR + real səhifələmə.

**Bu yoxlama zamanı tapılan yeni bug-lar:**

| Problem | Detal |
|---|---|
| Siyahının sonunda "Məhsul tapılmadı" | Bütün 34 məhsul yükləndikdən sonra altda boş-nəticə mesajı görünür |
| Eyni API sorğusu 3 dəfə | Səhifə açılanda `site/products?section=charging-stations&$skip=0&$limit=12` üç dəfə göndərilir |
| Bütün məhsullarda 5 dolu ulduz | Rəy olmadığı halda hər kartda ★★★★★ göstərilir — yanıltıcıdır |
| `ELCAR M4FDC` natamam | Güc göstəricisi boşdur (`Yanacaq növü: -`) |

### 1.5 "Elektrikli Avtomobillər" bölməsi tamamilə boşdur

`/electric-vehicles` səhifəsi: filtrlər var (Audi, Tesla, BMW, BYD…), amma **"Məhsul tapılmadı"**. Üstəlik bu səhifə əsas menyuda yoxdur — yalnız daxili linklərdən tapılır.

Halbuki ana səhifə və Haqqımızda mətni şirkəti "elektromobil idxalçısı və distribütoru" kimi təqdim edir. Ziddiyyət var.

**Seçim et:**
- **A)** Avtomobil satırsınızsa → ən azı 6–10 model əlavə et, menyuya çıxar
- **B)** Satmırsınızsa → səhifəni gizlət və "Sifarişlə avtomobil gətirilməsi" adlı sadə xidmət səhifəsi ilə əvəz et

### 1.6 404 səhifəsi yoxdur

Mövcud olmayan URL boş səhifə qaytarır. İstifadəçi itir, Google isə "soft 404" qeyd edir.
**Düzəliş:** brendli 404 səhifəsi — "Səhifə tapılmadı" + populyar kateqoriyalara linklər + axtarış.

---

# 2. TEXNİKİ BUG-LAR

| # | Problem | Harada |
|---|---|---|
| 1 | Breadcrumb "Əlaqə" linki `/blog`-a gedir | `/az/contact` |
| 2 | Breadcrumb "Yükləmə Stansiyaları" linki `/electric-vehicles`-ə gedir | `/az/charging-stations`, məhsul səhifələri |
| 3 | Breadcrumb linklərində dil prefiksi yoxdur (`/about`, `/blog`) — istifadəçi AZ-dən çıxıb default dilə düşür | Bütün səhifələr |
| 4 | `/az/about` → `/about`-a redirect olunur; dil prefiksi URL-də saxlanmır → canonical qarışıqlığı | Bütün səhifələr |
| 5 | Bloq məqaləsinin breadcrumb-ında sonuncu element (aktiv səhifə) yenə `/blog`-a link olub | Bloq məqalələri |
| 6 | Məhsul səhifəsinin altında "Loading..." mətni qalıb | `/charging-stations/...` |
| 7 | Əlaqəli məqalə tarixi "12 avqust 2026" (bugünkü tarix) göstərir — real dərc tarixi deyil | Bloq |
| 8 | `hreflang` etiketləri görünmür — Google AZ/EN/RU versiyalarını əlaqələndirə bilmir | Bütün səhifələr |

---

# 3. MƏZMUN SƏHVLƏRİ

### 3.1 Ana səhifədə səhv məhsul etiketləri

Ana səhifə məhsul kartlarında avtomobil şablonundan qalma etiketlər:

```
Yanacaq növü  → 22 kW     (olmalı: Çıxış gücü)
Maks. sürət   → 380 V     (olmalı: Güc sərfiyyatı)
Maks. at gücü → 3 Faza    (olmalı: Faza sayı)
```

Bir şarj cihazının "yanacaq növü 22 kW" olması ciddi görünmür.

### 3.2 Səhv spesifikasiya

**ELCAR WallBox Type 2 22kW** məhsul səhifəsində `Bağlayıcı növü: GBT/AC` yazılıb — halbuki məhsul Type 2-dir. Müştəri səhv məhsul alıb geri qaytaracaq.

Həmçinin: `WallBox Type 2 22kW` və `WallBox GBT/AC 22kW` **eyni şəkli** istifadə edir və eyni təsvirə malikdir.

### 3.3 Bağlayıcı təsvirləri hamısı eynidir

9 bağlayıcı məhsulunun **hamısında** eyni mətn:
> "Elektrikli avtomobilinizdə Çin standartı GB/T girişi varsa…"

Buna **Type 2 → Type 1** və **Type 2 → Tesla** adapterləri də daxildir — hər ikisi GB/T ilə əlaqəsizdir. Hər məhsul üçün ayrı, düzgün təsvir yazılmalıdır.

### 3.4 Təkrar məhsul

`ELCAR 32A Charging Cable Type 1` siyahıda **iki dəfə** eyni qiymətlə görünür. Biri silinməlidir (yəqin ki, biri Type 2 olmalıydı).

### 3.5 Ana səhifədə "Faza sayı --"

Ana səhifə kartlarında faza sayı `--` göstərir, məhsul səhifəsində isə düzgün ("3 Faza"). API-də sahə düzgün ötürülmür.

### 3.6 Bloq məzmunu maşın tərcüməsidir

"Şarj cihazlarının səviyyələri" məqaləsində birbaşa mətn:
> *"**Cars.com-da biz özümüz** bunun qurbanı ola bilərdik."*

Bu, Cars.com məqaləsinin tərcüməsidir. Problemlər:
- Müəllif hüququ riski
- Məsafələr **mil** ilə verilib (Azərbaycanda km)
- Gərginlik **120V / 240V** (ABŞ standartı) — Azərbaycanda 220V / 380V
- Google orijinal olmayan tərcümə məzmununu sıralamır

**Düzəliş:** məqaləni Azərbaycan reallığına uyğun yenidən yaz — 220V/380V, km, Azərbaycan elektrik şəbəkəsi, Bakıdakı ictimai şarj məntəqələri.

### 3.7 Orfoqrafiya

| Yer | Səhv | Düzgün |
|---|---|---|
| Bloq | "Bənzır məqalələr" | "Bənzər məqalələr" |
| RU ana səhifə | "марки электромобиле**йq**" | "марки электромобилей" |
| RU brend | "Извест**к**ая как VW" | "Известная как VW" |
| AZ məhsul | "Güc sərfiy**a**tı" (məhsul səhifəsi) / "Güc sərfiy**ya**tı" (kart) | vahid yazılış seç |
| AZ məhsul | "Şar**z** nəzarəti" | "Şar**j** nəzarəti" |
| AZ məhsul | "Plag & Play" | "Plug & Play" |
| Menyu | "Yükləmə Stansiyaları" | "Şarj Stansiyaları" (saytın qalan hissəsi "şarj" işlədir) |
| Ana səhifə | "baglayicilar" (başlıqda ə/ı olmadan) | "Bağlayıcılar" |

### 3.8 Anlaşılmaz marketinq iddiası

> "Azərbaycan dilində ilk Şarj cihazı"

Bu ifadə 6 məhsulda təkrarlanır və nə demək istədiyi aydın deyil. Əgər cihazın interfeysi azərbaycancadırsa → **"İnterfeysi Azərbaycan dilində olan ilk şarj cihazı"** yaz və bunu ayrıca üstünlük kimi göstər.

---

# 4. ƏLAVƏ EDİLMƏLİ — SATIŞA BİRBAŞA TƏSİR EDƏNLƏR

Prioritet sırası ilə (yuxarıdakılar daha çox gəlir gətirir):

### 4.1 Quraşdırma xidməti səhifəsi ⭐
EV şarj biznesində gəlirin böyük hissəsi cihazdan yox, **quraşdırmadan** gəlir. Hazırda saytda bu barədə bir kəlmə yoxdur.

Səhifədə olmalı: qiymət diapazonu, nəyi əhatə edir (kabel çəkilişi, avtomat, sayğac), nə qədər çəkir, quraşdırılmış obyektlərin fotoları, "Pulsuz baxış üçün müraciət" formu.

### 4.2 "Hansı şarj mənə uyğundur?" seçim köməkçisi ⭐
3 sual → 1–2 məhsul tövsiyəsi:
1. Avtomobilinizin markası/modeli? (BYD, Tesla, Zeekr, Li Auto…) → konnektor tipi müəyyən olunur
2. Evinizdə 3 faza var? → 7kW yoxsa 22kW
3. Evdə, işdə, yoxsa yolda? → wallbox / portativ

Bu, EV alıcısının **əsas qorxusunu** (səhv cihaz almaq) həll edir və konversiyanı ən çox artıran əlavədir.

### 4.3 Şarj müddəti kalkulyatoru
Batareya tutumu (kVts) + seçilmiş cihaz → "0-dan 100%-ə ~4 saat 20 dəq". Həm faydalıdır, həm də Google-dan trafik gətirir.

### 4.4 Ödəniş və hissə-hissə ödəniş məlumatı ⭐
Hazırda saytda ödəniş üsulları haqqında **heç bir məlumat yoxdur**. 800–1300 AZN-lik məhsullar üçün bu, satışı dayandırır.

Əlavə et: kart ödənişi, nağd, köçürmə + **Birbank / Tamkart / Bolkart taksit** (varsa). Məhsul səhifəsində "12 aya 67.5 AZN" göstər.

### 4.5 Çatdırılma, zəmanət və qaytarma səhifələri
E-ticarət üçün həm qanuni tələb, həm də etibar elementi:
- Çatdırılma: Bakı daxili müddət/qiymət, regionlara göndərmə
- Zəmanət: neçə il, nəyi əhatə edir, servis harada
- Qaytarma: 14 gün, şərtlər

### 4.6 Əlaqə kanallarının gücləndirilməsi
Hazırda yalnız statik telefon və form var.
- Telefon **kliklənə bilən** olsun (`tel:+994773006060`)
- Hər səhifədə sabit **WhatsApp düyməsi**
- Əlaqə səhifəsinə **Google xəritə** (Nərimanov r., Həsənoğlu küç. 4)
- İş saatları

### 4.7 Stok statusu
"Stokda var" / "Sifarişlə — 2–3 həftə". Alıcı bunu bilmədən sifariş verməkdən çəkinir.

### 4.8 FAQ bölməsi
Real suallar: *Evimə 22kW quraşdıra bilərəm? 3 faza necə çəkilir və nə qədərdir? Portativ cihazla adi rozetkadan şarj təhlükəsizdir? Zeekr / BYD üçün hansı konnektor lazımdır? Şarj etmək ayda nə qədər elektrik pulu deməkdir?*

FAQ struktur datası ilə birlikdə Google nəticələrində birbaşa görünə bilər.

### 4.9 Müştəri rəyləri və referanslar
Məhsul səhifələrində "Reyting" sahəsi var, amma **boşdur**. Ya real rəylər topla, ya da sahəni gizlət — boş ulduzlar etibarı azaldır.
Əlavə olaraq: quraşdırılmış obyektlərin foto qalereyası (ən güclü sosial sübut).

### 4.10 B2B / korporativ səhifə
Biznes mərkəzləri, otellər, avtoparklar, ticarət mərkəzləri üçün ayrıca səhifə + təklif formu. Bir korporativ sifariş onlarla fərdi satışa bərabərdir.

### 4.11 Struktur data (Schema.org)
Hazırda yoxdur. Əlavə et:
- `Product` + `Offer` (qiymət, valyuta, stok) → Google nəticələrində **qiymət görünür**
- `Organization` + `LocalBusiness` (ünvan, telefon, iş saatları)
- `BreadcrumbList`, `FAQPage`, `Article` (bloq üçün)

### 4.12 Analitika
GA4, Google Search Console, Meta Pixel quraşdırılmalıdır. Hazırda hansı səhifənin satış gətirdiyini ölçmək mümkün deyil.

### 4.13 Sayt daxili axtarış
Məhsul sayı artdıqca vacibləşir. Hazırda yoxdur.

### 4.14 Məhsul müqayisəsi
7kW vs 22kW, Type 2 vs GB/T — alıcının əsas dilemması. Yan-yana müqayisə cədvəli.

### 4.15 Footer-in doldurulması
Hazırda footer yalnız copyright sətridir. Olmalı: qısa şirkət təsviri, əsas kateqoriya linkləri, əlaqə, sosial media, ödəniş üsulları ikonları, hüquqi səhifələr (məxfilik siyasəti, istifadə şərtləri), VÖEN.

### 4.16 DC stansiyalar — ✅ DÜZƏLİŞ (12.08.2026)

**Əvvəlki qeyd səhv idi.** İlk auditdə "DC Stansiyalar kateqoriyası boşdur" yazmışdım — bu doğru deyil. Səbəb: kateqoriya səhifəsində DC məhsullar yalnız sonsuz sürüşdürmənin sonunda yüklənir, ilk 12-də görünmür.

Bazada **6 DC stansiya** var: `ELCAR SC40750 40kW`, `SC30750 30kW`, `SC20750 20kW`, `SC15750 15kW`, `XC15750 15kW`, `M4FDC`. Qiymətlər 14 670 AZN-ə qədər çatır — saytın **ən bahalı və ən yüksək marjalı məhsullarıdır**.

**Problem daha ciddidir:** bu 6 məhsul sürüşdürmə olmadan görünmür və indekslənmir. Yəni ən bahalı məhsullar praktiki olaraq gizlidir.

**Tövsiyə:** DC stansiyalar üçün ayrıca giriş nöqtəsi yaradın — ana səhifədə ayrıca bölmə və/və ya menyuda birbaşa link. Bunlar korporativ müştəri (otel, biznes mərkəzi, avtopark) üçün əsas məhsuldur və B2B səhifəsi ilə əlaqələndirilməlidir.

---

# 5. TƏTBİQ PLANI

### 1-ci həftə — "qan itkisini dayandır"
- [ ] EN/RU "Rusiya distribütoru" mətnini düzəlt
- [ ] Bütün səhifələrə unikal title + description
- [ ] robots.txt + sitemap.xml + Google Search Console
- [ ] Breadcrumb linklərini düzəlt (5 bug)
- [ ] Kliklənə bilən telefon + WhatsApp düyməsi
- [ ] Type 2 22kW-ın səhv "GBT/AC" spesifikasiyasını düzəlt
- [ ] Təkrar məhsulu sil

### 2–3-cü həftə — "Google-u aç, etibarı qur"
- [ ] Kateqoriya səhifələrini server-side render et
- [ ] `hreflang` + canonical əlavə et
- [ ] Product / Organization / Breadcrumb schema
- [ ] Çatdırılma, zəmanət, qaytarma, ödəniş səhifələri
- [ ] 404 səhifəsi
- [ ] Bağlayıcı təsvirlərini ayrı-ayrı yaz
- [ ] Ana səhifə kart etiketlərini düzəlt
- [ ] Orfoqrafiya siyahısını təmizlə
- [ ] GA4 + Meta Pixel

### 4–6-cı həftə — "satışı artır"
- [ ] Quraşdırma xidməti səhifəsi
- [ ] "Hansı şarj mənə uyğundur?" köməkçisi
- [ ] FAQ + FAQ schema
- [ ] Stok statusu
- [ ] Rəylər / referans qalereyası
- [ ] B2B səhifəsi
- [ ] Footer-in tam qurulması
- [ ] `/electric-vehicles` barədə qərar (doldur və ya əvəz et)

### Davamlı
- [ ] Ayda 2 orijinal AZ bloq məqaləsi (tərcümə yox)
- [ ] Şarj müddəti kalkulyatoru
- [ ] Məhsul müqayisəsi
- [ ] Sayt daxili axtarış

---

## Qeyd

Bu audit saytın **ictimai HTML-i** əsasında aparılıb. Aşağıdakıları yoxlamaq üçün əlavə giriş lazımdır:
- Real səhifə yüklənmə sürəti və Core Web Vitals (PageSpeed Insights)
- Mobil görünüş və mobil konversiya
- Google Search Console-da indekslənmə statusu və mövcud açar sözlər
- Səbət → ödəniş axınının real işləkliyi

Bunlara giriş verilsə, ikinci mərhələ auditi aparıla bilər.
