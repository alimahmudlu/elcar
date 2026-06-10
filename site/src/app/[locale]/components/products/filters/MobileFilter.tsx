"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Box,
  Typography,
  Checkbox,
  Slider,
  FormControlLabel,
  FormGroup,
  Radio,
  FormLabel,
} from "@mui/material";
import { HiFilter } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { MdRefresh } from "react-icons/md";
import { useTranslations } from "next-intl";
import { GenericFilter } from "./GenericFilter";
import { FaRegCircle } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Brand, CategoryType, GroupedCharacteristic, ModelType } from "@/types";

interface MobileFilterProps {
  filters: any;
  categories: CategoryType[];
  brands: Brand[];
  priceRange: number[];
  minMaxPrice: number[];
  filterOptions: GroupedCharacteristic[];
  handlePriceRangeChange: (event: Event, newValue: number | number[]) => void;
  selectedModels: ModelType[];
  handleFilterChange: (key: string, value: string | null | number[]) => void;
  hasActiveFilters: boolean;
  handleClearFilters: () => void;
}

const MobileFilter = ({
  filters,
  categories,
  brands,
  priceRange,
  minMaxPrice,
  handlePriceRangeChange,
  filterOptions,
  selectedModels,
  handleFilterChange,
  hasActiveFilters,
  handleClearFilters,
}: MobileFilterProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const t = useTranslations();

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        <Button
          variant="contained"
          startIcon={<HiFilter />}
          onClick={handleOpen}
          className={`bg-elcar hover:bg-elcar/90 text-white md:hidden ${
            hasActiveFilters ? "col-span-2" : "col-span-3"
          }`}
          fullWidth
          sx={{
            "&.MuiButton-contained": {
              backgroundColor: "#006965",
              "&:hover": {
                backgroundColor: "#005a57",
              },
            },
          }}
        >
          {t("pages-content.electric-vehicles.filters.title")}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="contained"
            startIcon={<MdRefresh />}
            className="bg-elcar col-span-1 hover:bg-elcar/90 text-white md:hidden"
            fullWidth
            onClick={handleClearFilters}
            sx={{
              "&.MuiButton-contained": {
                backgroundColor: "#006965",
                "&:hover": {
                  backgroundColor: "#005a57",
                },
              },
            }}
          >
            {t("pages-content.electric-vehicles.filters.clear")}
          </Button>
        )}
      </div>

      <Dialog
        fullScreen
        transitionDuration={300}
        open={open}
        onClose={handleClose}
        className="md:hidden dark:!bg-background"
      >
        <DialogContent className="p-0 flex flex-col h-full dark:!bg-background">
          <Box className="flex items-center justify-between p-4 border-b sticky top-0 bg-white dark:bg-background z-10">
            <Typography
              variant="h6"
              className="font-bold dark:text-primary-foreground"
            >
              {t("pages-content.electric-vehicles.filters.title")}
            </Typography>
            <IconButton onClick={handleClose}>
              <IoClose className="w-6 h-6 dark:text-primary-foreground" />
            </IconButton>
          </Box>

          <Box className="flex-1 overflow-y-auto p-4 space-y-6 dark:text-primary-foreground">
            {/* Categories */}
            <div className="border-b-2 border-elcar-opacity pb-1">
              <div className="p-3">
                <h2 className="text-lg font-semibold mb-2 dark:text-primary-foreground">
                  {t("pages-content.electric-vehicles.filters.categories")}
                </h2>
                <div className="space-y-2">
                  <FormLabel
                    key="all"
                    className="flex items-center gap-2 group"
                  >
                    <Radio
                      name="category"
                      value="all"
                      checked={filters.category === "" || !filters.category}
                      onChange={() => handleFilterChange("category", "")}
                      size="small"
                      sx={{ color: "elcar" }}
                      className="group-hover:!bg-elcar-opacity !rounded-full"
                      icon={
                        <FaRegCircle className="!w-6 !h-6 !p-0 text-elcar" />
                      }
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
                        icon={
                          <FaRegCircle className="!w-6 !h-6 !p-0 text-elcar" />
                        }
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
                  <FormLabel
                    key="all"
                    className="flex items-center gap-2 group"
                  >
                    <Radio
                      name="brand"
                      value="all"
                      checked={filters.brand === "" || !filters.brand}
                      onChange={() => handleFilterChange("brand", "")}
                      size="small"
                      sx={{ color: "elcar" }}
                      className="group-hover:!bg-elcar-opacity !rounded-full"
                      icon={
                        <FaRegCircle className="!w-6 !h-6 !p-0 text-elcar" />
                      }
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
                        icon={
                          <FaRegCircle className="!w-6 !h-6 !p-0 text-elcar" />
                        }
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
          </Box>

          <Box className="p-4 border-t sticky bottom-0 bg-white dark:bg-background">
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                handleClose();
              }}
              sx={{
                backgroundColor: "#006965",
                "&:hover": {
                  backgroundColor: "#005a57",
                },
                padding: "12px",
                fontSize: "1rem",
              }}
            >
              {t("pages-content.electric-vehicles.filters.apply")}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileFilter;
