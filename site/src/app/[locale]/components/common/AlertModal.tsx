import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { JSX } from "react";
import { RxCross1 } from "react-icons/rx";
import { useTranslations } from "next-intl";

export type AlertType = "success" | "error" | "info" | "warning";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  type: AlertType;
  title?: string;
  message?: string;
}

export function AlertModal({
  open,
  onClose,
  type,
  title,
  message,
}: AlertModalProps) {
  const t = useTranslations("alerts");

  const typeConfig: Record<
    AlertType,
    { icon: JSX.Element; color: string; title: string; message: string }
  > = {
    success: {
      icon: <CheckCircle className="text-green-500 size-20" />,
      color: "text-green-600",
      title: t("contact.success.title"),
      message: t("contact.success.message"),
    },
    error: {
      icon: <XCircle className="text-red-500 size-20" />,
      color: "text-red-600",
      title: t("contact.error.title"),
      message: t("contact.error.message"),
    },
    info: {
      icon: <Info className="text-blue-500 size-20" />,
      color: "text-blue-600",
      title: t("contact.info.title"),
      message: t("contact.info.message"),
    },
    warning: {
      icon: <AlertTriangle className="text-yellow-500 size-20" />,
      color: "text-yellow-600",
      title: t("contact.warning.title"),
      message: t("contact.warning.message"),
    },
  };
  const config = typeConfig[type];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="text-center max-w-sm">
        <div className="flex justify-center mb-2">{config.icon}</div>
        <DialogHeader>
          <DialogTitle
            className={cn("text-lg font-bold text-center", config.color)}
          >
            {title || config.title}
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground px-2">
          {message || config.message}
        </div>
        <DialogFooter className="mt-4 !justify-center">
          <Button
            variant="outline"
            className="border-transparent px-6 rounded-2xl hover:!bg-gray-300 dark:text-secondary-foreground focused hover:text-card-foreground"
            onClick={onClose}
          >
            {t("close")}
            <RxCross1 />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
