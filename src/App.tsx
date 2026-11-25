import { useState, useEffect } from 'react'
import { trackCourseClick, trackPageView } from './analytics'
import { 
  Stack, 
  HStack, 
  VStack, 
  Button, 
  Card, 
  TextInput, 
  TextArea, 
  Switch 
} from '@astryxdesign/core'
import { 
  Sparkles, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Layers, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Code,
  Smartphone,
  MapPin,
  Clock,
  Compass,
  ArrowUpRight,
  Database,
  Search,
  CheckCircle,
  Play,
  HelpCircle,
  FileCode,
  Gift,
  Laptop,
  AlertCircle,
  XCircle,
  CheckCircle2,
  GraduationCap,
  Rocket,
  Zap,
  Download,
  RefreshCw,
  Send,
  Terminal,
  Bot,
  Wrench,
  BookOpen,
  Info,
  Bell,
  Share2,
  Check
} from 'lucide-react'

type CategoryType = 'all' | 'doc' | 'scout' | 'ad' | 'copy' | 'report' | 'crm' | 'alert'

interface ProgramItem {
  id: string
  name: string
  category: CategoryType
  developer: string
  description: string
  impact: string
  features: string[]
}

export default function App() {
  useEffect(() => {
    const handleRouteChange = () => {
      trackPageView(window.location.pathname + window.location.search)
    }
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const [activeTab, setActiveTab] = useState<'blog' | 'sms' | 'briefing'>('blog')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [filterCategory, setFilterCategory] = useState<CategoryType>('all')
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null)
  
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    region: '',
    track: 'cohort2'
  })
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const [blogInputs, setBlogInputs] = useState({
    address: '서울시 마포구 아현동 래미안푸르지오',
    type: '아파트 (매매)',
    price: '18억 5,000만 원',
    features: '아현역 도보 3분 초역세권, 로얄층 판상형 남향, 최근 올수리 완료'
  })

  const [smsInputs, setSmsInputs] = useState({
    clientName: '이소민 사장님',
    listingName: '아현래미안 34평형 매매',
    agentName: '공덕베스트 박대표',
    tone: '정중하고 신뢰감 높은 전문적 어조'
  })

  const [briefingInput, setBriefingInput] = useState(
    '공덕역 도보 5분 32평형 남향 아파트. 2018년 준공. 소유주 직접 거주로 상태 매우 깨끗. 최근 실거래 15억선. 주차공간 넉넉하나 학원가가 약간 떨어져 있음.'
  )

  const [isCopied, setIsCopied] = useState(false)

  const [vibePromptType, setVibePromptType] = useState<string>('crawl')
  const [vibeCodeOutput, setVibeCodeOutput] = useState<string>('')
  const [vibeConsoleOutput, setVibeConsoleOutput] = useState<string>('')
  const [vibeStep, setVibeStep] = useState<number>(0)

  const runVibeSimulation = (type: string) => {
    setVibePromptType(type)
    setIsGenerating(true)
    setVibeStep(1)
    setVibeConsoleOutput('SYS: Vibe Engine 초기화 중...\n')
    setVibeCodeOutput('')

    const codeTemplates: Record<string, { code: string; logs: string[] }> = {
      crawl: {
        code: `import httpx\nimport pandas as pd\n\ndef collect_naver_land(complex_no):\n    url = f"https://m.land.naver.com/complex/getComplexArticleList"\n    headers = {\n        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",\n        "Referer": "https://m.land.naver.com/"\n    }\n    params = {\n        "complexNo": complex_no,\n        "tradeTypeFormNo": "A1",\n        "order": "prc"\n    }\n    \n    print(f"[Engine] 단지번호 {complex_no} 수집 시작...")\n    res = httpx.get(url, headers=headers, params=params)\n    data = res.json()\n    \n    articles = data['result']['list']\n    df = pd.DataFrame(articles)\n    df.to_excel("naver_listings.xlsx", index=False)\n    print(f"[Engine] 수집 완료! 엑셀 파일 저장 완료.")`,
        logs: [
          'SYS: cURL 복사 분석 완료.',
          'SYS: complexNo 변수 인식 완료.',
          'SYS: httpx 및 pandas 패키지 모듈 적재.',
          'RUN: python collect_naver_land("107511")',
          '[Engine] 단지번호 107511 수집 시작...',
          '[Engine] 수집 완료! 엑셀 파일 저장 완료.',
          'SUCCESS: naver_listings.xlsx 생성 성공!'
        ]
      },
      adauto: {
        code: `from selenium import webdriver\nfrom selenium.webdriver.common.by import By\nimport schedule, time\n\nclass ListingAutoUploader:\n    def __init__(self, platform):\n        self.driver = webdriver.Chrome()\n        self.platform = platform\n        \n    def login(self, user, pw):\n        self.driver.get(f"https://{self.platform}.com/login")\n        self.driver.find_element(By.ID, "username").send_keys(user)\n        self.driver.find_element(By.ID, "password").send_keys(pw)\n        self.driver.find_element(By.CSS_SELECTOR, ".login-btn").click()\n        \n    def upload_listing(self, listing_data):\n        for field, value in listing_data.items():\n            el = self.driver.find_element(By.NAME, field)\n            el.clear()\n            el.send_keys(value)\n        self.driver.find_element(By.CSS_SELECTOR, ".submit").click()\n        print(f"[AdAuto] {listing_data['title']} 등록 완료!")`,
        logs: [
          'SYS: Selenium WebDriver 초기화 완료.',
          'SYS: 이실장넷 / 부동산뱅크 로그인 모듈 연동.',
          'SYS: 매물 DB 엑셀 시트 파싱 완료 (12건).',
          'RUN: python ad_auto_uploader.py',
          '[AdAuto] 이실장넷 자동 로그인 성공.',
          '[AdAuto] 래미안푸르지오 32평 매매 → 등록 완료!',
          '[AdAuto] 래미안푸르지오 34평 전세 → 등록 완료!',
          '[AdAuto] 12건 광고 예약 등록 전체 완료.',
          'SUCCESS: 매물 광고 자동 등록 완료!'
        ]
      },
      agent: {
        code: `class RealtorAgentTeam:\n    def __init__(self, listing_id):\n        self.listing_id = listing_id\n        \n    def run_flow(self):\n        info = ScoutAgent.fetch_data(self.listing_id)\n        seo_data = SearchAgent.find_details(info['address'])\n        article = WriterAgent.compose(info, seo_data)\n        img = ImageAgent.generate(info['title'])\n        RpaPoster.upload(article, img)\n        print("[AgentTeam] 오케스트레이션 전체 파이프라인 완료!")`,
        logs: [
          'SYS: Orchestrator Engine 구동.',
          'SYS: 5개 서브 에이전트 채널 동기화 완료.',
          'RUN: python run_agent_team("24067")',
          '[AgentTeam] 정보수집봇 -> 매물 DB 연동 성공',
          '[AgentTeam] 검색봇 -> 네이버 지하철 도보거리 대조 완료',
          '[AgentTeam] 썸네일제작봇 -> Canva 레이아웃 합성 완료',
          '[AgentTeam] 브라우저등록봇 -> 블로그 글작성 완료',
          'SUCCESS: 100% 자동 포스팅 성공!'
        ]
      },
      compile: {
        code: `import os\nimport subprocess\n\ndef build_windows_exe():\n    print("[Build] PyInstaller 패키징 모듈 로드 완료.")\n    cmd = "pyinstaller --onefile --noconsole --name=RealtorHelper main.py"\n    res = subprocess.run(cmd, shell=True, capture_output=True)\n    if res.returncode == 0:\n        print("[Build] dist/RealtorHelper.exe 생성 완료!")\n    else:\n        print("[Build] 빌드 오류 발생. 에러 스택 디버깅 중...")`,
        logs: [
          'SYS: PyInstaller 빌드 모듈 장착.',
          'SYS: 윈도우 실행 모듈 의존성 검토 완료.',
          'RUN: python build_helper.py',
          '[Build] PyInstaller 패키징 모듈 로드 완료.',
          '[Build] dist/RealtorHelper.exe 생성 완료!',
          'SUCCESS: 윈도우 독립 프로그램 변환 완료! (경로: ./dist/RealtorHelper.exe)'
        ]
      }
    }

    const selected = codeTemplates[type] || codeTemplates.crawl
    
    let logIndex = 0
    const logInterval = setInterval(() => {
      if (logIndex < selected.logs.length) {
        setVibeConsoleOutput(prev => prev + `> ${selected.logs[logIndex]}\n`)
        logIndex++
      } else {
        clearInterval(logInterval)
        setVibeStep(2)
        let codeText = ''
        let codeIndex = 0
        const codeInterval = setInterval(() => {
          if (codeIndex < selected.code.length) {
            codeText += selected.code[codeIndex]
            setVibeCodeOutput(codeText)
            codeIndex += 2
          } else {
            clearInterval(codeInterval)
            setVibeCodeOutput(selected.code)
            setIsGenerating(false)
            setVibeStep(3)
          }
        }, 3)
      }
    }, 400)
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [showAllPrograms, setShowAllPrograms] = useState(false)
  const [showCurriculumModal, setShowCurriculumModal] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<string[]>([])
  const [quizResult, setQuizResult] = useState<string>('')

  const quizQuestions = [
    {
      q: "1. 바이브코딩을 활용해서 직접 만드신 프로그램이 있으신가요?",
      a: ["예", "아니오"]
    },
    {
      q: "2. API를 이용해서 네이버부동산 데이터를 수집해 보신적이 있나요?",
      a: ["예", "아니오"]
    },
    {
      q: "3. 다른 사람의 프로그램을 공유받아 커스텀하게 변경해서 빌드하실 수 있나요?",
      a: ["예", "아니오"]
    }
  ]

  const handleQuizAnswer = (answerIdx: number) => {
    const newAnswers = [...quizAnswers, quizQuestions[quizStep].a[answerIdx]]
    setQuizAnswers(newAnswers)
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1)
    } else {
      const isFastTrack = newAnswers.every(ans => ans === "예")
      const resultText = isFastTrack ? 'fasttrack' : 'cohort2'
      setQuizResult(resultText)
      setQuizStep(quizStep + 1)
      setLeadForm(prev => ({ ...prev, track: resultText }))
    }
  }

  const resetQuiz = () => {
    setQuizStep(0)
    setQuizAnswers([])
    setQuizResult('')
  }

  const programs: ProgramItem[] = [
    {
      id: 'doc-1',
      name: '공적장부 5종 자동 발급기',
      category: 'doc',
      developer: '1기 정예크루 마포골드 대표',
      description: '인터넷등기소와 정부24 통합 자동화를 통해, 주소 입력 한 번으로 매물의 건축물대장, 토지대장 등 필수 공적 서류 5종을 한 번에 자동 발급하고 정리합니다.',
      impact: '서류 발급 및 정리 시간 15분 → 30초 단축',
      features: ['정부24 연동', '인터넷등기소 연동', 'PDF 자동 저장']
    },
    {
      id: 'scout-1',
      name: '공실클럽 매물 수집기',
      category: 'scout',
      developer: '1기 정예크루 신촌제일 대표',
      description: '공실클럽 사이트의 실시간 매물 정보를 자동으로 수집하여 중복 매물을 걸러내고 지정된 양식의 엑셀 파일로 바로 변환해 줍니다.',
      impact: '수동 매물 수집 시간 95% 단축',
      features: ['실시간 크롤링', '중복 필터링', '엑셀 자동 가공']
    },
    {
      id: 'ad-1',
      name: '네이버 부동산 광고순위 모니터링',
      category: 'ad',
      developer: '1기 정예크루 목동원 대표',
      description: '등록한 네이버 부동산 광고 매물들의 현재 노출 순위를 실시간으로 모니터링하고 순위 변동 시 실시간으로 기록해 줍니다.',
      impact: '광고 효율 분석 및 최적화 노출 지원',
      features: ['실시간 순위 확인', '변동 내역 알림', '경쟁 매물 비교']
    },
    {
      id: 'crm-1',
      name: '만기알리미 앱스스크립트',
      category: 'crm',
      developer: '1기 정예크루 여의도퍼스트 대표',
      description: '구글 스프레드시트와 앱스스크립트를 결합해 관리 중인 임대차 계약 만기일이 다가올 때 자동으로 계약자와 소유주에게 리마인드 알림을 발송합니다.',
      impact: '만기 관리 누락율 0% 및 재계약 성사율 제고',
      features: ['자동 날짜 계산', '알림톡 발송 트리거', '고객 데이터 동기화']
    },
    {
      id: 'ad-2',
      name: '매경이실장 매물 광고 자동화',
      category: 'ad',
      developer: '1기 정예크루 강남자이 대표',
      description: '매경이실장 어드민에 로그인하여 다량의 매물 광고 정보를 자동으로 입력하고 순식간에 일괄 등록을 완료하는 RPA 프로그램입니다.',
      impact: '단순 매물 업로드 시간 하루 2시간 → 5분',
      features: ['다중 로그인', '양식 폼 자동 매핑', '일괄 전송']
    },
    {
      id: 'copy-1',
      name: '부동산 매물 카피라이터 (클로드 프로젝트)',
      category: 'copy',
      developer: '1기 정예크루 판교탑 대표',
      description: '기본 매물 조건 입력 시 공인중개사법상 광고법 위반 소지가 있는 단어들을 사전 필터링하고 블로그용 핵심 카피라이팅을 3초 만에 생성합니다.',
      impact: '과태료 리스크 원천 차단 및 카피 작성 1분 완성',
      features: ['중개사법 금지어 검출', '블로그 최적화 톤앤매너', '자동 키워드 추출']
    },
    {
      id: 'ad-3',
      name: '부동산뱅크 매물 광고 자동화',
      category: 'ad',
      developer: '1기 정예크루 일산스마트 대표',
      description: '부동산뱅크 웹사이트 양식에 맞춰 다수의 매물 광고 건을 백그라운드 브라우저에서 차례대로 대량 자동 포스팅해 줍니다.',
      impact: '단순 입력 업무 효율성 90% 극대화',
      features: ['셀레늄 백그라운드 구동', '중복 등록 체크', '자동 실패 재시도']
    },
    {
      id: 'ad-4',
      name: '부동산 블로그 자동 포스팅',
      category: 'ad',
      developer: '1기 정예크루 분당푸르지오 대표',
      description: '신규 확보된 매물 정보를 불러와 어울리는 썸네일과 설명 텍스트를 조합하여 매일 예약된 시간에 네이버 블로그에 자동으로 발행합니다.',
      impact: '블로그 1일 1포스팅 피로도 완전 해소',
      features: ['예약 발행 스케줄러', '자동 포맷 적용', '네이버 글쓰기 API 연동']
    },
    {
      id: 'copy-2',
      name: '부동산 세무 어시스턴트 (클로드 프로젝트)',
      category: 'copy',
      developer: '1기 정예크루 동탄중앙 대표',
      description: '양도세, 취득세, 종부세 등 복잡한 세법 질문을 고객이 던졌을 때 최신 세법 기준의 친절한 설명 가이드와 답변 문구를 자동 도출해 줍니다.',
      impact: '상담 신뢰도 확보 및 세법 질문 실시간 대응',
      features: ['세금 계산', '상담용 세법 리포트', '고객 카톡 전송용 요약']
    },
    {
      id: 'scout-2',
      name: '아파트 실거래가 조회 분석기',
      category: 'scout',
      developer: '1기 정예크루 해운대뷰 대표',
      description: '국토교통부 실거래가 정보를 실시간 수집하여 해당 단지의 동향 분석, 직전 분기 대비 매매/전세 증감률을 차트화해 시각 보고서로 제작합니다.',
      impact: '수집 분석 시간 1시간 → 원클릭 10초 완성',
      features: ['국토부 API 다이렉트 쿼리', '동향 분석 그래프 시각화', 'PDF 리포트 추출']
    },
    {
      id: 'ad-5',
      name: '이실장 신규 광고 등록 프로그램',
      category: 'ad',
      developer: '1기 정예크루 광교자이 대표',
      description: '이실장 포털에 여러 매물 건의 기본 정보와 사진을 일괄 드래그앤드롭하여 자동으로 광고 등록 완료 스택에 올려주는 RPA 툴입니다.',
      impact: '여러 건의 광고 게시 작업 소요 시간 85% 감축',
      features: ['이미지 일괄 업로드', '자동 데이터 파싱', '상태 모니터링']
    },
    {
      id: 'ad-6',
      name: '직방 매물 관리기',
      category: 'ad',
      developer: '1기 정예크루 송파힐스 대표',
      description: '현재 직방에 광고 중인 매물의 현황을 스캔하고 계약 만료되거나 취소된 거래 완료 매물을 동기화하여 허위 광고 경고를 예방합니다.',
      impact: '벌점 리스크 제거 및 플랫폼 광고 관리 자동화',
      features: ['직방 API 대조', '자동 비활성화 토글', '매물 유효성 주기적 스캔']
    },
    {
      id: 'doc-2',
      name: '특약 복사기',
      category: 'doc',
      developer: '1기 정예크루 위례포레 대표',
      description: '임대차 계약, 전세자금 대출 보증, 근저당 설정 등 상황별로 법적 안전성이 검증된 100여 개의 필수 특약 문구를 빠르고 편리하게 선택하여 복사해 갑니다.',
      impact: '계약서 작성 시 법적 분쟁 리스크 최소화 및 시간 절약',
      features: ['상황별 카테고리 분류', '원클릭 클립보드 복사', '특약 커스텀 키워드 치환']
    },
    {
      id: 'scout-3',
      name: '네이버 부동산 매물필터 수집기',
      category: 'scout',
      developer: '1기 정예크루 세종센트럴 대표',
      description: '원하는 아파트 단지와 조건(융자금 없음, 남향, 특정 동)을 필터링해 기준에 부합하는 매물이 네이버 부동산에 뜨는 즉시 긁어모아 줍니다.',
      impact: '일일 매물 서칭 및 확인 전화 피로도 90% 경감',
      features: ['조건 필터 튜닝', '동작 크론 모니터링', '엑셀 결과 추출']
    },
    {
      id: 'alert-1',
      name: '네이버 부동산 아파트 신규매물 알림이',
      category: 'alert',
      developer: '1기 정예크루 위례포레 대표',
      description: '설정한 타겟 아파트 단지에 새로운 매매나 전세 매물이 신규 등록되는 즉시 텔레그램 메신저 알림으로 실시간 알림을 보내 선점을 돕습니다.',
      impact: '실시간 모니터링 공수 0%화 및 선점 속도 극대화',
      features: ['실시간 주기 감시', '텔레그램 봇 푸시', '가격 변동 추이 연동']
    },
    {
      id: 'scout-4',
      name: '당근 부동산 매물 수집기',
      category: 'scout',
      developer: '1기 정예크루 평촌원 대표',
      description: '당근마켓 내 지역 카테고리에 등록되는 직거래 부동산 매물이나 매도/임차 매물을 구하는 유저의 게시글을 자동으로 수집해 정리해 줍니다.',
      impact: '당근 플랫폼 내 신규 매물 및 고객 발굴 채널 개척',
      features: ['당근 피드 스캔', '키워드 알림 필터', 'DB 일괄 가공']
    },
    {
      id: 'crm-2',
      name: '보유세 계산기 프로그램',
      category: 'crm',
      developer: '1기 정예크루 반포스타 대표',
      description: '고객의 다주택 보유 현황 및 공시가 정보를 대입해 종합부동산세, 재산세 등 예상 보유세를 간이 계산하고 상담 결과 PDF를 발행해 주는 툴입니다.',
      impact: '상담용 보유세 시뮬레이션 원클릭 생성',
      features: ['다주택 중과 세율 계산', '세목별 자동 계산', '고객 설명 보고서 출력']
    },
    {
      id: 'ad-7',
      name: '블로그 포스팅 자동생성기',
      category: 'ad',
      developer: '1기 정예크루 청라웰스 대표',
      description: '매물의 면적, 방수, 입지 요약 정보만 던져주면 검색 노출에 최적화된 양질의 부동산 블로그 포스팅 원고를 AI가 완전 자동으로 빌딩해 줍니다.',
      impact: '원고 기획 및 대리 작성 비용 100% 절감',
      features: ['부동산 전문 글쓰기 엔진', '네이버 SEO 최적 구조 적용', '자동 이미지 추천 태그']
    },
    {
      id: 'copy-3',
      name: '블로그 썸네일 생성기 프로그램',
      category: 'copy',
      developer: '1기 정예크루 동탄중앙 대표',
      description: '매물 특징(초역세권, 로얄층 등)과 가격 정보를 대입하면 미리 지정된 세련된 디자인 템플릿에 맞추어 블로그용 메인 썸네일 이미지를 5초 만에 제작합니다.',
      impact: '썸네일 디자인 제작 도구 활용 공수 완전 생략',
      features: ['간편 텍스트 대치', '배경 색상 자동 매칭', '고해상도 이미지 다운로드']
    },
    {
      id: 'alert-2',
      name: '서이추 자동화 프로그램',
      category: 'alert',
      developer: '1기 정예크루 성동베스트 대표',
      description: '부동산 타겟 실수요 고객들이 주로 방문하는 타겟 블로그의 이웃들을 찾아 자동으로 서로이웃 신청 및 친해지기 인사말을 보내 이웃을 증대합니다.',
      impact: '하루 50명 수동 신청 대비 피로도 90% 이상 감축',
      features: ['안전한 대기 간격 스케줄링', '자동 이웃 멘트 다변화', '성공 이력 로깅']
    },
    {
      id: 'alert-3',
      name: '쓰레드 스하리 자동화 프로그램',
      category: 'alert',
      developer: '1기 정예크루 대전하나 대표',
      description: '최신 SNS 플랫폼인 메타 Threads(쓰레드)에 일일 부동산 뉴스 요약 및 매물 카드 정보를 크론 스케줄에 따라 자동으로 퍼블리싱하고 반응을 관리합니다.',
      impact: 'MZ세대 타겟 신규 채널 브랜딩 자동화',
      features: ['자동 스레드 작성', '계정 반응 자동 필터', '실시간 소통 이력 리포팅']
    },
    {
      id: 'crm-3',
      name: '안심전세 확인 프로그램',
      category: 'crm',
      developer: '1기 정예크루 청라웰스 대표',
      description: '임차 희망 주택의 전세 가격이 보증보험(HUG) 가입 조건에 완벽히 부합하는지 공시가율, 선순위 근저당 비율을 정밀 분석해 합격 여부를 판독합니다.',
      impact: '보증보험 가입 불허로 인한 계약 파기 리스크 완전 제거',
      features: ['HUG 최신 규정 산식 내장', '안심 전세 여부 원클릭 판정', '브리핑용 결과표 출력']
    },
    {
      id: 'alert-4',
      name: '인스타그램 좋아요 자동화 프로그램',
      category: 'alert',
      developer: '1기 정예크루 대전하나 대표',
      description: '설정한 타겟 지역 및 부동산 관심사 태그를 가진 사용자들의 최신 포스트에 자동으로 좋아요와 간단한 리액션을 남겨 계정 유입을 극대화합니다.',
      impact: '인스타그램 팔로워 증대 및 매물 홍보 노출 효과 배가',
      features: ['타겟 태그 검색', '좋아요 오토 트리거', '어뷰징 차단 지연 시스템']
    },
    {
      id: 'doc-3',
      name: '중개대상물 확인설명서 자동 작성기',
      category: 'doc',
      developer: '1기 정예크루 마포골드 대표',
      description: '건축물대장 정보와 등기부 정보를 파싱 연동하여 한 번에 법정 중개대상물 확인설명서 폼의 기본 기재 의무 사항을 70% 이상 자동 기재 작성합니다.',
      impact: '수동 대조 기재 오류로 인한 공제사고 예방 및 작성 효율 4배 향상',
      features: ['대장 데이터 자동 매칭', '필수 표기 항목 유효성 체크', '통합 출력 지원']
    }
  ]

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsFormSubmitted(true)
  }

  const simulateAiTyping = (text: string) => {
    setIsGenerating(true)
    setGeneratedResult('')
    let currentText = ''
    let charIndex = 0
    const intervalTime = text.length > 300 ? 4 : 8
    
    const interval = setInterval(() => {
      if (charIndex < text.length) {
        currentText += text[charIndex]
        setGeneratedResult(currentText)
        charIndex++
      } else {
        clearInterval(interval)
        setIsGenerating(false)
      }
    }, intervalTime)
  }

  const generateBlog = () => {
    const response = `[네이버 블로그 포스팅 초안 생성 완료]

제목: [마포 아현동 매매] 아현역 초역세권! 올수리 완료된 명품 아파트 매물 브리핑

안녕하세요! 마포 부동산 가이드입니다. 
오늘은 실거주 목적이나 장기 투자로 가장 선호도가 높은 아현동 프리미엄 아파트 매매 물건을 정밀 분석해 드립니다. 

■ 매물 요약 정보
- 소재지: 서울시 마포구 아현동 래미안푸르지오
- 거래 형태: 아파트 매매
- 매매 가격: 18억 5,000만 원
- 매물 특징: 아현역 도보 3분 초역세권, 로얄층 판상형 남향, 최근 올수리 완료

■ 교통 및 입지 환경 분석
이 매물의 가장 큰 장점은 입지입니다. 아현역 도보 3분 거리에 위치한 진정한 초역세권 단지입니다. 여의도, 광화문, 시청 등 강북의 주요 핵심 업무지구로의 20분 내 통근이 보장되는 직주근접의 결정체라고 할 수 있습니다. 

■ 내부 리모델링 상태
로얄층 판상형 남향 구조로, 하루 종일 우수한 일조권과 막힘 없는 맞춤형 조망을 즐기실 수 있습니다. 특히 최근 집주인분께서 친환경 최고급 자재를 사용하여 전반적인 올수리를 완료해 신축 아파트와 비교해도 손색이 없는 최상급의 컨디션을 보여주고 있어 구매 후 수리비 지출 우려가 전혀 없습니다.

현지 부동산 시장의 급격한 실거래 회복 흐름과 본 단지의 입지 조건 대비 매력적인 평당 단가로 책정되어 빠른 소진이 우려됩니다. 
상세한 내부 관람이나 추가적인 세무적 검토가 필요하신 고객님께서는 하단의 연락처로 문의해 주시기 바랍니다.

공덕베스트 부동산 대표 올림
상담문의: 010-XXXX-XXXX`
    
    simulateAiTyping(response)
  }

  const generateSms = () => {
    const response = `[안내 문자 메시지 작성 완료]

안녕하세요, ${smsInputs.clientName}.
${smsInputs.agentName}입니다.

소중한 문의 감사드립니다. 어제 물어보셨던 [${smsInputs.listingName}]과 관련하여 최신 매물 상세 내역과 브리핑 일정을 전달해 드립니다.

해당 매물은 아현역 인근에서 가장 귀한 남향 로얄층 판상형 구조로, 최근 내부 올수리를 진행하여 거실과 주방 마감이 신축처럼 매우 훌륭합니다.

현재 집주인분과 협의하여 이번 주 목요일과 토요일 오후에 편안하게 세대를 관람하실 수 있는 방문 시간을 잡아두었습니다. 
바쁘시겠지만 매물 특성상 대기 수요가 많으므로 아래 링크나 회신 문자로 방문 가능한 시간을 미리 골라 알려주시면 조율해 두겠습니다.

바쁘신 일정에 시간 낭비 없도록 정확한 물건 분석 리포트도 현장에 준비해 두겠습니다. 편하게 연락해 주세요. 감사합니다.

- ${smsInputs.agentName} 배상`
    
    simulateAiTyping(response)
  }

  const generateBriefing = () => {
    const response = `[AI 매물 분석 및 고객 대면 브리핑 가이드]

■ 1. 매물 핵심 분석 (Unique Selling Point)
- 교통성: 공덕역 펜타역세권 도보 5분
- 구조성: 전통적인 남향 판상형 배치로 채광과 통풍 극대화
- 보존 상태: 실소유주 거주로 마감재 보존율 상위 5% 미만 깨끗한 컨디션 유지

■ 2. 고객 소구 핵심 셀링 포인트
"이 단지는 인근 30평대 단지 중에서 실소유주 거주율이 가장 높은 단지 중 하나입니다. 그만큼 단지 조경과 주민 편의시설 관리가 매우 잘 되어 있죠. 특히 2018년도식 준신축이라 감가상각이 덜하면서도 신축의 프리미엄을 온전히 누리실 수 있습니다."

■ 3. 고객 우려 요인 (학원가 부재) 돌파 방안
- 고객 질문: "아이들 보낼 만한 학원가가 주변에 마땅치 않아 보이는데요?"
- 중개사 대책 답변: "네, 맞습니다. 단지 바로 옆에 대형 학원가가 밀집되어 있지는 않습니다. 하지만 이 때문에 아파트 단지 바로 정문 앞에 대흥역, 신촌 방면 대형 학원가 셔틀버스가 안전하게 정차하는 전용 승하차 존이 마련되어 있습니다. 오히려 아이들이 유해업소 없는 조용한 단지 내에서 안전하게 셔틀로 통학할 수 있어 선배 부모님들의 안심 통학 선호도가 매우 높습니다."

■ 4. 대면 계약 클로징 대본 (Sales Script)
"사장님, 시세 15억 대에서 집주인이 직접 살며 발코니 누수나 결로 하자 관리까지 직접 신경 쓴 매물은 1년에 몇 개 안 나옵니다. 지금 세입자 만기로 수리비가 들 매물과 비교하면 이 집은 입주하시면서 최소 3천만 원 이상 버시는 겁니다. 이번 주 방문 때 결정하시는 걸 권해드립니다."`
    
    simulateAiTyping(response)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult)
    setIsCopied(true)
    setShowNotification(true)
    setTimeout(() => {
      setIsCopied(false)
      setShowNotification(false)
    }, 2000)
  }

  const filteredPrograms = programs.filter(prog => {
    const matchesCategory = filterCategory === 'all' || prog.category === filterCategory
    const matchesSearch = prog.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prog.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-mask, .reveal-scale, .reveal-blur'
    )
    revealElements.forEach(el => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [filteredPrograms.length, vibePromptType, quizStep, showAllPrograms])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let maxScroll = 0
    const measure = () => {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight
    }

    const onScroll = () => {
      const y = window.scrollY
      const progress = maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0
      document.documentElement.style.setProperty('--scroll-progress', String(progress))
      document.querySelector('.header')?.classList.toggle('scrolled', y > 60)
    }

    const onResize = () => {
      measure()
      onScroll()
    }

    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const card = target?.closest?.('.spotlight') as HTMLElement | null
      if (!card) return
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      card.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }

    measure()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('mousemove', onMove, { passive: true })

    const ro = new ResizeObserver(onResize)
    ro.observe(document.body)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('mousemove', onMove)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="page-shell">
      <div className="scroll-progress" aria-hidden="true" />
      <header className="header">
        <div className="container flex-row items-center justify-between">
          <div className="logo-container">
            <div className="logo-icon">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="logo-text">중개사 AI 클럽</span>
            </div>
          </div>
          <div className="header-actions">
            <nav className="nav-links">
              <a href="/news" className="nav-link">
                <TrendingUp className="w-4 h-4 dusk-accent" />
                <span>AI 실무 인사이트</span>
              </a>
            </nav>
            <a href="#join" className="cta-button">
              크루 합류하기
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section id="hero" className="hero-section">
          <div className="container hero-stage">
            <div className="hero-copy">
              <h1 className="hero-title">
                AI를 활용하는 상위 1% 중개사들의 중개업 자동화 비밀기지
              </h1>

              <p className="hero-desc">
                대한민국 최초 공인중개사 AI 커뮤니티. 함께 고민하고, 만들고, 공유합니다.
              </p>

              <div className="hero-buttons">
                <a href="#join" className="cta-button cta-button--lg">
                  정식 멤버 참가하기
                </a>
                <a href="#vault" className="secondary-button">
                  비밀창고 둘러보기
                </a>
              </div>
            </div>

            <div className="hero-ledger">
              <div className="hero-ledger-head">
                <span>중개사 AI 클럽 실무 자동화 지표</span>
                <span className="hero-ledger-status">실시간 운영 중</span>
              </div>
              <div className="hero-figures">
                <div className="hero-figure-item">
                  <span className="hero-figure-val">88.5%</span>
                  <span className="hero-figure-label">수강생 프로그램 개발 성공률</span>
                </div>
                <div className="hero-figure-item">
                  <span className="hero-figure-val hero-figure-val--apricot">30초</span>
                  <span className="hero-figure-label">일일 매물 분석·가공 (기존 1시간)</span>
                </div>
                <div className="hero-figure-item">
                  <span className="hero-figure-val">95%</span>
                  <span className="hero-figure-label">반복 실무 시간 단축 효과</span>
                </div>
              </div>
              <p className="aeo-answer-body">
                중개사 AI 클럽은 공인중개사가 자연어 지시(Vibe Coding)를 통해 부동산 매물 수집, 공적장부 발급, 광고 등록 등 실무 자동화 프로그램을 직접 개발하고 무제한 공유하는 공인중개사 전용 AI 플랫폼입니다.
              </p>
            </div>
          </div>
        </section>

        <section id="why" className="section-band">
          <div className="container">
            <div className="split-header">
              <h2 className="section-title">왜 중개사 AI 클럽이어야만 할까요?</h2>
              <p className="section-desc">
                다들 AI 시대라고 소리치지만, 정작 현업 공인중개사의 실무 환경에 녹아드는 해법은 전혀 다릅니다.
              </p>
            </div>

            <div className="editorial-rows">
              <div className="editorial-row">
                <h3 className="pain-title">01. 매물 광고와 마케팅의 비효율</h3>
                <p className="pain-desc">
                  매일 반복되는 단순 매물 등록과 블로그 포스팅에 진이 빠져, 정작 중요한 고객 미팅과 현장 임장 시간이 부족합니다.
                </p>
              </div>

              <div className="editorial-row">
                <h3 className="pain-title">02. 내 업무와 겉도는 AI 도입 장벽</h3>
                <p className="pain-desc">
                  다들 AI, AI 하지만 내 업무 특성에 맞추어 실제로 적용할 방법이 막막합니다.
                </p>
              </div>

              <div className="editorial-row">
                <h3 className="pain-title">03. 현업 적용이 어려운 이론 위주 강의</h3>
                <p className="pain-desc">
                  비싼 AI 강의와 프롬프트 강좌를 들었지만, 실제 내 업무를 덜어주는 나만의 자동화 도구는 하나도 얻지 못했습니다.
                </p>
              </div>
            </div>

            <div className="compare-well">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>업무 구분</th>
                    <th>기존 수동 방식</th>
                    <th>AI 자동화 방식</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>매물 수집 및 동향 분석</strong></td>
                    <td>매일 1시간 이상 소요 (직접 검색 및 엑셀 수동 정리)</td>
                    <td><strong className="compare-win">단 30초 완성</strong> (네이버 부동산 매물 엑셀 수집기 작동)</td>
                  </tr>
                  <tr>
                    <td><strong>블로그 마케팅 자동화</strong></td>
                    <td>매물 정보 기획, 원고 작성, 썸네일 제작 등 최소 1시간 이상</td>
                    <td><strong className="compare-win">5분 완성</strong> (매물 번호만 넣고 AI 작성 및 임시 저장)</td>
                  </tr>
                  <tr>
                    <td><strong>매물광고 자동화</strong></td>
                    <td>CP사, 블로그, 당근 등 플랫폼마다 개별 등록 (2시간)</td>
                    <td><strong className="compare-win">5분 이내 완료</strong> (매물광고 신규 및 재등록 자동화)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="what-we-do" className="section-band--well">
          <div className="container">
            <div className="split-header">
              <h2 className="section-title">중개사 AI 클럽은 무엇을 하는 곳인가요?</h2>
              <p className="section-desc">
                현업 공인중개사가 실무를 간소화할 중개업 자동화 프로그램을 개발하고 공유하는 지식 협력 생태계입니다.
              </p>
            </div>

            <div className="bento-well-grid">
              <div className="bento-well-card">
                <h3 className="master-title">01. 공인중개사 자동화 도구 직접 구축</h3>
                <p className="master-desc">
                  프로그래밍 지식이 없어도 인공지능 비서에게 자연어로 중개 업무 프로세스를 지시하여 네이버 부동산 수집기, 매물 자동 업로더 등 실무 자동화 프로그램을 100% 직접 바이브 코딩으로 구현할 수 있습니다.
                </p>
              </div>

              <div className="bento-well-card">
                <h3 className="master-title">02. 부동산 자동화 툴 무제한 상호 공유</h3>
                <p className="master-desc">
                  공인중개사가 제작한 실무용 도구 1개 이상을 공유 목록에 등록하면, 동료 크루들이 개발한 다양한 자동화 도구(등기부등본 발급기, 텔레그램 급매 알림봇 등)를 제한 없이 업무용 PC에 장착해 활용할 수 있습니다.
                </p>
              </div>

              <div className="bento-well-card bento-well-card--wide">
                <div>
                  <h3 className="master-title">03. 기술적 병목의 집단지성 해결</h3>
                </div>
                <p className="master-desc">
                  독학하는 과정에서 만나는 각종 시스템 오류나 요청 차단 문제를 크루 전용 커뮤니티 공간에 업로드하여 동료 공인중개사들과 협력해 디버깅 솔루션을 빠르게 도출합니다. 서로의 기술적 병목을 같이 고민하고 완성된 도구를 아낌없이 공유합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="vault" className="section-band">
          <div className="container flex-col gap-8">
            <div className="vault-head-row">
              <div>
                <h2 className="section-title">부동산 자동화 프로그램 비밀 창고</h2>
                <p className="section-desc" style={{ marginTop: '12px' }}>
                  내가 만든 무기 1개를 기부하면, 현업에서 매일 사용 중인 정교한 자동화 툴을 무제한 가져와 내 비즈니스에 적용할 수 있습니다.
                </p>
              </div>

              <div className="category-bar">
                {(
                  [
                    { id: 'all', label: '전체 보기', icon: Layers },
                    { id: 'doc', label: '공적 서류', icon: FileCode },
                    { id: 'scout', label: '매물 수집', icon: Search },
                    { id: 'ad', label: '매물 광고', icon: Send },
                    { id: 'copy', label: '상담·콘텐츠', icon: MessageSquare },
                    { id: 'report', label: '보고서·뉴스레터', icon: FileText },
                    { id: 'crm', label: 'CRM·고객관리', icon: Users },
                    { id: 'alert', label: '영업·알림', icon: Clock }
                  ] as { id: CategoryType; label: string; icon: React.ElementType }[]
                ).map(cat => {
                  const IconComp = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setFilterCategory(cat.id)
                        setShowAllPrograms(false)
                      }}
                      className={`category-button ${filterCategory === cat.id ? 'active' : ''}`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="vault-grid">
              {filteredPrograms.slice(0, showAllPrograms ? undefined : 9).map((prog) => (
                <div
                  key={prog.id}
                  onClick={() => setSelectedProgram(prog)}
                  className="vault-card spotlight"
                >
                  <div className="flex-row justify-between items-center">
                    <span className="vault-tag">
                      {
                        prog.category === 'doc' ? <><FileCode className="w-3 h-3" /> 공적 서류</> :
                        prog.category === 'scout' ? <><Search className="w-3 h-3" /> 매물 수집</> :
                        prog.category === 'ad' ? <><Send className="w-3 h-3" /> 매물 광고</> :
                        prog.category === 'copy' ? <><MessageSquare className="w-3 h-3" /> 상담·카피</> :
                        prog.category === 'report' ? <><FileText className="w-3 h-3" /> 보고서</> :
                        prog.category === 'crm' ? <><Users className="w-3 h-3" /> CRM</> :
                        <><Clock className="w-3 h-3" /> 영업·알림</>
                      }
                    </span>
                    <span className="vault-dev">{prog.developer.split(' ').pop()}</span>
                  </div>
                  <h3 className="vault-title">
                    <span>{prog.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 dusk-muted flex-shrink-0" />
                  </h3>
                  <p className="vault-desc">
                    {prog.description}
                  </p>
                  <div className="vault-card-footer">
                    <span className="vault-impact">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {prog.impact}
                    </span>
                    <span className="vault-more">자세히 보기</span>
                  </div>
                </div>
              ))}
              {filteredPrograms.length === 0 && (
                <div className="vault-empty">
                  검색어에 매칭되는 자동화 도구가 없습니다. 다른 키워드로 검색해 보세요!
                </div>
              )}
            </div>

            {filteredPrograms.length > 9 && (
              <div className="vault-more-wrap">
                <button
                  onClick={() => setShowAllPrograms(!showAllPrograms)}
                  className="secondary-button"
                >
                  {showAllPrograms ? '접기' : `더보기 (${filteredPrograms.length - 9}개 더보기)`}
                </button>
              </div>
            )}
          </div>
        </section>

        <section id="how-to-join" className="section-band--elevated">
          <div className="container">
            <div className="split-header">
              <h2 className="section-title">중개사 AI 클럽 합류 방법</h2>
              <p className="section-desc">
                철저한 <strong>인증제 폐쇄형 플랫폼</strong>으로 운영됩니다. 중개사님의 현재 상황에 알맞은 트랙을 선택해 주세요.
              </p>
            </div>

            <div className="track-grid">
              <div className="track-panel-primary">
                <div className="flex-col gap-3">
                  <h3 className="master-title">정규 교육 과정 (입문 및 실무 완성)</h3>
                  <p className="master-desc">
                    채팅으로 AI에게 개발 지시를 내려 실무 자동화 프로그램을 내 손으로 100% 직접 개발하고 완성하는 밀착 집중 트랙입니다.
                  </p>
                </div>
                <button
                  onClick={() => setShowCurriculumModal(true)}
                  className="cta-button cta-button--block"
                >
                  <span>커리큘럼 확인하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="track-panel-secondary">
                <div className="flex-col gap-3">
                  <h3 className="master-title">프리패스 트랙 (기개발자 즉시 합류)</h3>
                  <p className="master-desc">
                    이미 제작하여 실무에 사용 중인 본인의 자동화 툴 1개 이상을 공유(기여)하고, 교육 수강 없이 즉각 비밀 창고 전체를 이용하는 트랙입니다.
                  </p>
                </div>
                <button
                  onClick={() => setShowQuizModal(true)}
                  className="secondary-button cta-button--block"
                >
                  <span>합격 가능성 진단하기</span>
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="compare-table-container">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>항목</th>
                    <th>정규 교육 과정</th>
                    <th>프리패스 트랙</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>추천 대상</strong></td>
                    <td>코딩 왕초보 및 직접 내 프로그램을 기획하고 구현하고 싶은 중개사</td>
                    <td>이미 개발해서 현업에 사용 중인 본인만의 자동화 도구가 있는 능력자</td>
                  </tr>
                  <tr>
                    <td><strong>참여 조건</strong></td>
                    <td>공식 정규 교육 수강 및 과정 완수</td>
                    <td>공유 가능한 고유의 자동화 프로그램 1개 기부</td>
                  </tr>
                  <tr>
                    <td><strong>주요 혜택</strong></td>
                    <td>기초 교육 + AI 설계 코칭 + 비밀 창고 무제한 이용</td>
                    <td>교육 수강 없이 비밀 창고 데이터 및 공유 프로그램 즉시 이용</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="vibe-playground" className="section-band">
          <div className="container flex-col gap-8">
            <div className="split-header">
              <h2 className="section-title">정규과정 바이브 코딩 시뮬레이터</h2>
              <p className="section-desc">
                만들고자 하는 자동화 지시어를 선택하고 실행을 클릭해 보세요. 동일한 방식(바이브코딩)으로 나만의 중개업 자동화 프로그램을 만듭니다.
              </p>
            </div>

            <div className="playground-grid">
              <div className="flex-col gap-6">
                <div className="chip-container">
                  <button
                    onClick={() => runVibeSimulation('crawl')}
                    className={`prompt-chip ${vibePromptType === 'crawl' ? 'active' : ''}`}
                    disabled={isGenerating}
                  >
                    <Search className="w-4 h-4 dusk-accent" />
                    네이버 부동산 매물 엑셀 크롤러
                  </button>
                  <button
                    onClick={() => runVibeSimulation('adauto')}
                    className={`prompt-chip ${vibePromptType === 'adauto' ? 'active' : ''}`}
                    disabled={isGenerating}
                  >
                    <Send className="w-4 h-4 dusk-accent" />
                    매물 광고 자동 등록 및 예약 관리
                  </button>
                  <button
                    onClick={() => runVibeSimulation('agent')}
                    className={`prompt-chip ${vibePromptType === 'agent' ? 'active' : ''}`}
                    disabled={isGenerating}
                  >
                    <Bot className="w-4 h-4 dusk-accent" />
                    매물번호 입력 포스팅 에이전트팀
                  </button>
                  <button
                    onClick={() => runVibeSimulation('compile')}
                    className={`prompt-chip ${vibePromptType === 'compile' ? 'active' : ''}`}
                    disabled={isGenerating}
                  >
                    <Laptop className="w-4 h-4 dusk-accent" />
                    윈도우 단독 프로그램 .exe 빌드
                  </button>
                </div>

                <div className="form-panel">
                  <div className="flex-col gap-4">
                    <h3 className="pain-title flex-row items-center gap-2">
                      <Laptop className="w-5 h-5 dusk-accent" />
                      자연어로 지시한 바이브 코딩 명령문
                    </h3>
                    <div className="prompt-quote-box">
                      {vibePromptType === 'crawl' && '"네이버 부동산 API의 특정 단지번호를 가져와서 엑셀 파일로 바로 변환해 주는 파이썬 프로그램을 작성해 줘."'}
                      {vibePromptType === 'adauto' && '"이실장넷과 부동산뱅크에 자동 로그인해서, 엑셀에 정리된 매물 목록을 한 번에 일괄 등록하고 예약 관리까지 해 주는 RPA 프로그램을 만들어 줘."'}
                      {vibePromptType === 'agent' && '"매물번호만 입력해 주면, 정보수집/웹검색/글작성/썸네일생성/업로더 역할이 체인을 이루어 최종 블로그에 글을 등록하는 에이전트 팀을 구성해 줘."'}
                      {vibePromptType === 'compile' && '"완성된 파이썬 스크립트 파일을 코딩 모르는 사무원도 원클릭으로 쓸 수 있도록 단독 윈도우 실행프로그램(.exe)으로 패키징 빌드해 줘."'}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="cta-button cta-button--block"
                    onClick={() => runVibeSimulation(vibePromptType)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? '바이브 코드 빌딩 중…' : '바이브 코드 생성 및 실행'}
                  </button>
                </div>
              </div>

              <div className={`console-panel${isGenerating ? ' is-running' : ''}`}>
                <div className="console-header">
                  <span className="console-title">vibe-compiler-terminal.log</span>
                  {vibeCodeOutput && (
                    <span className="console-status">실행 완료</span>
                  )}
                </div>

                <div className="console-body">
                  {vibeStep === 0 && (
                    <div className="console-empty">
                      <div className="console-empty-icon">
                        <Code className="w-5 h-5 dusk-muted" />
                      </div>
                      <p className="dusk-ink-2">바이브 컴파일러 출력 대기 중</p>
                      <p className="dusk-muted">왼쪽 지시어 항목을 선택하고 실행을 클릭해 주세요.</p>
                    </div>
                  )}

                  {vibeStep >= 1 && (
                    <pre className="console-pre">
                      {vibeConsoleOutput}
                    </pre>
                  )}

                  {vibeStep >= 2 && vibeCodeOutput && (
                    <div className="code-block-section">
                      <p className="code-block-label">생성된 파이썬 코드</p>
                      <div className="editor-flex">
                        <div className="editor-line-numbers">
                          {vibeCodeOutput.split('\n').map((_, idx) => (
                            <div key={idx}>{idx + 1}</div>
                          ))}
                        </div>
                        <pre className="console-pre flex-grow">
                          <code>{vibeCodeOutput}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {vibeStep === 3 && (
                    <div className="vibe-success">
                      <div className="vibe-success-banner">
                        빌딩 완료: 실행 프로그램 미리보기
                      </div>
                      <div className="sim-frame">
                        <div className="sim-frame-head">
                          {vibePromptType === 'crawl' && '네이버 부동산 매물 크롤러 v1.0'}
                          {vibePromptType === 'adauto' && '매물 광고 자동 등록기 v1.0'}
                          {vibePromptType === 'agent' && 'AI 에이전트팀 오케스트레이터 v1.0'}
                          {vibePromptType === 'compile' && 'RealtorHelper.exe v1.0'}
                        </div>
                        <div className="sim-frame-body">
                          {vibePromptType === 'crawl' && (
                            <div>
                              <div className="sim-toolbar">
                                <span className="dusk-muted">단지번호</span>
                                <span className="sim-input">107511</span>
                                <span className="sim-pill">수집 시작</span>
                              </div>
                              <div className="sim-table">
                                <div className="sim-table-head">
                                  <span>No</span><span>매물명</span><span>거래</span><span>가격</span><span>평수</span>
                                </div>
                                {[['1', '래미안푸르지오', '매매', '18.5억', '32평'], ['2', '래미안푸르지오', '매매', '19.0억', '34평'], ['3', '래미안푸르지오', '전세', '8.0억', '32평'], ['4', '힐스테이트', '매매', '17.8억', '25평']].map((row, i) => (
                                  <div key={i} className="sim-table-row">
                                    {row.map((cell, j) => <span key={j}>{cell}</span>)}
                                  </div>
                                ))}
                                <div className="sim-note">…외 43건</div>
                              </div>
                              <div className="sim-toolbar" style={{ marginTop: '12px' }}>
                                <span className="sim-pill"><Download className="w-3 h-3" /> 엑셀 다운로드</span>
                                <span className="sim-pill sim-pill--muted"><RefreshCw className="w-3 h-3" /> 새로고침</span>
                              </div>
                              <div className="sim-status-bar">
                                <span className="flex-row items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> 수집 완료: 47건 (naver_listings.xlsx 저장됨)</span>
                              </div>
                            </div>
                          )}
                          {vibePromptType === 'adauto' && (
                            <div>
                              <div className="sim-toolbar">
                                <span className="dusk-muted">플랫폼</span>
                                <span className="sim-input">이실장넷</span>
                                <span className="dusk-accent">로그인됨</span>
                              </div>
                              <div className="sim-list">
                                {[
                                  { name: '래미안푸르지오 32평 매매', price: '18.5억', status: '등록완료', done: true },
                                  { name: '래미안푸르지오 34평 전세', price: '8.0억', status: '등록완료', done: true },
                                  { name: '아현힐스테이트 25평 매매', price: '12.3억', status: '등록완료', done: true },
                                  { name: '공덕파크자이 28평 매매', price: '15.1억', status: '대기중', done: false }
                                ].map((item, i) => (
                                  <div key={i} className="sim-list-row">
                                    {item.done ? <CheckCircle className="w-3.5 h-3.5 dusk-accent" /> : <Clock className="w-3.5 h-3.5 dusk-accent-2" />}
                                    <span className="dusk-ink flex-grow">{item.name}</span>
                                    <span className="dusk-muted">{item.price}</span>
                                    <span className={item.done ? 'dusk-accent' : 'dusk-accent-2'}>{item.status}</span>
                                  </div>
                                ))}
                                <div className="sim-note">…외 8건 대기 중</div>
                              </div>
                              <div className="sim-progress">
                                <div className="sim-progress-fill" />
                              </div>
                              <div className="sim-toolbar">
                                <span className="sim-pill">일괄 등록 시작</span>
                                <span className="sim-pill sim-pill--muted">예약 설정</span>
                              </div>
                            </div>
                          )}
                          {vibePromptType === 'agent' && (
                            <div>
                              <div className="sim-toolbar">
                                <span className="dusk-muted">매물번호</span>
                                <span className="sim-input">24067</span>
                                <span className="sim-pill">실행</span>
                              </div>
                              <div className="sim-list">
                                {['정보수집봇', '웹검색봇', '글작성봇', '썸네일봇', '업로드봇'].map((name, i) => (
                                  <div key={i} className="sim-list-row">
                                    <span className="dusk-ink" style={{ width: '76px' }}>{name}</span>
                                    <div className="sim-progress flex-grow" style={{ marginBottom: 0 }}>
                                      <div className="sim-progress-fill sim-progress-fill--full" />
                                    </div>
                                    <span className="dusk-accent">완료</span>
                                  </div>
                                ))}
                              </div>
                              <div className="sim-status-bar">
                                <span className="flex-row items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> 블로그 포스팅 완료</span>
                                <span className="sim-pill">결과 보기</span>
                              </div>
                            </div>
                          )}
                          {vibePromptType === 'compile' && (
                            <div>
                              <div className="sim-module-grid">
                                {[
                                  { icon: Database, name: '매물 수집' },
                                  { icon: Send, name: '광고 등록' },
                                  { icon: FileText, name: '블로그 작성' },
                                  { icon: FileCode, name: '서류 발급' }
                                ].map((item, i) => {
                                  const IconComp = item.icon
                                  return (
                                    <div key={i} className="sim-module-card">
                                      <IconComp className="w-5 h-5 dusk-accent" />
                                      <span>{item.name}</span>
                                    </div>
                                  )
                                })}
                              </div>
                              <div className="sim-log-box">
                                <div className="dusk-muted" style={{ marginBottom: '6px' }}>최근 실행 이력</div>
                                {[['14:30', '매물 수집 47건 완료'], ['14:35', '블로그 포스팅 3건 자동 등록'], ['14:40', '이실장넷 광고 12건 갱신']].map((log, i) => (
                                  <div key={i} className="flex-row gap-3">
                                    <span className="dusk-muted num">{log[0]}</span>
                                    <span className="dusk-ink-2">{log[1]}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="dusk-muted">버전 1.0.0 (상태 정상)</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {selectedProgram && (
          <div className="modal-backdrop" onClick={() => setSelectedProgram(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedProgram(null)} className="modal-close" aria-label="닫기">
                ✕
              </button>

              <div className="flex-col gap-6">
                <div className="flex-col gap-2">
                  <h3 className="master-title">{selectedProgram.name}</h3>
                  <p className="vault-dev">{selectedProgram.developer} (등록번호 {selectedProgram.id.toUpperCase()})</p>
                </div>

                <div>
                  <h4 className="track-label">도구 기능 요약</h4>
                  <p className="master-desc">{selectedProgram.description}</p>
                </div>

                <div>
                  <h4 className="track-label">핵심 기능 목록</h4>
                  <ul className="modal-features-list">
                    {selectedProgram.features.map((feat, idx) => (
                      <li key={idx} className="modal-feature-item">
                        <Check className="w-4 h-4 dusk-accent flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="modal-card-bottom">
                  <div className="flex-col gap-2">
                    <span className="vault-dev">검증된 현장 성과</span>
                    <span className="vault-impact">{selectedProgram.impact}</span>
                  </div>
                  <button className="modal-btn-disabled" disabled>
                    크루 전용 다운로드
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCurriculumModal && (
          <div className="modal-backdrop" onClick={() => setShowCurriculumModal(false)}>
            <div className="modal-content modal-content--wide" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowCurriculumModal(false)} className="modal-close" aria-label="닫기">
                ✕
              </button>

              <div className="flex-col gap-6">
                <div className="section-header" style={{ marginBottom: 0 }}>
                  <h2 className="section-title">정규과정 핵심 마스터 커리큘럼</h2>
                  <p className="section-desc">
                    코딩 문법을 단 한 줄도 외우지 않습니다. AI에게 역할, 목표, 형식을 지시하여 원하는 실무 프로그램을 100% 온전하게 완성해 냅니다.
                  </p>
                </div>

                <div className="master-footer">
                  <h4 className="master-footer-title">
                    <Bot className="w-5 h-5 dusk-accent" />
                    바이브 코딩(Vibe Coding)이란 무엇인가요?
                  </h4>
                  <p className="master-desc">
                    개발자가 직접 알고리즘을 한 줄씩 코딩하던 과거를 지나, 중개사는 자연어로 컴퓨터에게 역할(Role), 목표(Goal), 형식(Format)만 지시하고 실제 복잡한 코드는 AI가 빌딩하게 만드는 현대적 개발 기법입니다. 영어 단어 하나 모르는 왕초보도 마우스 클릭과 간단한 단어 매칭만으로 결과물을 뽑아낼 수 있습니다.
                  </p>
                </div>

                <div className="timeline">
                  <div className="timeline-content">
                    <h3>
                      <Search className="w-5 h-5 dusk-accent" />
                      <span>1강: 웹 정보 수집 및 단순 반복 업무 자동화 실무</span>
                    </h3>
                    <p className="master-desc">
                      인터넷에 흩어진 수많은 매물 정보를 한 번에 수집하고, 매일 내 마우스와 키보드가 반복하던 매물광고 같은 반복 작업을 컴퓨터가 스스로 대신하게 만듭니다.
                    </p>
                    <ul className="timeline-list">
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>네이버 부동산 매물 데이터 수집</strong>: 아파트 단지 또는 지역의 매물 목록 전체(가격, 면적, 층수 등)를 순식간에 깔끔한 엑셀 파일로 추출하는 결과물을 만듭니다.</li>
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>차단 없는 무제한 매물 크롤링</strong>: 수백 번 수집해도 네이버 시스템으로부터 접근 차단을 당하지 않고 안정적으로 대량 데이터를 가져오는 노하우를 습득합니다.</li>
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>네이버 블로그 포스팅 자동화</strong>: 네이버블로그에 자동으로 로그인해서 블로그 콘텐츠를 작성하는 스크립트를 구현합니다.</li>
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>매물 광고 자동화</strong>: 지긋지긋한 매물광고를 자동화하는 프로그램의 설계 로직을 확인합니다.</li>
                    </ul>
                  </div>

                  <div className="timeline-content">
                    <h3>
                      <Bot className="w-5 h-5 dusk-accent-2" />
                      <span>2강: 나만의 AI 직원 채용 및 단독 프로그램 제작</span>
                    </h3>
                    <p className="master-desc">
                      매물 번호만 입력하면 정보 검색부터 디자인, 업로드까지 알아서 끝내는 에이전트 워크플로우를 설계하고, 다른 직원이나 동료도 클릭 한 번으로 쓸 수 있는 실행 파일로 만듭니다.
                    </p>
                    <ul className="timeline-list">
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>매물 번호 한 줄로 블로그 자동 포스팅</strong>: 매물 번호만 쓰면 AI 비서들이 알아서 매물 정보를 수집하고, 콘텐츠를 작성하고, 썸네일과 함께 블로그에 업로드까지 마칩니다.</li>
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>AI가 추천하는 내 부동산 홈페이지</strong>: AI가 추천하고 인용할 수 있는 나만의 디지털 자산이 되는 내 부동산 홈페이지를 만들고 배포합니다.</li>
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>생성형 엔진 최적화</strong>: AI 시대의 바뀐 검색 트렌드에 맞추어 내 부동산이 AI가 고객에게 추천해 유입으로 연결되는 구조를 내재화합니다.</li>
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>원클릭 실행 프로그램(.exe) 변환</strong>: 개발 언어나 코드 프로그램을 켤 필요 없이, 바탕화면에 놓인 아이콘을 더블클릭하는 것만으로 작동하는 윈도우용 실행 프로그램을 만들어 냅니다.</li>
                    </ul>
                  </div>

                  <div className="timeline-content">
                    <h3>
                      <Wrench className="w-5 h-5 dusk-accent" />
                      <span>3강: 나만의 맞춤형 중개 업무 자동화 프로그램 설계 및 시연</span>
                    </h3>
                    <p className="master-desc">
                      2강까지 습득한 기술을 바탕으로 수강생들이 기획한 중개업 자동화 아이디어를 실제 프로그램으로 구현하기 위해 설계 프로세스를 컨설팅받고 작동 모델을 직접 눈으로 확인합니다.
                    </p>
                    <ul className="timeline-list">
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>중개업 자동화 프로그램 수요 조사</strong>: 수강생들이 현업에서 직접 자동화하고 싶은 개별 업무(수집, 알림 등)를 발굴하고 검토하는 세션입니다.</li>
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>자연어 지시 및 상세 설계 프로세스</strong>: 기획안을 바탕으로 AI 비서들에게 역할, 목표, 형식을 어떻게 하달하고 프로그램을 구성할지 설계 단계를 학습합니다.</li>
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>구현 가능성 컨설팅</strong>: 제안한 자동화 도구의 구현 가능성과 예상되는 허들(차단, 데이터 매칭 등)을 짚고 최적의 대안을 코칭받습니다.</li>
                      <li><Check className="w-3.5 h-3.5 dusk-accent inline mr-1.5" /><strong>핵심 자동화 프로그램 실물 라이브 시연</strong>: 수요조사에서 선정된 실제 중개업 자동화 시나리오를 바탕으로 직접 동작하는 프로그램 구현 과정을 시연합니다.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showQuizModal && (
          <div className="modal-backdrop" onClick={() => setShowQuizModal(false)}>
            <div className="modal-content modal-content--quiz" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowQuizModal(false)} className="modal-close" aria-label="닫기">
                ✕
              </button>

              <div className="flex-col gap-6">
                <div className="section-header" style={{ marginBottom: 0 }}>
                  <h2 className="section-title">프리패스 합격 가능성 자가 진단기</h2>
                  <p className="section-desc">
                    간단한 3가지 질문을 통해 내게 가장 적합한 교육 과정을 진단받으세요. 진단 결과는 하단의 등록 신청서에 즉시 반영됩니다.
                  </p>
                </div>

                <div className="quiz-card-box">
                  {quizStep < quizQuestions.length ? (
                    <div className="flex-col gap-6">
                      <div className="flex-row items-center justify-between">
                        <span className="dusk-accent-2 num">질문 {quizStep + 1} / {quizQuestions.length}</span>
                        <span className="dusk-muted">진행 중</span>
                      </div>
                      <h3 className="master-title">
                        {quizQuestions[quizStep].q}
                      </h3>
                      <div className="flex-col gap-3">
                        {quizQuestions[quizStep].a.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(idx)}
                            className="quiz-option-btn"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-col gap-6 items-center" style={{ textAlign: 'center' }}>
                      <div className="join-icon-wrap">
                        <Gift className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="success-title">진단이 모두 완료되었습니다!</h3>
                        <p className="success-desc">
                          중개사님의 진단 결과 추천되는 최적의 매칭 트랙은 아래와 같습니다.
                        </p>
                        <div className="quiz-result-box">
                          {quizResult === 'fasttrack' ? (
                            <>
                              <strong className="dusk-accent">프리패스 트랙: 즉시 합류 대상</strong>
                              <p className="master-desc" style={{ marginTop: '8px' }}>
                                이미 AI나 툴의 이해도가 훌륭하십니다. 교육 참가를 거치지 않고 나만의 자동화 도구를 기여하여 즉시 비밀창고를 무제한 잠금 해제할 수 있습니다.
                              </p>
                              <div className="quiz-info-callout">
                                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong>신청 방법:</strong> 공유 가능한 프로그램을 본인의 구글 드라이브에 업로드한 후, 아래 프리패스 신청하기 버튼을 통해 연결되는 1:1 오픈채팅방에 해당 공유 링크를 함께 전달해 주세요.
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <strong className="dusk-accent">정규과정 참가 트랙</strong>
                              <p className="master-desc" style={{ marginTop: '8px' }}>
                                기초부터 탄탄하게 다지는 정규 교육 참가를 권장합니다. 코중사와 함께 정규과정을 통해 중개업 자동화 프로그램을 직접 빌드할 수 있는 능력을 탑재합니다.
                              </p>
                            </>
                          )}
                        </div>
                        <p className="vault-dev">
                          진단 완료 결과에 따라 하단 합류 안내 트랙이 자동으로 설정되었습니다.
                        </p>
                      </div>
                      <div className="flex-row gap-3" style={{ width: '100%', maxWidth: '340px' }}>
                        {quizResult === 'fasttrack' ? (
                          <a
                            href="https://open.kakao.com/o/suLtTcYh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-button flex-grow"
                            onClick={() => setShowQuizModal(false)}
                          >
                            프리패스 신청하기
                          </a>
                        ) : (
                          <a
                            href="#join"
                            className="cta-button flex-grow"
                            onClick={() => setShowQuizModal(false)}
                          >
                            신청서 확인하기
                          </a>
                        )}
                        <button onClick={resetQuiz} className="secondary-button flex-grow">
                          다시 검사하기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <section id="reviews" className="section-band">
          <div className="container">
            <div className="split-header">
              <h2 className="section-title">정규과정 이수 후기</h2>
              <p className="section-desc">
                막막한 두려움을 안고 출발한 현업 중개사들이 직접 부딪히며 느낀 솔직한 이야기입니다.
              </p>
            </div>

            <div className="testimonial-grid">
              <div className="testimonial-card">
                <p className="testimonial-quote">
                  "결국 코딩은 AI가 하고, 저는 역할, 목표, 형식만 잘 지시하면 되는 거더라고요. 작게 하나씩 따라 하다 보니 어느새 저도 모르게 자동화 프로그램이 만들어져 있어서 신기하고 소름 돋았습니다."
                </p>
                <span className="testimonial-author">개업 공인중개사</span>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-quote">
                  "영어 단어도 이해하기 어렵고 여러 모듈이 너무 복잡해서 아예 엄두를 못 냈는데, 코중사님 유튜브를 보고 호기심에 한 번 따라 해 봤습니다. 어라 이게 되네? 하는 순간 마인드가 완전히 바뀌었습니다."
                </p>
                <span className="testimonial-author">개업 공인중개사</span>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-quote">
                  "막힐 때 나오는 에러 코드를 그대로 챗창에 물어보면 된다는 강사님의 말이 가장 위로가 되었어요. 이제는 컴퓨터 앞에 앉으면 클로드부터 켜는 습관이 생겼습니다."
                </p>
                <span className="testimonial-author">소속 공인중개사</span>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-quote">
                  "저의 솔직한 고백이 있다면, 제 주위에 있는 로컬 경쟁 중개사분들은 부디 평생 이 눈을 뜨지 않기만을 바랄 뿐입니다… 하하하."
                </p>
                <span className="testimonial-author">개업 공인중개사</span>
              </div>
            </div>

            <div className="statement-band">
              <p className="vision-lead">
                단순한 도구 사용자를 넘어 중개업 자동화를 직접 구현하는
              </p>
              <h2 className="vision-title">
                AI 활용 공인중개사들의 초격차 생태계 구축
              </h2>
            </div>
          </div>
        </section>

        <section id="join" className="section-band--well">
          <div className="container">
            <div className="offer-split">
              <div>
                <h2 className="section-title">중개사AI클럽 정규과정 신청하기</h2>
                <p className="section-desc">
                  지금 바로 중개사AI클럽 정규과정 VOD 강의를 수강하실 수 있습니다. 강의 수강 후 중개사AI클럽에 정예 크루로 합류하실 수 있습니다.
                </p>
              </div>

              <div className="offer-action-col">
                <a
                  href="https://cojungsa.liveklass.com/classes/317917?utm_source=club&utm_medium=referral&utm_content=club_bottom"
                  onClick={() => trackCourseClick('club_bottom', 'https://cojungsa.liveklass.com/classes/317917?utm_source=club&utm_medium=referral&utm_content=club_bottom')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-button cta-button--lg cta-button--block"
                >
                  정규과정 VOD 수강 신청하기 <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-logo">
            <div className="footer-logo-box">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="footer-logo-text">중개사 AI 클럽</span>
          </div>
          <div className="footer-meta">
            <div>
              &copy; 2026 중개사 AI 클럽 (Co-Build, Share, Synergize). 모든 문서 자료는 정예 크루 독점적 자산입니다.
            </div>
            <div className="footer-cookie">
              본 사이트는 방문 분석을 위해 Google Analytics와 Meta 픽셀(쿠키)을 사용합니다.
            </div>
          </div>
        </div>
      </footer>

      {showNotification && (
        <div className="toast-notification">
          <ShieldCheck className="w-4 h-4 dusk-accent" />
          <span>성공적으로 클립보드에 복사되었습니다!</span>
        </div>
      )}
    </div>
  )
}
