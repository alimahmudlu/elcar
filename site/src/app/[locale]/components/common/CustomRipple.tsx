import { Ripple } from "primereact/ripple";

const CustomRipple = () => {
  return (
    <Ripple
      pt={{
        root: {
          style: {
            background: "#0069652d",
            border: "none",
            outline: "none",
            zIndex: "50",
          },
        },
      }}
    />
  );
};

export default CustomRipple;
