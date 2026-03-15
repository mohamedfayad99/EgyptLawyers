import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArticleIcon from "@mui/icons-material/Article";
import BalanceIcon from "@mui/icons-material/Balance";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../../contexts/LanguageContext";

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 72;

interface AdminSidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({
  open,
  collapsed,
  onClose,
  onToggleCollapse,
}: AdminSidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLang();

  const navItems = [
    { labelKey: "dashboard" as const, icon: DashboardIcon, path: "/admin" },
    { labelKey: "lawyers" as const, icon: PeopleIcon, path: "/admin/lawyers" },
    { labelKey: "pendingApprovals" as const, icon: HourglassTopIcon, path: "/admin/pending-approvals" },
    { labelKey: "cities" as const, icon: LocationCityIcon, path: "/admin/cities" },
    { labelKey: "courts" as const, icon: AccountBalanceIcon, path: "/admin/courts" },
    { labelKey: "posts" as const, icon: ArticleIcon, path: "/admin/posts" },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const drawerWidth = collapsed && !isMobile ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  const content = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "var(--color-sidebar-bg)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Logo area */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={collapsed && !isMobile ? 0 : 1.5}
        sx={{
          px: collapsed && !isMobile ? 1.5 : 2.5,
          height: 64,
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          justifyContent: collapsed && !isMobile ? "center" : "flex-start",
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            bgcolor: "var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
          }}
        >
          <BalanceIcon
            sx={{ fontSize: 20, color: "#fff" }}
          />
        </Box>
        {(!collapsed || isMobile) && (
          <Typography
            sx={{
              color: "var(--color-sidebar-text)",
              fontWeight: 800,
              fontSize: "1rem",
              whiteSpace: "nowrap",
              letterSpacing: "0.5px",
            }}
          >
            {t("adminPanel")}
          </Typography>
        )}
      </Stack>

      {/* Nav items */}
      <List sx={{ flex: 1, pt: 3, px: 1.5 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) onClose();
              }}
              sx={{
                borderRadius: "12px",
                mb: 0.8,
                px: collapsed && !isMobile ? 1.5 : 2,
                py: 1.4,
                justifyContent:
                  collapsed && !isMobile ? "center" : "flex-start",
                bgcolor: active
                  ? "var(--color-sidebar-item-active)"
                  : "transparent",
                color: active
                  ? "#fff"
                  : "rgba(255, 255, 255, 0.6)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "var(--color-sidebar-item-hover)",
                  color: "#fff",
                  transform: collapsed ? "none" : "translateX(4px)",
                },
                "& .MuiListItemIcon-root": {
                   color: active ? "var(--color-accent)" : "inherit",
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed && !isMobile ? 0 : 38,
                  color: "inherit",
                  justifyContent: "center",
                }}
              >
                <item.icon sx={{ fontSize: 22 }} />
              </ListItemIcon>
              {(!collapsed || isMobile) && (
                <ListItemText
                  primary={t(item.labelKey)}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.9rem",
                    color: "inherit",
                    textAlign: "left",
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <IconButton
            onClick={onToggleCollapse}
            sx={{
              width: "100%",
              color: "rgba(255, 255, 255, 0.5)",
              borderRadius: "10px",
              "&:hover": { 
                bgcolor: "var(--color-sidebar-item-hover)",
                color: "#fff"
              },
            }}
          >
            <ChevronLeftIcon
              sx={{
                transition: theme.transitions.create("transform", {
                  duration: theme.transitions.duration.shorter,
                }),
                transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                willChange: "transform",
              }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  );

  // Mobile: temporary drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: DRAWER_WIDTH, border: "none" } }}
        ModalProps={{ keepMounted: true }}
      >
        {content}
      </Drawer>
    );
  }

  // Desktop: persistent drawer
  return (
    <Drawer
      variant="permanent"
      open
      PaperProps={{
        sx: {
          width: drawerWidth,
          border: "none",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
          willChange: "width",
        },
      }}
    >
      {content}
    </Drawer>
  );
}

export { DRAWER_WIDTH, DRAWER_COLLAPSED };
