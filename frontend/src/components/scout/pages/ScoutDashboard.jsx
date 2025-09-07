import Header from "../../../layout/overallLayout/Header";
import Footer from "../../../layout/overallLayout/Footer";
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
