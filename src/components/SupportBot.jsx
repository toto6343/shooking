import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SupportBot.module.css';

const SupportBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '안녕하세요! 슈킹 도우미입니다. 무엇을 도와드릴까요?' }
  ]);

  const quickReplies = [
    '배송 조회하고 싶어요',
    '사이즈 문의',
    '반품/환불 절차',
    '상담원 연결'
  ];

  const handleReply = (reply) => {
    setMessages([...messages, 
      { id: Date.now(), type: 'user', text: reply },
      { id: Date.now() + 1, type: 'bot', text: `'${reply}'에 대해 안내해 드리겠습니다. 잠시만 기다려 주세요...` }
    ]);
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className={styles.header}>
              <h4>SHOOKING 챗봇</h4>
              <button onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            
            <div className={styles.messageList}>
              {messages.map(msg => (
                <div key={msg.id} className={`${styles.message} ${styles[msg.type]}`}>
                  <div className={styles.bubble}>{msg.text}</div>
                </div>
              ))}
            </div>

            <div className={styles.quickReplies}>
              {quickReplies.map(reply => (
                <button key={reply} onClick={() => handleReply(reply)} className={styles.replyBtn}>
                  {reply}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button className={styles.launcher} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '↓' : '💬'}
      </button>
    </div>
  );
};

export default SupportBot;
