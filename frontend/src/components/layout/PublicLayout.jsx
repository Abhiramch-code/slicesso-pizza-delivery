import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#fcf9f8] font-sans text-gray-900 flex flex-col">
      <TopNavBar />
      <main className="flex-1 mt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
