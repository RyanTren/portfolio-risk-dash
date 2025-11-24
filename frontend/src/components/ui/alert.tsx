import { Alert } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

type AlertPopUpProps = {
  color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  title: string;
};

export default function AlertPopUp({ color, title }: AlertPopUpProps) {
  return (
    <AnimatePresence>
      <motion.div
        key="alert"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-6 right-6 z-[9999]"
      >
        <Alert color={color} title={title} />
      </motion.div>
    </AnimatePresence>
  );
}
