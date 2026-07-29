import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          backgroundColor: "#F3F4F6",
        }}
      >
        <Topbar />

        <div
          style={{
            padding: "25px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;