import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../api/supabase';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import styles from './StyleSnap.module.css';

const StyleSnap = ({ productId }) => {
  const [snaps, setSnaps] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [newSnap, setNewSnap] = useState({ image: '', comment: '' });
  const { user, profile } = useUser();
  const { showToast } = useToast();

  const mockSnaps = [
    { id: 1, user_name: 'style_master', image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop', likes: 24, comment: '데일리로 최고예요!' },
    { id: 2, user_name: 'nike_love', image_url: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=400&auto=format&fit=crop', likes: 15, comment: '색감이 너무 영롱함...' },
  ];

  useEffect(() => {
    const fetchSnaps = async () => {
      const { data, error } = await supabase
        .from('style_snaps')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (data) setSnaps([...data, ...mockSnaps]);
      else setSnaps(mockSnaps);
    };
    fetchSnaps();
  }, [productId]);

  const handleLike = async (snapId) => {
    // Basic optimistic update for UI
    setSnaps(prev => prev.map(s => 
      s.id === snapId ? { ...s, likes: (s.likes || 0) + 1, isLiked: true } : s
    ));

    if (typeof snapId === 'number' && snapId > 1000) { // Real DB record
      // This would require a postgres function 'increment_likes'
      await supabase.from('style_snaps').update({ likes: (snaps.find(s=>s.id === snapId)?.likes || 0) + 1 }).eq('id', snapId);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('로그인이 필요합니다.', 'info');
      return;
    }

    const { data, error } = await supabase
      .from('style_snaps')
      .insert([{
        product_id: parseInt(productId),
        user_id: user.id,
        user_name: profile?.name || user.email.split('@')[0],
        image_url: newSnap.image || 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=400&auto=format&fit=crop',
        comment: newSnap.comment
      }])
      .select();

    if (error) {
      showToast('업로드 중 오류가 발생했습니다.', 'error');
    } else {
      setSnaps([data[0], ...snaps]);
      setShowUpload(false);
      setNewSnap({ image: '', comment: '' });
      showToast('스타일 스냅이 등록되었습니다!');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>스타일 스냅 (OOTD)</h2>
        <button className={styles.uploadBtn} onClick={() => setShowUpload(true)}>스냅 올리기</button>
      </div>

      <div className={styles.grid}>
        {snaps.map(snap => (
          <motion.div 
            key={snap.id} 
            className={styles.card}
            whileHover={{ y: -5 }}
          >
            <div className={styles.imageWrapper}>
              <img src={snap.image_url} alt={snap.comment} className={styles.image} />
              <button 
                className={`${styles.likeBtn} ${snap.isLiked ? styles.liked : ''}`}
                onClick={() => handleLike(snap.id)}
              >
                ♥ {snap.likes}
              </button>
            </div>
            <div className={styles.info}>
              <span className={styles.user}>@{snap.user_name}</span>
              <p className={styles.comment}>{snap.comment}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showUpload && (
          <div className={styles.modalOverlay} onClick={() => setShowUpload(false)}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              <h3>나의 스타일 공유하기</h3>
              <form onSubmit={handleUpload}>
                <input 
                  type="text" 
                  placeholder="이미지 URL (Unsplash 등)" 
                  value={newSnap.image}
                  onChange={e => setNewSnap({ ...newSnap, image: e.target.value })}
                />
                <textarea 
                  placeholder="코디 정보를 입력해주세요" 
                  value={newSnap.comment}
                  onChange={e => setNewSnap({ ...newSnap, comment: e.target.value })}
                  required
                />
                <div className={styles.modalBtns}>
                  <button type="button" onClick={() => setShowUpload(false)}>취소</button>
                  <button type="submit" className={styles.submitBtn}>등록</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StyleSnap;
