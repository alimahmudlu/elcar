# ELCAR — Məhsul Təsvirləri (təsdiq üçün)

**Tarix:** 12 avqust 2026
**Mənbə:** admin.elcar.az bazasındakı real spesifikasiyalar
**Status:** ⏸️ Hələ yazılmayıb — təsdiqini gözləyir

---

## Boşluq analizinin nəticəsi

Yaxşı xəbər: **34 məhsulun heç birində boş təsvir, çatışmayan şəkil və ya boş spesifikasiya qrupu yoxdur.** Baza faktiki olaraq doludur.

Əsl problem başqadır — **21 məhsul 9 qrupda eyni təsviri paylaşır.** Yəni müştəri iki fərqli məhsulu yan-yana qoyanda arasındakı fərqi oxuya bilmir. Ən pisi DC bölməsidir: 2 994 AZN-dən 4 533 AZN-ə qədər 5 məhsulun hamısında hərfi-hərfinə eyni bir cümlə var.

| Qrup | Məhsul sayı | Vəziyyət |
|---|---|---|
| DC stansiyalar | 5 | Eyni generik mətn |
| ELCAR WallBox 7kW | 3 | Eyni mətn (Type 1 / Type 2 / GB-T fərqi yazılmayıb) |
| ELCAR EVA07B portativ | 3 | Eyni mətn |
| ELCAR WallBox 22kW | 2 | Eyni mətn |
| INJET HN10332 | 2 | Eyni mətn |
| INJET HM10332 | 2 | Eyni mətn |
| INJET HM10132 | 2 | Eyni mətn |
| INJET HN10132 | 2 | Eyni mətn |
| INJET M3W316 | 2 | Eyni mətn |

**Bir şey təsdiqləndi:** INJET model kodlarındakı `EN` = Type 2, `GD` = GB/T. Əvvəlki sənəddə bunu ehtimal kimi yazmışdım — baza bunu təsdiqləyir. Həmin sənəddəki [YOXLA] qeydini götürmək olar.

---

## ⚠️ Əvvəlcə həll edilməli 3 data problemi

Bunları mən özbaşına düzəldə bilmərəm — texniki qərar tələb edir.

### 1. `ELCAR WallBox Type 2 22kW` — konnektor səhvdir

Bazada `Bağlayıcı növü: GBT/AC` yazılıb. Məhsulun adı Type 2-dir. Müqayisə üçün:

| Məhsul | Bazadakı konnektor |
|---|---|
| ELCAR WallBox **Type 2** 22kW | **GBT/AC** ❌ |
| ELCAR WallBox GBT/AC 22kW | GBT/AC ✅ |
| ELCAR WallBox Type 2 7kW | Type 2 ✅ |

7kW variantında düzgün, 22kW variantında səhv. Təsdiq et — `Type 2` edim?

### 2. `ELCAR M4FDC` — çıxış gücü boşdur

Saytın **ən bahalı məhsulu (14 670 AZN)** və güc göstəricisi boşdur. Saytda kartda `Yanacaq növü: -` görünür.

Bazadakı digər dəyərlər: `DC Güc Çıxış Reytinqi: 80 kW`, `Maksimum çıxış cərəyanı: 200 A`, `DC Voltage Output: 150~1000 VDC`.

Amma diqqət: digər DC modellərdə reytinq ilə çıxış gücü **fərqlənir** — SC15750-də reytinq 20 kW, çıxış gücü 15 kW. Ona görə M4FDC üçün "80 kW" yazmaq riskli olardı. Təchizatçı sənədindən dəqiq dəyəri ver, yazım.

### 3. `XC15750` və `SC15750` — reytinq/çıxış uyğunsuzluğu

Hər ikisində `Çıxış gücü: 15 kW`, amma `DC Güc Çıxış Reytinqi: 20 kW`. Bu qəsdəndirsə problem yoxdur (reytinq pik, çıxış nominal), amma saytda ikisi də göstərilirsə müştərini çaşdırır. Yoxlanmalıdır.

---

# TƏKLİF OLUNAN TƏSVİRLƏR

Hamısı bazadakı real spesifikasiyalara əsaslanır — heç bir dəyər uydurulmayıb.

## DC Stansiyalar (5 məhsul)

Hazırkı ortaq mətn: *"DC Charger elektrikli avtomobil şarj cihazıdır. Yüksək gücə malikdir və avtomobilin sabit cərəyan (DC) vasitəsilə doldurulmasını təmin edir."*

