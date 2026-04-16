export type Language = 'en' | 'zh' | 'ja' | 'ko';

export const LANGUAGE_OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
];

type TranslationKeys = {
  // Common
  back: string;
  loading: string;
  error: string;
  search: string;

  // Home
  'home.title': string;
  'home.subtitle': string;
  'home.chat': string;
  'home.meditation': string;
  'home.letters': string;
  'home.getTodayLetter': string;
  'home.generating': string;
  'home.letterCardTitle': string;
  'home.noLetters': string;

  // Onboarding
  'onboarding.welcome': string;

  // Auth
  'auth.login': string;
  'auth.signIn': string;
  'auth.signUp': string;
  'auth.email': string;
  'auth.password': string;
  'auth.confirmPassword': string;
  'auth.name': string;
  'auth.noAccount': string;
  'auth.hasAccount': string;
  'auth.forgotPassword': string;
  'auth.loggingIn': string;
  'auth.signingUp': string;
  'auth.signInWith': string;
  'auth.fillAll': string;
  'auth.passwordMismatch': string;
  'auth.passwordTooShort': string;

  // Chat
  'chat.title': string;
  'chat.aiName': string;
  'chat.me': string;
  'chat.placeholder': string;
  'chat.meditation': string;
  'chat.changeMind': string;
  'chat.generateAudio': string;
  'chat.audioReady': string;
  'chat.audioGenerating': string;
  'chat.audioFailed': string;

  // Letters
  'letters.title': string;
  'letters.signature': string;
  'letters.from': string;
  'letters.notFound': string;

  // Meditation
  'meditation.title': string;
  'meditation.empty': string;

  // Profile
  'profile.title': string;
  'profile.vip': string;
  'profile.account': string;
  'profile.changePassword': string;
  'profile.helpFeedback': string;
  'profile.about': string;
  'profile.language': string;
  'profile.logout': string;

  // Account Settings
  'account.title': string;
  'account.email': string;
  'account.phone': string;
  'account.wechat': string;
  'account.bound': string;
  'account.changePassword': string;
  'account.logoutAll': string;
  'account.deleteAccount': string;

  // About
  'about.title': string;
  'about.terms': string;
  'about.privacy': string;

  // Avatar
  'avatar.upload': string;
  'avatar.tap': string;
  'avatar.formats': string;
  'avatar.reset': string;
  'avatar.crop': string;
  'avatar.different': string;
  'avatar.enjoy': string;

  // Language
  'language.title': string;
  'language.subtitle': string;
};

