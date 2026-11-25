export interface NavSubItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface NavCategory {
  id: string;
  label: string;
  href: string;
  englishTitle: string;
  description: string;
  subItems: NavSubItem[];
}

export interface SermonItem {
  id: string;
  category: string;
  title: string;
  scripture: string;
  pastor: string;
  date: string;
  summary: string;
  duration: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category?: string;
}

export interface StoryItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  accentColor: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  gradient: string;
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: "ministry",
    label: "생명사역",
    href: "/ministry",
    englishTitle: "Life Ministry",
    description:
      "복음으로 사람을 살리고, 키우고, 고치는 church19의 핵심 비전과 섬기는 공동체를 소개합니다.",
    subItems: [
      {
        label: "교회소개",
        href: "/ministry/about",
        children: [
          { label: "생명사역 비전", href: "/ministry/about#vision" },
          { label: "로고 CI", href: "/ministry/about#ci" },
          { label: "교회연혁", href: "/ministry/about#history" },
        ],
      },
      {
        label: "섬기는분들",
        href: "/ministry/leaders",
        children: [
          { label: "담임목사 인사말", href: "/ministry/leaders#pastor" },
          { label: "교역자 소개", href: "/ministry/leaders#staff" },
          { label: "장로·직원 안내", href: "/ministry/leaders#elders" },
        ],
      },
      {
        label: "새가족안내",
        href: "/ministry/newcomer",
        children: [
          { label: "새가족 등록신청", href: "/online/education" },
          { label: "새가족 양육과정", href: "/ministry/newcomer#course" },
          { label: "새가족 포토", href: "/community/news#gallery" },
        ],
      },
      {
        label: "생명사역훈련원",
        href: "/ministry/academy",
        children: [
          { label: "훈련원 소개", href: "/ministry/academy#overview" },
          { label: "생명사역 스토리", href: "/community/news#stories" },
        ],
      },
    ],
  },
  {
    id: "worship",
    label: "예배",
    href: "/worship",
    englishTitle: "Worship & Word",
    description:
      "살아있는 말씀과 영감 있는 찬양으로 하나님을 만나는 church19의 모든 예배 안내입니다.",
    subItems: [
      {
        label: "church19 TV",
        href: "/worship/tv",
        children: [
          { label: "주일설교", href: "/worship/tv#sermons" },
          { label: "수요예배", href: "/worship/tv#sermons" },
          { label: "금요기도집회", href: "/worship/tv#sermons" },
          { label: "새벽기도회", href: "/worship/tv#sermons" },
        ],
      },
      {
        label: "경배와 찬양",
        href: "/worship/praise",
        children: [
          { label: "찬양대", href: "/worship/praise#choir" },
          { label: "경배와찬양팀", href: "/worship/praise#band" },
        ],
      },
      {
        label: "예배안내",
        href: "/worship/guide",
        children: [
          { label: "예배시간 안내", href: "/worship/guide#schedule" },
          { label: "주차·차량안내", href: "/worship/guide#parking" },
          { label: "시설안내", href: "/worship/guide#facility" },
        ],
      },
    ],
  },
  {
    id: "education",
    label: "교육·훈련",
    href: "/education",
    englishTitle: "Education & Training",
    description:
      "회심한 그리스도인으로 양육하여 생명사역자가 되도록 세우는 신앙교육공동체입니다.",
    subItems: [
      {
        label: "교회학교",
        href: "/education/school",
        children: [
          { label: "영아부 · 유치부", href: "/education/school#preschool" },
          { label: "유년부 · 초등부", href: "/education/school#elementary" },
          { label: "소년부 · 청소년부", href: "/education/school#youth" },
        ],
      },
      {
        label: "청년아포슬",
        href: "/education/youth",
        children: [
          { label: "청년공동체 소개", href: "/education/youth#vision" },
          { label: "청년 예배안내", href: "/education/youth#schedule" },
        ],
      },
      {
        label: "영어예배위원회",
        href: "/education/english",
        children: [
          { label: "English Worship", href: "/education/english#worship" },
          { label: "어와나 · 예능교실", href: "/education/english#programs" },
        ],
      },
      {
        label: "교육훈련",
        href: "/education/training",
        children: [
          { label: "제자훈련", href: "/education/training#discipleship" },
          { label: "교사훈련원", href: "/education/training#teachers" },
        ],
      },
    ],
  },
  {
    id: "mission",
    label: "선교",
    href: "/mission",
    englishTitle: "World Mission",
    description:
      "지역 복음화, 민족 복음화, 세계선교를 향해 나아가는 church19 세계선교회입니다.",
    subItems: [
      {
        label: "church19 세계선교회",
        href: "/mission/world",
        children: [
          { label: "선교 비전", href: "/mission/world#vision" },
          { label: "파송 선교사", href: "/mission/world#missionaries" },
          { label: "선교영상", href: "/mission/world#media" },
        ],
      },
      {
        label: "다문화 예배부",
        href: "/mission/multicultural",
        children: [
          { label: "중국예배부", href: "/mission/multicultural#cn" },
          { label: "베트남예배부", href: "/mission/multicultural#vn" },
          { label: "러시아예배부", href: "/mission/multicultural#ru" },
        ],
      },
    ],
  },
  {
    id: "online",
    label: "온라인신청",
    href: "/online",
    englishTitle: "Online Services",
    description:
      "교육훈련 신청, 기부금영수증 발급, 온라인헌금, 장소·차량 예약을 간편하게 이용하세요.",
    subItems: [
      {
        label: "교육신청",
        href: "/online/education",
        children: [{ label: "양육/훈련 신청", href: "/online/education" }],
      },
      {
        label: "기부금증명서",
        href: "/online/certificate",
        children: [{ label: "연말정산 발급", href: "/online/certificate" }],
      },
      {
        label: "온라인헌금",
        href: "/online/offering",
        children: [{ label: "헌금 계좌 및 안내", href: "/online/offering" }],
      },
      {
        label: "온라인행정",
        href: "/online/admin",
        children: [
          { label: "장소사용 신청", href: "/online/admin" },
          { label: "차량배차 신청", href: "/online/admin" },
        ],
      },
    ],
  },
  {
    id: "parish",
    label: "교구",
    href: "/parish",
    englishTitle: "Parish & Small Groups",
    description:
      "말씀과 기도로 서로를 돌보며 사랑을 나누는 church19의 교구 및 순모임 공동체입니다.",
    subItems: [
      {
        label: "교구 안내",
        href: "/parish/districts",
        children: [
          { label: "1~4교구 안내", href: "/parish/districts#list" },
          { label: "순모임 안내", href: "/parish/districts#soon" },
        ],
      },
      {
        label: "남·여전도회",
        href: "/parish/fellowship",
        children: [
          { label: "남전도회", href: "/parish/fellowship#men" },
          { label: "여전도회", href: "/parish/fellowship#women" },
        ],
      },
    ],
  },
  {
    id: "service",
    label: "봉사/사역",
    href: "/service",
    englishTitle: "Serve & Ministry",
    description:
      "은사대로 부름받아 교회와 이웃을 사랑으로 섬기는 church19 봉사·사역팀 안내입니다.",
    subItems: [
      {
        label: "긍휼·복지사역",
        href: "/service/welfare",
        children: [
          { label: "사랑의 나눔", href: "/service/welfare#sharing" },
          { label: "지역사회 섬김", href: "/service/welfare#local" },
        ],
      },
      {
        label: "예배봉사",
        href: "/service/worship-team",
        children: [
          { label: "안내위원", href: "/service/worship-team#usher" },
          { label: "미디어·방송팀", href: "/service/worship-team#media" },
        ],
      },
    ],
  },
  {
    id: "community",
    label: "나눔터",
    href: "/community",
    englishTitle: "Community & News",
    description:
      "church19 뉴스룸, 생명사역 스토리, 공지사항, 포토 갤러리와 언론 보도를 확인하세요.",
    subItems: [
      {
        label: "소통 게시판",
        href: "/community/board",
        children: [
          { label: "나눔터 게시판", href: "/community/board" },
          { label: "기도제목 나눔", href: "/community/board" },
        ],
      },
      {
        label: "교회소식",
        href: "/community/news",
        children: [
          { label: "church19 뉴스룸", href: "/community/news#newsroom" },
          { label: "공지사항", href: "/community/news#notices" },
          { label: "생명사역 스토리", href: "/community/news#stories" },
        ],
      },
      {
        label: "언론보도",
        href: "/community/press",
        children: [{ label: "PRESS ROOM", href: "/community/press#press" }],
      },
    ],
  },
];

