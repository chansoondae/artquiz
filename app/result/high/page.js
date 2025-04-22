// /app/result/high/page.js
import ResultClientHigh from './ResultClientHigh';

export const metadata = {
  title: '전문가급 퀴즈 결과 및 통계 - 당신의 전문성을 확인하세요!',
  description: '전문가급 미술 퀴즈의 결과와 통계를 확인하세요. 만점자 명단과 문제별 정답률을 볼 수 있습니다.',
  metadataBase: new URL('https://artfrnd.com'),
  openGraph: {
    title: '전문가급 퀴즈 결과 및 통계 - 당신의 전문성을 확인하세요!',
    description: '전문가급 미술 퀴즈의 결과와 통계를 확인하세요. 만점자 명단과 문제별 정답률을 볼 수 있습니다.',
    images: ['/images/high1.jpg'],
    url: 'https://artfrnd.com/quiz-result/high',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '전문가급 퀴즈 결과 및 통계 - 당신의 전문성을 확인하세요!',
    description: '전문가급 미술 퀴즈의 결과와 통계를 확인하세요. 만점자 명단과 문제별 정답률을 볼 수 있습니다.',
    images: ['/images/result.jpg'],
  },
  keywords: ['미술', '퀴즈', '전문가급', '통계', '순위', '만점자', '결과', '랭킹', '미술사'],
};

export default function ResultHighPage() {
  return <ResultClientHigh />;
}