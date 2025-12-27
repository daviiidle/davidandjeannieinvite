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
    infoSections?: Array<{
      title: string;
      layoutIndex?: number;
      subsections: Array<{
        heading: string;
        body?: string;
        bullets?: string[];
      }>;
    }>;
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
      dateLabel: 'October 3, 2026',
      countdownTitle: 'Countdown to the big day',
      countdownUnits: {
        days: 'DAYS',
        hours: 'HOURS',
        minutes: 'MINUTES',
        seconds: 'SECONDS',
      },
      sectionTitle: 'Event Details',
      infoTitle: 'Wedding Etiquette & Important Information',
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
      infoSections: [
        {
          title: 'Reception Details',
          layoutIndex: 0,
          subsections: [
            {
              heading: 'Reception Timing',
              body: 'Reception winds down at 11:00 PM, with guests beginning to depart from 11:15 PM. We kindly ask that the venue be fully cleared by 11:30 PM to respect venue regulations and ensure a smooth conclusion to the evening.',
            },
            {
              heading: 'Photography & Phones',
              body: 'We invite you to be fully present and enjoy the moment with us.',
              bullets: [
                'Please refrain from stepping into aisles during the ceremony',
                'Kindly avoid using flash photography',
                'Our photographers will capture the evening so you can relax and celebrate',
              ],
            },
            {
              heading: 'Seating Arrangements',
              body: 'All seating arrangements are available on this website. Please enter your name exactly as shown on your invitation to view your assigned table for the reception.',
            },
          ],
        },
        {
          title: 'Attire & Dress Code',
          layoutIndex: 1,
          subsections: [
            {
              heading: 'Dress Code: Semi-Formal / Elegant',
              body: 'We kindly ask guests to dress in polished, evening-appropriate attire to match the tone of the celebration.',
              bullets: [
                'Cocktail dresses, evening dresses, suits, or dress shirts are welcome',
                'Neutral, pastel, or rich evening colours are encouraged',
                'Please avoid overly casual clothing such as jeans, sneakers, or T-shirts',
              ],
            },
            {
              heading: 'Children',
              body: 'This will be an adults-focused celebration to allow everyone to fully enjoy the evening. A small number of children from our immediate family will be in attendance. Thank you for your understanding.',
            },
            {
              heading: 'Gifts & Well-Wishes',
              body: 'Your presence truly means the world to us. For those who wish to share their well-wishes in a traditional way, a wishing table will be available at the reception.',
            },
          ],
        },
        {
          title: 'Celebration Notes',
          layoutIndex: 2,
          subsections: [
            {
              heading: 'Food & Celebration Style',
              body: 'Dinner will be served as individual plated courses throughout the evening. Relax, enjoy each course, and celebrate with us.',
            },
            {
              heading: 'Respectful Celebration',
              body: 'We kindly ask all guests to help make the night enjoyable for everyone.',
              bullets: [
                'Celebrate responsibly',
                'Be mindful of volume as the evening progresses',
                'Respect venue staff and fellow guests',
              ],
            },
            {
              heading: 'Quick Notes (Mobile Summary)',
              bullets: [
                'Semi-formal attire',
                'Adults-focused celebration',
                'Wishing table available',
                'Assigned seating via website',
                'Reception winds down by 11:00 PM (departures from 11:15 PM, venue clear by 11:30 PM)',
              ],
            },
          ],
        },
      ],
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
      heading: 'Want to stay in the loop?',
      subtitle: 'Leave your name and number so we can keep you updated. This is not a formal RSVP.',
      firstNameLabel: 'First name',
      lastNameLabel: 'Last name',
      phoneLabel: 'Mobile number',
      phonePlaceholder: '04XX XXX XXX',
      phoneHelper: 'Use an Australian mobile number.',
      likelyLabel: 'Likely to attend? (optional)',
      dropdownPlaceholder: 'Select one (optional)',
      optionYes: 'Yes',
      optionMaybe: 'Maybe',
      buttonIdle: 'Send me updates',
      buttonSubmitting: 'Sending…',
      privacy: 'We’ll only use your details for wedding updates.',
      success: 'Thanks! We’ll keep you posted.',
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
      date: 'Ngày 3 tháng 10 năm 2026',
      locationLine: 'Melbourne, Victoria',
      invitationLine: 'Thiệp mời chính thức sẽ được gửi sau',
      rsvpStatus: 'Chúng tôi sẽ mở RSVP gần ngày cưới',
      calendar: {
        googleLabel: 'Thêm vào Google Calendar',
        appleLabel: 'Thêm vào Apple Calendar',
      },
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
      infoTitle: 'Nghi thức & thông tin quan trọng',
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
      infoSections: [
        {
          title: 'Chi tiết tiệc cưới',
          layoutIndex: 0,
          subsections: [
            {
              heading: 'Thời gian tiệc',
              body: 'Tiệc sẽ nhẹ nhàng kết thúc vào 11:00 PM, khách bắt đầu rời tiệc từ 11:15 PM. Mong mọi người giúp chúng tôi rời địa điểm trước 11:30 PM để tôn trọng quy định và khép lại buổi tối thật trọn vẹn.',
            },
            {
              heading: 'Chụp hình & điện thoại',
              body: 'Mong mọi người hãy tận hưởng khoảnh khắc cùng chúng tôi.',
              bullets: [
                'Vui lòng không bước vào lối đi trong lúc làm lễ',
                'Hạn chế sử dụng đèn flash khi chụp ảnh',
                'Đã có nhiếp ảnh gia ghi lại trọn vẹn buổi tối để bạn yên tâm vui tiệc',
              ],
            },
            {
              heading: 'Sắp xếp chỗ ngồi',
              body: 'Sơ đồ chỗ ngồi được hiển thị ngay trên website. Vui lòng nhập đúng họ tên như trên thiệp mời để xem bàn tiệc được sắp xếp cho bạn.',
            },
          ],
        },
        {
          title: 'Trang phục & Dress code',
          layoutIndex: 1,
          subsections: [
            {
              heading: 'Trang phục: Bán trang trọng / thanh lịch',
              body: 'Rất mong mọi người chọn trang phục chỉn chu, phù hợp không khí ấm áp của buổi tối.',
              bullets: [
                'Khuyến khích váy cocktail, đầm dạ tiệc, vest, sơ mi lịch sự',
                'Màu trung tính, pastel hoặc sắc tối sang trọng đều phù hợp',
                'Vui lòng hạn chế đồ quá casual như quần jeans, giày thể thao hoặc áo thun',
              ],
            },
            {
              heading: 'Trẻ em',
              body: 'Buổi tiệc ưu tiên người lớn để mọi người có thể tận hưởng trọn vẹn. Một vài bé trong gia đình hai bên sẽ tham dự cùng chúng tôi. Cảm ơn bạn đã thông cảm.',
            },
            {
              heading: 'Quà tặng & lời chúc',
              body: 'Sự hiện diện của bạn là món quà quý giá nhất. Nếu muốn gửi lời chúc theo cách truyền thống, xin mời ghé “wishing table” tại tiệc.',
            },
          ],
        },
        {
          title: 'Ghi chú buổi tiệc',
          layoutIndex: 2,
          subsections: [
            {
              heading: 'Phong cách tiệc & ẩm thực',
              body: 'Bữa tối được phục vụ theo từng phần riêng cho mỗi khách, với nhiều món nối tiếp nhau. Mời mọi người thư giãn, thưởng thức và cùng nhau chúc mừng.',
            },
            {
              heading: 'Ăn mừng văn minh',
              body: 'Để buổi tối trọn vẹn hơn, mong mọi người:',
              bullets: [
                'Vui hết mình nhưng vẫn điều độ',
                'Giữ âm lượng vừa phải khi đêm về khuya',
                'Tôn trọng nhân viên phục vụ và khách mời khác',
              ],
            },
            {
              heading: 'Ghi chú nhanh',
              bullets: [
                'Trang phục bán trang trọng',
                'Tiệc ưu tiên người lớn',
                'Có bàn nhận lời chúc',
                'Xem chỗ ngồi ngay trên website',
                'Tiệc kết thúc 11:00 PM (bắt đầu rời tiệc từ 11:15 PM, rời địa điểm trước 11:30 PM)',
              ],
            },
          ],
        },
      ],
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
      heading: 'Muốn nhận thông tin mới nhất?',
      subtitle:
        'Để lại tên và số điện thoại để chúng tôi gửi cập nhật cho bạn. Đây không phải là RSVP chính thức.',
      firstNameLabel: 'Tên',
      lastNameLabel: 'Họ',
      phoneLabel: 'Số điện thoại',
      phonePlaceholder: '04XX XXX XXX',
      phoneHelper: 'Vui lòng dùng số di động Úc.',
      likelyLabel: 'Bạn có thể tham dự? (không bắt buộc)',
      dropdownPlaceholder: 'Chọn một tùy chọn (không bắt buộc)',
      optionYes: 'Có',
      optionMaybe: 'Có thể',
      buttonIdle: 'Gửi cho tôi cập nhật',
      buttonSubmitting: 'Đang gửi…',
      privacy: 'Thông tin chỉ dùng để gửi cập nhật đám cưới.',
      success: 'Cảm ơn! Chúng tôi sẽ báo cho bạn.',
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
