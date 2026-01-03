export type Language = 'en' | 'vi';

interface InfoSection {
  title: string;
  layoutIndex?: number;
  subsections: Array<{
    heading: string;
    body?: string;
    bullets?: string[];
  }>;
}

export interface TranslationContent {
  navigation: {
    skipToContent: string;
    saveTheDate: string;
    details: string;
    story: string;
    seating: string;
    rsvp: string;
    etiquette: string;
    theDay: string;
    reception: string;
    photos: string;
    changeLanguage: string;
    menuLabel: string;
    closeMenu: string;
    moreLabel?: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    updatesHeading: string;
    scrollHint: string;
    groomName: string;
    brideName: string;
    date: string;
    locationLine: string;
    invitationLine: string;
    rsvpStatus: string;
    calendar: {
      googleLabel: string;
      appleLabel: string;
    };
  };
  details: {
    saveTheDate: string;
    familiesHeading: string;
    sponsorsLabel: string;
    dateLabel: string;
    countdownTitle: string;
    countdownUnits: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
    sectionTitle: string;
    infoTitle?: string;
    moreInfoLabel?: string;
    lessInfoLabel?: string;
    scanQrLabel?: string;
    parents: {
      groomTitle: string;
      groomNames: string;
      brideTitle: string;
      brideNames: string;
    };
    weddingParty: {
      columns: Array<{
        title: string;
        name: string;
        groupTitle: string;
        members: string[];
      }>;
    };
    infoSections?: InfoSection[];
    cards: Array<{
      heading: string;
      time?: string;
      location?: string;
      address?: string;
      description?: string;
      image?: string;
    }>;
  };
  story: {
    heading: string;
    viewPrompt: string;
    closeLabel: string;
  };
  stayInLoop: {
    heading: string;
    subtitle: string;
    reassurance: string;
    firstNameLabel: string;
    lastNameLabel: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneHelper: string;
    likelyLabel: string;
    dropdownPlaceholder: string;
    optionYes: string;
    optionMaybe: string;
    buttonIdle: string;
    buttonSubmitting: string;
    privacy: string;
    success: string;
    rsvpNote: string;
    errors: {
      firstName: string;
      lastName: string;
      phone: string;
    };
    submitErrors: {
      unavailable: string;
      generic: string;
    };
  };
  photos: {
    sectionLabel: string;
    heading: string;
    intro: string;
    encouragement: string;
    stepsTitle: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
    ctaLabel: string;
    qrCaption: string;
    widgetTitle: string;
    widgetDescription: string;
    widgetUnavailable: string;
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
    buttonSubmitting: string;
    firstNameLabel: string;
    lastNameLabel: string;
    householdNameLabel: string;
    householdNamePlaceholder: string;
    phoneLabel: string;
    emailLabel: string;
    attendanceQuestion: string;
    attendanceYes: string;
    attendanceNo: string;
    havingTrouble: string;
    contactHint: string;
    adultNote: string;
    partySizeLabel: string;
    partySizeHelper: string;
    otherGuestNamesLabel: string;
    otherGuestNamesPlaceholder: string;
    notesLabel: string;
    networkFallbackMessage: string;
    successMessage: string;
    phoneHelper: string;
    phoneError: string;
    emailError: string;
    attendanceError: string;
    partySizeError: string;
    firstNameError: string;
    lastNameError: string;
  };
  footer: {
    rights: string;
    madeWith: string;
    formalLine: string;
  };
  languageSelector: {
    title: string;
    subtitle: string;
    english: string;
    vietnamese: string;
    close: string;
  };
  etiquette: {
    pageLabel: string;
    pageTitle: string;
    intro: string;
    preview: {
      title: string;
      summary: string;
      highlights: string[];
      ctaLabel: string;
    };
    sections: InfoSection[];
    backToDetailsLabel: string;
    moreDetailsLabel?: string;
    lessDetailsLabel?: string;
    calloutSummary: string;
  };
}

