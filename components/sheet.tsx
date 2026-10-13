"use client";

import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";

export function Sheet({
  open,
  title,
  onClose,
  children,
  panel = "sheet",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  panel?: "sheet" | "drawer";
}) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const anchor = panel === "drawer" && desktop ? "right" : "bottom";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor={anchor}
      slotProps={{
        paper: {
          sx:
            anchor === "bottom"
              ? {
                  maxHeight: "min(88vh, 760px)",
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                }
              : {
                  width: 400,
                  borderRadius: 0,
                },
        },
      }}
    >
      <div className="flex h-14 shrink-0 items-center justify-between px-2">
        <Typography id="sheet-title" className="px-2 font-display" sx={{ fontSize: 20, fontWeight: 500 }}>
          {title}
        </Typography>
        <IconButton aria-label="Close" onClick={onClose} sx={{ width: 48, height: 48 }}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="overflow-y-auto px-4 pb-8">{children}</div>
    </Drawer>
  );
}
