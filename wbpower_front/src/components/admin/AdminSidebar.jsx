import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, matchPath } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { logout } from '../../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import api from "../../api/api";
import { selectAuthUser } from '../../redux/authSlice';
import { FaSliders } from "react-icons/fa6";

import {
  MdDashboard,
  MdSettings,
  MdExpandMore,
  MdExpandLess,
  MdLogout,
  MdOutlineMenu,
  MdPostAdd,
} from "react-icons/md";

const AdminSidebar = ({ sidebarOpen, closeSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user_fname = useSelector(selectAuthUser);
  const [customPostTables, setCustomPostTables] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); 
  };

  // Get first letter from user name or fallback
  const firstLetter = user_fname?.name?.charAt(0).toUpperCase() || '?';

  // Fetch custom post tables on mount
  useEffect(() => {
    api.get('/postformtable-list')
      .then(res => {
        if (res.data && Array.isArray(res.data.data)) {
          const tables = res.data.data.map(item => item.table_name);
          setCustomPostTables(tables);
        } else {
          console.error("Unexpected API response shape", res.data);
        }
      })
      .catch(err => console.error("Failed to load custom post tables", err));
  }, []);

  // Build dynamic submenu for Custom Post
  const customPostSubMenu = customPostTables.map(tableName => ({
  label: tableName
    .replace(/^custompost_/, "")             // Remove "custompost_" prefix
    .replace(/_/g, " ")                      // Replace underscores with spaces
    .replace(/\b\w/g, c => c.toUpperCase()), // Capitalize each word
  to: `/custom-post-list/${tableName}`,      // ✅ Correct route
}));

  // Menu items including dynamic custom posts submenu
  const menuItems = [
    { label: "Dashboard", icon: <MdDashboard />, to: "/dashboard" },
    {
      label: "Slider",
      icon: <FaSliders />,
      children: [{ label: "Slider List", to: "/slider" }],
    },
    { label: "Menu", icon: <MdOutlineMenu />, to: "/menu" },
    {
      label: "Post",
      icon: <MdPostAdd />,
      children: [
        { label: "Post Category", to: "/post-category" },
        { label: "Add Custom Post", to: "/custom-post-form-table" },
      ],
    },
    {
      label: "Custom Post",
      icon: <MdPostAdd />,
      children: customPostSubMenu,
    },
    {
      label: "Settings",
      icon: <MdSettings />,
      children: [{ label: "Profile", to: "/user-profile" }],
    },
    { label: "Sign out", icon: <MdLogout />, isLogout: true },
  ];

  // Check if menu item is active (exact match)
  const isActive = (path) => !!matchPath({ path, end: true }, location.pathname);

  // Check if any child submenu item is active
  const isSubMenuActive = (children) => {
    return children.some(sub => isActive(sub.to));
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed m-header top-0 left-0 h-screen flex flex-col from-blue-50 to-gray-50 border-r border-gray-200 shadow-md z-40 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-[16%]`}
      >
        {/* Header / Logo */}
        <div className="p-4 border-b border-gray-200 shadow-sm">
          <h4 className="text-power font-semibold flex items-center mb-0 justify-center gap-2">
            <i className="fa-solid fa-bolt"></i> Power Dept
          </h4>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2 text-sm font-medium">
          {menuItems.filter(item => !item.isLogout).map((item, i) => (
            <div key={i}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setOpenMenu(openMenu === i ? null : i)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200
                      ${isSubMenuActive(item.children)
                        ? "bg-[#262626] text-white font-semibold"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span className="flex items-center gap-3 text-base font-medium">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    {openMenu === i ? <MdExpandLess className="text-lg" /> : <MdExpandMore className="text-lg" />}
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenu === i ? "max-h-96 mt-2" : "max-h-0"}`}>
                    <div className="ml-6 border-l border-gray-200 pl-3 space-y-1">
                      {item.children.map((sub, j) => (
                        <Link
                          key={j}
                          to={sub.to}
                          className={`block py-1.5 px-2 rounded-lg text-sm transition
                            ${isActive(sub.to)
                              ? "bg-gradient-to-r from-gray-200 to-gray-200 font-semibold"
                              : "text-gray-700 hover:bg-gray-100"
                            }`}
                          onClick={closeSidebar}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to={item.to}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition
                    ${isActive(item.to)
                      ? "bg-[#262626] text-white font-semibold"
                      : "bg-gray-50 text-gray-700 hover:bg-[#f0f0f0]"
                    }`}
                  onClick={closeSidebar}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-gray-600 hover:text-red-500 transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
              {firstLetter}
            </div>
            <span className="text-base font-medium tracking-wide">Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