const englishInfoSections: InfoSection[] = [
  {
    title: 'Reception Details',
    layoutIndex: 0,
    subsections: [
      {
        heading: 'Reception Timing',
        body: 'The reception will conclude at 11:00 PM. For guests requiring transportation, departures will begin at 11:15 PM. Kindly note that the venue will close at 11:30 PM.',
      },
      {
        heading: 'Photography & Mobile Phones',
        body: 'We warmly invite you to be fully present and enjoy the celebration with us. Kindly avoid stepping into aisles or using flash photography during key moments. Our photographers will capture the evening, allowing you to relax and celebrate.',
      },
      {
        heading: 'Seating Arrangements',
        body: 'All seating details are available on this website. Please enter your name exactly as shown on your invitation to view your assigned table.',
      },
    ],
  },
  {
    title: 'Attire & Dress Code',
    layoutIndex: 1,
    subsections: [
      {
        heading: 'Dress Code: Semi-Formal / Elegant',
        body: 'We kindly ask guests to dress in polished, evening-appropriate attire.',
        bullets: [
          'Cocktail dresses, elegant evening wear, or dress shirts are most welcome',
          'Neutral, pastel, or rich evening tones are encouraged',
          'Please avoid casual clothing such as jeans, sneakers, or T-shirts',
        ],
      },
      {
        heading: 'Children',
        body: 'This will be an adults-focused celebration to allow everyone to fully enjoy the evening. A small number of children from our immediate family will be in attendance. Thank you sincerely for your understanding.',
      },
      {
        heading: 'Gifts & Well-Wishes',
        body: 'Your presence is the greatest gift to us. For those who wish to share their well-wishes in a traditional way, a wishing table will be available at the reception.',
      },
    ],
  },
  {
    title: 'Celebration Notes',
    layoutIndex: 2,
    subsections: [
      {
        heading: 'Celebration Notes',
        body: 'Dinner will be served as individual plated courses throughout the evening. We invite everyone to enjoy each course at a relaxed pace.',
      },
      {
        heading: 'Respectful Celebration',
        body: 'To ensure a pleasant evening for all, we kindly ask guests to:',
        bullets: [
          'Celebrate responsibly',
          'Be mindful of volume as the evening progresses',
          'Show respect to venue staff and fellow guests',
        ],
      },
      {
        heading: 'At a Glance',
        body: 'Semi-formal / elegant attire | Adults-focused celebration | Assigned seating via website | Reception ends at 11:00 PM | Venue closes at 11:30 PM',
      },
    ],
  },
];

