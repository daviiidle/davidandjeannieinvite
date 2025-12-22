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
    phoneLabel: string;
    emailLabel: string;
    havingTrouble: string;
    contactHint: string;
    adultNote: string;
    partySizeLabel: string;
    partySizeHelper: string;
    additionalNamesLabel: string;
    additionalNamesPlaceholder: string;
    notesLabel: string;
    groomSurnameLabel: string;
    brideSurnameLabel: string;
    surnamePlaceholder: string;
    networkFallbackMessage: string;
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
        groomNames: 'Ken Do & Hanh Nguyen',
        brideTitle: 'Parents of the Bride',
        brideNames: 'Annie McHale & Anthony McHale',
      },
      weddingParty: {
        columns: [
          {
            title: 'Best Man',
            name: 'Best Man Name',
            groupTitle: 'Groomsmen',
            members: ['Daniel Le', 'Viet Vu', 'Brian Nguyen'],
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
              body: 'Reception concludes at 11:00 PM sharp to respect venue regulations and ensure a smooth evening for all guests.',
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
                'Reception ends at 11:00 PM',
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
      phoneLabel: 'Mobile Number',
      emailLabel: 'Email (optional)',
      havingTrouble: 'Having trouble?',
      contactHint: 'Email us and we will be happy to help.',
      adultNote:
        'This celebration is adults-focused. Only children from our extended family will attend. Thank you for understanding.',
      partySizeLabel: 'Total guests attending (including you)',
      partySizeHelper:
        'If you are bringing family or friends, let us know the total number so we can reserve seats.',
      additionalNamesLabel: 'Other guest names (if known)',
      additionalNamesPlaceholder: 'Optional',
      notesLabel: 'Notes',
      groomSurnameLabel: "Groom's family name",
      brideSurnameLabel: "Bride's family name",
      surnamePlaceholder: 'As printed on your invitation',
      networkFallbackMessage:
        'If you saw a network error, please know we received your RSVP. Email us if you would like to confirm.',
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
        groomNames: 'Ken Do & Hanh Nguyen',
        brideTitle: 'Ba mẹ cô dâu',
        brideNames: 'Annie McHale & Anthony McHale',
      },
      weddingParty: {
        columns: [
          {
            title: 'Phù rể chính',
            name: 'Tên phù rể chính',
            groupTitle: 'Phù rể',
            members: ['Daniel Le', 'Viet Vu', 'Brian Nguyen'],
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
              body: 'Tiệc sẽ kết thúc đúng 11:00 PM để tuân thủ quy định của địa điểm và giúp buổi tối diễn ra trọn vẹn.',
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
                'Tiệc kết thúc 11:00 PM',
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
      phoneLabel: 'Số điện thoại',
      emailLabel: 'Email (không bắt buộc)',
      havingTrouble: 'Gặp khó khăn?',
      contactHint: 'Gửi email cho chúng tôi để được hỗ trợ.',
      adultNote:
        'Buổi tiệc chủ yếu dành cho người lớn, chỉ các bé trong đại gia đình tham dự. Cảm ơn bạn đã thông cảm.',
      partySizeLabel: 'Tổng số khách tham dự (tính luôn bạn)',
      partySizeHelper:
        'Nếu bạn dẫn theo gia đình/bạn bè, hãy cho chúng tôi biết tổng số người để sắp xếp chỗ ngồi.',
      additionalNamesLabel: 'Tên khách khác (nếu đã biết)',
      additionalNamesPlaceholder: 'Không bắt buộc',
      notesLabel: 'Ghi chú',
      groomSurnameLabel: 'Họ của chú rể',
      brideSurnameLabel: 'Họ của cô dâu',
      surnamePlaceholder: 'Ghi đúng như trên thiệp mời',
      networkFallbackMessage:
        'Nếu màn hình báo lỗi mạng, chúng tôi vẫn nhận được RSVP của bạn. Vui lòng email nếu muốn xác nhận.',
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
