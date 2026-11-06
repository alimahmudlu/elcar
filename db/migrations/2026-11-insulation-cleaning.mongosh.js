// İzolyasiya təmizləmə bölməsi: icazələr, kateqoriyalar, xüsusiyyətlər
//
// İşə salmaq (əvvəlcə bazanın yedəyini alın):
//   mongosh "<MONGO_URI>" db/migrations/2026-11-insulation-cleaning.mongosh.js
//
// İdempotentdir: təkrar işə salınsa, mövcud qeydlər yenidən yaradılmır.

const SECTION = "insulation-cleaning";
const n = (az, en, ru) => ({ az, en, ru });
const number = (suffix, extra = {}) => ({ name: "input", attrs: { type: "number", suffix, ...extra } });
const text = (suffix) => ({ name: "input", attrs: { type: "text", translatable: false, ...(suffix ? { suffix } : {}) } });
const select = (extra = {}) => ({ name: "select", attrs: { multiple: false, ...extra } });
const filter = { showOnFilter: true };
const onCard = { showOnItem: true };

// 1) Rol icazələri: lazer bölməsindəki hüquqlar kopyalanır
db.module_permissions.find({ "sections.key": "laser-equipment" }).forEach((doc) => {
  if (doc.sections.some((s) => s.key === SECTION)) return;
  const template = doc.sections.find((s) => s.key === "laser-equipment");
  db.module_permissions.updateOne({ _id: doc._id }, { $push: { sections: { ...template, key: SECTION } } });
  print(`module_permissions ${doc._id}: +${SECTION}`);
});

// 2) Kateqoriyalar
const CATEGORIES = {
  tools: [n("Təmizləmə alətləri", "Cleaning tools", "Инструменты для очистки"), n("temizleme-aletleri", "cleaning-tools", "instrumenty-dlya-ochistki")],
  fluids: [n("Təmizləyici mayelər", "Cleaning fluids", "Чистящие жидкости"), n("temizleyici-mayeler", "cleaning-fluids", "chistyashchie-zhidkosti")],
};
const categoryIds = {};
Object.entries(CATEGORIES).forEach(([key, [name, slug]]) => {
  db.categories.updateOne(
    { section: SECTION, "slug.en": slug.en },
    { $setOnInsert: { section: SECTION, name, slug } },
    { upsert: true }
  );
  categoryIds[key] = db.categories.findOne({ section: SECTION, "slug.en": slug.en })._id;
});