const vietnameseInfoSections: InfoSection[] = [
  {
    title: 'Chi tiết tiệc cưới',
    layoutIndex: 0,
    subsections: [
      {
        heading: 'Thời gian tiệc',
        body: 'Tiệc cưới sẽ kết thúc lúc 11:00 PM. Xe đưa đón sẽ bắt đầu khởi hành từ 11:15 PM. Địa điểm tổ chức sẽ đóng cửa lúc 11:30 PM.',
      },
      {
        heading: 'Chụp hình & điện thoại',
        body: 'Kính mong quý khách dành thời gian tận hưởng khoảnh khắc cùng chúng tôi. Xin vui lòng tránh di chuyển vào lối đi hoặc sử dụng đèn flash trong các nghi thức chính. Đội ngũ nhiếp ảnh sẽ ghi lại những khoảnh khắc đẹp trong suốt buổi tiệc.',
      },
      {
        heading: 'Sắp xếp chỗ ngồi',
        body: 'Thông tin chỗ ngồi được cập nhật trên website. Xin vui lòng nhập đúng họ tên như trên thiệp mời để xem bàn được sắp xếp.',
      },
    ],
  },
  {
    title: 'Trang phục & Dress code',
    layoutIndex: 1,
    subsections: [
      {
        heading: 'Trang phục: Bán trang trọng / Thanh lịch',
        body: 'Chúng tôi trân trọng kính mời quý khách mặc trang phục lịch sự, phù hợp với không khí buổi tiệc.',
        bullets: [
          'Váy dạ hội nhẹ, trang phục cocktail hoặc áo sơ mi lịch sự đều rất phù hợp',
          'Khuyến khích các tông màu trung tính, pastel hoặc trang nhã',
          'Xin vui lòng hạn chế trang phục quá giản dị như quần jeans, giày thể thao hoặc áo thun',
        ],
      },
      {
        heading: 'Trẻ em',
        body: 'Buổi tiệc được tổ chức chủ yếu dành cho người lớn để đảm bảo sự trang trọng. Một số ít trẻ em trong gia đình gần sẽ tham dự. Rất mong quý khách thông cảm và thấu hiểu.',
      },
      {
        heading: 'Quà tặng & lời chúc',
        body: 'Sự hiện diện của quý khách là niềm vinh hạnh lớn nhất đối với chúng tôi. Nếu quý khách muốn gửi lời chúc theo truyền thống, xin mời ghé bàn chúc mừng tại buổi tiệc.',
      },
    ],
  },
  {
    title: 'Ghi chú buổi tiệc',
    layoutIndex: 2,
    subsections: [
      {
        heading: 'Lưu ý trong buổi tiệc',
        body: 'Các món ăn sẽ được phục vụ theo từng phần trong suốt buổi tối. Kính mong quý khách thưởng thức một cách thong thả và thoải mái.',
      },
      {
        heading: 'Ăn mừng văn minh',
        body: 'Để buổi tiệc diễn ra văn minh và trọn vẹn, xin quý khách vui lòng:',
        bullets: [
          'Vui mừng chừng mực',
          'Giữ âm lượng vừa phải về cuối buổi',
          'Tôn trọng nhân viên và các khách mời khác',
        ],
      },
      {
        heading: 'Thông tin chính',
        body: 'Trang phục lịch sự, thanh lịch | Tiệc chủ yếu dành cho người lớn | Có sắp xếp chỗ ngồi theo danh sách | Tiệc kết thúc lúc 11:00 PM | Địa điểm đóng cửa lúc 11:30 PM',
      },
    ],
  },
];

