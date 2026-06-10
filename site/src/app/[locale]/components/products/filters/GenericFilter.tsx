import { Radio, FormLabel } from "@mui/material";
import { FaRegCircle } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

interface Category {
  name: string;
  slug: string;
  _id: string;
  section: string;
}

interface Characteristic {
  name: string;
  _id: string;
  categories: Category[];
}

interface FilterChild {
  name: string;
  _id: string;
  section: string;
  group: { name: string; _id: string };
  characteristic: Characteristic;
}

export interface FilterData {
  name: string;
  _id: string;
  component: {
    name: string;
    attrs: { multiple: boolean; showOnFilter: boolean };
  };
  key: string;
  children: FilterChild[];
}

interface GenericFilterProps {
  filters: FilterData[];
  selectedValues: { [key: string]: string };
  onChange: (filterKey: string, value: string) => void;
}

export const GenericFilter = ({
  filters,
  selectedValues,
  onChange,
}: GenericFilterProps) => {
  return (
    <>
      {filters.map((filter) => (
        <div
          key={filter._id}
          className="border-b-2 border-elcar-opacity pb-3 mb-2"
        >
          <div className="px-3">
            <h2 className="text-lg font-semibold mb-2 dark:text-primary-foreground">
              {filter?.name}
            </h2>
          </div>
          <div className="p-3 flex flex-col gap-1">
            {filter?.children?.map((child) => (
              <FormLabel
                key={child._id}
                className="flex items-center gap-2 group"
              >
                <Radio
                  name={filter.key}
                  value={child._id}
                  size="small"
                  sx={{ color: "#006965" }}
                  className="group-hover:!bg-elcar-opacity !rounded-full"
                  icon={<FaRegCircle className="!w-6 !h-6 !p-0 text-elcar" />}
                  checkedIcon={
                    <IoMdCheckmarkCircleOutline className="w-6 h-6 scale-125 !p-0 text-elcar" />
                  }
                  checked={selectedValues[filter.key] === child._id}
                  onChange={() => onChange(filter.key, child._id)}
                />
                {child.name}
              </FormLabel>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
