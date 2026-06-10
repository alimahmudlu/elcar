import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import { FaTimes, FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BasketProductType } from "@/types";
import { extractTitlePrefix } from "@/lib/utils";
import { createOrder } from "@/api/request";
import { AlertModal, AlertType } from "../common/AlertModal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL } from "@/api/endpoints";
interface Props {
  open: boolean;
  onClose: () => void;
  products: BasketProductType[];
}

const orderSchema = z.object({
  purchaser: z.string().min(2, "Ad çox qısadır"),
  phone: z.string().min(5, "Telefon düzgün deyil"),
  email: z.string().optional(),
  note: z.string().optional(),
});

type OrderFormType = z.infer<typeof orderSchema>;

export default function OrderCheckoutModal({ open, onClose, products }: Props) {
  const t = useTranslations("header");

  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("success");
  const [alertMessage, setAlertMessage] = useState("");

  const totalPrice = products.reduce((sum, item) => sum + item.price, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormType>({
    resolver: zodResolver(orderSchema),
  });
  const onSubmit = async (values: OrderFormType) => {
    const data = {
      purchaser: values.purchaser,
      email: values.email,
      message: values.note,
      phone: values.phone,
      products: products.map((item) => ({
        detail: item._id,
        amount: item.count,
      })),
    };

    const res = await createOrder(data);

    if (!res || res.error) {
      setAlertType("error");
      setAlertMessage(res?.message || "Xəta baş verdi");
    } else {
      setAlertType("success");
      setAlertMessage(res.message);
    }

    setOpenAlert(true);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        className="modal"
      >
        <DialogTitle className="flex items-center justify-between dark:bg-card dark:text-primary-foreground  max-xs:!p-3">
          <div className="flex items-center gap-2 max-xs:text-base">
            <FaShoppingCart />
            {t("confirmModal.title")}
          </div>
          <IconButton
            onClick={onClose}
            className=" dark:text-primary-foreground"
          >
            <FaTimes className="dark:text-primary-foreground" />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            className="dark:bg-card dark:text-primary-foreground max-xs:!p-3"
            dividers
          >
            <Typography
              fontWeight="bold"
              className="max-xs:!text-base"
              gutterBottom
            >
              {t("confirmModal.subtitle")}
            </Typography>
            <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4 max-sm:gap-2 gap-y-6 max-sm:gap-y-3 mb-6 max-sm:mb-3">
              <TextField
                label={t("confirmModal.form.fullName")}
                fullWidth
                size="small"
                {...register("purchaser")}
                error={!!errors.purchaser}
                helperText={errors.purchaser?.message}
              />
              <TextField
                label={t("confirmModal.form.phone")}
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                fullWidth
                size="small"
              />
              <TextField
                label={t("confirmModal.form.email")}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                size="small"
              />
              <TextField
                label={t("confirmModal.form.note")}
                {...register("note")}
                error={!!errors.note}
                helperText={errors.note?.message}
                fullWidth
                multiline
                rows={4}
                size="small"
                className="col-span-3 max-sm:col-span-1"
              />
            </div>

            <Typography fontWeight="bold" gutterBottom>
              {t("confirmModal.table.products")}
            </Typography>

            <div className="overflow-auto">
              <TableContainer
                className="dark:bg-foreground"
                sx={{ overflowX: "auto" }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="dark:!text-primary-foreground">
                        {t("confirmModal.table.photo")}
                      </TableCell>
                      <TableCell className="dark:!text-primary-foreground">
                        {t("confirmModal.table.product")}
                      </TableCell>
                      <TableCell className="dark:!text-primary-foreground">
                        {t("confirmModal.table.quantity")}
                      </TableCell>
                      <TableCell className="dark:!text-primary-foreground">
                        {t("confirmModal.table.discount")}
                      </TableCell>
                      <TableCell className="dark:!text-primary-foreground">
                        {t("confirmModal.table.oldPrice")}
                      </TableCell>
                      <TableCell className="dark:!text-primary-foreground">
                        {t("confirmModal.table.price")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="dark:!text-primary-foreground">
                          <Image
                            width={64}
                            height={64}
                            src={`${BASE_URL}/${item.image.src}`}
                            alt={extractTitlePrefix(
                              item?.title,
                              item?.category.name
                            )}
                            style={{
                              objectFit: "contain",
                              width: 64,
                              height: 64,
                            }}
                          />
                        </TableCell>
                        <TableCell className="dark:!text-primary-foreground">
                          {extractTitlePrefix(item.title, item.category.name)}
                        </TableCell>
                        <TableCell className="dark:!text-primary-foreground">
                          {item.count}
                        </TableCell>
                        <TableCell className="dark:!text-primary-foreground">
                          {item.discount || 0}%
                        </TableCell>
                        <TableCell className="dark:!text-primary-foreground">
                          <s>{item.oldPrice ? `${item.oldPrice} AZN` : "-"}</s>
                        </TableCell>
                        <TableCell className="dark:!text-primary-foreground">
                          {item.price} AZN
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <Divider className="my-3" />
            <Typography align="right" fontWeight="bold" color="success.main">
              {t("confirmModal.table.total")}: {totalPrice} AZN
            </Typography>
          </DialogContent>

          <DialogActions className="dark:bg-card dark:text-primary-foreground">
            <Button
              variant="contained"
              className="!rounded-2xl !bg-elcar"
              color="primary"
              type="submit"
            >
              {t("confirmModal.table.createOrder")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <AlertModal
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        type={alertType}
        message={alertMessage}
      />
    </>
  );
}