const en: TranslationKeys = {
  back: 'Back',
  loading: 'Loading...',
  error: 'Error',
  search: 'Search...',

  'home.title': 'Your Home',
  'home.subtitle': 'Natural Planet',
  'home.chat': 'Chat',
  'home.meditation': 'Meditation',
  'home.letters': 'letters',
  'home.getTodayLetter': "Get Today's Letter",
  'home.generating': 'Generating...',
  'home.letterCardTitle': 'The Letter of Another Planet',
  'home.noLetters': 'No letters yet. Get your first one!',

  'onboarding.welcome': 'Hi, I am a Ego >',

  'auth.login': 'Login',
  'auth.signIn': 'Sign In',
  'auth.signUp': 'Sign Up',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.confirmPassword': 'Confirm Password',
  'auth.name': 'Name',
  'auth.noAccount': "Don't have an account?",
  'auth.hasAccount': 'Already have an account?',
  'auth.forgotPassword': 'Forgot password?',
  'auth.loggingIn': 'LOGGING IN...',
  'auth.signingUp': 'SIGNING UP...',
  'auth.signInWith': 'Sign In with',
  'auth.fillAll': 'Please fill in all fields',
  'auth.passwordMismatch': 'Passwords do not match',
  'auth.passwordTooShort': 'Password must be at least 6 characters',

  'chat.title': 'Love ego AI',
  'chat.aiName': 'Love ego AI',
  'chat.me': 'Me',
  'chat.placeholder': 'Type a message...',
  'chat.meditation': 'Meditation',
  'chat.changeMind': 'Change Mind',
  'chat.generateAudio': 'Generate Meditation Audio',
  'chat.audioReady': 'Your meditation is ready. Press play to begin.',
  'chat.audioGenerating': "I'm generating a meditation audio for you. Please wait about 15 seconds...",
  'chat.audioFailed': 'Sorry, meditation generation failed. Please try again later.',

  'letters.title': 'The LETTER of\nanother planet',
  'letters.signature': 'Love Ego',
  'letters.from': 'FROM NATURAL PLANET',
  'letters.notFound': 'Letter not found',

  'meditation.title': 'Meditation for you',
  'meditation.empty': 'No meditation yet. Go to chat and try it!',

  'profile.title': 'Profile',
  'profile.vip': 'Planet VIP',
  'profile.account': 'Account',
  'profile.changePassword': 'Change Password',
  'profile.helpFeedback': 'Help & Feedback',
  'profile.about': 'About Love ego',
  'profile.language': 'Language',
  'profile.logout': 'Log Out',

  'account.title': 'Account Settings',
  'account.email': 'Email',
  'account.phone': 'Phone',
  'account.wechat': 'WeChat',
  'account.bound': 'Bound',
  'account.changePassword': 'Change Password',
  'account.logoutAll': 'Log Out All Devices',
  'account.deleteAccount': 'Delete Account',

  'about.title': 'About Love ego',
  'about.terms': 'Terms of Service',
  'about.privacy': 'Privacy Policy',

  'avatar.upload': 'Upload your avatar',
  'avatar.tap': 'Tap to upload',
  'avatar.formats': 'JPG, PNG or GIF',
  'avatar.reset': 'Reset',
  'avatar.crop': 'Crop',
  'avatar.different': 'Upload Different Photo',
  'avatar.enjoy': 'Enjoy',

  'language.title': 'Choose Language',
  'language.subtitle': 'Select your preferred language',
};

const zh: TranslationKeys = {
  back: '返回',
  loading: '加载中...',
  error: '错误',
  search: '搜索...',

  'home.title': 'Your Home',
  'home.subtitle': 'Natural Planet',
  'home.chat': '聊天',
  'home.meditation': '冥想',
  'home.letters': '信件',
  'home.getTodayLetter': '获取今日信件',
  'home.generating': '生成中...',
  'home.letterCardTitle': '来自另一个星球的信',
  'home.noLetters': '还没有信件，获取你的第一封吧！',

  'onboarding.welcome': 'Hi, I am a Ego >',

  'auth.login': '登录',
  'auth.signIn': '登录',
  'auth.signUp': '注册',
  'auth.email': '邮箱',
  'auth.password': '密码',
  'auth.confirmPassword': '确认密码',
  'auth.name': '姓名',
  'auth.noAccount': '没有账号？',
  'auth.hasAccount': '已有账号？',
  'auth.forgotPassword': '忘记密码？',
  'auth.loggingIn': '登录中...',
  'auth.signingUp': '注册中...',
  'auth.signInWith': '使用以下方式登录',
  'auth.fillAll': '请填写所有字段',
  'auth.passwordMismatch': '两次密码不一致',
  'auth.passwordTooShort': '密码至少6个字符',

  'chat.title': 'Love ego AI',
  'chat.aiName': 'Love ego AI',
  'chat.me': '我',
  'chat.placeholder': '输入消息...',
  'chat.meditation': '冥想',
  'chat.changeMind': '转念',
  'chat.generateAudio': '生成冥想音频',
  'chat.audioReady': '冥想音频已就绪，点击播放开始。',
  'chat.audioGenerating': '正在为你生成冥想音频，请稍候约15秒...',
  'chat.audioFailed': '抱歉，冥想音频生成失败，请稍后重试。',

  'letters.title': '来自\n另一个星球的信',
  'letters.signature': 'Love Ego',
  'letters.from': '来自自然星球',
  'letters.notFound': '信件未找到',

  'meditation.title': '为你冥想',
  'meditation.empty': '还没有冥想记录，去聊天页面试试吧！',

  'profile.title': '个人中心',
  'profile.vip': '星球会员VIP',
  'profile.account': '账号',
  'profile.changePassword': '更改密码',
  'profile.helpFeedback': '帮助与反馈',
  'profile.about': '关于 Love ego',
  'profile.language': '语言',
  'profile.logout': '退出登录',

  'account.title': '账号管理',
  'account.email': '电子邮箱',
  'account.phone': '手机号',
  'account.wechat': '微信号',
  'account.bound': '已绑定',
  'account.changePassword': '更改密码',
  'account.logoutAll': '登出所有设备',
  'account.deleteAccount': '注销账号',

  'about.title': '关于 Love ego',
  'about.terms': '用户协议',
  'about.privacy': '隐私政策',

  'avatar.upload': '上传头像',
  'avatar.tap': '点击上传',
  'avatar.formats': 'JPG、PNG 或 GIF',
  'avatar.reset': '重置',
  'avatar.crop': '裁剪',
  'avatar.different': '换一张照片',
  'avatar.enjoy': '完成',

  'language.title': '选择语言',
  'language.subtitle': '选择你偏好的语言',
};

