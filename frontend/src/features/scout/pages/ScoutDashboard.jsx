import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import ScoutWelcome from "../components/ScoutWelcome";
import ScoutSearch from "../components/ScoutSearch";

export default function ScoutDashboard() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <ScoutWelcome />
      <ScoutSearch />
      <Footer />
    </div>
  );
}
