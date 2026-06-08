import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';

const Profile = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zip: user?.address?.zip || '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.replace('address.', '');
      setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  return (
    <div className="max-w-container-max mx-auto w-full space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-on-surface">My Profile</h1>
        <p className="text-on-surface-variant mt-2">Manage your personal information and delivery address.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-outline-variant/30 shadow-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-3xl mb-4">
            {user?.name?.charAt(0) || '?'}
          </div>
          <h3 className="text-xl font-bold">{user?.name}</h3>
          <p className="text-on-surface-variant text-sm">{user?.email}</p>
          <div className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase">
            {user?.role}
          </div>
          <div className="mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
            {user?.isVerified ? 'Verified' : 'Unverified'}
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-outline-variant/30 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Edit Profile</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant ml-1">Full Name</label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant ml-1">Phone Number</label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="border-t border-outline-variant/30 pt-6">
              <h4 className="text-lg font-bold mb-4">Delivery Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">Street Address</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="123 Pizza Lane"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">City</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">State</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="MH"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">ZIP Code</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    name="address.zip"
                    value={formData.address.zip}
                    onChange={handleChange}
                    placeholder="400001"
                  />
                </div>
              </div>
            </div>

            <button
              className="w-full bg-primary text-white py-4 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;