| Model | Qiymət | Yeni təsvir |
|---|---|---|
| **ELCAR SC15750 15kW**<br>`64f098e503d3c555cc6dd0a2` | 2 994.6 AZN | 15 kVt gücündə DC sürətli şarj stansiyası. CCS 2 və GB/T DC konnektorları ilə avtomobili birbaşa sabit cərəyanla doldurur — AC stansiyalardan qat-qat sürətli. RFID kart və mobil tətbiq ilə idarə olunur. |
| **ELCAR XC15750 15kW**<br>`64f1e4bf03d3c555cc6e4abb` | 3 112.9 AZN | 15 kVt DC sürətli şarj stansiyası, genişləndirilmiş bağlantı imkanları ilə: Wi-Fi, Ethernet və Bluetooth. RFID, mobil tətbiq və Plug & Play rejimlərini dəstəkləyir — çoxsaylı istifadəçi üçün uyğundur. |
| **ELCAR SC20750 20kW**<br>`64f1df2403d3c555cc6e2894` | 3 203.2 AZN | 20 kVt gücündə DC sürətli şarj stansiyası. CCS 2 və GB/T DC dəstəyi, 200–750 VDC çıxış diapazonu. Kiçik ticarət obyektləri və korporativ avtoparklar üçün optimal həll. |
| **ELCAR SC30750 30kW**<br>`64f1dff603d3c555cc6e2bdc` | 3 700.9 AZN | 30 kVt DC sürətli şarj stansiyası. Gündə bir neçə avtomobilin növbə ilə şarjı üçün nəzərdə tutulub — otel, restoran və biznes mərkəzləri üçün. IP54 qoruma ilə çöldə quraşdırıla bilər. |
| **ELCAR SC40750 40kW**<br>`64f1e12e03d3c555cc6e3255` | 4 533.9 AZN | Seriyanın ən güclü modeli — 40 kVt DC sürətli şarj. Yüksək dövriyyəli obyektlər üçün: ticarət mərkəzləri, yanacaqdoldurma məntəqələri, korporativ avtoparklar. CCS 2 və GB/T DC, 200–750 VDC. |
| **ELCAR M4FDC**<br>`6411cd39f0806609e4b52c41` | 14 670 AZN | ⏸️ Çıxış gücü dəyəri təsdiqlənəndən sonra yazılacaq |

## ELCAR WallBox 22kW (2 məhsul)

Hazırkı ortaq mətn: *"ALPHA WallBox AC 22kW - elektrikli avtomobilləri tez, təhlükəsiz şarj etmək üçün nəzərdə tutulmuş yüksək texnologiyalı şarj cihazıdır. Azərbaycan dilində ilk Şarj cihazı"*

| Model | Yeni təsvir |
|---|---|
| **WallBox Type 2 22kW**<br>`65f317cec9b82d43b3242cfe` | Avropa standartlı **Type 2** girişli elektromobillər üçün 3 fazalı 22 kVt divar şarj stansiyası. 32A, IP65 qoruma, Wi-Fi və Ethernet bağlantısı. RFID kart, mobil tətbiq və Plug & Play ilə idarə olunur. |
| **WallBox GBT/AC 22kW**<br>`65f31625c9b82d43b3241253` | Çin standartlı **GB/T** girişli elektromobillər üçün 3 fazalı 22 kVt divar şarj stansiyası — BYD, Zeekr, Li Auto və Çindən gətirilən digər modellər. 32A, IP65, RFID və mobil tətbiq dəstəyi. |

## ELCAR WallBox 7kW (3 məhsul)

Hazırkı ortaq mətn üç məhsulda eynidir — halbuki hər birinin konnektoru fərqlidir.

| Model | Konnektor | Yeni təsvir |
|---|---|---|
| **WallBox Type 2 7kW**<br>`65c9f47dc9b82d43b31cef6c` | Type 2 | Avropa standartlı **Type 2** girişli avtomobillər üçün 1 fazalı 7 kVt ev şarj stansiyası. 220V şəbəkəyə uyğundur — 3 faza tələb etmir. Gecə ərzində avtomobili tam doldurur. IP65, çöldə quraşdırıla bilər. |
| **WallBox GBT/AC 7kW**<br>`65c9f4acc9b82d43b31cfc8a` | GB/T | Çin standartlı **GB/T** girişli avtomobillər üçün 1 fazalı 7 kVt ev şarj stansiyası. Adi 220V şəbəkədən işləyir. BYD, Zeekr, Li Auto və digər Çin modelləri üçün ən sərfəli ev həlli. |
| **WallBox Type 1 7kW**<br>`65c9f458c9b82d43b31ce652` | Type 1 | **Type 1 (SAE J1772)** girişli elektromobil və plug-in hibridlər üçün 1 fazalı 7 kVt ev şarj stansiyası. 220V şəbəkəyə uyğun, IP65 qoruma, RFID və mobil tətbiq nəzarəti. |

