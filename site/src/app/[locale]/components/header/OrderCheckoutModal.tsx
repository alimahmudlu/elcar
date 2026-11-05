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
import { FaTimes, FaShoppingCart, FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BasketProductType } from "@/types";
import { extractTitlePrefix } from "@/lib/utils";
import { sendMessage } from "@/api/request";
import { useCartStore } from "@/lib/cartStore";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { AlertModal } from "../common/AlertModal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL } from "@/api/endpoints";
interface Props {
  open: boolean;
  onClose: () => void;
  products: BasketProductType[];
}

const formatAmount = (value: number) => `${Number(value.toFixed(2))} AZN`;

/**
 * Sifariş WhatsApp ilə verilir: düymə basılanda səbətin mətni ilə açılır, mesajı
 * müştəri göndərir. Surəti admin paneldə Mesajlar bölməsinə yazılır. Bank ödənişi
 * yaradan /orders xidməti burada işlədilmir.
 */
export default function OrderCheckoutModal({ open, onClose, products }: Props) {
  const t = useTranslations("header");
  const tQuote = useTranslations("quote");
  const clearBasket = useCartStore((state) => state.clearBasket);

  const [openAlert, setOpenAlert] = useState(false);
  const [whatsappHref, setWhatsappHref] = useState("");

  const lineTotal = (item: BasketProductType) => item.price * item.count;
  const totalPrice = products.reduce((sum, item) => sum + lineTotal(item), 0);

  // API ilə eyni ad qaydası: istənilən əlifbanın hərfləri, boşluq, . ' -
  const orderSchema = z.object({
    purchaser: z
      .string()
      .trim()
      .min(2, tQuote("errors.full-name"))
      .regex(/^[\p{L}\s.'-]+$/u, tQuote("errors.full-name")),
    phone: z.string().trim().min(7, tQuote("errors.phone")),
    email: z
      .string()
      .trim()
      .email(tQuote("errors.email"))
      .optional()
      .or(z.literal("")),
    note: z.string().trim().max(1000).optional(),
  });
  type OrderFormType = z.infer<typeof orderSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormType>({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit = async (values: OrderFormType) => {
    const label = (key: string) => t(`confirmModal.${key}`);
    const productLines = products.map((item, i) => {
      const title = extractTitlePrefix(item.title, item.category.name);
      const price = item.price ? `: ${formatAmount(lineTotal(item))}` : "";
      return `${i + 1}. ${title} × ${item.count}${price}`;
    });
    // Mətn kəsilsə məbləğ itməsin deyə məhsullardan əvvəl yazılır
    const order = [
      totalPrice > 0 && `${label("table.total")}: ${formatAmount(totalPrice)}`,
      `\n${label("table.products")}:`,
      ...productLines,
      values.note && `\n${label("form.note")}: ${values.note}`,
    ]
      .filter(Boolean)
      .join("\n");
    const subject = `[${label("subject")}]`;

    const href = buildWhatsAppHref(
      [
        subject,
        `${label("form.fullName")}: ${values.purchaser}`,
        `${label("form.phone")}: ${values.phone}`,
        values.email && `${label("form.email")}: ${values.email}`,
        order,
      ]
        .filter(Boolean)
        .join("\n")
    );
    setWhatsappHref(href);
    // Sorğunu gözləmədən açılır, yoxsa brauzer yeni pəncərəni bloklaya bilər
    window.open(href, "_blank", "noopener,noreferrer");

    await sendMessage({
      fullName: values.purchaser,
      email: values.email || undefined,
      phone: values.phone,
      message: `${subject}\n${order}`,
    });

    clearBasket();
    reset();
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
              {t("confirmModal.table.total")}: {formatAmount(totalPrice)}
            </Typography>
          </DialogContent>

          <DialogActions className="dark:bg-card dark:text-primary-foreground">
            <Button
              variant="contained"
              className="!rounded-2xl !bg-elcar flex items-center gap-2"
              color="primary"
              type="submit"
              disabled={isSubmitting}
            >
              <FaWhatsapp />
              {t("confirmModal.table.createOrder")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <AlertModal
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        type="info"
        title={tQuote("last-step")}
        message={tQuote("last-step-text")}
        action={
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-3xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <FaWhatsapp className="w-5 h-5" />
            {tQuote("whatsapp")}
          </a>
        }
      />
    </>
  );
}
