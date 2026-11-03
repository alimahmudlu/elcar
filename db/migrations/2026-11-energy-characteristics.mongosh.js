// Enerji bölmələri üçün xüsusiyyətlər (characteristics), qruplar və filtr seçimləri
//
// İşə salmaq (əvvəlcə bazanın yedəyini alın):
//   mongosh "<MONGO_URI>" db/migrations/2026-11-energy-characteristics.mongosh.js
//
// İdempotentdir: qrup (bölmə + EN adı), xüsusiyyət (bölmə + key) və seçim
// (xüsusiyyət + EN adı) artıq varsa yenidən yaradılmır; adlar və parametrlər
// yenilənir. Admin-də sonradan əl ilə edilən dəyişikliklərə (məs. yeni
// seçimlər) toxunulmur. Xüsusiyyətlər bölmənin bütün kateqoriyalarına bağlanır.
//
// Saytda filtr kimi yalnız "select" tipli və showOnFilter: true olanlar görünür.
// Rəqəmli göstəricilər (güc, tutum) üçün ayrıca "... diapazonu" seçimi var.

const n = (az, en, ru) => ({ az, en, ru });

// --- Komponent tipləri (şarj stansiyalarındakı ilə eyni format) ---
const number = (suffix, extra = {}) => ({ name: "input", attrs: { type: "number", ...(suffix ? { suffix } : {}), ...extra } });
const text = (suffix, extra = {}) => ({ name: "input", attrs: { type: "text", translatable: false, ...(suffix ? { suffix } : {}), ...extra } });
const select = (extra = {}) => ({ name: "select", attrs: { multiple: false, ...extra } });
const checkbox = () => ({ name: "checkbox", attrs: null });

// Filtr: saytda sol paneldə görünür; showOnItem: məhsul kartında göstərilir;
// addToSlug: məhsul adına əlavə olunur (məs. "... 550W")
const filter = { showOnFilter: true };
const onCard = { showOnItem: true };

const G_MAIN = n("Əsas göstəricilər", "Key specifications", "Основные характеристики");
const G_TECH = n("Texniki göstəricilər", "Technical specifications", "Технические характеристики");
const G_DIM = n("Ölçü və çəki", "Dimensions and weight", "Размеры и вес");

const dimensionItems = [
  { key: "dimensions", name: n("Ölçülər (U×E×H)", "Dimensions (L×W×H)", "Размеры (Д×Ш×В)"), component: text("mm") },
  { key: "weight", name: n("Çəki", "Weight", "Вес"), component: number("kg") },
];

const communication = (items) => ({
  key: "communication",
  name: n("Rabitə interfeysi", "Communication", "Интерфейс связи"),
  component: select({ multiple: true }),
  options: items.map((x) => n(x, x, x)),
});