export const WORSHIP_CATEGORIES = [
  { id: "sunday", label: "주일예배", time: "1부 07:30 · 2부 09:30 · 3부 11:30 · 4부 14:00" },
  { id: "wednesday", label: "수요예배", time: "매주 수요일 저녁 7:30" },
  { id: "friday", label: "금요기도폭풍집회", time: "매주 금요일 저녁 8:30" },
  { id: "dawn", label: "새벽기도회", time: "월~토 오전 5:30" },
  { id: "praise", label: "찬양", time: "경배와 찬양 · 성가대" },
] as const;

export const SERMONS: Record<string, SermonItem> = {
  sunday: {
    id: "sermon-sunday",
    category: "주일예배",
    title: "합리주의의 함정을 넘어 믿음의 길로",
    scripture: "고린도전서 1:18~25",
    pastor: "church19 담임목사",
    date: "2026-11-22",
    summary:
      "세상의 지혜가 아닌 십자가의 복음으로 삶을 해석하고, 하나님 나라의 가치를 따라 살아가는 성도의 결단을 나눕니다.",
    duration: "42:18",
  },
  wednesday: {
    id: "sermon-wednesday",
    category: "수요예배",
    title: "은혜로 걷는 제자도",
    scripture: "마태복음 16:24~26",
    pastor: "church19 부목사",
    date: "2026-11-18",
    summary:
      "자기 부인과 십자가를 지는 삶이 무거운 짐이 아니라, 주님과 동행하는 기쁨의 여정임을 묵상합니다.",
    duration: "35:40",
  },
  friday: {
    id: "sermon-friday",
    category: "금요기도폭풍집회",
    title: "성령의 불로 깨어 기도하라",
    scripture: "사도행전 2:1~4",
    pastor: "church19 기도사역팀",
    date: "2026-11-20",
    summary:
      "개인, 가정, 교회와 열방의 회복을 위해 한마음으로 부르짖는 금요 성령 집회 말씀과 찬양입니다.",
    duration: "54:10",
  },
  dawn: {
    id: "sermon-dawn",
    category: "새벽기도회",
    title: "아침마다 새로운 주의 인자하심",
    scripture: "예레미야애가 3:22~24",
    pastor: "church19 교역자",
    date: "2026-11-24",
    summary:
      "하루의 첫 시간을 하나님께 드리며 말씀으로 영혼을 깨우는 새벽 강해 설교입니다.",
    duration: "24:05",
  },
  praise: {
    id: "sermon-praise",
    category: "찬양",
    title: "주님의 높고 위대하심을 (할렐루야 찬양대)",
    scripture: "시편 150:1~6",
    pastor: "church19 연합찬양대",
    date: "2026-11-22",
    summary:
      "온 성도가 한목소리로 하나님께 영광 올려드리는 주일 찬양 실황입니다.",
    duration: "08:45",
  },
};

