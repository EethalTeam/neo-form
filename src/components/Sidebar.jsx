import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  Settings,
  BarChart3,
  Stethoscope,
  ChevronLeft,
  HeartPulse,
  Share2,
  FileSpreadsheet,
  Flag,
  Wallet,
  Layers,
  Database,
  Fuel,
  Map,
  SquareCode,
  ShieldPlus,
  Menu,
  Globe,
  ClipboardCheck,
  ClipboardList,
  AlertTriangle,
  MapPinned,
  Building2,
  RadioTower,
  ShieldAlert,
  Receipt,
  CreditCard,
  Signal,
  CalendarCheck,
  Activity,
  CalendarClock,
  MessageCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { apiRequest } from "@/components/CustomComponents/apiRequest";
import Logo from "@/Assets/images/Logo_png.png";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  // const {menuPermissions} = useAuth()

  // const {getRole}=useAuth()

  const [MENU, SETMENU] = useState([]);
  const [roles, setRoles] = useState([]);
  const [menuPermissions, setMenuPermissions] = useState({});
  useEffect(() => {
    getAllMenus();
    getRole();
  }, []);
  useEffect(() => {
    let rolepath = roles.reduce((acc, curr) => {
      if (!acc[curr.RoleName]) {
        return {
          ...acc,
          [curr.RoleName]: curr.permissions.map((val) => val.menuDetails.path),
        };
      } else {
        return acc;
      }
    }, {});
    console.log(rolepath, "rolepath");
    setMenuPermissions(rolepath);
  }, [roles]);

  const iconMapping = {
    LayoutDashboard,
    Users,
    UserPlus,
    Calendar,
    Settings,
    BarChart3,
    Stethoscope,
    HeartPulse,
    Share2,
    FileSpreadsheet,
    Flag,
    Wallet,
    Layers,
    Database,
    Map,
    SquareCode,
    ShieldPlus,
    Globe,
    ClipboardCheck,
    ClipboardList,
    Activity,
    CalendarCheck,
    Signal,
    Receipt,
    ShieldAlert,
    RadioTower,
    AlertTriangle,
    Globe,
    MapPinned,
    Building2,
    RadioTower,
    CreditCard,
    CalendarClock,
    MessageCircle,
  };
  const getAllMenus = async () => {
    try {
      const response = await apiRequest("Menu/getFormattedMenu", {
        method: "POST",
        body: JSON.stringify({}),
      });
      SETMENU(response.data);
    } catch (error) {
      console.error("Failed to fetch menus", error);
      return {};
    }
  };
  const getRole = async () => {
    try {
      const response = await apiRequest("RoleBased/getAllRoles", {
        method: "POST",
        body: JSON.stringify({}),
      });
      setRoles(response.data || []);
    } catch (error) {
      console.error("Failed to fetch roles", error);
      setRoles([]);
    }
  };

  const location = useLocation();
  const hasAccess = (path) => {
    const userRole = user.role;
    if (userRole === "Super Admin") return true;

    const rolePermissions = menuPermissions[userRole];
    // const rolePermissions = ['*'];

    if (!rolePermissions) return false;
    if (rolePermissions.includes("*")) return true;

    return rolePermissions.some((p) => path.startsWith(p));
  };

  const filteredMenuItems = MENU.map((item) => {
    // const filteredMenuItems = ALL_MENU_ITEMS.map(item => {
    if (user.role === "Super Admin") return item;

    if (item.subItems.length > 0) {
      const accessibleSubItems = item.subItems.filter((sub) =>
        hasAccess(sub.path),
      );
      if (accessibleSubItems.length > 0) {
        return { ...item, subItems: accessibleSubItems };
      }
      return null;
    }
    return hasAccess(item.path) ? item : null;
  }).filter(Boolean);
  console.log(filteredMenuItems, "filteredMenuItems");
  const getMenuItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ];

    const mastersSubmenu = {
      icon: Database,
      label: "Masters",
      isMenu: true,
      submenu: [
        { icon: ClipboardCheck, label: "Debit", path: "/debit" },
        { icon: ClipboardCheck, label: "Credit", path: "/credit" },

        { icon: Layers, label: "Categories", path: "/categories" },
        { icon: AlertTriangle, label: "Red Flags", path: "/red-flags" },
        { icon: Globe, label: "Country", path: "/country" },
        { icon: MapPinned, label: "State", path: "/state" },
        { icon: Building2, label: "City", path: "/city" },
        {
          icon: Stethoscope,
          label: "Physio Category",
          path: "/physioCategory",
        },
        { icon: RadioTower, label: "Lead Source", path: "/leadSource" },
        { icon: Users, label: "Gender", path: "/gender" },
        { icon: ShieldAlert, label: "Risk Factor", path: "/riskFactor" },
        { icon: Receipt, label: "Expense Type", path: "/expenseType" },
        { icon: CreditCard, label: "Fees Type", path: "/feesType" },
        { icon: Signal, label: "Lead Status", path: "/leadStatus" },
        {
          icon: CalendarCheck,
          label: "Session Status",
          path: "/sessionStatus",
        },
        { icon: Activity, label: "Modalities", path: "/modalities" },
        { icon: ClipboardList, label: "Review Type", path: "/reviewtype" },
        { icon: ClipboardCheck, label: "Review form", path: "/reviewform" },
      ],
    };

    const Adminpannel = {
      icon: Settings,
      label: "Admin",
      isMenu: true,
      submenu: [
        { icon: Layers, label: "Role", path: "/role" },
        { icon: Layers, label: "Menu Registry", path: "/menuRegistry" },
      ],
    };

    const roleBasedItems = {
      SuperAdmin: [
        { icon: UserPlus, label: "Leads", path: "/leads" },
        { icon: Users, label: "Patients", path: "/patients" },
        { icon: CalendarClock, label: "Sessions", path: "/sessions" },
        { icon: Stethoscope, label: "Physios", path: "/physios" },
        { icon: Settings, label: "Machinery", path: "/machinery" },
        { icon: Share2, label: "References", path: "/references" },
        { icon: ClipboardCheck, label: "Leave Assign", path: "/leavephysio" },
        { icon: ClipboardCheck, label: "Income", path: "/income" },

        mastersSubmenu,
        Adminpannel,
        { icon: Wallet, label: "Expenses", path: "/expenses" },
        { icon: Fuel, label: "Petrol Allowance", path: "/petrol-allowance" },
        { icon: FileSpreadsheet, label: "Payroll", path: "/payroll" },
        { icon: BarChart3, label: "Reports", path: "/reports" },
        { icon: MessageCircle, label: "Consultation", path: "/consultation" },
      ],
      Admin: [
        { icon: UserPlus, label: "Leads", path: "/leads" },
        { icon: Users, label: "Patients", path: "/patients" },
        { icon: CalendarClock, label: "Sessions", path: "/sessions" },
        { icon: Stethoscope, label: "Physios", path: "/physios" },
        { icon: Settings, label: "Machinery", path: "/machinery" },
        { icon: Share2, label: "References", path: "/references" },
        { icon: ClipboardCheck, label: "Income", path: "/income" },
        { icon: ClipboardCheck, label: "Leave Assign", path: "/leavephysio" },

        mastersSubmenu,
        { icon: Flag, label: "Red Flags", path: "/red-flags" },
        { icon: FileSpreadsheet, label: "Payroll", path: "/payroll" },
        { icon: BarChart3, label: "Reports", path: "/reports" },
        { icon: Map, label: "Country", path: "/country" },
        { icon: MessageCircle, label: "Consultation", path: "/consultation" },
      ],
      HOD: [
        { icon: Users, label: "Patients", path: "/patients" },
        { icon: CalendarClock, label: "Sessions", path: "/sessions" },
        { icon: Settings, label: "Machinery", path: "/machinery" },
        { icon: Flag, label: "Red Flags", path: "/red-flags" },
        { icon: BarChart3, label: "Reports", path: "/reports" },
        { icon: MessageCircle, label: "Consultation", path: "/consultation" },
        { icon: ClipboardCheck, label: "Leave Assign", path: "/leavephysio" },
        { icon: ClipboardCheck, label: "Income", path: "/income" },
      ],
      Physio: [
        { icon: CalendarClock, label: "My Sessions", path: "/sessions" },
        {
          icon: FileSpreadsheet,
          label: "Monthly Summary",
          path: "/monthly-summary",
        },
      ],
    };

    if (
      user?.role === "Physio" &&
      !roleBasedItems.Physio.find((item) => item.path === "/monthly-summary")
    ) {
      roleBasedItems.Physio.push({
        icon: FileSpreadsheet,
        label: "Monthly Summary",
        path: "/monthly-summary",
      });
    }

    return [...baseItems, ...(roleBasedItems[user?.role] || [])];
  };

  const [openAccordion, setOpenAccordion] = useState("");

  const menuItems = getMenuItems();

  const sidebarVariants = {
    open: {
      width: "16rem",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      width: "5rem",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const textVariants = {
    open: { opacity: 1, x: 0, transition: { delay: 0.1 } },
    closed: { opacity: 0, x: -10 },
  };

  const NavItem = ({ item }) => {
    const Icon =
      typeof item.icon === "string"
        ? iconMapping[item.icon] || LayoutDashboard
        : item.icon;
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        title={item.label}
        className={`flex items-center h-12 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-600 hover:bg-gray-100"
        } ${isOpen ? "px-4" : "justify-center"}`}
      >
        <Icon size={20} className="shrink-0" />
        {isOpen && (
          <motion.span
            initial={false}
            animate={isOpen ? "open" : "closed"}
            variants={textVariants}
            className="ml-3 font-medium whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </Link>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className="fixed left-0 top-0 h-full bg-white shadow-lg z-50  flex-col flex"
      >
        <div
          className={`flex items-center border-b h-16 shrink-0 ${
            isOpen ? "justify-between px-4" : "justify-center"
          }`}
        >
          {isOpen ? (
            <motion.div
              initial={false}
              animate={isOpen ? "open" : "closed"}
              variants={textVariants}
              className="flex items-center gap-2 min-w-0"
            >
              {/* <HeartPulse className="text-blue-600" size={28} /> */}
              <img
                src={Logo}
                alt="Neo-physio Logo"
                className="h-20 w-20 object-contain"
              />

              <span className="flex flex-col text-blue-600">
                <span className="text-xl font-bold">NEO DESK</span>
                <span className="text-xs text-blue-300">V-1.4.4</span>
              </span>
            </motion.div>
          ) : (
            // <HeartPulse className="text-blue-600" size={28} />
            <img
              src={Logo}
              alt="Neo-physio Logo"
              className="h-20 w-20 object-contain"
            />
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors absolute -right-4 top-5 bg-white border shadow-sm hidden md:block lg:block"
          >
            <ChevronLeft
              size={16}
              className={`transition-transform ${isOpen ? "" : "rotate-180"}`}
            />
          </button>
          {/* <button
            variant="ghost"
            size="icon"
               onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden md:hidden absolute -right-3 top-5  hover:bg-gray-100 transition-colors  bg-white border shadow-sm "
          >
            <Menu size={22}  className={`transition-transform ${isOpen}`} />
          </button> */}
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto overflow-x-hidden ">
          <Accordion
            type="single"
            collapsible
            value={openAccordion}
            onValueChange={setOpenAccordion}
            className="w-full"
          >
            {filteredMenuItems.map((item, index) => (
              <div key={index} className="mx-3 my-1">
                {item.subItems.length ? (
                  <AccordionItem value={item.label} className="border-none">
                    <AccordionTrigger
                      className={`flex items-center h-12 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:no-underline ${
                        isOpen ? "px-4" : "justify-center"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon size={20} className="shrink-0" />
                        {isOpen && (
                          <motion.span
                            initial={false}
                            animate={isOpen ? "open" : "closed"}
                            variants={textVariants}
                            className="ml-3 font-medium whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-6 pr-2 py-0">
                      {isOpen &&
                        item.subItems.map((subItem, subIndex) => (
                          <div key={subIndex} className="my-1">
                            <NavItem item={subItem} />
                          </div>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <NavItem item={item} />
                )}
              </div>
            ))}
          </Accordion>
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
