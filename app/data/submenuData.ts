export interface SubMenuSectionItem {
  id?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  body: string;
  meta?: string[];
}

export interface SubMenuPageConfig {
  categoryId: string;
  slug: string;
  title: string;
  englishTitle: string;
  intro: string;
  specialWidget?:
    | "worship"
    | "community-board"
    | "community-news"
    | "online-edu-apply"
    | "online-donation-cert"
    | "online-offering"
    | "online-admin";
  sections: {
    id: string;
    heading: string;
    subheading?: string;
    items: SubMenuSectionItem[];
  }[];
  cta?: {
    label: string;
    href: string;
  };
}

export const SUBMENU_PAGES: SubMenuPageConfig[] = [
  // 1. 생명사역
  {
    categoryId: "ministry",
    slug: "about",
    title: "교회소개",
    englishTitle: "About church19",
    intro:
      "복음으로 사람을 살리고, 키우고, 고치는 생명사역 공동체 church19의 비전과 정체성을 소개합니다.",
    sections: [
      {
        id: "vision",
        heading: "생명사역 3대 핵심 가치",
        subheading: "Save · Nurture · Heal",
        items: [
          {
            badge: "01 SAVE",
            title: "살리는 사역",
            body: "십자가와 부활의 복음을 선포하여 한 영혼이 예수 그리스도를 만나 거듭나도록 돕습니다.",
          },
          {
            badge: "02 NURTURE",
            title: "키우는 사역",
            body: "말씀 묵상과 제자훈련, 순모임을 통해 그리스도의 장성한 분량까지 자라가도록 양육합니다.",
          },
          {
            badge: "03 HEAL",
            title: "고치는 사역",
            body: "성령의 위로와 공동체의 사랑 안에서 상처 입은 가정과 마음을 치유하고 회복시킵니다.",
          },
        ],
      },
      {
        id: "ci",
        heading: "로고 CI 및 교회 연혁",
        items: [
          {
            id: "history",
            badge: "CI",
            title: "church19 심볼과 컬러",
            body: "십자가와 생명의 잎을 담은 올리브 그린(#60984B)은 복음 안에서 자라나는 생명의 공동체를 상징합니다.",
            meta: ["Primary #60984B", "Accent #5AADA7", "Cream #FEFEF4"],
          },
          {
            badge: "HISTORY",
            title: "걸어온 길 (2007~2026)",
            body: "2007년 개척 이후 생명사역훈련원 개원, 비전센터 완공, 다문화 예배부 확장을 거쳐 오늘에 이르렀습니다.",
            meta: ["2007 개척", "2015 훈련원 개원", "2022 다문화예배", "2026 통합플랫폼"],
          },
        ],
      },
    ],
    cta: { label: "섬기는분들 보기", href: "/ministry/leaders" },
  },
  {
    categoryId: "ministry",
    slug: "leaders",
    title: "섬기는분들",
    englishTitle: "Leadership & Staff",
    intro:
      "말씀과 기도로 교회를 세우며 성도 한 분 한 분을 겸손히 섬기는 church19 교역자와 직분자들입니다.",
    sections: [
      {
        id: "pastor",
        heading: "담임목사 인사말",
        items: [
          {
            badge: "담임목사",
            title: "김은성 담임목사",
            subtitle: "생명사역 총괄 · 주일 설교",
            body: "“하나님의 말씀 앞에 순종하며 한 영혼을 천하보다 귀하게 여기는 공동체로 나아갑니다. church19에 오신 모든 분들을 주님의 이름으로 축복합니다.”",
          },
        ],
      },
      {
        id: "staff",
        heading: "교역자 및 당회·직원 안내",
        items: [
          {
            badge: "수석부목사",
            title: "박지훈 목사",
            subtitle: "교구 · 양육훈련 총괄",
            body: "1~4교구 심방과 생명사역훈련원 제자훈련 과정을 섬기고 있습니다.",
          },
          {
            badge: "교육총괄",
            title: "이서연 목사",
            subtitle: "다음세대 · 청년아포슬",
            body: "영아부부터 청년부까지 다음 세대 신앙 전수를 담당합니다.",
          },
          {
            id: "elders",
            badge: "선교 · 행정",
            title: "정민수 목사 · 당회 · 교회사무실",
            subtitle: "세계선교회 · 다문화예배 · 교회행정",
            body: "해외 파송 선교사 후원, 다문화 예배부, 교회 시설 및 재정 행정을 성실히 섬깁니다.",
          },
        ],
      },
    ],
  },
  {
    categoryId: "ministry",
    slug: "newcomer",
    title: "새가족안내",
    englishTitle: "Newcomer Welcome",
    intro:
      "church19를 처음 찾아주신 모든 분들을 진심으로 환영합니다. 등록부터 정착까지 바나바가 함께합니다.",
    sections: [
      {
        id: "course",
        heading: "새가족 등록 및 4주 양육과정",
        items: [
          {
            badge: "STEP 1",
            title: "방문 및 등록카드 작성",
            body: "주일 예배 후 본당 로비 새가족실 또는 온라인신청 페이지를 통해 등록하실 수 있습니다.",
          },
          {
            badge: "STEP 2",
            title: "바나바 만남 및 4주 양육",
            body: "복음의 기초, 교회 비전, 신앙생활의 기본을 4주간 1:1 또는 소그룹으로 따뜻하게 나눕니다.",
          },
          {
            badge: "STEP 3",
            title: "수료식 및 교구·순 배정",
            body: "양육 수료 후 거주 지역과 연령에 맞는 교구와 순모임에 연결되어 공동체 생활을 시작합니다.",
          },
        ],
      },
    ],
    cta: { label: "새가족 온라인 등록신청", href: "/online/education" },
  },
  {
    categoryId: "ministry",
    slug: "academy",
    title: "생명사역훈련원",
    englishTitle: "Life Ministry Academy",
    intro:
      "회심한 성도를 그리스도의 신실한 제자와 생명사역자로 세우는 church19의 체계적인 훈련 과정입니다.",
    sections: [
      {
        id: "overview",
        heading: "생명사역 5단계 커리큘럼",
        items: [
          {
            badge: "1~2단계",
            title: "새가족반 · 확신반",
            body: "구원의 확신과 경건의 시간(QT), 기도와 말씀 생활의 기초를 다집니다.",
          },
          {
            badge: "3단계",
            title: "성장반 (성경 파노라마)",
            body: "구약과 신약 전체의 흐름을 관통하는 구속사적 성경 공부를 진행합니다.",
          },
          {
            badge: "4~5단계",
            title: "제자반 · 사역반",
            body: "소그룹 리더(순장) 및 교회 사역자로 헌신하기 위한 집중 제자훈련 과정입니다.",
          },
        ],
      },
    ],
    cta: { label: "훈련 과정 신청하기", href: "/online/education" },
  },

  // 2. 예배
  {
    categoryId: "worship",
    slug: "tv",
    title: "church19 TV",
    englishTitle: "Sermons & Media",
    intro:
      "주일예배, 수요예배, 금요기도폭풍집회, 새벽기도회 및 찬양 실황 말씀을 언제 어디서나 다시 들으실 수 있습니다.",
    specialWidget: "worship",
    sections: [],
  },
  {
    categoryId: "worship",
    slug: "praise",
    title: "경배와 찬양",
    englishTitle: "Praise & Choir",
    intro:
      "영과 진리로 하나님께 올려드리는 church19 연합찬양대와 경배와찬양팀 사역 안내입니다.",
    sections: [
      {
        id: "choir",
        heading: "찬양대 사역",
        items: [
          {
            badge: "2부 예배",
            title: "시온 찬양대",
            body: "매주 주일 오전 9:30 예배를 은혜로운 성가로 섬기며 주일 오전 8:15 연습을 진행합니다.",
          },
          {
            badge: "3부 예배",
            title: "할렐루야 찬양대 · 관현악단",
            body: "매주 주일 오전 11:30 예배를 풍성한 합창과 오케스트라 연주로 섬깁니다.",
          },
        ],
      },
      {
        id: "band",
        heading: "경배와찬양팀",
        items: [
          {
            badge: "예배 찬양",
            title: "church19 워십팀",
            body: "주일·수요·금요 기도집회의 회중 찬양을 인도하며 예배의 문을 여는 찬양 사역팀입니다.",
          },
        ],
      },
    ],
    cta: { label: "찬양대·봉사 지원하기", href: "/online/admin" },
  },
  {
    categoryId: "worship",
    slug: "guide",
    title: "예배안내",
    englishTitle: "Worship Guide & Location",
    intro:
      "주일 및 주중 예배 시간, 주차장 이용, 지하철 셔틀버스 운행 및 본당 시설 안내입니다.",
    sections: [
      {
        id: "schedule",
        heading: "예배 시간표",
        items: [
          {
            badge: "주일예배",
            title: "1부 07:30 · 2부 09:30 · 3부 11:30 · 4부 14:00",
            body: "1~3부 대예배실(3부는 수어 통역 제공), 4부 청년아포슬 예배는 비전홀에서 드립니다.",
          },
          {
            badge: "주중예배",
            title: "수요 19:30 · 금요 20:30 · 새벽 05:30",
            body: "수요 말씀예배와 금요 기도폭풍집회는 대예배실에서, 새벽기도회(월~토)는 은혜채플에서 드립니다.",
          },
        ],
      },
      {
        id: "parking",
        heading: "주차 · 차량 및 시설 안내",
        items: [
          {
            badge: "주차안내",
            title: "본당 지하 1~3층 및 비전센터 주차장",
            body: "주일에는 주차 봉사팀의 안내에 따라 제1·제2 주차장을 이용해 주세요. 인근 지하철역 순환 셔틀버스가 15분 간격 운행됩니다.",
          },
          {
            id: "facility",
            badge: "시설안내",
            title: "본당 · 비전관 · 자모실 · 북카페",
            body: "영아 동반 성도님을 위한 자모실(본당 2층)과 쉼터 북카페(비전관 1층)가 상시 개방되어 있습니다.",
          },
        ],
      },
    ],
  },

  // 3. 교육·훈련
  {
    categoryId: "education",
    slug: "school",
    title: "교회학교",
    englishTitle: "Church School",
    intro:
      "영아부부터 청소년부까지 다음 세대가 하나님의 말씀을 즐거워하며 믿음의 세대로 자라납니다.",
    sections: [
      {
        id: "preschool",
        heading: "미취학 · 초등 부서",
        items: [
          {
            badge: "0~7세",
            title: "영아부 · 유치부",
            subtitle: "주일 오전 11:30 · 비전관 1~2층",
            body: "부모와 함께 드리는 첫 예배, 오감 성경 놀이와 찬양으로 예수님의 사랑을 배웁니다.",
          },
          {
            id: "elementary",
            badge: "초등 1~4학년",
            title: "유년부 · 초등부",
            subtitle: "주일 오전 11:30 · 비전관 3층 비전홀",
            body: "어린이 눈높이 설교와 반별 공과 모임을 통해 신앙의 기초를 튼튼히 세웁니다.",
          },
        ],
      },
      {
        id: "youth",
        heading: "소년부 · 청소년부",
        items: [
          {
            badge: "초등 5~6 · 중·고등",
            title: "소년부 · 청소년부",
            subtitle: "주일 오전 9:30 · 비전관 4층 / 교육관 드림홀",
            body: "사춘기와 학업의 현장 속에서 복음적 세계관과 비전을 품는 청소년 공동체입니다.",
          },
        ],
      },
    ],
  },
  {
    categoryId: "education",
    slug: "youth",
    title: "청년아포슬",
    englishTitle: "Youth Apostle",
    intro:
      "시대와 열방을 향해 복음으로 응답하는 church19 대학·청년 예배 공동체입니다.",
    sections: [
      {
        id: "vision",
        heading: "청년아포슬 소개 및 예배안내",
        items: [
          {
            id: "schedule",
            badge: "주일 오후 2:00",
            title: "청년아포슬 예배",
            subtitle: "비전홀 · 매주 주일 14:00",
            body: "뜨거운 경배와 찬양, 청년의 고민에 답하는 말씀 선포, 그리고 또래별 셀(순) 모임이 이어집니다.",
          },
          {
            badge: "캠퍼스 · 직장인",
            title: "목요 기도모임 & 여름·겨울 수련회",
            body: "학기 중 캠퍼스 기도모임과 직장인 소그룹, 연 2회 전교인 청년 수련회를 통해 영적 도약을 이룹니다.",
          },
        ],
      },
    ],
  },
  {
    categoryId: "education",
    slug: "english",
    title: "영어예배위원회",
    englishTitle: "English Ministry",
    intro:
      "글로벌 시대의 언어와 문화로 복음을 전하는 영어예배 및 다음 세대 영어 신앙교육 프로그램입니다.",
    sections: [
      {
        id: "worship",
        heading: "English Worship & 어와나·예능교실",
        items: [
          {
            badge: "ENGLISH WORSHIP",
            title: "주일 영어예배 (11:30 AM)",
            body: "영어 설교와 찬양, 다국적 성도들과의 교제를 통해 복음 안에서 하나 되는 예배입니다.",
          },
          {
            id: "programs",
            badge: "AWANA · ARTS",
            title: "어와나(AWANA) · 예능·스포츠교실",
            body: "주말 어린이 성경 암송 클럽 어와나와 바이올린·미술·풋살 등 지역 어린이를 위한 전인 교육 교실을 운영합니다.",
          },
        ],
      },
    ],
  },
  {
    categoryId: "education",
    slug: "training",
    title: "교육훈련",
    englishTitle: "Discipleship & Teacher Training",
    intro:
      "평신도 지도자와 교회학교 교사를 말씀으로 무장시키는 제자훈련 및 교사훈련원 안내입니다.",
    sections: [
      {
        id: "discipleship",
        heading: "제자훈련 · 교사훈련원",
        items: [
          {
            badge: "제자훈련",
            title: "평신도 제자반 · 사역반",
            body: "소그룹 인도자 양성과 영적 성숙을 위한 32주 집중 훈련 과정입니다(봄·가을 학기 모집).",
          },
          {
            id: "teachers",
            badge: "교사훈련원",
            title: "교회학교 교사대학",
            body: "다음 세대를 가르치는 교사들의 성경 교수법과 영성 함양을 위한 정기 세미나입니다.",
          },
        ],
      },
    ],
    cta: { label: "교육훈련 신청하기", href: "/online/education" },
  },

  // 4. 선교
  {
    categoryId: "mission",
    slug: "world",
    title: "church19 세계선교회",
    englishTitle: "Global Mission",
    intro:
      "“너희는 온 천하에 다니며 만민에게 복음을 전파하라”는 지상명령을 따라 지역과 열방을 섬깁니다.",
    sections: [
      {
        id: "vision",
        heading: "선교 비전 및 파송 선교사",
        items: [
          {
            id: "missionaries",
            badge: "동남아 · 중앙아",
            title: "27가정 파송 및 협력 선교",
            body: "동남아시아(18가정)와 중앙아시아·러시아(9가정)에 선교사를 파송해 교회 개척, 신학교 교육, 의료·구제 사역을 후원합니다.",
          },
          {
            id: "media",
            badge: "선교영상",
            title: "단기선교 및 선교지 리포트",
            body: "매년 여름·겨울 단기선교팀 파송과 분기별 선교지 소식 영상을 성도들과 공유합니다.",
          },
        ],
      },
    ],
  },
  {
    categoryId: "mission",
    slug: "multicultural",
    title: "다문화 예배부",
    englishTitle: "Multicultural Worship",
    intro:
      "우리 곁에 찾아온 열방의 이웃들과 각자의 모국어로 하나님을 예배하는 다문화 공동체입니다.",
    sections: [
      {
        id: "cn",
        heading: "언어권별 예배 안내",
        items: [
          {
            badge: "CN",
            title: "중국예배부 (Chinese Part)",
            subtitle: "주일 오후 1:30 · 비전관 3층",
            body: "중국어 예배, 유학생 식사 교제 및 성경 공부 모임을 매주 진행합니다.",
          },
          {
            id: "vn",
            badge: "VN",
            title: "베트남예배부 (Vietnamese Part)",
            subtitle: "주일 오후 2:00 · 은혜홀",
            body: "베트남 이주민·근로자·가정을 위한 예배와 한국어 교실·생활 정착을 돕습니다.",
          },
          {
            id: "ru",
            badge: "RU",
            title: "러시아예배부 (Russian Part)",
            subtitle: "주일 오후 2:00 · 사랑홀",
            body: "러시아어권 및 중앙아시아 출신 성도들이 함께 모국어로 예배합니다.",
          },
        ],
      },
    ],
  },

  // 5. 온라인신청
  {
    categoryId: "online",
    slug: "education",
    title: "교육신청",
    englishTitle: "Education Registration",
    intro: "새가족반, 확신반, 제자훈련 및 세례·입교 문답 과정을 온라인으로 간편하게 신청하세요.",
    specialWidget: "online-edu-apply",
    sections: [],
  },
  {
    categoryId: "online",
    slug: "certificate",
    title: "기부금증명서",
    englishTitle: "Donation Certificate",
    intro: "연말정산 및 세무 증빙을 위한 기부금 영수증 발급 신청을 온라인으로 접수합니다.",
    specialWidget: "online-donation-cert",
    sections: [],
  },
  {
    categoryId: "online",
    slug: "offering",
    title: "온라인헌금",
    englishTitle: "Online Offering",
    intro: "성도의 정성을 담아 드리는 온라인 헌금 계좌 안내 및 헌금 확인 신청 창구입니다.",
    specialWidget: "online-offering",
    sections: [],
  },
  {
    categoryId: "online",
    slug: "admin",
    title: "온라인행정",
    englishTitle: "Online Administration",
    intro: "교회 내 모임 장소 예약, 교회 차량 배차 및 일반 행정 문의를 접수할 수 있습니다.",
    specialWidget: "online-admin",
    sections: [],
  },

  // 6. 교구
  {
    categoryId: "parish",
    slug: "districts",
    title: "교구 안내",
    englishTitle: "Parish & Small Groups",
    intro:
      "거주 권역별 1~4교구와 소그룹 순모임을 통해 말씀 나눔과 돌봄의 공동체를 이루어 갑니다.",
    sections: [
      {
        id: "list",
        heading: "1~4교구 담당 교역자 및 권역",
        items: [
          {
            badge: "1교구",
            title: "만촌 · 수성권역",
            subtitle: "김도현 목사 · 이영수 장로",
            body: "만촌동 및 수성구 중심 지역 성도님들의 순모임과 심방을 섬깁니다.",
          },
          {
            badge: "2교구",
            title: "범어 · 황금권역",
            subtitle: "박은지 목사 · 최미라 권사",
            body: "범어·황금 지역 가정 심방 및 중보기도 모임을 운영합니다.",
          },
          {
            badge: "3교구 · 4교구",
            title: "시지·경산 / 동구·북구권역",
            subtitle: "정우성 목사 · 한소망 목사",
            body: "외곽 권역 성도님들을 위한 순모임 및 권역 연합 모임을 진행합니다.",
          },
        ],
      },
      {
        id: "soon",
        heading: "순모임 안내",
        items: [
          {
            badge: "SMALL GROUP",
            title: "말씀으로 하나 되는 작은 교회, 순모임",
            body: "매주 주일 말씀을 바탕으로 삶을 나누고 서로의 기도제목을 품고 기도하는 church19의 핵심 공동체입니다.",
          },
        ],
      },
    ],
  },
  {
    categoryId: "parish",
    slug: "fellowship",
    title: "남·여전도회",
    englishTitle: "Men & Women Fellowship",
    intro:
      "연령과 세대별로 연합하여 교회 절기 봉사와 선교 후원, 성도 친교를 감당하는 자치 기관입니다.",
    sections: [
      {
        id: "men",
        heading: "남전도회 · 여전도회",
        items: [
          {
            badge: "남전도회",
            title: "1~6남전도회",
            body: "교회 시설 관리 지원, 구제·선교 후원 및 남성 성도 영적 교제를 섬깁니다.",
          },
          {
            id: "women",
            badge: "여전도회",
            title: "1~8여전도회",
            body: "주일 애찬 섬김, 새가족 돌봄, 국내외 선교지 바자회와 중보기도 사역을 감당합니다.",
          },
        ],
      },
    ],
  },

  // 7. 봉사/사역
  {
    categoryId: "service",
    slug: "welfare",
    title: "긍휼·복지사역",
    englishTitle: "Care & Welfare Ministry",
    intro:
      "예수님의 손과 발이 되어 지역사회의 소외된 이웃을 찾아가고 사랑을 나누는 복지 사역입니다.",
    sections: [
      {
        id: "sharing",
        heading: "사랑의 나눔 · 지역사회 섬김",
        items: [
          {
            badge: "사랑의 나눔",
            title: "굿윌스토어 · 사랑의 쌀 나누기",
            body: "성도님들이 기증한 물품과 구제 헌금으로 이웃의 자립과 생계를 지원합니다.",
          },
          {
            id: "local",
            badge: "지역섬김",
            title: "독거 어르신 반찬 나눔 · 장학 사역",
            body: "매월 지역 내 취약 계층 가정과 청소년에게 따뜻한 식사와 장학금을 전달합니다.",
          },
        ],
      },
    ],
    cta: { label: "봉사 참여 신청하기", href: "/online/admin" },
  },
  {
    categoryId: "service",
    slug: "worship-team",
    title: "예배봉사",
    englishTitle: "Worship Service Teams",
    intro:
      "예배의 현장이 질서 있고 은혜롭게 진행되도록 보이지 않는 곳에서 헌신하는 봉사팀입니다.",
    sections: [
      {
        id: "usher",
        heading: "안내위원 · 미디어·방송팀",
        items: [
          {
            badge: "안내 · 주차",
            title: "예배 안내위원 및 주차 봉사팀",
            body: "본당 입구에서 성도와 새가족을 맞이하고, 주보 배부 및 안전한 주차를 안내합니다.",
          },
          {
            id: "media",
            badge: "방송 · 자막",
            title: "미디어·방송 사역팀",
            body: "예배 음향, 영상 스위칭, 온라인 실시간 송출과 찬양 자막을 담당합니다.",
          },
        ],
      },
    ],
    cta: { label: "예배봉사 신청하기", href: "/online/admin" },
  },

  // 8. 나눔터
  {
    categoryId: "community",
    slug: "board",
    title: "소통 게시판",
    englishTitle: "Community Board",
    intro:
      "일반사용자(읽기), 로그인사용자(읽기·댓글), 관리자(모든 권한) 역할이 적용된 church19 나눔터입니다.",
    specialWidget: "community-board",
    sections: [],
  },
  {
    categoryId: "community",
    slug: "news",
    title: "교회소식",
    englishTitle: "Church News & Stories",
    intro:
      "church19 주간 영상뉴스, 생명사역 스토리, 공지사항 및 사역 포토 갤러리를 확인하세요.",
    specialWidget: "community-news",
    sections: [],
  },
  {
    categoryId: "community",
    slug: "press",
    title: "언론보도",
    englishTitle: "PRESS ROOM",
    intro: "언론과 교계 매체에 소개된 church19의 사역 소식과 칼럼을 모아 제공합니다.",
    specialWidget: "community-news",
    sections: [],
  },
];

export function getSubMenuConfig(
  categoryId: string,
  slug: string
): SubMenuPageConfig | undefined {
  return SUBMENU_PAGES.find(
    (item) => item.categoryId === categoryId && item.slug === slug
  );
}