const ja: TranslationKeys = {
  back: '戻る',
  loading: '読み込み中...',
  error: 'エラー',
  search: '検索...',

  'home.title': 'Your Home',
  'home.subtitle': 'Natural Planet',
  'home.chat': 'チャット',
  'home.meditation': '瞑想',
  'home.letters': 'レター',
  'home.getTodayLetter': '今日のレターを取得',
  'home.generating': '生成中...',
  'home.letterCardTitle': '別の惑星からの手紙',
  'home.noLetters': 'まだレターがありません。最初の一通を受け取りましょう！',

  'onboarding.welcome': 'Hi, I am a Ego >',

  'auth.login': 'ログイン',
  'auth.signIn': 'サインイン',
  'auth.signUp': 'サインアップ',
  'auth.email': 'メール',
  'auth.password': 'パスワード',
  'auth.confirmPassword': 'パスワード確認',
  'auth.name': '名前',
  'auth.noAccount': 'アカウントをお持ちでないですか？',
  'auth.hasAccount': 'すでにアカウントをお持ちですか？',
  'auth.forgotPassword': 'パスワードをお忘れですか？',
  'auth.loggingIn': 'ログイン中...',
  'auth.signingUp': '登録中...',
  'auth.signInWith': '他の方法でログイン',
  'auth.fillAll': 'すべての項目を入力してください',
  'auth.passwordMismatch': 'パスワードが一致しません',
  'auth.passwordTooShort': 'パスワードは6文字以上にしてください',

  'chat.title': 'Love ego AI',
  'chat.aiName': 'Love ego AI',
  'chat.me': '私',
  'chat.placeholder': 'メッセージを入力...',
  'chat.meditation': '瞑想',
  'chat.changeMind': 'チェンジマインド',
  'chat.generateAudio': '瞑想オーディオを生成',
  'chat.audioReady': '瞑想の準備ができました。再生を押してください。',
  'chat.audioGenerating': '瞑想オーディオを生成しています。約15秒お待ちください...',
  'chat.audioFailed': '申し訳ありません。瞑想の生成に失敗しました。後でもう一度お試しください。',

  'letters.title': '別の惑星\nからの手紙',
  'letters.signature': 'Love Ego',
  'letters.from': 'ナチュラルプラネットより',
  'letters.notFound': 'レターが見つかりません',

  'meditation.title': 'あなたのための瞑想',
  'meditation.empty': 'まだ瞑想がありません。チャットで試してみましょう！',

  'profile.title': 'プロフィール',
  'profile.vip': 'プラネットVIP',
  'profile.account': 'アカウント',
  'profile.changePassword': 'パスワード変更',
  'profile.helpFeedback': 'ヘルプ＆フィードバック',
  'profile.about': 'Love egoについて',
  'profile.language': '言語',
  'profile.logout': 'ログアウト',

  'account.title': 'アカウント設定',
  'account.email': 'メールアドレス',
  'account.phone': '電話番号',
  'account.wechat': 'WeChat',
  'account.bound': '連携済み',
  'account.changePassword': 'パスワード変更',
  'account.logoutAll': '全デバイスからログアウト',
  'account.deleteAccount': 'アカウント削除',

  'about.title': 'Love egoについて',
  'about.terms': '利用規約',
  'about.privacy': 'プライバシーポリシー',

  'avatar.upload': 'アバターをアップロード',
  'avatar.tap': 'タップしてアップロード',
  'avatar.formats': 'JPG、PNG、GIF',
  'avatar.reset': 'リセット',
  'avatar.crop': 'クロップ',
  'avatar.different': '別の写真をアップロード',
  'avatar.enjoy': '完了',

  'language.title': '言語を選択',
  'language.subtitle': 'お好みの言語を選んでください',
};

