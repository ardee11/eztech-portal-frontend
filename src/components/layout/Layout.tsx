import { Outlet } from "react-router-dom";
import Header from "../elements/Header";
import Sidebar from "../elements/Sidebar";
import Breadcrumb from "../elements/Breadcrumb";

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Header />
        <Breadcrumb />
          <div className="lg:ps-64">
            <Outlet />
          </div>
        </div>
    </div>
  );
}