// 3) Qruplar və xüsusiyyətlər. Alət və maye xüsusiyyətləri öz kateqoriyasına bağlanır.
const GROUPS = [
  {
    name: n("Əsas göstəricilər", "Key specifications", "Основные характеристики"),
    items: [
      { for: "tools", key: "power-w", name: n("Nominal güc", "Rated power", "Номинальная мощность"), component: number("W", onCard) },
      {
        for: "tools", key: "voltage-range", name: n("Gərginlik həddi", "Voltage limit", "Предел напряжения"), component: select({ ...filter, ...onCard }),
        options: [n("35 kV-a qədər", "Up to 35 kV", "До 35 кВ"), n("220 kV-a qədər", "Up to 220 kV", "До 220 кВ"), n("330 kV-a qədər", "Up to 330 kV", "До 330 кВ")],
      },
      { for: "tools", key: "work-height", name: n("İş hündürlüyü", "Working height", "Рабочая высота"), component: number("m") },
      { for: "tools", key: "flow-rate", name: n("Maye axını", "Fluid flow", "Расход жидкости"), component: text("l/min") },
      {
        for: "fluids", key: "application", name: n("Təyinat", "Application", "Назначение"), component: select({ ...filter, ...onCard }),
        options: [
          n("Paylayıcı şkaflar, birinci dövrə avadanlığı, transformatorlar", "Switchgear, primary equipment, transformers", "Распределительные шкафы, первичное оборудование, трансформаторы"),
          n("İdarəetmə şkafları, dəqiq elektronika, serverlər", "Control cabinets, precision electronics, servers", "Шкафы управления, точная электроника, серверы"),
        ],
      },
      { for: "fluids", key: "evaporation-time", name: n("Buxarlanma müddəti", "Evaporation time", "Время испарения"), component: text("h") },
      { for: "fluids", key: "flash-point", name: n("Alışma temperaturu (açıq qab)", "Flash point (open cup)", "Температура вспышки (открытый тигель)"), component: text("°C") },
      { for: "fluids", key: "package-volume", name: n("Qab həcmi", "Container volume", "Объём тары"), component: number("l", onCard) },
    ],
  },
  {
    name: n("Texniki göstəricilər", "Technical specifications", "Технические характеристики"),
    items: [
      { for: "tools", key: "pressure", name: n("Təzyiq", "Pressure", "Давление"), component: text("kg") },
      {
        for: "tools", key: "control", name: n("İdarəetmə", "Control", "Управление"), component: select({ multiple: true }),
        options: [n("Panel", "Panel", "Панель"), n("Pult", "Remote control", "Пульт")],
      },
      { for: "tools", key: "insulation-class", name: n("İzolyasiya sinfi", "Insulation class", "Класс изоляции"), component: text() },
      { for: "tools", key: "battery", name: n("Batareya variantları", "Battery options", "Варианты батареи"), component: text() },
      {
        for: "tools", key: "power-supply", name: n("Qidalanma", "Power supply", "Электропитание"), component: select({ multiple: true }),
        options: [n("Daxili 48 V", "Built-in 48 V", "Встроенное 48 В"), n("Xarici 48 V", "External 48 V", "Внешнее 48 В"), n("Xarici 220 V", "External 220 V", "Внешнее 220 В")],
      },
      {
        for: "tools", key: "case-material", name: n("Korpus", "Housing", "Корпус"), component: select(),
        options: [
          n("Sinklənmiş təbəqə, paslanmayan polad birləşmələr", "Galvanised sheet, stainless steel fittings", "Оцинкованный лист, соединения из нержавеющей стали"),
          n("Mühəndis plastik çanta", "Engineering plastic case", "Кейс из инженерного пластика"),
        ],
      },
      { for: "fluids", key: "fire-point", name: n("Yanma temperaturu", "Fire point", "Температура воспламенения"), component: text("°C") },
      { for: "fluids", key: "liquid-class", name: n("Sinif", "Class", "Класс"), component: text() },
      { for: "fluids", key: "breakdown-voltage", name: n("Deşilmə gərginliyi", "Breakdown voltage", "Пробивное напряжение"), component: text() },
      { for: "fluids", key: "cleaning-efficiency", name: n("Təmizləmə səmərəsi", "Cleaning efficiency", "Эффективность очистки"), component: text("%") },
      { for: "fluids", key: "density", name: n("Sıxlıq", "Density", "Плотность"), component: text() },
      { for: "fluids", key: "volume-resistivity", name: n("Həcmi müqavimət", "Volume resistivity", "Объёмное сопротивление"), component: text("Ω·cm") },
    ],
  },
  {
    name: n("Ölçü və çəki", "Dimensions and weight", "Размеры и вес"),
    items: [
      { for: "tools", key: "dimensions", name: n("Ölçülər (U×E×H)", "Dimensions (L×W×H)", "Размеры (Д×Ш×В)"), component: text("mm") },
      { for: "tools", key: "weight", name: n("Çəki", "Weight", "Вес"), component: number("kg") },
    ],
  },
];

GROUPS.forEach((group) => {
  let groupDoc = db.characteristic_groups.findOne({ section: SECTION, "name.en": group.name.en });
  if (!groupDoc) {
    const res = db.characteristic_groups.insertOne({
      name: group.name,
      section: SECTION,
      photo: { display: false, multiple: false, background: false },
      hasDescription: false,
    });
    groupDoc = { _id: res.insertedId };
    print(`+ group ${group.name.az}`);
  }
  group.items.forEach((item) => {
    let charDoc = db.characteristics.findOne({ section: SECTION, key: item.key });
    if (!charDoc) {
      const res = db.characteristics.insertOne({
        name: item.name,
        key: item.key,
        section: SECTION,
        categories: [categoryIds[item.for]],
        group: groupDoc._id,
        component: item.component,
      });
      charDoc = { _id: res.insertedId };
      print(`+ char ${item.key}`);
    }
    (item.options || []).forEach((option) => {
      if (!db.characteristic_options.findOne({ characteristic: charDoc._id, "name.en": option.en })) {
        db.characteristic_options.insertOne({ name: option, section: SECTION, group: groupDoc._id, characteristic: charDoc._id });
      }
    });
  });
});

print("Hazırdır.");
