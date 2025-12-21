export type Language = 'en' | 'vi';

export interface TranslationContent {
  navigation: {
    skipToContent: string;
    details: string;
    story: string;
    seating: string;
    rsvp: string;
    changeLanguage: string;
  };
  hero: {
    groomName: string;
    brideName: string;
  };
  details: {
    saveTheDate: string;
    dateLabel: string;
    countdownTitle: string;
    countdownUnits: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
    sectionTitle: string;
    cards: Array<{
      heading: string;
      time?: string;
      location?: string;
      address?: string;
      description?: string;
    }>;
  };
  story: {
    heading: string;
    viewPrompt: string;
    closeLabel: string;
  };
  seating: {
    heading: string;
    subtitle: string;
    inputPlaceholder: string;
    searchButton: string;
    searchingButton: string;
    resultFound: string;
    resultNotFound: string;
    notFoundHint: string;
    hint: string;
    tableLabel: string;
    enterNamePrompt: string;
    error: string;
  };
  rsvp: {
    heading: string;
    deadline: string;
    button: string;
    havingTrouble: string;
    contactHint: string;
  };
  footer: {
    rights: string;
    madeWith: string;
  };
  languageSelector: {
    title: string;
    subtitle: string;
    english: string;
    vietnamese: string;
    close: string;
  };
}

