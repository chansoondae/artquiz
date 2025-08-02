'use client';

import React, { useState } from 'react';
import styles from './ReservationModal.module.css';

const ReservationModal = ({ seatNumber, onClose, onReserve }) => {
  const [nickname, setNickname] = useState('');
  const [boardingStation, setBoardingStation] = useState('합정역');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      onReserve({
        seatNumber,
        nickname: nickname.trim(),
        boardingStation
      });
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>좌석 예약</h2>
        <p className={styles.seatInfo}>좌석 번호: {seatNumber}</p>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>승차 장소</label>
            <div className={styles.radioGroup}>
              <div 
                className={`${styles.radioLabel} ${boardingStation === '합정역' ? styles.selected : ''}`}
                onClick={() => setBoardingStation('합정역')}
              >
                <input
                  type="radio"
                  name="boardingStation"
                  value="합정역"
                  checked={boardingStation === '합정역'}
                  onChange={() => {}}
                />
                <span>합정역</span>
              </div>
              <div 
                className={`${styles.radioLabel} ${boardingStation === '양재역' ? styles.selected : ''}`}
                onClick={() => setBoardingStation('양재역')}
              >
                <input
                  type="radio"
                  name="boardingStation"
                  value="양재역"
                  checked={boardingStation === '양재역'}
                  onChange={() => {}}
                />
                <span>양재역</span>
              </div>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              취소
            </button>
            <button type="submit" className={styles.submitButton}>
              예약하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal; 