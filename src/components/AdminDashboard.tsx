import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Crown, Users, CheckCircle, XCircle } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  is_admin: boolean;
  subscription_tier: string;
  subscription_status: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const { data, error } = await supabase
        .from('user_profiles_with_subscription')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error loading users:', error);
      setMessage('Error loading users');
    } finally {
      setLoading(false);
    }
  }

  async function updateSubscription(userId: string, planType: string) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ plan_type: planType })
        .eq('user_id', userId);

      if (error) throw error;

      setMessage('Subscription updated successfully!');
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      setMessage('Error updating subscription');
    }
  }

  async function toggleAdmin(userId: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      setMessage('Admin status updated successfully!');
      loadUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      setMessage('Error updating admin status');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Crown size={32} className="text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Manage users and subscriptions</p>
          </div>
        </div>

        {message && (
          <div className="mb-6 bg-blue-600 border border-blue-500 rounded-lg p-4 text-white">
            {message}
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800 border-b border-zinc-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Tier</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Admin</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{user.full_name}</span>
                        {user.is_admin && <Crown size={16} className="text-yellow-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.subscription_tier}
                        onChange={(e) => updateSubscription(user.id, e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="pro">Pro</option>
                        <option value="studio">Studio</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        user.subscription_status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                      }`}>
                        {user.subscription_status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {user.subscription_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_admin ? (
                        <span className="text-yellow-500 font-medium text-sm">Yes</span>
                      ) : (
                        <span className="text-gray-500 text-sm">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAdmin(user.id, user.is_admin)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-xs font-medium text-white transition"
                      >
                        Toggle Admin
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
