import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) setProfile(data);
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const addPoints = async (amount) => {
    if (!user || !profile) return;
    const nextPoints = (profile.points || 0) + amount;
    const { error } = await supabase
      .from('profiles')
      .update({ points: nextPoints })
      .eq('id', user.id);
    
    if (!error) {
      setProfile(prev => ({ ...prev, points: nextPoints }));
    }
  };

  const getTier = () => {
    const pts = profile?.points || 0;
    if (pts >= 50000) return { name: 'GOLD', color: '#FFD700', discount: 0.1 };
    if (pts >= 20000) return { name: 'SILVER', color: '#C0C0C0', discount: 0.05 };
    return { name: 'BRONZE', color: '#CD7F32', discount: 0 };
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      profile, 
      login, 
      logout, 
      loading, 
      points: profile?.points || 0, 
      addPoints, 
      tier: getTier() 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
