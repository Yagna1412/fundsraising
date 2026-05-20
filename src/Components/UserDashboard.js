import React, { useState, useEffect } from "react";
import "../App.css";

export default function UserDashboard() {
  const email = localStorage.getItem("email") || "tirumalayagnaprasanna@gmail.com";
  
  const [user, setUser] = useState({
    name: "Tirumala Yagna Prasanna",
    email: email,
    phone: "+91 9876543210",
    location: "Hyderabad",
    job: "Software Developer",
    company: "MyFundraiser",
    bank: "HDFC",
    account: "XXXX XXXX 1234",
    donated: "₹5,00,000",
    campaigns: 4,
    cause: "Education",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    // Load profile from localStorage if exists
    const storedProfile = localStorage.getItem(`profile_${email}`);
    let profileData = {};
    if (storedProfile) {
      profileData = JSON.parse(storedProfile);
    }

    // Load actual donations from localStorage
    const allDonations = JSON.parse(localStorage.getItem("userDonations")) || [];
    const userDonations = allDonations.filter(d => d.email === email);
    setDonations(userDonations);

    // Calculate dynamic stats from donations
    const totalDonated = userDonations.reduce((sum, d) => sum + Number(d.amount), 0);
    const uniqueCampaigns = new Set(userDonations.map(d => d.campaignId)).size;

    setUser(prevUser => {
      const updated = {
        ...prevUser,
        ...profileData,
        email: email // Keep email consistent
      };
      
      // Update donation stats dynamically if user has donations
      if (totalDonated > 0) {
        updated.donated = `₹${totalDonated.toLocaleString('en-IN')}`;
        updated.campaigns = uniqueCampaigns;
      }
      
      return updated;
    });
  }, [email]);

  const handleEditClick = () => {
    setEditForm({ ...user });
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(`profile_${email}`, JSON.stringify(editForm));
    setUser({ ...editForm });
    setIsEditing(false);
  };

  return (
    <div className="dashboard">
      <div className="top">
        <div className="profile">
          <img
            src={user.avatar}
            alt="Profile Avatar"
          />
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <p>{user.location}</p>
          </div>
        </div>
        <button onClick={handleEditClick}>
          Edit Profile
        </button>
      </div>

      <div className="stats">
        <div className="card">
          <h3>Total Donations</h3>
          <h1>{user.donated}</h1>
        </div>

        <div className="card">
          <h3>Campaigns Supported</h3>
          <h1>{user.campaigns}</h1>
        </div>

        <div className="card">
          <h3>Favorite Cause</h3>
          <h1>{user.cause}</h1>
        </div>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Personal Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
        </div>

        <div className="box">
          <h3>Job Details</h3>
          <p>{user.job}</p>
          <p>{user.company}</p>
        </div>

        <div className="box">
          <h3>Bank Details</h3>
          <p>{user.bank}</p>
          <p>{user.account}</p>
        </div>

        <div className="box">
          <h3>Donation Preferences</h3>
          <p>{user.cause}</p>
        </div>
      </div>

      {donations.length > 0 && (
        <div className="table">
          <h3>Recent Donations</h3>
          <table>
            <thead>
              <tr>
                <th>Campaign ID</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, index) => (
                <tr key={index}>
                  <td>Campaign #{donation.campaignId}</td>
                  <td>₹{Number(donation.amount).toLocaleString('en-IN')}</td>
                  <td>{donation.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8" style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0E7470', margin: 0 }}>Edit Profile</h2>
              <button 
                onClick={() => setIsEditing(false)}
                style={{ background: 'transparent', color: '#6b7280', border: 'none', fontSize: '20px', cursor: 'pointer', padding: 5 }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: '95%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Phone</label>
                  <input 
                    type="text" 
                    value={editForm.phone} 
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    style={{ width: '90%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }}
                    required
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Location</label>
                  <input 
                    type="text" 
                    value={editForm.location} 
                    onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                    style={{ width: '90%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Job Title</label>
                  <input 
                    type="text" 
                    value={editForm.job} 
                    onChange={e => setEditForm({ ...editForm, job: e.target.value })}
                    style={{ width: '90%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }}
                    required
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Company</label>
                  <input 
                    type="text" 
                    value={editForm.company} 
                    onChange={e => setEditForm({ ...editForm, company: e.target.value })}
                    style={{ width: '90%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Bank Name</label>
                  <input 
                    type="text" 
                    value={editForm.bank} 
                    onChange={e => setEditForm({ ...editForm, bank: e.target.value })}
                    style={{ width: '90%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }}
                    required
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Bank Account</label>
                  <input 
                    type="text" 
                    value={editForm.account} 
                    onChange={e => setEditForm({ ...editForm, account: e.target.value })}
                    style={{ width: '90%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Favorite Cause / Donation Preference</label>
                <input 
                  type="text" 
                  value={editForm.cause} 
                  onChange={e => setEditForm({ ...editForm, cause: e.target.value })}
                  style={{ width: '95%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Avatar Image URL (Optional)</label>
                <input 
                  type="text" 
                  value={editForm.avatar} 
                  onChange={e => setEditForm({ ...editForm, avatar: e.target.value })}
                  style={{ width: '95%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e5e7eb', paddingTop: '15px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  style={{ background: 'white', color: '#374151', border: '1px solid #d1d5db', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ background: '#0E7470', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}