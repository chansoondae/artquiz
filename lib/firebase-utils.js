// /lib/firebase-utils.js
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    limit, 
    getDocs, 
    getDoc, 
    doc, 
    runTransaction, 
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  // 퀴즈 결과 저장
  export const saveQuizResult = async (nickname, score, answers, totalQuestions) => {
    try {
      const docRef = await addDoc(collection(db, 'quizResults'), {
        nickname,
        score,
        answers,
        totalQuestions,
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  };
  
  // 최고 득점자 목록 가져오기
  export const getTopScorers = async (limitCount = 10) => {
    try {
      const q = query(
        collection(db, 'quizResults'),
        orderBy('score', 'desc'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching top scorers:', error);
      throw error;
    }
  };
  
  // 만점자 목록 가져오기
  export const getPerfectScorers = async (totalQuestions, limitCount = 10) => {
    try {
      // Firebase에는 eq 및 orderBy를 함께 사용할 때 복합 인덱스가 필요할 수 있음
      const q = query(
        collection(db, 'quizResults'),
        orderBy('timestamp', 'desc'),
        limit(100) // 더 많은 결과를 가져온 후 필터링
      );
      
      const querySnapshot = await getDocs(q);
      const allResults = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // 클라이언트 측에서 만점자 필터링
      const perfectScorers = allResults
        .filter(result => result.score === totalQuestions)
        .slice(0, limitCount);
      
      return perfectScorers;
    } catch (error) {
      console.error('Error fetching perfect scorers:', error);
      throw error;
    }
  };
  
  // 문제별 통계 가져오기
  export const getQuestionStats = async () => {
    try {
      const statsDoc = await getDoc(doc(db, 'statistics', 'questionStats'));
      if (statsDoc.exists()) {
        return statsDoc.data().stats || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching question statistics:', error);
      throw error;
    }
  };
  
  // 퀴즈 결과 제출 및 통계 업데이트
  export const submitQuizResultAndUpdateStats = async (nickname, score, answers, questions) => {
    try {
      // 결과 저장
      const resultId = await saveQuizResult(nickname, score, answers, questions.length);
      
      // 통계 업데이트
      const statsRef = doc(db, 'statistics', 'questionStats');
      await runTransaction(db, async (transaction) => {
        const statsDoc = await transaction.get(statsRef);
        
        let stats = statsDoc.exists() ? statsDoc.data().stats : [];
        
        // 최초 데이터 생성
        if (!stats.length) {
          stats = questions.map(q => ({
            questionId: q.id,
            totalAttempts: 0,
            correctAnswers: 0
          }));
        }
        
        // 통계 업데이트
        questions.forEach(question => {
          const questionStat = stats.find(s => s.questionId === question.id);
          if (questionStat) {
            questionStat.totalAttempts++;
            if (answers[question.id] === question.correctAnswer) {
              questionStat.correctAnswers++;
            }
          } else {
            // 새 문제가 추가된 경우
            stats.push({
              questionId: question.id,
              totalAttempts: 1,
              correctAnswers: answers[question.id] === question.correctAnswer ? 1 : 0
            });
          }
        });
        
        transaction.set(statsRef, { stats });
      });
      
      return resultId;
    } catch (error) {
      console.error('Error submitting quiz result and updating stats:', error);
      throw error;
    }
  };