import ResultClient from './ResultClient';

export const metadata = {
  title: '퀴즈 결과 및 통계 - 당신의 점수를 확인하세요!',
  description: '퀴즈의 결과와 통계를 확인하세요. 만점자 명단과 문제별 정답률을 볼 수 있습니다.',
  metadataBase: new URL('https://artfrnd.com'),
  openGraph: {
    title: '퀴즈 결과 및 통계 - 당신의 점수를 확인하세요!',
    description: '퀴즈의 결과와 통계를 확인하세요. 만점자 명단과 문제별 정답률을 볼 수 있습니다.',
    images: ['/images/result.jpg'],
    url: 'https://artfrnd.com/result',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '퀴즈 결과 및 통계 - 당신의 점수를 확인하세요!',
    description: '퀴즈의 결과와 통계를 확인하세요. 만점자 명단과 문제별 정답률을 볼 수 있습니다.',
    images: ['/images/result.jpg'],
  },
  keywords: ['미술', '퀴즈', '미술작품', '통계', '순위', '만점자', '결과', '랭킹'],
};

export default function ResultPage() {
  return <ResultClient />;
}