export const NEWSROOM_ITEMS: NewsItem[] = [
  { id: "n1", title: "church19 뉴스 2026년 11월 22일", date: "2026-11-22" },
  { id: "n2", title: "church19 뉴스 2026년 11월 15일", date: "2026-11-15" },
  { id: "n3", title: "church19 뉴스 2026년 11월 08일", date: "2026-11-08" },
  { id: "n4", title: "church19 뉴스 2026년 11월 01일", date: "2026-11-01" },
  { id: "n5", title: "church19 뉴스 2026년 10월 25일", date: "2026-10-25" },
];

export const MINISTRY_STORIES: StoryItem[] = [
  {
    id: "s1",
    title: "감사의 눈으로 바라보는 삶, 2026 추수감사주일",
    excerpt:
      "지난 11월 15일, 주일 1부부터 4부까지 2026 추수감사주일 예배를 드렸습니다. 성도들은 한 해 동안 우리를 인도하시고 풍성한 은혜를 베풀어 주신 하나님께 감사드렸습니다.",
    date: "2026-11-15",
    tag: "예배스토리",
    accentColor: "from-emerald-700/80 to-teal-900/90",
  },
  {
    id: "s2",
    title: "몸과 마음으로 하나 되는 기쁨, 2026 순장 소풍",
    excerpt:
      "지난 11월 14일, 200여 명의 순장이 참여한 가운데 2026 순장 소풍이 열렸습니다. 1부 예배와 말씀 격려, 이어진 레크리에이션을 통해 공동체가 하나로 연합했습니다.",
    date: "2026-11-14",
    tag: "공동체",
    accentColor: "from-lime-700/80 to-emerald-900/90",
  },
  {
    id: "s3",
    title: "기독교 상담의 사명을 나누는 만남, 지역 상담 컨퍼런스",
    excerpt:
      "비전관에서 지역 기독교 대학의 상담학 교수와 상담센터 기관장, 지역 교회 상담목회자들이 참석하여 다음 세대 치유 사역을 함께 모색했습니다.",
    date: "2026-10-31",
    tag: "치유사역",
    accentColor: "from-teal-700/80 to-cyan-900/90",
  },
];