const SPEC = {
  // ---------------------------------------------------------------- Günəş
  "solar-energy": [
    {
      name: G_MAIN,
      items: [
        { key: "power-w", name: n("Güc", "Power", "Мощность"), component: number("W", { ...onCard, addToSlug: true }) },
        {
          key: "power-range", name: n("Güc diapazonu", "Power range", "Диапазон мощности"), component: select(filter),
          options: [n("400 W-a qədər", "Up to 400 W", "До 400 Вт"), n("400–500 W", "400–500 W", "400–500 Вт"), n("500–600 W", "500–600 W", "500–600 Вт"), n("600 W-dan çox", "Over 600 W", "Более 600 Вт")],
        },
        {
          key: "cell-type", name: n("Hüceyrə növü", "Cell type", "Тип ячеек"), component: select({ ...filter, ...onCard }),
          options: [n("N-tip TOPCon", "N-type TOPCon", "N-тип TOPCon"), n("HJT", "HJT", "HJT"), n("P-tip PERC", "P-type PERC", "P-тип PERC"), n("Polikristal", "Polycrystalline", "Поликристалл")],
        },
        {
          key: "module-face", name: n("Panel tipi", "Module type", "Тип модуля"), component: select(filter),
          options: [n("Monofasial", "Monofacial", "Монофациальный"), n("Bifasial (ikiüzlü)", "Bifacial", "Бифациальный")],
        },
        { key: "efficiency", name: n("Səmərəlilik", "Module efficiency", "КПД модуля"), component: number("%", onCard) },
      ],
    },
    {
      name: G_TECH,
      items: [
        { key: "vmp", name: n("Maks. güc gərginliyi (Vmp)", "Max power voltage (Vmp)", "Напряжение при макс. мощности (Vmp)"), component: number("V") },
        { key: "imp", name: n("Maks. güc cərəyanı (Imp)", "Max power current (Imp)", "Ток при макс. мощности (Imp)"), component: number("A") },
        { key: "voc", name: n("Açıq dövrə gərginliyi (Voc)", "Open-circuit voltage (Voc)", "Напряжение холостого хода (Voc)"), component: number("V") },
        { key: "isc", name: n("Qısa qapanma cərəyanı (Isc)", "Short-circuit current (Isc)", "Ток короткого замыкания (Isc)"), component: number("A") },
        { key: "cells", name: n("Hüceyrə sayı", "Number of cells", "Количество ячеек"), component: number("") },
        {
          key: "max-system-voltage", name: n("Maks. sistem gərginliyi", "Max system voltage", "Макс. напряжение системы"), component: select(),
          options: [n("1000 V DC", "1000 V DC", "1000 В DC"), n("1500 V DC", "1500 V DC", "1500 В DC")],
        },
        { key: "temp-coefficient", name: n("Gücün temperatur əmsalı", "Temperature coefficient of Pmax", "Темп. коэффициент Pmax"), component: text("%/°C") },
        { key: "power-warranty", name: n("Güc zəmanəti (il)", "Linear power warranty (years)", "Гарантия на мощность (лет)"), component: number("") },
        { key: "degradation", name: n("İllik deqradasiya", "Annual degradation", "Годовая деградация"), component: text("%") },
      ],
    },
    { name: G_DIM, items: dimensionItems },
  ],

  // ---------------------------------------------------------------- İnvertorlar
  inverters: [
    {
      name: G_MAIN,
      items: [
        { key: "power-kw", name: n("Nominal güc", "Rated power", "Номинальная мощность"), component: number("kW", { ...onCard, addToSlug: true }) },
        {
          key: "power-range", name: n("Güc diapazonu", "Power range", "Диапазон мощности"), component: select(filter),
          options: [n("5 kW-a qədər", "Up to 5 kW", "До 5 кВт"), n("5–10 kW", "5–10 kW", "5–10 кВт"), n("10–20 kW", "10–20 kW", "10–20 кВт"), n("20 kW-dan çox", "Over 20 kW", "Более 20 кВт")],
        },
        {
          key: "inverter-type", name: n("İnvertor növü", "Inverter type", "Тип инвертора"), component: select({ ...filter, ...onCard }),
          options: [n("Hibrid", "Hybrid", "Гибридный"), n("Şəbəkəyə qoşulan", "On-grid", "Сетевой"), n("Avtonom", "Off-grid", "Автономный"), n("Mikroinvertor", "Microinverter", "Микроинвертор")],
        },
        {
          key: "phase", name: n("Faza", "Phase", "Фазность"), component: select({ ...filter, ...onCard }),
          options: [n("Tək faza", "Single-phase", "Однофазный"), n("Üç faza", "Three-phase", "Трёхфазный")],
        },
        {
          key: "battery-voltage", name: n("Batareya gərginliyi", "Battery voltage", "Напряжение АКБ"), component: select(filter),
          options: [n("12 V", "12 V", "12 В"), n("24 V", "24 V", "24 В"), n("48 V", "48 V", "48 В"), n("Yüksək gərginlik", "High voltage", "Высоковольтная")],
        },
      ],
    },
    {
      name: G_TECH,
      items: [
        { key: "mppt-count", name: n("MPPT sayı", "MPPT trackers", "Количество MPPT"), component: number("") },
        { key: "mppt-range", name: n("MPPT gərginlik diapazonu", "MPPT voltage range", "Диапазон MPPT"), component: text("V") },
        { key: "max-pv-voltage", name: n("Maks. PV gərginliyi", "Max PV input voltage", "Макс. напряжение PV"), component: number("V") },
        { key: "max-pv-power", name: n("Maks. PV gücü", "Max PV input power", "Макс. мощность PV"), component: number("W") },
        { key: "peak-power", name: n("Pik güc", "Peak power", "Пиковая мощность"), component: number("VA") },
        { key: "efficiency", name: n("Maks. səmərəlilik", "Peak efficiency", "Макс. КПД"), component: number("%") },
        { key: "transfer-time", name: n("Keçid müddəti (UPS)", "Transfer time (UPS)", "Время переключения (UPS)"), component: number("ms") },
        {
          key: "battery-type", name: n("Batareya növü", "Battery type", "Тип АКБ"), component: select({ multiple: true }),
          options: [n("Litium (LiFePO4)", "Lithium (LiFePO4)", "Литий (LiFePO4)"), n("Turşu-qurğuşun", "Lead-acid", "Свинцово-кислотный")],
        },
        communication(["RS232", "RS485", "CAN", "Wi-Fi", "BMS"]),
        { key: "parallel-units", name: n("Paralel qoşulma (maks. ədəd)", "Parallel units (max)", "Параллельно (макс. шт.)"), component: number("") },
        { key: "works-without-battery", name: n("Batareyasız işləyir", "Works without battery", "Работает без АКБ"), component: checkbox() },
      ],
    },
    { name: G_DIM, items: dimensionItems },
  ],

  // ---------------------------------------------------------------- Enerji saxlama
  "energy-storage": [
    {
      name: G_MAIN,
      items: [
        { key: "capacity-kwh", name: n("Tutum", "Capacity", "Ёмкость"), component: number("kWh", { ...onCard, addToSlug: true }) },
        {
          key: "capacity-range", name: n("Tutum diapazonu", "Capacity range", "Диапазон ёмкости"), component: select(filter),
          options: [n("5 kWh-a qədər", "Up to 5 kWh", "До 5 кВт·ч"), n("5–15 kWh", "5–15 kWh", "5–15 кВт·ч"), n("15–50 kWh", "15–50 kWh", "15–50 кВт·ч"), n("50–500 kWh", "50–500 kWh", "50–500 кВт·ч"), n("500 kWh-dan çox", "Over 500 kWh", "Более 500 кВт·ч")],
        },
        {
          key: "segment", name: n("Təyinat", "Segment", "Назначение"), component: select(filter),
          options: [n("Ev", "Residential", "Для дома"), n("Kommersiya və sənaye", "Commercial & industrial", "Коммерция и промышленность"), n("Şəbəkə miqyaslı", "Utility-scale", "Сетевой масштаб")],
        },
        {
          key: "product-type", name: n("Məhsul tipi", "Product type", "Тип продукта"), component: select({ ...filter, ...onCard }),
          options: [n("Yalnız batareya", "Battery only", "Только АКБ"), n("Batareya + invertor (all-in-one)", "All-in-one (battery + inverter)", "Всё-в-одном (АКБ + инвертор)")],
        },
        {
          key: "installation", name: n("Quraşdırma", "Installation", "Монтаж"), component: select(filter),
          options: [n("Rack (server şkafı)", "Rack-mounted", "Стоечный"), n("Divar", "Wall-mounted", "Настенный"), n("Döşəmə", "Floor-standing", "Напольный"), n("Modul (stack)", "Stackable", "Модульный (stack)"), n("Açıq hava kabineti", "Outdoor cabinet", "Уличный шкаф"), n("Konteyner", "Container", "Контейнер")],
        },
        {
          key: "voltage-class", name: n("Gərginlik sinfi", "Voltage class", "Класс напряжения"), component: select({ ...filter, ...onCard }),
          options: [n("Aşağı gərginlik (48–51,2 V)", "Low voltage (48–51.2 V)", "Низковольтная (48–51,2 В)"), n("Yüksək gərginlik", "High voltage", "Высоковольтная")],
        },
      ],
    },
    {
      name: G_TECH,
      items: [
        {
          key: "chemistry", name: n("Kimyəvi tərkib", "Chemistry", "Химия"), component: select(),
          options: [n("LiFePO4 (LFP)", "LiFePO4 (LFP)", "LiFePO4 (LFP)"), n("NMC", "NMC", "NMC")],
        },
        { key: "nominal-voltage", name: n("Nominal gərginlik", "Nominal voltage", "Номинальное напряжение"), component: number("V") },
        { key: "capacity-ah", name: n("Nominal tutum (Ah)", "Rated capacity (Ah)", "Номинальная ёмкость (Ач)"), component: number("Ah") },
        { key: "inverter-power", name: n("İnvertor gücü", "Inverter power", "Мощность инвертора"), component: number("kW") },
        { key: "max-current", name: n("Maks. doldurma/boşalma cərəyanı", "Max charge/discharge current", "Макс. ток заряда/разряда"), component: number("A") },
        { key: "cycle-life", name: n("Dövr sayı", "Cycle life", "Количество циклов"), component: number("") },
        {
          key: "cooling", name: n("Soyutma", "Cooling", "Охлаждение"), component: select(),
          options: [n("Təbii", "Natural", "Естественное"), n("Hava", "Air", "Воздушное"), n("Maye", "Liquid", "Жидкостное")],
        },
        communication(["RS485", "CAN", "Wi-Fi", "Bluetooth", "4G"]),
        { key: "ip-rating", name: n("Qoruma dərəcəsi", "Protection rating", "Степень защиты"), component: text("") },
        { key: "operating-temperature", name: n("İşləmə temperaturu", "Operating temperature", "Рабочая температура"), component: text("°C") },
      ],
    },
    { name: G_DIM, items: dimensionItems },
  ],

  // ---------------------------------------------------------------- Külək
  "wind-energy": [
    {
      name: G_MAIN,
      items: [
        { key: "power-w", name: n("Nominal güc", "Rated power", "Номинальная мощность"), component: number("W", { ...onCard, addToSlug: true }) },
        {
          key: "axis", name: n("Ox növü", "Axis type", "Тип оси"), component: select({ ...filter, ...onCard }),
          options: [n("Üfüqi ox", "Horizontal axis", "Горизонтальная ось"), n("Şaquli ox", "Vertical axis", "Вертикальная ось")],
        },
        {
          key: "output-voltage", name: n("Çıxış gərginliyi", "Output voltage", "Выходное напряжение"), component: select(filter),
          options: [n("12 V", "12 V", "12 В"), n("24 V", "24 V", "24 В"), n("48 V", "48 V", "48 В"), n("220 V", "220 V", "220 В")],
        },
      ],
    },
    {
      name: G_TECH,
      items: [
        { key: "start-wind-speed", name: n("Başlanğıc külək sürəti", "Start-up wind speed", "Стартовая скорость ветра"), component: number("m/s") },
        { key: "rated-wind-speed", name: n("Nominal külək sürəti", "Rated wind speed", "Номинальная скорость ветра"), component: number("m/s") },
        { key: "rotor-diameter", name: n("Rotor diametri", "Rotor diameter", "Диаметр ротора"), component: number("m") },
        { key: "blades", name: n("Pər sayı", "Number of blades", "Количество лопастей"), component: number("") },
      ],
    },
    { name: G_DIM, items: dimensionItems },
  ],

  // ---------------------------------------------------------------- Lazer
  "laser-equipment": [
    {
      name: G_MAIN,
      items: [
        { key: "laser-power-w", name: n("Lazer gücü", "Laser power", "Мощность лазера"), component: number("W", { ...onCard, addToSlug: true }) },
        {
          key: "power-range", name: n("Güc diapazonu", "Power range", "Диапазон мощности"), component: select(filter),
          options: [n("100 W-a qədər", "Up to 100 W", "До 100 Вт"), n("100–1000 W", "100–1000 W", "100–1000 Вт"), n("1–3 kW", "1–3 kW", "1–3 кВт"), n("3–6 kW", "3–6 kW", "3–6 кВт"), n("6 kW-dan çox", "Over 6 kW", "Более 6 кВт")],
        },
        {
          key: "laser-type", name: n("Lazer tipi", "Laser type", "Тип лазера"), component: select({ ...filter, ...onCard }),
          options: [n("Fiber", "Fiber", "Волоконный"), n("QCW", "QCW", "QCW"), n("UV (355 nm)", "UV (355 nm)", "УФ (355 нм)")],
        },
        {
          key: "form-factor", name: n("Konstruksiya", "Form factor", "Исполнение"), component: select(filter),
          options: [
            n("Əl aparatı", "Handheld", "Ручной"), n("Bel çantası", "Backpack", "Ранцевый"), n("Arabalı", "Trolley", "На тележке"),
            n("Masaüstü / stasionar", "Desktop / fixed", "Настольный / стационарный"), n("Konsol", "Cantilever", "Консольный"),
            n("Portal (masalı)", "Gantry / flatbed", "Портальный"), n("Qapalı kabinli", "Enclosed", "Закрытый"),
            n("Lövhə + boru", "Plate + tube", "Лист + труба"), n("Robot", "Robot", "Робот"), n("Kobot", "Cobot", "Коллаборативный робот"),
          ],
        },
        {
          key: "laser-source", name: n("Lazer mənbəyi", "Laser source", "Лазерный источник"), component: select(filter),
          options: ["Raycus", "MAX", "IPG", "JPT", "GW", "BW"].map((x) => n(x, x, x)),
        },
        {
          key: "cooling", name: n("Soyutma", "Cooling", "Охлаждение"), component: select(filter),
          options: [n("Hava", "Air", "Воздушное"), n("Su (çiller)", "Water (chiller)", "Водяное (чиллер)")],
        },
      ],
    },
    {
      name: G_TECH,
      items: [
        {
          key: "work-mode", name: n("İş rejimi", "Work mode", "Режим работы"), component: select({ multiple: true }),
          options: [n("Fasiləsiz (CW)", "Continuous (CW)", "Непрерывный (CW)"), n("İmpuls", "Pulse", "Импульсный"), n("QCW", "QCW", "QCW")],
        },
        { key: "wavelength", name: n("Dalğa uzunluğu", "Wavelength", "Длина волны"), component: number("nm") },
        { key: "max-thickness", name: n("Maks. qalınlıq (kəsmə/qaynaq)", "Max thickness (cutting/welding)", "Макс. толщина (резка/сварка)"), component: text("mm") },
        { key: "working-area", name: n("İş sahəsi", "Working area", "Рабочая зона"), component: text("mm") },
        { key: "cleaning-width", name: n("Təmizləmə eni", "Cleaning width", "Ширина очистки"), component: text("mm") },
        { key: "positioning-accuracy", name: n("Mövqe dəqiqliyi", "Positioning accuracy", "Точность позиционирования"), component: text("mm") },
        { key: "fiber-length", name: n("Optik kabel uzunluğu", "Fiber length", "Длина оптоволокна"), component: number("m") },
        {
          key: "power-supply", name: n("Qidalanma", "Power supply", "Электропитание"), component: select(),
          options: [n("220 V, tək faza", "220 V, single-phase", "220 В, однофазное"), n("380 V, üç faza", "380 V, three-phase", "380 В, трёхфазное")],
        },
        { key: "total-power", name: n("Ümumi enerji sərfi", "Total power consumption", "Общая потребляемая мощность"), component: number("kW") },
      ],
    },
    { name: G_DIM, items: dimensionItems },
  ],
};

