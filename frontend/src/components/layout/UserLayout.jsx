import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-[#fcf9f8] font-sans text-gray-900 flex flex-col">
      <TopNavBar />
      <main className="flex-1 mt-16 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
