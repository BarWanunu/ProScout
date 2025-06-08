import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import ScoutWelcome from "../components/ScoutWelcome";

export default function ScoutDashboard() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <ScoutWelcome />
      {/* החלקים הבאים יתווספו בהמשך */}
      <Footer />
    </div>
  );
}
