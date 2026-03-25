import Sidebar from "./Sidebar";
import Header from "./Header";

const PageLayout = ({ children }) => (
  <div className="flex w-full h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  </div>
);

export default PageLayout;