const ko: TranslationKeys = {
  back: '뒤로',
  loading: '로딩 중...',
  error: '오류',
  search: '검색...',

  'home.title': 'Your Home',
  'home.subtitle': 'Natural Planet',
  'home.chat': '채팅',
  'home.meditation': '명상',
  'home.letters': '편지',
  'home.getTodayLetter': '오늘의 편지 받기',
  'home.generating': '생성 중...',
  'home.letterCardTitle': '다른 행성에서 온 편지',
  'home.noLetters': '아직 편지가 없습니다. 첫 번째 편지를 받아보세요!',

  'onboarding.welcome': 'Hi, I am a Ego >',

  'auth.login': '로그인',
  'auth.signIn': '로그인',
  'auth.signUp': '회원가입',
  'auth.email': '이메일',
  'auth.password': '비밀번호',
  'auth.confirmPassword': '비밀번호 확인',
  'auth.name': '이름',
  'auth.noAccount': '계정이 없으신가요?',
  'auth.hasAccount': '이미 계정이 있으신가요?',
  'auth.forgotPassword': '비밀번호를 잊으셨나요?',
  'auth.loggingIn': '로그인 중...',
  'auth.signingUp': '가입 중...',
  'auth.signInWith': '다른 방법으로 로그인',
  'auth.fillAll': '모든 항목을 입력해 주세요',
  'auth.passwordMismatch': '비밀번호가 일치하지 않습니다',
  'auth.passwordTooShort': '비밀번호는 6자 이상이어야 합니다',

  'chat.title': 'Love ego AI',
  'chat.aiName': 'Love ego AI',
  'chat.me': '나',
  'chat.placeholder': '메시지를 입력하세요...',
  'chat.meditation': '명상',
  'chat.changeMind': '마음 전환',
  'chat.generateAudio': '명상 오디오 생성',
  'chat.audioReady': '명상이 준비되었습니다. 재생을 눌러 시작하세요.',
  'chat.audioGenerating': '명상 오디오를 생성하고 있습니다. 약 15초만 기다려 주세요...',
  'chat.audioFailed': '죄송합니다. 명상 생성에 실패했습니다. 나중에 다시 시도해 주세요.',

  'letters.title': '다른 행성에서\n온 편지',
  'letters.signature': 'Love Ego',
  'letters.from': '자연 행성에서',
  'letters.notFound': '편지를 찾을 수 없습니다',

  'meditation.title': '당신을 위한 명상',
  'meditation.empty': '아직 명상이 없습니다. 채팅에서 시도해 보세요!',

  'profile.title': '프로필',
  'profile.vip': '플래닛 VIP',
  'profile.account': '계정',
  'profile.changePassword': '비밀번호 변경',
  'profile.helpFeedback': '도움말 및 피드백',
  'profile.about': 'Love ego 소개',
  'profile.language': '언어',
  'profile.logout': '로그아웃',

  'account.title': '계정 설정',
  'account.email': '이메일',
  'account.phone': '전화번호',
  'account.wechat': 'WeChat',
  'account.bound': '연동됨',
  'account.changePassword': '비밀번호 변경',
  'account.logoutAll': '모든 기기에서 로그아웃',
  'account.deleteAccount': '계정 삭제',

  'about.title': 'Love ego 소개',
  'about.terms': '이용약관',
  'about.privacy': '개인정보 처리방침',

  'avatar.upload': '아바타 업로드',
  'avatar.tap': '탭하여 업로드',
  'avatar.formats': 'JPG, PNG 또는 GIF',
  'avatar.reset': '초기화',
  'avatar.crop': '자르기',
  'avatar.different': '다른 사진 업로드',
  'avatar.enjoy': '완료',

  'language.title': '언어 선택',
  'language.subtitle': '선호하는 언어를 선택하세요',
};

export const translations: Record<Language, TranslationKeys> = { en, zh, ja, ko };