export const translations: Record<Language, TranslationContent> = {
  en: {
    navigation: {
      skipToContent: 'Skip to main content',
      details: 'Details',
      story: 'Our Story',
      seating: 'Seating',
      rsvp: 'RSVP',
      changeLanguage: 'Change Language',
    },
    hero: {
      groomName: 'David',
      brideName: 'Jeannie',
    },
    details: {
      saveTheDate: 'Save the Date',
      dateLabel: 'October 3, 2026',
      countdownTitle: 'Countdown to the big day',
      countdownUnits: {
        days: 'DAYS',
        hours: 'HOURS',
        minutes: 'MINUTES',
        seconds: 'SECONDS',
      },
      sectionTitle: 'Event Details',
      cards: [
        {
          heading: 'Ceremony',
          time: '1:00 PM',
          location: 'Holy Family Parish',
          address: '46A Ballarat Rd, Maidstone VIC 3012',
          description: 'Please arrive 15 minutes early for seating',
        },
        {
          heading: 'Reception',
          time: '6:00 PM',
          location: 'Ultima Function Centre',
          address: 'Corner of Ely Court, Keilor Park Dr, Keilor East VIC 3042',
          description: 'Dinner, drinks, and dancing to follow',
        },
        {
          heading: 'Dress Code',
          description:
            'Formal attire requested. Ladies: Evening gowns or formal dresses. Gentlemen: Tuxedos or dark suits with ties.',
        },
      ],
    },
    story: {
      heading: 'Our Story',
      viewPrompt: 'Click to View',
      closeLabel: 'Close',
    },
    seating: {
      heading: 'Find Your Seat',
      subtitle: 'Enter your full name to find your table assignment',
      inputPlaceholder: 'Enter your full name',
      searchButton: 'Find My Table',
      searchingButton: 'Searching...',
      resultFound: "You're seated at Table {{table}}",
      resultNotFound: "We couldn't find your name in our seating list.",
      notFoundHint: 'Try alternate spelling if not found, or contact us for assistance.',
      hint: 'Tip: Try using your first and last name as it appears on your invitation',
      tableLabel: 'Table {{table}}',
      enterNamePrompt: 'Please enter your name',
      error: 'Error loading seating information. Please try again later.',
    },
    rsvp: {
      heading: 'RSVP',
      deadline: 'Please respond by September 1st, 2026',
      button: 'Complete RSVP Form',
      havingTrouble: 'Having trouble?',
      contactHint: 'Email us and we will be happy to help.',
    },
    footer: {
      rights: 'All Rights Reserved',
      madeWith: 'Made with ♡',
    },
    languageSelector: {
      title: 'Choose your language',
      subtitle: 'Please select English or Vietnamese to view the invitation.',
      english: 'English',
      vietnamese: 'Tiếng Việt',
      close: 'Keep current language',
    },
  },
  vi: {
    navigation: {
      skipToContent: 'Bỏ qua tới nội dung chính',
      details: 'Thông tin',
      story: 'Chuyện tình',
      seating: 'Sơ đồ bàn',
      rsvp: 'Phản hồi',
      changeLanguage: 'Đổi ngôn ngữ',
    },
    hero: {
      groomName: 'David',
      brideName: 'Jeannie',
    },
    details: {
      saveTheDate: 'Lưu ngày trọng đại',
      dateLabel: 'Ngày 3 tháng 10 năm 2026',
      countdownTitle: 'Đếm ngược đến ngày cưới',
      countdownUnits: {
        days: 'NGÀY',
        hours: 'GIỜ',
        minutes: 'PHÚT',
        seconds: 'GIÂY',
      },
      sectionTitle: 'Thông tin sự kiện',
      cards: [
        {
          heading: 'Lễ cưới',
          time: '1:00 chiều',
          location: 'Nhà thờ Holy Family',
          address: '46A Ballarat Rd, Maidstone VIC 3012',
          description: 'Vui lòng đến sớm 15 phút để ổn định chỗ ngồi',
        },
        {
          heading: 'Tiệc cưới',
          time: '6:00 chiều',
          location: 'Trung tâm Ultima Function',
          address: 'Corner of Ely Court, Keilor Park Dr, Keilor East VIC 3042',
          description: 'Tiệc tối, đồ uống và khiêu vũ sau buổi lễ',
        },
        {
          heading: 'Trang phục',
          description:
            'Vui lòng mặc trang phục trang trọng. Quý cô: Đầm dạ hội hoặc váy trang nhã. Quý ông: Vest hoặc suit màu tối kèm cà vạt.',
        },
      ],
    },
    story: {
      heading: 'Chuyện tình của chúng tôi',
      viewPrompt: 'Nhấn để xem',
      closeLabel: 'Đóng',
    },
    seating: {
      heading: 'Tìm bàn của bạn',
      subtitle: 'Nhập họ tên để biết bạn ngồi bàn nào',
      inputPlaceholder: 'Nhập họ tên của bạn',
      searchButton: 'Tìm bàn của tôi',
      searchingButton: 'Đang tìm...',
      resultFound: 'Bạn sẽ ngồi tại bàn số {{table}}',
      resultNotFound: 'Chúng tôi không tìm thấy tên bạn trong danh sách.',
      notFoundHint: 'Hãy thử viết cách khác hoặc liên hệ với chúng tôi để được hỗ trợ.',
      hint: 'Mẹo: Nhập đầy đủ họ và tên giống như trên thiệp mời',
      tableLabel: 'Bàn {{table}}',
      enterNamePrompt: 'Vui lòng nhập tên của bạn',
      error: 'Có lỗi khi tải thông tin chỗ ngồi. Vui lòng thử lại sau.',
    },
    rsvp: {
      heading: 'Phản hồi (RSVP)',
      deadline: 'Vui lòng phản hồi trước ngày 1 tháng 9 năm 2026',
      button: 'Mở biểu mẫu RSVP',
      havingTrouble: 'Gặp khó khăn?',
      contactHint: 'Gửi email cho chúng tôi để được hỗ trợ.',
    },
    footer: {
      rights: 'Bảo lưu mọi quyền',
      madeWith: 'Được tạo nên với ♡',
    },
    languageSelector: {
      title: 'Chọn ngôn ngữ',
      subtitle: 'Hãy chọn tiếng Anh hoặc tiếng Việt để xem lời mời.',
      english: 'English',
      vietnamese: 'Tiếng Việt',
      close: 'Giữ nguyên ngôn ngữ hiện tại',
    },
  },
};
