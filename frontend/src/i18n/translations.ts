export type LangCode = 'ko' | 'en' | 'yue' | 'szeyup' | 'br'

export interface Translations {
  langName: string
  dateLocale: string
  siteTitle: string
  backToThreads: string
  close: string
  newThread: string
  loadingThreads: string
  noThreads: string
  createNewThread: string
  titleLabel: string
  nameLabel: string
  messageLabel: string
  subjectLabel: string
  titlePlaceholder: string
  anonymousPlaceholder: string
  messagePlaceholder: string
  subjectPlaceholder: string
  replyPlaceholder: string
  creating: string
  createThread: string
  titleBodyRequired: string
  failedCreateThread: string
  errorOccurred: string
  replyToThread: string
  posting: string
  postReply: string
  messageRequired: string
  failedCreatePost: string
  lastUpdated: string
  loadingPosts: string
  postNo: string
}

export const translations: Record<LangCode, Translations> = {
  ko: {
    langName: '한국어',
    dateLocale: 'ko-KR',
    siteTitle: '6ch - 익명 이미지보드',
    backToThreads: '← 목록으로',
    close: '✕ 닫기',
    newThread: '+ 새 스레드',
    loadingThreads: '스레드 불러오는 중...',
    noThreads: '아직 스레드가 없습니다. 첫 번째를 만들어보세요!',
    createNewThread: '새 스레드 만들기',
    titleLabel: '제목 *',
    nameLabel: '이름',
    messageLabel: '내용 *',
    subjectLabel: '제목',
    titlePlaceholder: '스레드 제목',
    anonymousPlaceholder: '익명',
    messagePlaceholder: '내용을 입력하세요',
    subjectPlaceholder: '선택사항',
    replyPlaceholder: '답글을 입력하세요',
    creating: '생성 중...',
    createThread: '스레드 만들기',
    titleBodyRequired: '제목과 내용은 필수입니다',
    failedCreateThread: '스레드 생성에 실패했습니다',
    errorOccurred: '오류가 발생했습니다',
    replyToThread: '답글 달기',
    posting: '게시 중...',
    postReply: '답글 달기',
    messageRequired: '내용은 필수입니다',
    failedCreatePost: '게시물 작성에 실패했습니다',
    lastUpdated: '최근:',
    loadingPosts: '게시물 불러오는 중...',
    postNo: '번',
  },
  en: {
    langName: 'English',
    dateLocale: 'en-US',
    siteTitle: '6ch - Anonymous Imageboard',
    backToThreads: '← Back to Threads',
    close: '✕ Close',
    newThread: '+ New Thread',
    loadingThreads: 'Loading threads...',
    noThreads: 'No threads yet. Create one!',
    createNewThread: 'Create New Thread',
    titleLabel: 'Title *',
    nameLabel: 'Name',
    messageLabel: 'Message *',
    subjectLabel: 'Subject',
    titlePlaceholder: 'Thread title',
    anonymousPlaceholder: 'Anonymous',
    messagePlaceholder: 'Enter your message',
    subjectPlaceholder: 'Optional',
    replyPlaceholder: 'Enter your reply',
    creating: 'Creating...',
    createThread: 'Create Thread',
    titleBodyRequired: 'Title and body are required',
    failedCreateThread: 'Failed to create thread',
    errorOccurred: 'An error occurred',
    replyToThread: 'Reply to Thread',
    posting: 'Posting...',
    postReply: 'Post Reply',
    messageRequired: 'Message is required',
    failedCreatePost: 'Failed to create post',
    lastUpdated: 'Last:',
    loadingPosts: 'Loading posts...',
    postNo: 'No.',
  },
  yue: {
    langName: '廣東話',
    dateLocale: 'zh-HK',
    siteTitle: '6ch - 匿名圖片版',
    backToThreads: '← 返去帖子列表',
    close: '✕ 關閉',
    newThread: '+ 新帖子',
    loadingThreads: '載入帖子中...',
    noThreads: '未有帖子。整一個啦！',
    createNewThread: '整新帖子',
    titleLabel: '標題 *',
    nameLabel: '名',
    messageLabel: '內容 *',
    subjectLabel: '主題',
    titlePlaceholder: '帖子標題',
    anonymousPlaceholder: '匿名',
    messagePlaceholder: '輸入你嘅內容',
    subjectPlaceholder: '可以唔填',
    replyPlaceholder: '輸入你嘅回覆',
    creating: '整緊...',
    createThread: '整帖子',
    titleBodyRequired: '標題同內容係必填',
    failedCreateThread: '整帖子失敗',
    errorOccurred: '出錯咗',
    replyToThread: '回覆帖子',
    posting: '發緊...',
    postReply: '發回覆',
    messageRequired: '內容係必填',
    failedCreatePost: '發帖失敗',
    lastUpdated: '最新：',
    loadingPosts: '載入中...',
    postNo: '第',
  },
  szeyup: {
    langName: '四縣客家話',
    dateLocale: 'zh-TW',
    siteTitle: '6ch - 匿名圖片版',
    backToThreads: '← 轉去討論串列表',
    close: '✕ 關等',
    newThread: '+ 新討論串',
    loadingThreads: '載入討論串中...',
    noThreads: '還無討論串。來發一個！',
    createNewThread: '發新討論串',
    titleLabel: '標題 *',
    nameLabel: '名',
    messageLabel: '內容 *',
    subjectLabel: '主題',
    titlePlaceholder: '討論串標題',
    anonymousPlaceholder: '無名氏',
    messagePlaceholder: '輸入你个內容',
    subjectPlaceholder: '毋一定要填',
    replyPlaceholder: '輸入你个回覆',
    creating: '發緊...',
    createThread: '發討論串',
    titleBodyRequired: '標題同內容係必要个',
    failedCreateThread: '發討論串失敗',
    errorOccurred: '出問題了',
    replyToThread: '回覆討論串',
    posting: '發緊...',
    postReply: '發回覆',
    messageRequired: '內容係必要个',
    failedCreatePost: '發文失敗',
    lastUpdated: '最新：',
    loadingPosts: '載入中...',
    postNo: '第',
  },
  br: {
    langName: 'Brezhoneg',
    dateLocale: 'br',
    siteTitle: '6ch - Taolenn-skeudenn dizanv',
    backToThreads: '← Distreiñ d\'ar filtennoù',
    close: '✕ Serriñ',
    newThread: '+ Filten nevez',
    loadingThreads: 'O kargañ ar filtennoù...',
    noThreads: 'Filtennoù ebet c\'hoazh. Krouit unan!',
    createNewThread: 'Krouiñ ur filten nevez',
    titleLabel: 'Titl *',
    nameLabel: 'Anv',
    messageLabel: 'Kemennadenn *',
    subjectLabel: 'Danvez',
    titlePlaceholder: 'Titl ar filten',
    anonymousPlaceholder: 'Dizanv',
    messagePlaceholder: 'Skrivit ho kemennadenn',
    subjectPlaceholder: 'Diret',
    replyPlaceholder: 'Skrivit ho respont',
    creating: 'O krouidigezh...',
    createThread: 'Krouiñ filten',
    titleBodyRequired: 'Ret eo ar titl hag ar c\'horf',
    failedCreateThread: 'C\'hwitet eo ar c\'hrouidigezh',
    errorOccurred: 'Degouezhet ez eus ur fazi',
    replyToThread: 'Respont d\'ar filten',
    posting: 'O postiñ...',
    postReply: 'Postañ respont',
    messageRequired: 'Ret eo ar gemennadenn',
    failedCreatePost: 'C\'hwitet eo ar postiñ',
    lastUpdated: 'Diwezhañ:',
    loadingPosts: 'O kargañ...',
    postNo: 'Niv.',
  },
}
