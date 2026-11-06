export const navigations = () => {

  const routes = {
    home: { path: "/" },
    chargingStations: { path: "/charging-stations" },
    connectors: { path: "/connectors-accessories" },
    chargerGuide: { path: "/charger-guide" },
    energy: {
      path: "/solar-energy",
      solar: { path: "/solar-energy" },
      wind: { path: "/wind-energy" },
      storage: { path: "/energy-storage" },
      inverters: { path: "/inverters" },
      calculator: { path: "/solar-calculator" },
    },
    laser: { path: "/laser-equipment" },
    insulationCleaning: { path: "/insulation-cleaning" },
    blog: { path: "/blog" },
    ourCompany: {
      path: "/about",
      about: { path: "/about" },
      services: { path: "/services" },
      contact: { path: "/contact" },
    },
  }


  return {
    az: [
      { name: "Ana Səhifə", href: routes.home.path },
      {
        name: "Şarj Stansiyaları",
        href: routes.chargingStations.path,
        subItems: [
          { name: "Şarj Stansiyaları", href: routes.chargingStations.path },
          { name: "Bağlayıcılar və Aksesuarlar", href: routes.connectors.path },
          { name: "Stansiya seçim bələdçisi", href: routes.chargerGuide.path },
        ],
      },
      {
        name: "Enerji Həlləri",
        href: routes.energy.path,
        subItems: [
          { name: "Günəş Enerjisi", href: routes.energy.solar.path },
          { name: "Külək Enerjisi", href: routes.energy.wind.path },
          { name: "Enerji Saxlama (BESS)", href: routes.energy.storage.path },
          { name: "İnvertorlar", href: routes.energy.inverters.path },
          { name: "İzolyasiya Təmizləmə Avadanlığı", href: routes.insulationCleaning.path },
          { name: "Günəş sistemi hesablayıcısı", href: routes.energy.calculator.path },
        ],
      },
      { name: "Lazer Avadanlıqları", href: routes.laser.path },
      { name: "Bloq", href: routes.blog.path },
      {
        name: "Şirkətimiz",
        href: routes.ourCompany.path,
        subItems: [
          { name: "Haqqımızda", href: routes.ourCompany.about.path },
          { name: "Quraşdırma və Servis", href: routes.ourCompany.services.path },
          { name: "Əlaqə", href: routes.ourCompany.contact.path },
        ],
      },
    ],
    en: [
      { name: "Home", href: routes.home.path },
      {
        name: "Charging Stations",
        href: routes.chargingStations.path,
        subItems: [
          { name: "Charging Stations", href: routes.chargingStations.path },
          { name: "Connectors & Accessories", href: routes.connectors.path },
          { name: "Charger selection guide", href: routes.chargerGuide.path },
        ],
      },
      {
        name: "Energy Solutions",
        href: routes.energy.path,
        subItems: [
          { name: "Solar Energy", href: routes.energy.solar.path },
          { name: "Wind Energy", href: routes.energy.wind.path },
          { name: "Energy Storage (BESS)", href: routes.energy.storage.path },
          { name: "Inverters", href: routes.energy.inverters.path },
          { name: "Insulation Cleaning Equipment", href: routes.insulationCleaning.path },
          { name: "Solar system calculator", href: routes.energy.calculator.path },
        ],
      },
      { name: "Laser Equipment", href: routes.laser.path },
      { name: "Blog", href: routes.blog.path },
      {
        name: "Our Company",
        href: routes.ourCompany.path,
        subItems: [
          { name: "About Us", href: routes.ourCompany.about.path },
          { name: "Installation & Service", href: routes.ourCompany.services.path },
          { name: "Contact", href: routes.ourCompany.contact.path },
        ],
      },
    ],
    ru: [
      { name: "Главная", href: routes.home.path },
      {
        name: "Зарядные станции",
        href: routes.chargingStations.path,
        subItems: [
          { name: "Зарядные станции", href: routes.chargingStations.path },
          { name: "Разъемы и аксессуары", href: routes.connectors.path },
          { name: "Как выбрать станцию", href: routes.chargerGuide.path },
        ],
      },
      {
        name: "Энергорешения",
        href: routes.energy.path,
        subItems: [
          { name: "Солнечная энергия", href: routes.energy.solar.path },
          { name: "Ветровая энергия", href: routes.energy.wind.path },
          { name: "Накопители энергии (BESS)", href: routes.energy.storage.path },
          { name: "Инверторы", href: routes.energy.inverters.path },
          { name: "Оборудование для очистки изоляции", href: routes.insulationCleaning.path },
          { name: "Калькулятор солнечной системы", href: routes.energy.calculator.path },
        ],
      },
      { name: "Лазеры", href: routes.laser.path },
      { name: "Блог", href: routes.blog.path },
      {
        name: "Компания",
        href: routes.ourCompany.path,
        subItems: [
          { name: "О нас", href: routes.ourCompany.about.path },
          { name: "Монтаж и сервис", href: routes.ourCompany.services.path },
          { name: "Контакты", href: routes.ourCompany.contact.path },
        ],
      },
    ],
  }

}