export const navigations = () => {

  const routes = {
    home: { path: "/" },
    chargingStations: { path: "/charging-stations" },
    electricVehicles: { path: "/electric-vehicles" },
    connectors: { path: "/connectors-accessories" },
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
      { name: "Yükləmə Stansiyaları", href: routes.chargingStations.path },
      /*{
        name: "Elektrikli Nəqliyyat Vasitələri",
        href: routes.electricVehicles.path,
      },*/
      { name: "Bağlayıcılar və Aksesuarlar", href: routes.connectors.path },
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
      { name: "Charging Stations", href: routes.chargingStations.path },
      /*{ name: "Electric Vehicles", href: routes.electricVehicles.path },*/
      { name: "Connectors & Accessories", href: routes.connectors.path },
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
      { name: "Зарядные станции", href: routes.chargingStations.path },
      /*{ name: "Электромобили", href: routes.electricVehicles.path },*/
      { name: "Разъемы и аксессуары", href: routes.connectors.path },
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