## ELCAR EVA07B portativ (3 məhsul)

| Model | Konnektor | Yeni təsvir |
|---|---|---|
| **EVA07B 7.4kW**<br>`6447bc33e285e3cd3452b6b1` | Type 2 | **Type 2** girişli avtomobillər üçün portativ şarj cihazı, 7.4 kVt. Cərəyanı 6–32A arasında tənzimləyə bilirsiniz — zəif elektrik xəttində də təhlükəsiz istifadə. IP67, cəmi 2.9 kq, baqajda daim saxlaya bilərsiniz. |
| **EVA07BG 7.4kW**<br>`65bb583dc9b82d43b3196f10` | GB/T | Çin standartlı **GB/T** girişli avtomobillər üçün portativ şarj cihazı, 7.4 kVt. 6–32A tənzimlənən cərəyan, IP67 qoruma. Yol üçün ehtiyat şarj vasitəsi kimi əvəzsizdir. |
| **EVA07BU 7.4kW**<br>`65bb585ec9b82d43b3197970` | Type 1 | **Type 1** girişli avtomobil və hibridlər üçün portativ şarj cihazı, 7.4 kVt. Cərəyan 6–32A arasında tənzimlənir, IP67, yüngül və daşınandır. |

## INJET cütlükləri (10 məhsul, 5 cüt)

Hər cütdə yeganə fərq konnektordur: `EN` = Type 2, `GD` = GB/T. Hazırda ikisində də eyni mətn var.

**Düzəliş məntiqi:** mövcud mətnin əsasını saxlayıb sonuna konnektor cümləsi əlavə edirəm — beləliklə INJET-in orijinal təsviri qalır, fərq isə aydın olur.

| Model | Əlavə olunacaq cümlə |
|---|---|
| **HN10332EN 22kW** `65c9c5bac9b82d43b31ca7c7` | Avropa standartlı **Type 2** konnektor, 3 fazalı 22 kVt. |
| **HN10332GD 22kW** `65c9c603c9b82d43b31cb765` | Çin standartlı **GB/T** konnektor, 3 fazalı 22 kVt. |
| **HM10332EN 22kW** `65c9c558c9b82d43b31c9767` | Avropa standartlı **Type 2** konnektor, 3 fazalı 22 kVt. |
| **HM10332GD 22kW** `65c9c589c9b82d43b31ca138` | Çin standartlı **GB/T** konnektor, 3 fazalı 22 kVt. |
| **HM10132EN 7kW** `65c9c506c9b82d43b31c8b18` | Avropa standartlı **Type 2** konnektor, 1 fazalı 7 kVt, 220V şəbəkəyə uyğun. |
| **HM10132GD 7kW** `65c9c4d4c9b82d43b31c823a` | Çin standartlı **GB/T** konnektor, 1 fazalı 7 kVt, 220V şəbəkəyə uyğun. |
| **HN10132EN 7kW** `65c9c47ac9b82d43b31c72f2` | Avropa standartlı **Type 2** konnektor, 1 fazalı 7 kVt. |
| **HN10132GD 7kW** `65c9c464c9b82d43b31c6a4a` | Çin standartlı **GB/T** konnektor, 1 fazalı 7 kVt. |
| **M3W316EN 11kW** `65c9b964c9b82d43b31c061c` | Avropa standartlı **Type 2** konnektor, 3 fazalı 11 kVt. |
| **M3W316GD 11kW** `65c9b9bfc9b82d43b31c0fa4` | Çin standartlı **GB/T** konnektor, 3 fazalı 11 kVt. |

---

## Nə qədər çəkəcək

Cəmi **21 məhsulun** AZ təsviri. Admin-də hər məhsul ayrıca açılıb yadda saxlanmalıdır — təxminən 20–30 dəqiqə.

Sonra eyni işi **EN və RU** dilləri üçün təkrarlamaq lazımdır (redaktə formasında dil seçicisi var). Bunu AZ təsdiqləndikdən sonra edərəm.

---

## Təsdiq üçün suallar

1. Yuxarıdakı AZ təsvirlər yazılsın?
2. `WallBox Type 2 22kW`-ın konnektorunu `GBT/AC` → `Type 2` edim?
3. `M4FDC`-nin çıxış gücü neçə kVt-dir?
4. "Azərbaycan dilində ilk Şarj cihazı" ifadəsi nə deməkdir — cihazın interfeysi azərbaycancadır? Doğrudursa, düzgün formada saxlayım; deyilsə, silim.
