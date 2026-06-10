import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

interface SortSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  t: (key: string) => string;
}

export const SortSelect = ({ value, onChange, t }: SortSelectProps) => {
  const selectValue =
    value === "price" ? "asc" : value === "-price" ? "desc" : value;

  return (
    <div className="flex justify-between mb-4 items-center">
      <h2 className="text-2xl font-black mb-2 dark:text-primary-foreground">
        {t("all-cars")}
      </h2>

      <FormControl className="max-md:w-1/3" size="small">
        <InputLabel
          className="dark:text-primary-foreground"
          id="sort-select-label"
        >
          {t("sort.title")}
        </InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={selectValue}
          label={t("sort.title")}
          onChange={onChange}
          className="!text-elcar dark:!text-white"
        >
          <MenuItem value="byDate">{t("sort.byDate")}</MenuItem>
          <MenuItem value="asc">{t("sort.asc")}</MenuItem>
          <MenuItem value="desc">{t("sort.desc")}</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
