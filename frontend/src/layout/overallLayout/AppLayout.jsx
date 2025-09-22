import RouteFade from "@/components/RouteFade";

const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
        <main className="flex-1">
            <RouteFade>{children}</RouteFade>
        </main>
    </div>
  );
};

export default AppLayout;