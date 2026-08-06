import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { formatCurrency } from '../utils/formatters';
import Modal from '../components/Modal';
import * as authService from '../services/authService';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useNotification();

  const [name, setName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone || '' : '');
  const [avatar, setAvatar] = useState(user ? user.avatar || '' : '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) {
      return addToast('danger', 'Invalid Amount', 'Please enter a positive deposit amount.');
    }
    setIsDepositing(true);
    try {
      const res = await authService.addFunds(Number(depositAmount));
      const updatedUser = res.data;
      if (updatedUser && updatedUser.walletBalance !== undefined) {
        updateUserProfile({ walletBalance: updatedUser.walletBalance });
      } else {
        const me = await authService.getMe();
        if (me.data && me.data.walletBalance !== undefined) {
          updateUserProfile({ walletBalance: me.data.walletBalance });
        }
      }
      addToast('success', 'Funds Added', `Successfully deposited ${formatCurrency(Number(depositAmount))}!`);
      setDepositModalOpen(false);
      setDepositAmount('');
    } catch (err) {
      addToast('danger', 'Deposit Failed', err.message || 'Could not process deposit.');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await authService.updateProfile({ name, phone, avatar });
      updateUserProfile(res.data);
      addToast('success', 'Profile Updated', 'Your profile details have been saved.');
    } catch (err) {
      addToast('danger', 'Update Failed', err.message || 'Could not update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return addToast('danger', 'Error', 'New passwords do not match');
    }
    setIsChangingPassword(true);
    try {
      await authService.changePassword({ oldPassword, newPassword });
      addToast('success', 'Password Updated', 'Your account password has been changed.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast('danger', 'Error', err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container">
      <div className="row g-4">
        {/* Left Column: User Card & Cash Info */}
        <div className="col-lg-4">
          <div className="glass-card p-4 text-center mb-4">
            <img
              src={user.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
              alt={user.name}
              className="rounded-circle border border-primary p-1 mb-3"
              width="100"
              height="100"
            />
            <h4 className="fw-bold text-light mb-1">{user.name}</h4>
            <p className="text-muted mb-2">{user.email}</p>
            <span className={`badge ${user.role === 'ADMIN' ? 'bg-warning text-dark' : 'bg-primary'}`}>
              {user.role} ACCOUNT
            </span>
          </div>

          <div className="glass-card p-4 text-center">
            <i className="bi bi-wallet2 text-success fs-1 d-block mb-2"></i>
            <span className="text-muted small d-block">Available Wallet Cash</span>
            <h3 className="fw-bold text-light mb-3">{formatCurrency(user.walletBalance)}</h3>
            <button
              className="btn btn-success-gradient w-100"
              onClick={() => setDepositModalOpen(true)}
            >
              <i className="bi bi-plus-circle me-1"></i> Deposit Virtual Cash
            </button>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="col-lg-8">
          <div className="glass-card p-4 mb-4">
            <h5 className="fw-bold text-light mb-4">
              <i className="bi bi-person-gear me-2 text-primary"></i> Edit Profile Information
            </h5>
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-3">
                <label className="form-label text-muted">Full Name</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Email Address (Read-only)</label>
                <input
                  type="email"
                  className="form-control glass-input"
                  value={user.email}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Phone Number</label>
                <input
                  type="tel"
                  className="form-control glass-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted">Avatar Image URL</label>
                <input
                  type="url"
                  className="form-control glass-input"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary-gradient" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Box */}
          <div className="glass-card p-4">
            <h5 className="fw-bold text-light mb-4">
              <i className="bi bi-lock me-2 text-warning"></i> Security & Password
            </h5>
            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label className="form-label text-muted">Current Password</label>
                <input
                  type="password"
                  className="form-control glass-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">New Password</label>
                <input
                  type="password"
                  className="form-control glass-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control glass-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="btn btn-outline-warning" disabled={isChangingPassword}>
                {isChangingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal isOpen={depositModalOpen} onClose={() => setDepositModalOpen(false)} title="Add Cash to Wallet">
        <form onSubmit={handleDeposit}>
          <div className="mb-3">
            <label className="form-label text-muted">Amount ($ USD)</label>
            <input
              type="number"
              min="10"
              step="10"
              className="form-control glass-input"
              placeholder="e.g. 5000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setDepositModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success-gradient" disabled={isDepositing}>
              {isDepositing ? 'Processing...' : 'Deposit Funds'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