export const translations: Record<Language, TranslationContent> = {
  en: {
    navigation: {
      skipToContent: 'Skip to main content',
      saveTheDate: 'Save the Date',
      details: 'Details',
      story: 'Our Story',
      seating: 'Seating',
      rsvp: 'RSVP',
      etiquette: 'Etiquette',
      theDay: 'The Day',
      reception: 'Reception',
      photos: 'Photos',
      changeLanguage: 'Change Language',
      menuLabel: 'Menu',
      closeMenu: 'Close Menu',
      moreLabel: 'More',
    },
    hero: {
      title: 'Save the Date',
      subtitle: '',
      ctaLabel: 'Receive Updates',
      updatesHeading: 'Updates & RSVP',
      scrollHint: 'Scroll for details',
      groomName: 'David',
      brideName: 'Jeannie',
      date: 'October 3, 2026',
      locationLine: 'Melbourne, Victoria',
      invitationLine: 'Formal invitation to follow',
      rsvpStatus: 'RSVPs will open closer to the date',
      calendar: {
        googleLabel: 'Add to Google Calendar',
        appleLabel: 'Add to Apple Calendar',
      },
    },
    details: {
      saveTheDate: 'Save the Date',
      familiesHeading: 'Our Families',
      sponsorsLabel: 'Principal Sponsors',
      dateLabel: 'October 3, 2026',
      countdownTitle: 'Countdown to the Wedding Day',
      countdownUnits: {
        days: 'DAYS',
        hours: 'HOURS',
        minutes: 'MINUTES',
        seconds: 'SECONDS',
      },
      sectionTitle: 'Event Details',
      infoTitle: 'Wedding Etiquette & Important Information',
      moreInfoLabel: 'More info',
      lessInfoLabel: 'Hide info',
      scanQrLabel: 'Scan for map',
      parents: {
        groomTitle: 'Parents of the Groom',
        groomNames: 'Khen Do & Hanh Nguyen',
        brideTitle: 'Parents of the Bride',
        brideNames: 'Annie McHale & Anthony McHale',
      },
      weddingParty: {
        columns: [
          {
            title: 'Best Man',
            name: 'Viet Ngoc Tran',
            groupTitle: 'Groomsmen',
            members: ['Daniel Le', 'Tien Viet Vu', 'Groomsman Name'],
          },
          {
            title: 'Maid of Honor',
            name: 'Patricia Dionisio',
            groupTitle: 'Bridesmaids',
            members: ['Yvette Olaes', 'Lorie Bigalbal', 'Jazmine McHale'],
          },
        ],
      },
      infoSections: englishInfoSections,
      cards: [
        {
          heading: 'Ceremony',
          time: '1:00 PM',
          location: 'Holy Family Parish',
          address: '46A Ballarat Rd, Maidstone VIC 3012',
          description: 'Please arrive 15 minutes early for seating',
          image: 'images/ceremony.jpg',
        },
        {
          heading: 'Reception',
          time: '6:00 PM',
          location: 'Ultima Function Centre · Sketch Room',
          address: 'Corner of Ely Court, Keilor Park Dr, Keilor East VIC 3042',
          description:
            'Dinner, drinks, and dancing to follow. When entering the venue, please drive towards the left-hand side and look for the Sketch Room.',
          image: 'images/reception.jpg',
        },
        {
          heading: 'Dress Code',
          description:
            'Formal attire requested. Ladies: Evening gowns or formal dresses. Gentlemen: Tuxedos or dark suits with ties.',
        },
      ],
    },
    stayInLoop: {
      heading: 'Would you like to receive updates?',
      subtitle: 'Leave your name and number so we can keep you updated. This is not a formal RSVP.',
      reassurance: '',
      firstNameLabel: 'First name',
      lastNameLabel: 'Last name',
      phoneLabel: 'Mobile number',
      phonePlaceholder: '04XX XXX XXX',
      phoneHelper: 'Use an Australian mobile number.',
      likelyLabel: 'Planning to attend? (Optional)',
      dropdownPlaceholder: 'Select one (optional)',
      optionYes: 'Yes',
      optionMaybe: 'Maybe',
      buttonIdle: 'Send me updates',
      buttonSubmitting: 'Sending…',
      privacy: 'We’ll only use your details for wedding updates.',
      success: 'Thanks! We’ll keep you posted.',
      rsvpNote: 'Formal RSVPs will open closer to the date.',
      errors: {
        firstName: 'First name is required.',
        lastName: 'Last name is required.',
        phone: 'Enter a valid Australian mobile number.',
      },
      submitErrors: {
        unavailable: 'Unable to send right now. Please try again later.',
        generic: 'Something went wrong. Please try again.',
      },
    },
    story: {
      heading: 'Our Story',
      viewPrompt: 'Click to View',
      closeLabel: 'Close',
    },
    photos: {
      sectionLabel: 'Shared Memories',
      heading: 'Photo & Video Album',
      intro:
        'We set up an Uploadcare portal for everyone to drop photos and short clips. Scan the QR code below to open the uploader, share what you captured, and explore the memories from every point of view.',
      encouragement: 'Feel free to upload photos and videos at any time during the evening.',
      stepsTitle: 'How it works',
      steps: [
        {
          title: 'Scan the code',
          description:
            'Point your camera at the QR code to launch the Uploadcare portal in your browser.',
        },
        {
          title: 'Add your memories',
          description:
            'Upload any photos or videos you capture so everyone can relive the celebration together.',
        },
        {
          title: 'Download & share',
          description:
            'Browse the gallery, save your favorites, and share the highlight moments with family and friends.',
        },
      ],
      ctaLabel: 'Launch Upload Portal',
      qrCaption: 'Scan to upload',
      widgetTitle: 'Upload directly with Uploadcare',
      widgetDescription:
        'Use the uploader below to send photos or short clips straight to us—no app install required.',
      widgetUnavailable: 'Upload portal is unavailable right now. Please email us if you need help sharing media.',
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
      button: 'Submit RSVP',
      buttonSubmitting: 'Sending...',
      firstNameLabel: 'First Name',
      lastNameLabel: 'Last Name',
      householdNameLabel: 'Household name (optional)',
      householdNamePlaceholder: 'e.g. The Nguyen Family',
      phoneLabel: 'Mobile Number',
      emailLabel: 'Email (optional)',
      attendanceQuestion: 'Will you be attending?',
      attendanceYes: 'Yes, we will be there',
      attendanceNo: 'No, we cannot attend',
      havingTrouble: 'Having trouble?',
      contactHint: 'Email us and we will be happy to help.',
      adultNote:
        'This celebration is adults-focused. Only children from our extended family will attend. Thank you for understanding.',
      partySizeLabel: 'Total guests attending (including you)',
      partySizeHelper:
        'Please only include guests listed on your invitation.',
      otherGuestNamesLabel: 'Other guest names',
      otherGuestNamesPlaceholder: 'e.g. Jane Nguyen, Tom Nguyen',
      notesLabel: 'Notes',
      networkFallbackMessage:
        'If you saw a network error, please know we received your RSVP. Email us if you would like to confirm.',
      successMessage: 'Thank you — we’ve received your RSVP.',
      phoneHelper: 'Australian mobile only (e.g. 0412 345 678 or +61 412 345 678).',
      phoneError: 'Enter an Australian mobile number such as 0412 345 678 or +61 412 345 678.',
      emailError: 'Enter a valid email address or leave the field blank.',
      attendanceError: 'Please select whether you will attend.',
      partySizeError: 'Guest count must be between 0 and 10.',
      firstNameError: 'First name is required.',
      lastNameError: 'Last name is required.',
    },
    footer: {
      rights: 'All Rights Reserved',
      madeWith: 'Made with ♡',
      formalLine: '',
    },
    languageSelector: {
      title: 'Choose your language',
      subtitle: 'Please select English or Vietnamese to view the invitation.',
      english: 'English',
      vietnamese: 'Tiếng Việt',
      close: 'Keep current language',
    },
    etiquette: {
      pageLabel: 'A gentle guide',
      pageTitle: 'Wedding Etiquette',
      intro:
        'We have prepared a few gentle notes regarding attire, timing, and celebration etiquette, so everyone can feel comfortable and enjoy the evening with peace of mind.',
      preview: {
        title: 'Wedding Etiquette',
        summary:
          'Our celebration is adults-focused, the ceremony will be unplugged, and we kindly ask everyone to arrive a little early so seating runs smoothly.',
        highlights: [
          'Adults-focused celebration with limited children from immediate family',
          'Unplugged ceremony — please keep phones away during the vows',
          'Arrive 15 minutes early to settle in before the procession',
        ],
        ctaLabel: 'View full etiquette →',
      },
      sections: englishInfoSections,
      backToDetailsLabel: 'Back to Details',
      moreDetailsLabel: 'More details',
      lessDetailsLabel: 'Hide details',
      calloutSummary: 'A quick guide to attire, timing, and respectful celebration.',
    },
  },
  vi: {
    navigation: {
      skipToContent: 'Bỏ qua tới nội dung chính',
      saveTheDate: 'Báo ngày cưới',
      details: 'Thông tin chi tiết',
      story: 'Câu chuyện của chúng tôi',
      seating: 'Sắp xếp chỗ ngồi',
      rsvp: 'Xác nhận tham dự',
      etiquette: 'Lưu ý tham dự',
      theDay: 'Ngày hôn lễ',
      reception: 'Tiệc cưới',
      photos: 'Hình ảnh',
      changeLanguage: 'Đổi ngôn ngữ',
      menuLabel: 'Menu',
      closeMenu: 'Đóng Menu',
      moreLabel: 'Thêm',
    },
    hero: {
      title: 'Trân trọng báo ngày',
      subtitle: 'Gia đình chúng tôi trân trọng thông báo ngày hôn lễ của con em chúng tôi.',
      ctaLabel: 'Nhận cập nhật',
      updatesHeading: 'Cập nhật & Phản hồi tham dự',
      scrollHint: 'Cuộn xuống để xem chi tiết',
      groomName: 'David',
      brideName: 'Jeannie',
      date: 'Ngày 3 tháng 10 năm 2026',
      locationLine: 'Melbourne, Victoria',
      invitationLine: 'Thiệp mời chính thức sẽ được trân trọng gửi đến quý khách sau.',
      rsvpStatus: 'Chúng tôi sẽ mở RSVP gần ngày cưới',
      calendar: {
        googleLabel: 'Thêm vào Google Calendar',
        appleLabel: 'Thêm vào Apple Calendar',
      },
    },
    details: {
      saveTheDate: 'Vui lòng ghi nhớ ngày',
      familiesHeading: 'Gia đình hai bên',
      sponsorsLabel: 'Gia đình chứng giám',
      dateLabel: 'Ngày 3 tháng 10 năm 2026',
      countdownTitle: 'Thời gian còn lại đến ngày hôn lễ',
      countdownUnits: {
        days: 'NGÀY',
        hours: 'GIỜ',
        minutes: 'PHÚT',
        seconds: 'GIÂY',
      },
      sectionTitle: 'Thông tin sự kiện',
      infoTitle: 'Nghi thức & thông tin quan trọng',
      moreInfoLabel: 'Xem thêm',
      lessInfoLabel: 'Thu gọn',
      scanQrLabel: 'Quét để xem bản đồ',
      parents: {
        groomTitle: 'Ba mẹ chú rể',
        groomNames: 'Khen Do & Hanh Nguyen',
        brideTitle: 'Ba mẹ cô dâu',
        brideNames: 'Annie McHale & Anthony McHale',
      },
      weddingParty: {
        columns: [
          {
            title: 'Phù rể chính',
            name: 'Viet Ngoc Tran',
            groupTitle: 'Phù rể',
            members: ['Daniel Le', 'Tien Viet Vu', 'Groomsman Name'],
          },
          {
            title: 'Phù dâu chính',
            name: 'Patricia Dionisio',
            groupTitle: 'Phù dâu',
            members: ['Yvette Olaes', 'Lorie Bigalbal', 'Jazmine McHale'],
          },
        ],
      },
      infoSections: vietnameseInfoSections,
      cards: [
        {
          heading: 'Lễ cưới',
          time: '1:00 chiều',
          location: 'Nhà thờ Holy Family',
          address: '46A Ballarat Rd, Maidstone VIC 3012',
          description: 'Vui lòng đến sớm 15 phút để ổn định chỗ ngồi',
          image: 'images/ceremony.jpg',
        },
        {
          heading: 'Tiệc cưới',
          time: '6:00 chiều',
          location: 'Trung tâm Ultima Function · Sketch Room',
          address: 'Corner of Ely Court, Keilor Park Dr, Keilor East VIC 3042',
          description:
            'Tiệc tối, đồ uống và khiêu vũ sau buổi lễ. Khi vào khuôn viên, hãy chạy xe về phía bên trái và tìm phòng mang tên “Sketch Room”.',
          image: 'images/reception.jpg',
        },
        {
          heading: 'Trang phục',
          description:
            'Vui lòng mặc trang phục trang trọng. Quý cô: Đầm dạ hội hoặc váy trang nhã. Quý ông: Vest hoặc suit màu tối kèm cà vạt.',
        },
      ],
    },
    stayInLoop: {
      heading: 'Để tiện cập nhật thông tin hôn lễ',
      subtitle:
        'Để lại tên và số điện thoại để chúng tôi gửi cập nhật cho bạn. Đây không phải là RSVP chính thức.',
      reassurance:
        'Việc đăng ký này chỉ nhằm mục đích cập nhật thông tin, không thay thế cho thiệp mời chính thức.',
      firstNameLabel: 'Tên',
      lastNameLabel: 'Họ',
      phoneLabel: 'Số điện thoại',
      phonePlaceholder: '04XX XXX XXX',
      phoneHelper: 'Vui lòng dùng số di động Úc.',
      likelyLabel: 'Quý khách có thể sắp xếp tham dự không? (Không bắt buộc)',
      dropdownPlaceholder: 'Chọn một tùy chọn (không bắt buộc)',
      optionYes: 'Có',
      optionMaybe: 'Có thể',
      buttonIdle: 'Gửi cho tôi cập nhật',
      buttonSubmitting: 'Đang gửi…',
      privacy: 'Thông tin chỉ dùng để gửi cập nhật đám cưới.',
      success: 'Cảm ơn! Chúng tôi sẽ báo cho bạn.',
      rsvpNote: 'RSVP chính thức sẽ mở gần ngày cưới.',
      errors: {
        firstName: 'Vui lòng nhập tên.',
        lastName: 'Vui lòng nhập họ.',
        phone: 'Vui lòng nhập số di động Úc hợp lệ.',
      },
      submitErrors: {
        unavailable: 'Hiện không thể gửi, vui lòng thử lại sau.',
        generic: 'Có lỗi xảy ra, vui lòng thử lại.',
      },
    },
    story: {
      heading: 'Chuyện tình của chúng tôi',
      viewPrompt: 'Nhấn để xem',
      closeLabel: 'Đóng',
    },
    photos: {
      sectionLabel: 'Khoảnh khắc chung',
      heading: 'Album Ảnh & Video',
      intro:
        'Chúng tôi đã tạo cổng Uploadcare để mọi người dễ dàng gửi ảnh và video ngắn. Quét mã QR bên dưới để mở trình tải lên, chia sẻ khoảnh khắc của bạn và cùng gìn giữ ký ức.',
      encouragement: 'Cứ thoải mái tải ảnh và video bất cứ lúc nào trong buổi tối.',
      stepsTitle: 'Cách thực hiện',
      steps: [
        {
          title: 'Quét mã',
          description:
            'Mở camera và hướng vào mã QR để bật trình tải Uploadcare trên trình duyệt.',
        },
        {
          title: 'Chia sẻ khoảnh khắc',
          description:
            'Tải lên mọi hình ảnh hoặc video để mọi người có thể cùng hồi tưởng và mỉm cười.',
        },
        {
          title: 'Tải xuống & lan tỏa',
          description:
            'Duyệt bộ sưu tập, lưu mục yêu thích và gửi những khoảnh khắc nổi bật cho gia đình, bạn bè.',
        },
      ],
      ctaLabel: 'Mở cổng Uploadcare',
      qrCaption: 'Quét để tải ảnh',
      widgetTitle: 'Tải trực tiếp qua Uploadcare',
      widgetDescription:
        'Dùng trình tải lên bên dưới để gửi ảnh hoặc video ngắn cho chúng tôi—không cần cài thêm ứng dụng.',
      widgetUnavailable: 'Cổng tải lên đang tạm thời gián đoạn. Vui lòng email cho chúng tôi nếu cần hỗ trợ.',
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
      button: 'Gửi phản hồi',
      buttonSubmitting: 'Đang gửi...',
      firstNameLabel: 'Tên',
      lastNameLabel: 'Họ',
      householdNameLabel: 'Tên gia đình (không bắt buộc)',
      householdNamePlaceholder: 'Ví dụ: Gia đình Nguyễn',
      phoneLabel: 'Số điện thoại',
      emailLabel: 'Email (không bắt buộc)',
      attendanceQuestion: 'Bạn có tham dự được không?',
      attendanceYes: 'Có, chúng tôi sẽ tham dự',
      attendanceNo: 'Rất tiếc, chúng tôi không đến được',
      havingTrouble: 'Gặp khó khăn?',
      contactHint: 'Gửi email cho chúng tôi để được hỗ trợ.',
      adultNote:
        'Buổi tiệc chủ yếu dành cho người lớn, chỉ các bé trong đại gia đình tham dự. Cảm ơn bạn đã thông cảm.',
      partySizeLabel: 'Tổng số khách tham dự (tính luôn bạn)',
      partySizeHelper:
        'Vui lòng chỉ bao gồm những người được ghi tên trên thiệp mời.',
      otherGuestNamesLabel: 'Tên khách khác',
      otherGuestNamesPlaceholder: 'Ví dụ: Jane Nguyen, Tom Nguyen',
      notesLabel: 'Ghi chú',
      networkFallbackMessage:
        'Nếu màn hình báo lỗi mạng, chúng tôi vẫn nhận được RSVP của bạn. Vui lòng email nếu muốn xác nhận.',
      successMessage: 'Cảm ơn bạn — tụi con đã nhận được phản hồi.',
      phoneHelper: 'Chỉ nhận số di động Úc (ví dụ 0412 345 678 hoặc +61 412 345 678).',
      phoneError: 'Vui lòng nhập số di động Úc hợp lệ (0412… hoặc +61…).',
      emailError: 'Nhập email hợp lệ hoặc để trống.',
      attendanceError: 'Vui lòng chọn Có hoặc Không.',
      partySizeError: 'Số khách phải từ 0 đến 10.',
      firstNameError: 'Vui lòng nhập tên.',
      lastNameError: 'Vui lòng nhập họ.',
    },
    footer: {
      rights: 'Bảo lưu mọi quyền',
      madeWith: 'Được tạo nên với ♡',
      formalLine: 'Chúng tôi hân hạnh được đón tiếp quý khách trong ngày trọng đại này.',
    },
    languageSelector: {
      title: 'Chọn ngôn ngữ',
      subtitle: 'Hãy chọn tiếng Anh hoặc tiếng Việt để xem lời mời.',
      english: 'English',
      vietnamese: 'Tiếng Việt',
      close: 'Giữ nguyên ngôn ngữ hiện tại',
    },
    etiquette: {
      pageLabel: 'Ghi chú nhẹ nhàng',
      pageTitle: 'Nghi thức tiệc cưới',
      intro:
        'Chúng tôi xin gửi đến quý khách một vài lưu ý nhỏ về trang phục, thời gian và cách tham dự tiệc, để buổi lễ diễn ra trang trọng và trọn vẹn.',
      preview: {
        title: 'Nghi thức cưới',
        summary:
          'Tiệc ưu tiên người lớn, lễ cưới sẽ “unplugged” và chúng tôi mong mọi người đến sớm 15 phút để ổn định chỗ ngồi.',
        highlights: [
          'Tiệc hướng đến người lớn, chỉ có vài bé trong gia đình thân thiết',
          'Lễ cưới không dùng điện thoại — xin giữ máy trong túi suốt nghi thức',
          'Đến trước giờ làm lễ 15 phút để ổn định chỗ và kịp thời gian',
        ],
        ctaLabel: 'Xem đầy đủ nghi thức →',
      },
      sections: vietnameseInfoSections,
      backToDetailsLabel: 'Quay lại trang Thông tin',
      moreDetailsLabel: 'Xem chi tiết',
      lessDetailsLabel: 'Thu gọn',
      calloutSummary: 'Hướng dẫn nhanh về trang phục, thời gian và cách ăn mừng tinh tế.',
    },
  },
};