export const NOTICES: NewsItem[] = [
  { id: "no1", title: "2026 굿윌스토어 사랑의 나눔 행사 안내", date: "2026-11-18" },
  { id: "no2", title: "이웃과 함께하는 가을 사랑의 음악회", date: "2026-11-10" },
  { id: "no3", title: "제2회 church19 패밀리 페스티벌 부스 배치도 안내", date: "2026-10-28" },
  { id: "no4", title: "2026년 하반기 세례·입교 문답 신청 안내", date: "2026-10-16" },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "g1", title: "2026 추수감사주일 강단 장식", date: "2026-11-15", gradient: "from-amber-200 via-emerald-100 to-teal-200" },
  { id: "g2", title: "순장 소풍 및 공동체 교제", date: "2026-11-14", gradient: "from-lime-200 via-green-100 to-emerald-200" },
  { id: "g3", title: "청년아포슬 가을 수련회", date: "2026-11-07", gradient: "from-sky-200 via-teal-100 to-emerald-100" },
  { id: "g4", title: "다음세대 가을 성경축제", date: "2026-10-25", gradient: "from-emerald-200 via-lime-100 to-amber-100" },
];

export const PRESS_ITEMS: NewsItem[] = [
  {
    id: "p1",
    title: "2027년 선교한국대회 주제는 ‘삼위일체 하나님의 선교’… church19 협력 동참",
    date: "2026-11-17",
  },
  {
    id: "p2",
    title: "‘선교적 성경해석학 컨퍼런스’ 개최, 선교적 제자훈련 조명",
    date: "2026-11-04",
  },
  {
    id: "p3",
    title: "[칼럼] 디지털 시대의 영성과 공동체의 회복",
    date: "2026-10-22",
  },
  {
    id: "p4",
    title: "이주민 1세대 넘어 자녀 세대로…“정체성 지키고 선교 비전 키워”",
    date: "2026-08-24",
  },
];

export const EDUCATION_CARDS = [
  {
    id: "school",
    title: "교회학교",
    subtitle: "Church School",
    desc: "영아부부터 청소년부까지 말씀 위에 세워지는 다음 세대",
    gradient: "from-emerald-600 to-teal-700",
    badge: "NEXT GEN",
  },
  {
    id: "youth",
    title: "청년아포슬",
    subtitle: "Youth Apostle",
    desc: "시대와 열방을 향해 복음으로 응답하는 젊은 예배자들",
    gradient: "from-teal-600 to-cyan-700",
    badge: "YOUNG ADULTS",
  },
  {
    id: "english",
    title: "영어예배위원회",
    subtitle: "English Ministry",
    desc: "글로벌 시대의 언어와 문화로 복음을 전하는 예배 공동체",
    gradient: "from-sky-600 to-indigo-700",
    badge: "GLOBAL",
  },
  {
    id: "training",
    title: "교육훈련",
    subtitle: "Discipleship",
    desc: "회심한 그리스도인을 생명사역자로 양육하는 제자훈련",
    gradient: "from-lime-600 to-emerald-700",
    badge: "TRAINING",
  },
];

export const MISSION_PARTS = [
  {
    id: "cn",
    en: "Chinese Part of worship",
    ko: "중국예배부",
    time: "주일 오후 1:30 · 비전관 3층",
    code: "CN",
  },
  {
    id: "vn",
    en: "Vietnamese Part of worship",
    ko: "베트남예배부",
    time: "주일 오후 2:00 · 은혜홀",
    code: "VN",
  },
  {
    id: "ru",
    en: "Russian Part of worship",
    ko: "러시아예배부",
    time: "주일 오후 2:00 · 사랑홀",
    code: "RU",
  },
];

export const ONLINE_SERVICES = [
  {
    id: "edu-apply",
    title: "교육신청",
    subtitle: "제자훈련 · 새가족 · 세례",
    description: "church19 생명사역훈련원 및 각 부서 교육 과정을 온라인으로 간편하게 신청할 수 있습니다.",
  },
  {
    id: "donation-cert",
    title: "기부금증명서",
    subtitle: "연말정산 온라인 발급",
    description: "교인 등록 번호 또는 본인 인증을 통해 연말정산용 기부금 영수증을 즉시 발급받으실 수 있습니다.",
  },
  {
    id: "online-offering",
    title: "온라인헌금",
    subtitle: "십일조 · 감사 · 선교헌금",
    description: "성도의 정성을 담아 온라인 계좌이체 및 간편 헌금 안내를 확인하실 수 있습니다.",
  },
  {
    id: "online-admin",
    title: "온라인행정",
    subtitle: "장소사용 · 차량배차 신청",
    description: "교회 내 모임 장소 예약, 교회 차량 배차, 주보/행정 문의를 온라인으로 접수할 수 있습니다.",
  },
];

export const SECTION_ANCHORS = [
  { id: "hero", label: "홈" },
  { id: "worship", label: "예배·말씀" },
  { id: "news", label: "뉴스·스토리" },
  { id: "intro", label: "교회소개" },
  { id: "education", label: "교육·훈련" },
  { id: "mission", label: "세계선교" },
  { id: "online", label: "온라인신청" },
  { id: "sitemap", label: "전체메뉴" },
];
