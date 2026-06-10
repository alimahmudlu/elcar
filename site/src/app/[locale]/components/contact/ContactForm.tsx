"use client";
import { Button, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdSend } from "react-icons/md";
import { sendMessage } from "@/api/request";
import { AlertModal, AlertType } from "../common/AlertModal";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const ContactForm = () => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AlertType>("success");
  const [loading, setLoading] = useState(false);

  const ContactSchema = z.object({
    fullName: z.string().min(1, t("contact.form.errors.full-name")),
    email: z.string().email(t("contact.form.errors.email")),
    phone: z.string().min(7, t("contact.form.errors.phone")),
    message: z.string().min(1, t("contact.form.errors.message")),
  });
  type ContactFormData = z.infer<typeof ContactSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    const res = await sendMessage(data);
    if (!res) {
      setType("error");
      setOpen(true);
      setLoading(false);
      return;
    }

    setType("success");
    setOpen(true);
    setLoading(false);
    reset();
  };

  const textFieldStyles = {
    "& .MuiInputBase-input": {
      fontSize: "14px",
    },
    "& .MuiInputLabel-root": {
      fontSize: "14px",
    },
    "html.dark & .MuiInputLabel-root": {
      color: "#fff",
    },
    "html.dark & .MuiInputBase-root": {
      backgroundColor: "#1f2937",
      color: "#fff",
    },
    "html.dark & .MuiInputBase-root:hover": {
      backgroundColor: "#1f2937",
    },
    "html.dark & .MuiInputBase-root:focus": {
      backgroundColor: "#1f2937",
    },
    "html.dark & .MuiInputBase-root:active": {
      backgroundColor: "#1f2937",
    },
  };

  return (
    <div>
      <Typography
        variant="h5"
        className="font-bold mb-4 dark:text-primary-foreground"
      >
        {t("contact.form.title")}
      </Typography>
      <Typography className="mb-6 dark:text-secondary-foreground">
        {t("contact.form.subtitle")}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="grid max-md:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <TextField
            label={t("contact.form.full-name")}
            variant="outlined"
            fullWidth
            size="small"
            {...register("fullName")}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            sx={textFieldStyles}
            className=""
          />

          <TextField
            label={t("contact.form.email")}
            variant="outlined"
            fullWidth
            size="small"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={textFieldStyles}
          />

          <TextField
            label={t("contact.form.phone")}
            variant="outlined"
            fullWidth
            className="max-md:col-span-2"
            size="small"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            sx={textFieldStyles}
          />
        </div>

        <TextField
          label={t("contact.form.message")}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          size="small"
          className="mb-4 dark:bg-[#1f2937]"
          {...register("message")}
          error={!!errors.message}
          helperText={errors.message?.message}
          sx={{
            ...textFieldStyles,
            "& .MuiInputBase-root": {
              alignItems: "flex-start",
            },
          }}
        />

        <div className="w-full flex justify-end items-center mt-4">
          <Button
            type="submit"
            variant="contained"
            className="!rounded-3xl !bg-elcar !text-white flex items-center gap-2 focused"
            // color="primary"
          >
            {t("contact.form.send")}
            {loading ? (
              <FaSpinner className="ml-2 animate-spin" />
            ) : (
              <MdSend className="ml-2" />
            )}
          </Button>
        </div>
      </form>
      <AlertModal open={open} onClose={() => setOpen(false)} type={type} />
    </div>
  );
};

export default ContactForm;
