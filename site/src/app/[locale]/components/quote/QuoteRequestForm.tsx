"use client";

import { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdSend } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { sendMessage } from "@/api/request";
import { AlertModal, AlertType } from "../common/AlertModal";

const OBJECTS = ["home", "business", "industry", "other"] as const;

/**
 * Quraşdırma təklifi sorğusu. Mövcud "messages" xidmətinə göndərilir —
 * admin paneldə Mesajlar bölməsində görünür və e-poçtla bildiriş gedir.
 * `summary` (məs. hesablayıcının nəticəsi) mesajın sonuna əlavə olunur.
 */
const QuoteRequestForm = ({ summary }: { summary?: string }) => {
  const t = useTranslations("quote");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AlertType>("success");
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    // API ilə eyni qayda: istənilən əlifbanın hərfləri, boşluq, . ' -
    fullName: z
      .string()
      .trim()
      .min(2, t("errors.full-name"))
      .regex(/^[\p{L}\s.'-]+$/u, t("errors.full-name")),
    phone: z.string().trim().min(7, t("errors.phone")),
    email: z.string().trim().email(t("errors.email")),
    object: z.enum(OBJECTS),
    city: z.string().trim().max(100).optional(),
    note: z.string().trim().max(1000).optional(),
  });
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { object: "home" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const message = [
      `[${t("subject")}]`,
      `${t("object")}: ${t(`objects.${data.object}`)}`,
      data.city && `${t("city")}: ${data.city}`,
      summary && `\n${t("calc")}:\n${summary}`,
      data.note && `\n${t("note")}: ${data.note}`,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await sendMessage({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      message,
    });
    setLoading(false);
    setType(res ? "success" : "error");
    setOpen(true);
    if (res) reset({ object: data.object });
  };

  const fieldSx = {
    "& .MuiInputBase-input": { fontSize: "14px" },
    "& .MuiInputLabel-root": { fontSize: "14px" },
    "html.dark & .MuiInputLabel-root": { color: "#fff" },
    "html.dark & .MuiInputBase-root": { backgroundColor: "#1f2937", color: "#fff" },
  };

  return (
    <div className="border p-6 dark:border-secondary-foreground">
      <h2 className="text-2xl font-black text-title dark:text-primary-foreground">
        {t("title")}
      </h2>
      <p className="mt-2 text-sm text-subtitle dark:text-secondary-foreground">
        {t("subtitle")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 grid sm:grid-cols-2 gap-4">
        <TextField
          label={t("full-name")}
          size="small"
          fullWidth
          autoComplete="name"
          {...register("fullName")}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
          sx={fieldSx}
        />
        <TextField
          label={t("phone")}
          size="small"
          fullWidth
          type="tel"
          autoComplete="tel"
          {...register("phone")}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          sx={fieldSx}
        />
        <TextField
          label={t("email")}
          size="small"
          fullWidth
          type="email"
          autoComplete="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={fieldSx}
        />
        <TextField
          select
          label={t("object")}
          size="small"
          fullWidth
          defaultValue="home"
          {...register("object")}
          sx={fieldSx}
        >
          {OBJECTS.map((o) => (
            <MenuItem key={o} value={o}>
              {t(`objects.${o}`)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t("city")}
          size="small"
          fullWidth
          className="sm:col-span-2"
          {...register("city")}
          sx={fieldSx}
        />
        <TextField
          label={t("note")}
          size="small"
          fullWidth
          multiline
          rows={3}
          className="sm:col-span-2"
          {...register("note")}
          sx={fieldSx}
        />

        <div className="sm:col-span-2 flex justify-end">
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="!rounded-3xl !bg-elcar !text-white flex items-center gap-2"
          >
            {t("send")}
            {loading ? <FaSpinner className="animate-spin" /> : <MdSend />}
          </Button>
        </div>
      </form>

      <AlertModal open={open} onClose={() => setOpen(false)} type={type} />
    </div>
  );
};

export default QuoteRequestForm;
