export const navigations = () => {

  const routes = {
    home: { path: "/" },
    chargingStations: { path: "/charging-stations" },
    electricVehicles: { path: "/electric-vehicles" },
    connectors: { path: "/connectors-accessories" },
    energy: {
      path: "/solar-energy",
      solar: { path: "/solar-energy" },
      wind: { path: "/wind-energy" },
      storage: { path: "/energy-storage" },
    },
    laser: { path: "/laser-equipment" },
    blog: { path: "/blog" },
    ourCompany: {
      path: "/about",
      about: { path: "/about" },
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
        ],
      },
      /*{
        name: "Elektrikli Nəqliyyat Vasitələri",
        href: routes.electricVehicles.path,
      },*/
      {
        name: "Enerji Həlləri",
        href: routes.energy.path,
        subItems: [
          { name: "Günəş Enerjisi", href: routes.energy.solar.path },
          { name: "Külək Enerjisi", href: routes.energy.wind.path },
          { name: "Enerji Saxlama (BESS)", href: routes.energy.storage.path },
        ],
      },
      { name: "Lazer Avadanlıqları", href: routes.laser.path },
      { name: "Bloq", href: routes.blog.path },
      {
        name: "Şirkətimiz",
        href: routes.ourCompany.path,
        subItems: [
          { name: "Haqqımızda", href: routes.ourCompany.about.path },
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
        ],
      },
      /*{ name: "Electric Vehicles", href: routes.electricVehicles.path },*/
      {
        name: "Energy Solutions",
        href: routes.energy.path,
        subItems: [
          { name: "Solar Energy", href: routes.energy.solar.path },
          { name: "Wind Energy", href: routes.energy.wind.path },
          { name: "Energy Storage (BESS)", href: routes.energy.storage.path },
        ],
      },
      { name: "Laser Equipment", href: routes.laser.path },
      { name: "Blog", href: routes.blog.path },
      {
        name: "Our Company",
        href: routes.ourCompany.path,
        subItems: [
          { name: "About Us", href: routes.ourCompany.about.path },
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
        ],
      },
      /*{ name: "Электромобили", href: routes.electricVehicles.path },*/
      {
        name: "Энергетические решения",
        href: routes.energy.path,
        subItems: [
          { name: "Солнечная энергия", href: routes.energy.solar.path },
          { name: "Ветровая энергия", href: routes.energy.wind.path },
          { name: "Накопители энергии (BESS)", href: routes.energy.storage.path },
        ],
      },
      { name: "Лазерное оборудование", href: routes.laser.path },
      { name: "Блог", href: routes.blog.path },
      {
        name: "Наша компания",
        href: routes.ourCompany.path,
        subItems: [
          { name: "О нас", href: routes.ourCompany.about.path },
          { name: "Контакты", href: routes.ourCompany.contact.path },
        ],
      },
    ],
  }

}