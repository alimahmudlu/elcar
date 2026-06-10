"use client";

import { ProductEnum } from "@/constants/enums";
import { motion } from "framer-motion";
import {
  Brand,
  CategoryType,
  GroupedCharacteristic,
  ModelType,
  ProductType,
} from "@/types";
import { useTranslations } from "next-intl";
import { HiFilter } from "react-icons/hi";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  Slider,
} from "@mui/material";
import { FaRegCircle } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { GenericFilter } from "./filters/GenericFilter";
import {
  chargingConnectors,
  chargingStations,
  getVehicles,
} from "@/api/request";
import ProductItem from "../common/ProductItem";
import MobileFilter from "./filters/MobileFilter";

type Props = {
  type: ProductEnum;
  categories: CategoryType[];
  brands: Brand[];
  models: ModelType[];
  filterOptions: GroupedCharacteristic[];
};

const ProductsSection = ({
  categories,
  type,
  brands,
  models,
  filterOptions,
}: Props) => {
  const t = useTranslations();
  const [filters, setFilters] = useState<any>({});
  const [skip, setSkip] = useState(0);
  const [limit] = useState(12);
  const [selectedModels, setSelectedModels] = useState<ModelType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minMaxPrice, setMinMaxPrice] = useState<[number, number]>([0, 10000]);
  const handleFilterChange = (key: string, value: string | null | number[]) => {
    setFilters((prevFilters: any) => {
      const newFilters = { ...prevFilters };
      if (value === null) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  };

  const getProducts = async (loadMore = false) => {
    setIsLoading(true);
    try {
      const cleanedFilters: { [key: string]: string | string[] } =
        Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            acc[key] = value as string | string[];
          }
          return acc;
        }, {} as { [key: string]: string | string[] });

      const res =
        type === ProductEnum.ChargingStation
          ? await chargingStations(cleanedFilters, loadMore ? `${skip}` : "0")
          : type === ProductEnum.Car
          ? await getVehicles(cleanedFilters, loadMore ? `${skip}` : "0")
          : await chargingConnectors(
              cleanedFilters,
              loadMore ? `${skip}` : "0"
            );

      const newProducts = res?.data || [];

      if (loadMore) {
        setProducts((prev) => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }

      const prices = newProducts
        .map((p: ProductType) => p.discountedPrice ?? p.price)
        .filter((price: number) => typeof price === "number");

      if (prices.length > 0) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setMinMaxPrice([min, max]);
        setPriceRange([min, max]);
      }

      const totalLoaded = loadMore
        ? products.length + res.data.length
        : res.data.length;
      setHasMore(totalLoaded < res.meta.total);

      if (loadMore) {
        setSkip((prev) => prev + limit);
      } else {
        setSkip(limit);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !isLoading) {
          getProducts(true);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading]);

  useEffect(() => {
    setSkip(0);
    getProducts(false);
  }, [filters]);

  useEffect(() => {
    getProducts(false);
  }, []);

  useEffect(() => {
    getProducts(filters.$skip > 0);
  }, [filters]);

  useEffect(() => {
    const selected = models.filter(
      (model) => model.brand._id === filters.brand
    );

    setSelectedModels(selected);
  }, [filters.brand]);

  const handleClearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).length > 0;
  };

  // let priceRangeTimeout: ReturnType<typeof setTimeout>;

  const handlePriceRangeChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    const range = newValue as [number, number];
    setPriceRange(range);

    // if (priceRangeTimeout) clearTimeout(priceRangeTimeout);

    // priceRangeTimeout = setTimeout(() => {
    //   handleFilterChange("priceRange", range);
    // }, 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10">
      <aside className="md:col-span-3 border border-gray-200 block max-md:hidden h-max">
        <div className="flex items-center justify-between border-b-2 border-elcar-opacity p-3">
          <h2 className="text-2xl font-black mb-2 flex dark:text-primary-foreground items-center gap-2">
            <HiFilter className="w-5 h-5 text-elcar dark:text-primary-foreground" />
            {t("pages-content.electric-vehicles.filters.title")}
          </h2>
          <div className="min-h-[32px] flex items-center dark:text-primary-foreground">
            {hasActiveFilters() && (
              <button
                onClick={handleClearFilters}
                className="text-elcar text-sm bg-elcar-opacity dark:text-primary-foreground px-3 py-1 rounded-md"
              >
                {t("pages-content.electric-vehicles.filters.clear")}
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="border-b-2 border-elcar-opacity pb-1">
          <div className="p-3">
            <h2 className="text-lg font-semibold mb-2 dark:text-primary-foreground">
              {t("pages-content.electric-vehicles.filters.categories")}
            </h2>
            <div className="space-y-2">
              <FormLabel key="all" className="flex items-center gap-2 group">
                <Radio
                  name="category"
                  value="all"
                  checked={filters.category === "" || !filters.category}
                  onChange={() => handleFilterChange("category", "")}
                  size="small"
                  sx={{ color: "elcar" }}
                  className="group-hover:!bg-elcar-opacity !rounded-full"
                  icon={<FaRegCircle className="!w-6 !h-6 !p-0 text-elcar" />}
                  checkedIcon={
                    <IoMdCheckmarkCircleOutline className="w-6 h-6 scale-125 !p-0 text-elcar" />
                  }
                />
                {t("pages-content.electric-vehicles.filters.all")}
              </FormLabel>
              {categories?.map((category) => (
                <FormLabel
                  key={category?._id}
                  className="flex items-center gap-2 group"
                >
                  <Radio
                    name="category"
                    value={category?._id}
                    checked={filters.category === category?._id}
                    onChange={() =>
                      handleFilterChange("category", category?._id)
                    }
                    size="small"
                    sx={{ color: "elcar" }}
                    className="group-hover:!bg-elcar-opacity !rounded-full"
                    icon={<FaRegCircle className="!w-6 !h-6 !p-0 text-elcar" />}
                    checkedIcon={
                      <IoMdCheckmarkCircleOutline className="w-6 h-6 scale-125 !p-0 text-elcar" />
                    }
                  />
                  {category?.name}
                </FormLabel>
              ))}
            </div>
          </div>
        </div>

        {/* Brnads */}
        <div className="border-b-2 border-elcar-opacity pb-1">
          <div className="p-3">
            <h2 className="text-lg font-semibold mb-2 dark:text-primary-foreground">
              {t("pages-content.electric-vehicles.filters.brands")}
            </h2>
            <div className="max-h-[250px] overflow-y-auto">
              <FormLabel key="all" className="flex items-center gap-2 group">
                <Radio
                  name="brand"
                  value="all"
                  checked={filters.brand === "" || !filters.brand}
                  onChange={() => handleFilterChange("brand", "")}
                  size="small"
                  sx={{ color: "elcar" }}
                  className="group-hover:!bg-elcar-opacity !rounded-full"
                  icon={<FaRegCircle className="!w-6 !h-6 !p-0 text-elcar" />}
                  checkedIcon={
                    <IoMdCheckmarkCircleOutline className="w-6 h-6 scale-125 !p-0 text-elcar" />
                  }
                />
                {t("pages-content.electric-vehicles.filters.all")}
              </FormLabel>
              {brands?.map((brand) => (
                <FormLabel
                  key={brand?._id}
                  className="flex items-center gap-2 group"
                >
                  <Radio
                    name="brand"
                    value={brand?._id}
                    checked={filters.brand === brand?._id}
                    onChange={() => handleFilterChange("brand", brand?._id)}
                    size="small"
                    sx={{ color: "elcar" }}
                    className="group-hover:!bg-elcar-opacity !rounded-full"
                    icon={<FaRegCircle className="!w-6 !h-6 !p-0 text-elcar" />}
                    checkedIcon={
                      <IoMdCheckmarkCircleOutline className="w-6 h-6 scale-125 !p-0 text-elcar" />
                    }
                  />
                  {brand?.name}
                </FormLabel>
              ))}
            </div>
          </div>
        </div>

        {/* Models */}
        {filters.brand && selectedModels?.length > 0 && (
          <div className="border-b-2 border-elcar-opacity pb-1">
            <div className="p-3">
              <h2 className="text-lg font-semibold mb-2 dark:text-primary-foreground">
                {t("pages-content.electric-vehicles.models")}
              </h2>
              <div className="max-h-[250px] overflow-y-auto px-1">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "#006965",
                          "&.Mui-checked": {
                            color: "#006965",
                          },
                        }}
                      />
                    }
                    label={t("pages-content.electric-vehicles.filters.all")}
                    className="-ml-2"
                  />
                  {selectedModels?.map((model) => (
                    <FormControlLabel
                      key={model?._id}
                      control={
                        <Checkbox
                          sx={{
                            color: "#006965",
                            "&.Mui-checked": {
                              color: "#006965",
                            },
                          }}
                        />
                      }
                      label={model?.name}
                      className="-ml-2"
                    />
                  ))}
                </FormGroup>
              </div>
            </div>
          </div>
        )}

        <div className="border-b-2 border-elcar-opacity pb-3">
          <div className="p-3">
            <h2 className="text-lg font-semibold mb-2 dark:text-primary-foreground">
              {t("pages-content.electric-vehicles.filters.price")}
            </h2>
            <div className="px-3">
              <Slider
                value={priceRange}
                min={minMaxPrice[0]}
                max={minMaxPrice[1]}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                sx={{
                  color: "#006965",
                  height: 4,
                  "& .MuiSlider-thumb": {
                    width: 16,
                    height: 16,
                    backgroundColor: "#fff",
                    border: "2px solid #006965",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0 0 0 8px rgba(0, 105, 101, 0.16)",
                    },
                    "&.Mui-active": {
                      boxShadow: "0 0 0 14px rgba(0, 105, 101, 0.16)",
                    },
                  },
                  "& .MuiSlider-rail": {
                    opacity: 0.28,
                  },
                }}
                className="dark:!text-secondary-foreground"
              />
            </div>
            <div className="text-sm text-gray-700 mt-2 px-3 dark:text-secondary-foreground">
              {minMaxPrice[0]} AZN - {minMaxPrice[1]} AZN
            </div>
          </div>
        </div>

        {/* Generic Filters */}
        {filterOptions?.length > 0 && (
          <GenericFilter
            filters={filterOptions}
            selectedValues={filters}
            onChange={handleFilterChange}
          />
        )}
      </aside>

      <div className="hidden max-md:block">
        <MobileFilter
          filters={filters}
          categories={categories}
          brands={brands}
          priceRange={priceRange}
          minMaxPrice={minMaxPrice}
          handlePriceRangeChange={handlePriceRangeChange}
          filterOptions={filterOptions}
          selectedModels={selectedModels}
          handleFilterChange={handleFilterChange}
          hasActiveFilters={hasActiveFilters()}
          handleClearFilters={handleClearFilters}
        />
      </div>

      <div className="md:col-span-9">
        <div className="flex justify-between mb-4 items-center max-md:flex-col max-md:gap-3">
          <h2 className="text-2xl font-black max-md:text-xl max-sm:text-base max-xs:text-sm mb-2 dark:text-primary-foreground">
            {type === ProductEnum.Car
              ? t("pages-content.electric-vehicles.all-cars")
              : type === ProductEnum.ChargingStation
              ? t("pages-content.chargingStations.all-products")
              : t("pages-content.connectors.all-products")}
          </h2>

          {/* Sort */}
          <FormControl className="!min-w-[150px] max-md:!w-full" size="small">
            <InputLabel
              className="dark:text-primary-foreground"
              id="sort-select-label"
            >
              {t("pages-content.electric-vehicles.sort.title")}
            </InputLabel>
            <Select
              value={
                filters.$sort
                  ? filters.$sort === "price"
                    ? "asc"
                    : "desc"
                  : "byDate"
              }
              onChange={(e) => {
                const selectedValue = e.target.value;

                // Eğer byDate seçilirse $sort'u tamamen sil
                if (selectedValue === "byDate") {
                  setFilters((prev: any) => {
                    const newFilters = { ...prev };
                    delete newFilters.$sort;
                    return newFilters;
                  });
                }
                // Diğer durumlarda uygun değeri set et
                else {
                  handleFilterChange(
                    "$sort",
                    selectedValue === "asc" ? "price" : "-price"
                  );
                }
              }}
              labelId="sort-select-label"
              id="sort-select"
              label={t("pages-content.electric-vehicles.sort.title")}
              className="!text-elcar dark:!text-white"
            >
              <MenuItem value="byDate">
                {t("pages-content.electric-vehicles.sort.byDate")}
              </MenuItem>
              <MenuItem value="asc">
                {t("pages-content.electric-vehicles.sort.asc")}
              </MenuItem>
              <MenuItem value="desc">
                {t("pages-content.electric-vehicles.sort.desc")}
              </MenuItem>
            </Select>
          </FormControl>
        </div>

        {isLoading && !products.length ? (
          <div className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-foreground rounded-lg shadow-md p-4 animate-pulse"
                >
                  <div className="bg-gray-300 dark:bg-card h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-300 dark:bg-card h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 dark:bg-card h-4 rounded mb-2 w-3/4"></div>
                  <div className="bg-gray-300 dark:bg-card h-6 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-3"
            >
              {products?.map((vehicle: ProductType) => (
                <ProductItem
                  key={vehicle._id}
                  product={vehicle}
                  type={type}
                  imageClass="w-[280px]"
                />
              ))}
            </motion.div>

            {/* Infinite scroll loader */}
            <div ref={loaderRef} className="flex justify-center my-6">
              {isLoading && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-elcar"></div>
              )}
              {!hasMore && (
                <p className="text-gray-500 dark:text-gray-400">
                  {t("pages-content.electric-vehicles.noResults")}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center w-full">
            <h4 className="text-2xl font-black">
              {t("pages-content.electric-vehicles.noResults")}
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsSection;
