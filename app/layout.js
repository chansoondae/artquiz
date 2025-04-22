// /app/layout.js
import './globals.css';
export const metadata = {
  title: '아트프렌즈 퀴즈',
  description: '미술 애호가를 위한 10가지 문제',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-100">
        {children}
      </body>
    </html>
  )
}