// ---------------------------------------------------------------------------

let created = { groups: 0, characteristics: 0, options: 0 };

Object.entries(SPEC).forEach(([section, groups]) => {
  const categoryIds = db.categories.find({ section }, { _id: 1 }).toArray().map((c) => c._id);
  if (!categoryIds.length) {
    print(`! ${section}: kateqoriya yoxdur — əvvəlcə 2026-10-energy-sections miqrasiyasını işə salın`);
  }

  groups.forEach((group) => {
    // Qrup
    let groupDoc = db.characteristic_groups.findOne({ section, "name.en": group.name.en });
    if (!groupDoc) {
      const res = db.characteristic_groups.insertOne({
        name: group.name,
        section,
        photo: { display: false, multiple: false, background: false },
        hasDescription: false,
      });
      groupDoc = { _id: res.insertedId };
      created.groups++;
      print(`+ group  ${section} / ${group.name.az}`);
    } else {
      db.characteristic_groups.updateOne({ _id: groupDoc._id }, { $set: { name: group.name } });
    }

    group.items.forEach((item) => {
      // Xüsusiyyət
      let charDoc = db.characteristics.findOne({ section, key: item.key });
      if (!charDoc) {
        const res = db.characteristics.insertOne({
          name: item.name,
          key: item.key,
          section,
          categories: categoryIds,
          group: groupDoc._id,
          component: item.component,
        });
        charDoc = { _id: res.insertedId };
        created.characteristics++;
        print(`+ char   ${section} / ${item.key}`);
      } else {
        db.characteristics.updateOne(
          { _id: charDoc._id },
          {
            $set: { name: item.name, group: groupDoc._id, component: item.component },
            $addToSet: { categories: { $each: categoryIds } },
          }
        );
      }

      // Seçimlər (select üçün)
      (item.options || []).forEach((option) => {
        const exists = db.characteristic_options.findOne({ characteristic: charDoc._id, "name.en": option.en });
        if (!exists) {
          db.characteristic_options.insertOne({
            name: option,
            section,
            group: groupDoc._id,
            characteristic: charDoc._id,
          });
          created.options++;
        } else {
          db.characteristic_options.updateOne({ _id: exists._id }, { $set: { name: option } });
        }
      });
    });
  });
});

print(`Hazırdır. Yeni: ${created.groups} qrup, ${created.characteristics} xüsusiyyət, ${created.options} seçim.`);
