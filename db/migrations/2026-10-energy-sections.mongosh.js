// Enerji bölmələri: icazələr + başlanğıc kateqoriyalar
//
// İşə salmaq (əvvəlcə bazanın backup-ını alın):
//   mongosh "<MONGO_URI>" db/migrations/2026-10-energy-sections.mongosh.js
//
// Skript idempotentdir — təkrar işə salınsa, artıq mövcud olan
// bölmə/kateqoriyalar yenidən əlavə olunmur.

const SECTIONS = ["solar-energy", "wind-energy", "energy-storage", "inverters", "laser-equipment"];

// 1) Rol icazələri.
// root/owner rolları onsuz da "manage all" hüququna malikdir; admin/user
// rolları üçün hər yeni bölməyə "charging-stations" bölməsindəki
// eyni hüquqlar (create/read/update/delete) kopyalanır.
db.module_permissions.find({ "sections.key": "charging-stations" }).forEach((doc) => {
  const template = doc.sections.find((s) => s.key === "charging-stations");
  const existing = new Set(doc.sections.map((s) => s.key));
  const toAdd = SECTIONS.filter((key) => !existing.has(key)).map((key) => ({
    ...template,
    key,
  }));
  if (toAdd.length) {
    db.module_permissions.updateOne(
      { _id: doc._id },
      { $push: { sections: { $each: toAdd } } }
    );
    print(`module_permissions ${doc._id}: +${toAdd.map((s) => s.key).join(", ")}`);
  }
});

// 1b) Rəylər bölməsi: admin/user rollarına "messages" bölməsindəki hüquqlar
// kopyalanır (oxumaq, təsdiqləmək = update, silmək)
db.module_permissions.find({ "sections.key": "messages" }).forEach((doc) => {
  if (doc.sections.some((s) => s.key === "reviews")) return;
  const template = doc.sections.find((s) => s.key === "messages");
  db.module_permissions.updateOne(
    { _id: doc._id },
    { $push: { sections: { ...template, key: "reviews", alias: "reviews" } } }
  );
  print(`module_permissions ${doc._id}: +reviews`);
});

// 2) Başlanğıc kateqoriyalar (admin paneldən sonradan dəyişdirilə bilər)
const CATEGORIES = {
  "solar-energy": [
    [{ az: "Günəş panelləri", en: "Solar panels", ru: "Солнечные панели" },
     { az: "gunes-panelleri", en: "solar-panels", ru: "solnechnye-paneli" }],
    [{ az: "Montaj sistemləri", en: "Mounting systems", ru: "Системы крепления" },
     { az: "montaj-sistemleri", en: "mounting-systems", ru: "sistemy-krepleniya" }],
    [{ az: "Hazır dəstlər", en: "Complete kits", ru: "Готовые комплекты" },
     { az: "hazir-destler", en: "complete-kits", ru: "gotovye-komplekty" }],
  ],
  "wind-energy": [
    [{ az: "Külək turbinləri", en: "Wind turbines", ru: "Ветрогенераторы" },
     { az: "kulek-turbinleri", en: "wind-turbines", ru: "vetrogeneratory" }],
    [{ az: "Kontrollerlər", en: "Controllers", ru: "Контроллеры" },
     { az: "kontrollerler", en: "controllers", ru: "kontrollery" }],
    [{ az: "Hibrid günəş-külək sistemləri", en: "Hybrid solar-wind systems", ru: "Гибридные солнечно-ветровые системы" },
     { az: "hibrid-gunes-kulek-sistemleri", en: "hybrid-solar-wind-systems", ru: "gibridnye-solnechno-vetrovye-sistemy" }],
  ],
  "energy-storage": [
    [{ az: "Ev batareyaları", en: "Home batteries", ru: "Домашние аккумуляторы" },
     { az: "ev-batareyalari", en: "home-batteries", ru: "domashnie-akkumulyatory" }],
    [{ az: "Kommersiya və sənaye BESS", en: "Commercial & industrial BESS", ru: "Коммерческие и промышленные BESS" },
     { az: "kommersiya-ve-senaye-bess", en: "commercial-industrial-bess", ru: "kommercheskie-i-promyshlennye-bess" }],
    [{ az: "Akkumulyator modulları", en: "Battery modules", ru: "Аккумуляторные модули" },
     { az: "akkumulyator-modullari", en: "battery-modules", ru: "akkumulyatornye-moduli" }],
  ],
  "inverters": [
    [{ az: "Hibrid invertorlar", en: "Hybrid inverters", ru: "Гибридные инверторы" },
     { az: "hibrid-invertorlar", en: "hybrid-inverters", ru: "gibridnye-invertory" }],
    [{ az: "Şəbəkəyə qoşulan invertorlar", en: "On-grid inverters", ru: "Сетевые инверторы" },
     { az: "sebekeye-qosulan-invertorlar", en: "on-grid-inverters", ru: "setevye-invertory" }],
    [{ az: "Avtonom invertorlar", en: "Off-grid inverters", ru: "Автономные инверторы" },
     { az: "avtonom-invertorlar", en: "off-grid-inverters", ru: "avtonomnye-invertory" }],
    [{ az: "Mikroinvertorlar", en: "Microinverters", ru: "Микроинверторы" },
     { az: "mikroinvertorlar", en: "microinverters", ru: "mikroinvertory" }],
  ],
  "laser-equipment": [
    [{ az: "Lazer kəsmə", en: "Laser cutting", ru: "Лазерная резка" },
     { az: "lazer-kesme", en: "laser-cutting", ru: "lazernaya-rezka" }],
    [{ az: "Lazer qaynaq", en: "Laser welding", ru: "Лазерная сварка" },
     { az: "lazer-qaynaq", en: "laser-welding", ru: "lazernaya-svarka" }],
    [{ az: "Lazer markalama", en: "Laser marking", ru: "Лазерная маркировка" },
     { az: "lazer-markalama", en: "laser-marking", ru: "lazernaya-markirovka" }],
    [{ az: "Lazerlə təmizləmə", en: "Laser cleaning", ru: "Лазерная очистка" },
     { az: "lazerle-temizleme", en: "laser-cleaning", ru: "lazernaya-ochistka" }],
  ],
};

Object.entries(CATEGORIES).forEach(([section, list]) => {
  list.forEach(([name, slug]) => {
    const res = db.categories.updateOne(
      { section, "slug.en": slug.en },
      { $setOnInsert: { section, name, slug } },
      { upsert: true }
    );
    if (res.upsertedCount) print(`categories: + ${section} / ${name.az}`);
  });
});

print("Hazırdır.");
