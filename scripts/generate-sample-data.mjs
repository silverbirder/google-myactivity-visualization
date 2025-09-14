import fs from 'fs';
import path from 'path';

// Google My Activity データの型に合わせてサンプルデータを生成
function generateSampleActivity(product, index) {
  const baseDate = new Date();
  // 過去5年間のランダムな日時を生成
  const randomDaysAgo = Math.floor(Math.random() * (5 * 365));
  const activityDate = new Date(baseDate.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
  
  // 時刻もランダムに設定
  activityDate.setHours(Math.floor(Math.random() * 24));
  activityDate.setMinutes(Math.floor(Math.random() * 60));
  activityDate.setSeconds(Math.floor(Math.random() * 60));
  
  const timeString = activityDate.toISOString();

  switch (product) {
    case '検索':
      return generateSearchActivity(timeString, index);
    case 'YouTube':
      return generateYouTubeActivity(timeString, index);
    case 'マップ':
      return generateMapsActivity(timeString, index);
    case 'Chrome':
      return generateChromeActivity(timeString, index);
    case 'Gmail':
      return generateGmailActivity(timeString, index);
    case 'Google Play ストア':
      return generatePlayStoreActivity(timeString, index);
    case 'アシスタント':
      return generateAssistantActivity(timeString, index);
    case 'Google ニュース':
      return generateNewsActivity(timeString, index);
    case 'ドライブ':
      return generateDriveActivity(timeString, index);
    default:
      return generateGenericActivity(timeString, index);
  }
}

function generateSearchActivity(time, index) {
  const searchTerms = [
    'javascript tutorial', 'react components', 'typescript best practices', 'nodejs mongodb', 'next.js guide', 'web development', 'css flexbox',
    'git commands', 'api design', 'database optimization', 'python pandas', 'docker tutorial', 'kubernetes basics', 'machine learning', 'aws services',
    'vue.js guide', 'angular tutorial', 'graphql basics', 'restful api', 'microservices pattern', 'frontend frameworks', 'backend development',
    'devops tools', 'cloud computing', 'serverless architecture', 'react hooks', 'typescript generics', 'express middleware', 'jwt authentication',
    'oauth2 flow', 'react native', 'flutter widgets', 'swiftui basics', 'kotlin coroutines', 'go concurrency', 'rust ownership', 'c++ templates',
    'java streams', 'spring boot', 'laravel eloquent', 'django orm', 'flask api', 'ruby on rails', 'elixir phoenix', 'graphql mutation',
    'apollo client', 'redux toolkit', 'mobx state tree', 'rxjs operators', 'webpack config', 'vite build', 'babel transpile', 'eslint rules',
    'prettier format', 'husky hooks', 'github actions', 'circleci config', 'travis ci', 'docker compose', 'k8s deployment', 'helm charts',
    'terraform basics', 'ansible playbook', 'aws lambda', 'gcp cloud run', 'azure functions', 'firebase auth', 'supabase storage', 'netlify deploy',
    'vercel edge', 'heroku dyno', 'digitalocean droplet', 'linode server', 'mongodb atlas', 'postgresql index', 'mysql join', 'sqlite migration',
    'redis pubsub', 'elasticsearch query', 'algolia search', 'meilisearch', 'cypress test', 'playwright e2e', 'jest mock', 'mocha chai',
    'vitest coverage', 'storybook story', 'chromatic review', 'figma plugin', 'adobe xd', 'sketch symbols', 'zeplin handoff', 'notion api',
    'slack bot', 'discord webhook', 'twitter api', 'facebook graph', 'instagram feed', 'youtube data api', 'tiktok trends', 'line messaging',
    'zoom sdk', 'teams integration', 'shopify app', 'stripe payment', 'paypal checkout', 'square pos', 'mercari api', 'rakuten search',
    'yahoo auction', 'amazon product', 'google maps js', 'openstreetmap', 'leaflet marker', 'mapbox gl', 'd3.js chart', 'chartjs bar',
    'echarts pie', 'highcharts line', 'three.js 3d', 'babylon.js', 'webgl shader', 'canvas animation', 'svg path', 'css grid', 'sass mixin',
    'less variables', 'styled components', 'emotion css', 'tailwind utility', 'bootstrap modal', 'foundation grid', 'bulma hero', 'material ui',
    'chakra ui', 'ant design', 'element ui', 'vuetify', 'primevue', 'quasar framework', 'nuxt content', 'gatsby plugin', 'next image',
    'remix loader', 'svelte store', 'solidjs signal', 'alpinejs', 'htmx', 'unocss', 'windicss', 'postcss', 'autoprefixer', 'purgecss',
    'critical css', 'fontawesome icon', 'google fonts', 'typekit', 'webfontloader', 'lighthouse score', 'pagespeed insights', 'web vitals',
    'core web vitals', 'seo audit', 'structured data', 'json ld', 'open graph', 'twitter card', 'sitemap xml', 'robots txt', 'canonical url',
    'hreflang', 'amp page', 'pwa manifest', 'service worker', 'workbox', 'push notification', 'web share', 'clipboard api', 'web speech',
    'webrtc', 'web bluetooth', 'web usb', 'web serial', 'web nfc', 'geolocation api', 'device orientation', 'battery status', 'network info',
    'payment request', 'credential management', 'webauthn', 'fido2', 'otp input', 'captcha solve', 'recaptcha', 'hcaptcha', 'turnstile',
    'cookie consent', 'gdpr compliance', 'csp header', 'xss prevention', 'csrf token', 'cors policy', 'sri hash', 'subresource integrity',
    'referrer policy', 'feature policy', 'permissions api', 'web animation', 'intersection observer', 'mutation observer', 'resize observer',
    'performance observer', 'memory leak', 'event delegation', 'custom event', 'shadow dom', 'web component', 'html template', 'slot element',
    'aria label', 'accessibility audit', 'screen reader', 'tabindex', 'focus trap', 'skip link', 'keyboard nav', 'pointer events', 'touch event',
    'drag and drop', 'clipboard event', 'file upload', 'image optimization', 'video streaming', 'audio context', 'media recorder', 'canvas draw',
    'webgl context', 'offscreen canvas', 'shared worker', 'service worker cache', 'indexeddb', 'localstorage', 'sessionstorage', 'cookie js',
    'jwt decode', 'oauth login', 'saml sso', 'openid connect', 'sso integration', 'ldap auth', 'basic auth', 'digest auth', 'ntlm auth',
    'kerberos', 'tls handshake', 'ssl cert', 'letsencrypt', 'acme challenge', 'dns record', 'domain transfer', 'whois lookup', 'ip geolocation',
    'cdn cache', 'edge function', 'reverse proxy', 'load balancer', 'failover', 'rate limit', 'api gateway', 'graphql resolver', 'rest endpoint',
    'openapi spec', 'swagger ui', 'postman collection', 'insomnia workspace', 'http2', 'http3', 'quic protocol', 'tcp socket', 'udp packet',
    'websocket', 'sse event', 'mqtt broker', 'coap protocol', 'grpc client', 'protobuf schema', 'avro format', 'thrift idl', 'capnproto',
    'msgpack', 'cbor', 'bson', 'parquet', 'orc file', 'feather format', 'arrow table', 'csv import', 'tsv export', 'excel formula', 'google sheets',
    'airtable base', 'notion database', 'trello board', 'asana task', 'jira issue', 'redmine ticket', 'backlog project', 'monday.com', 'clickup',
    'wrike', 'smartsheet', 'basecamp', 'confluence', 'slack channel', 'discord server', 'teams meeting', 'zoom call', 'google meet', 'webex',
    'gotomeeting', 'bluejeans', 'livestorm', 'demio', 'hopin', 'bigmarker', 'remotely', 'whereby', 'jitsi', 'appear.in', '8x8', 'join.me',
    'freeconference', 'uberconference', 'dialpad', 'phone.com', 'grasshopper', 'ringcentral', 'nextiva', 'vonage', 'twilio sms', 'plivo',
    'nexmo', 'bandwidth', 'signalwire', 'telnyx', 'zipwhip', 'textmagic', 'clicksend', 'simpletexting', 'eztexting', 'smsapi', 'smsglobal',
    'infobip', 'telesign', 'sinch', 'kaleyra', 'routee', 'cm.com', 'messente', 'melrose labs', 'esendex', 'firetext', 'intellisoftware',
    'messagebird', 'sms77', 'smsmode', 'smsfactor', 'smsenvoi', 'smscenter', 'smscountry', 'smsc.ru', 'smsc.ua', 'smsc.kz', 'smsc.by',
    'smsc.pl', 'smsc.cz', 'smsc.sk', 'smsc.hu', 'smsc.ro', 'smsc.bg', 'smsc.rs', 'smsc.si', 'smsc.hr', 'smsc.ba', 'smsc.me', 'smsc.al',
    'smsc.mk', 'smsc.md', 'smsc.ee', 'smsc.lv', 'smsc.lt', 'smsc.ge', 'smsc.am', 'smsc.az', 'smsc.tm', 'smsc.kg', 'smsc.tj', 'smsc.uz',
    'smsc.tm', 'smsc.kg', 'smsc.tj', 'smsc.uz', 'smsc.tm', 'smsc.kg', 'smsc.tj', 'smsc.uz', 'smsc.tm', 'smsc.kg', 'smsc.tj', 'smsc.uz'
  ];
  const term = searchTerms[index % searchTerms.length];
  
  return {
    header: "検索", // ワードクラウド用にheaderを"検索"に設定
    title: `${term} を検索しました`,
    titleUrl: `https://www.google.com/search?q=${encodeURIComponent(term)}`, // ワードクラウド用のURL形式
    subtitles: [
      {
        name: "Google",
        url: "https://www.google.com"
      }
    ],
    time: time,
    products: ["Search"],
    activityControls: ["ウェブとアプリのアクティビティ"]
  };
}

function generateYouTubeActivity(time, index) {
  const videoTitles = [
    'React Tutorial for Beginners', 'JavaScript ES6 Features', 
    'Node.js Crash Course', 'CSS Grid Layout Guide', 'TypeScript in 2024',
    'Web Performance Optimization', 'Database Design Principles',
    'API Development Best Practices', 'Python Data Science',
    'Docker for Developers', 'Kubernetes Fundamentals', 'AWS Architecture Patterns',
    'Vue.js Complete Guide', 'Angular Best Practices', 'GraphQL Tutorial',
    'Frontend Testing Strategies', 'Backend Security', 'DevOps Pipeline',
    'Microservices Design', 'Cloud Native Development'
  ];
  
  const channels = [
    'Tech Academy', 'Code Masters', 'Dev Channel', 'Programming Hub',
    'Web Dev Pro', 'Full Stack Guide', 'Tech Tutorials', 'Code School'
  ];
  
  const title = videoTitles[index % videoTitles.length];
  const channel = channels[index % channels.length];
  const videoId = 'sample' + String(index).padStart(3, '0');
  
  return {
    header: "YouTube",
    title: `${title} を視聴しました`,
    titleUrl: `https://www.youtube.com/watch?v=${videoId}`,
    subtitles: [
      {
        name: channel,
        url: "https://www.youtube.com"
      }
    ],
    time: time,
    products: ["YouTube"],
    activityControls: ["YouTube の再生履歴"]
  };
}

function generateMapsActivity(time, index) {
  const locations = [
    { name: '東京駅', lat: 35.681382, lng: 139.766084 },
    { name: '渋谷駅', lat: 35.659518, lng: 139.701334 },
    { name: '新宿駅', lat: 35.689487, lng: 139.691706 },
    { name: '秋葉原駅', lat: 35.729503, lng: 139.801086 },
    { name: '原宿駅', lat: 35.664592, lng: 139.698556 },
    { name: '六本木ヒルズ', lat: 35.670168, lng: 139.740982 },
    { name: '東京スカイツリー', lat: 35.710063, lng: 139.810700 },
    { name: '浅草寺', lat: 35.714765, lng: 139.796617 },
    { name: '明治神宮', lat: 35.676192, lng: 139.699333 },
    { name: '上野公園', lat: 35.715298, lng: 139.773099 }
  ];
  
  const location = locations[index % locations.length];
  
  // url形式をランダムに query=lat,lng か center=lat,lng にする
  const useQuery = Math.random() < 0.5;
  const url = useQuery
    ? `https://maps.google.com/?query=${location.lat},${location.lng}`
    : `https://maps.google.com/?center=${location.lat},${location.lng}`;

  const locationInfos = [
    {
      name: location.name,
      url: url,
      latitude: location.lat,
      longitude: location.lng
    }
  ];

  return {
    header: "マップ（あなたのタイムライン）",
    title: `${location.name}を訪問しました`,
    titleUrl: url,
    subtitles: [
      {
        name: "地図",
        url: "https://maps.google.com"
      }
    ],
    time: time,
    products: ["Maps"],
    activityControls: ["ロケーション履歴"],
    locationInfos: locationInfos
  };
}

function generateChromeActivity(time, index) {
  const websites = [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
    { name: 'dev.to', url: 'https://dev.to' },
    { name: 'Qiita', url: 'https://qiita.com' },
    { name: 'Zenn', url: 'https://zenn.dev' },
    { name: 'Medium', url: 'https://medium.com' },
    { name: 'CodePen', url: 'https://codepen.io' },
    { name: 'JSFiddle', url: 'https://jsfiddle.net' },
    { name: 'npm', url: 'https://www.npmjs.com' }
  ];
  
  const site = websites[index % websites.length];
  
  return {
    header: site.url,
    title: `${site.name} にアクセスしました`,
    titleUrl: site.url,
    time: time,
    products: ["Chrome"],
    activityControls: ["ウェブとアプリのアクティビティ"]
  };
}

function generateGmailActivity(time, index) {
  const emailSubjects = [
    'プロジェクトの進捗について', 'ミーティングの件', '資料の共有',
    '新機能のリリース', 'バグ修正完了のお知らせ', 'レビュー依頼',
    'コードレビューの結果', 'デプロイ完了通知', 'テスト結果報告',
    'システムメンテナンス予定'
  ];
  
  const subject = emailSubjects[index % emailSubjects.length];
  const messageId = 'msg' + String(index).padStart(6, '0');
  
  return {
    header: "mail.google.com",
    title: `${subject} - sample@example.com - Gmail にアクセスしました`,
    titleUrl: `https://mail.google.com/mail/u/0/#inbox/${messageId}`,
    time: time,
    products: ["Gmail"],
    activityControls: ["ウェブとアプリのアクティビティ"]
  };
}

function generatePlayStoreActivity(time, index) {
  const apps = [
    'サンプル開発ツール', 'テスト支援アプリ', 'コードエディタ',
    'デバッグヘルパー', 'プロトタイプツール', 'デザインアプリ',
    'タスク管理ツール', 'ノートアプリ', 'カレンダーアプリ',
    'リマインダーアプリ'
  ];
  
  const app = apps[index % apps.length];
  const packageId = 'com.example.app' + String(index % apps.length);
  
  return {
    header: "Google Play ストア",
    title: `${app} をインストールしました`,
    titleUrl: `https://play.google.com/store/apps/details?id=${packageId}`,
    subtitles: [
      {
        name: "Google Play ストア",
        url: "https://play.google.com"
      }
    ],
    time: time,
    products: ["Google Play ストア"],
    activityControls: ["ウェブとアプリのアクティビティ"]
  };
}

function generateAssistantActivity(time, index) {
  const queries = [
    '今日の天気を教えて', '明日の予定は？', 'アラームを7時にセット',
    'タイマーを10分で開始', '最新のニュースは？', '近くのレストランを探して',
    '音楽を再生して', 'ライトをつけて', '今何時？', '明日の天気は？'
  ];
  
  const query = queries[index % queries.length];
  
  return {
    header: "アシスタント",
    title: `「${query}」と話しかけました`,
    titleUrl: "https://assistant.google.com",
    time: time,
    products: ["アシスタント"],
    activityControls: ["音声とオーディオのアクティビティ"]
  };
}

function generateNewsActivity(time, index) {
  const topics = [
    'テクノロジー', 'ビジネス', 'スポーツ', 'エンターテイメント',
    'サイエンス', '健康', '政治', '経済', '社会', '国際'
  ];
  
  const topic = topics[index % topics.length];
  const articleId = 'article' + String(index).padStart(4, '0');
  
  return {
    header: "Google ニュース",
    title: `${topic}のニュース記事を読みました`,
    titleUrl: `https://news.google.com/articles/${articleId}`,
    subtitles: [
      {
        name: "Google ニュース",
        url: "https://news.google.com"
      }
    ],
    time: time,
    products: ["Google ニュース"],
    activityControls: ["ウェブとアプリのアクティビティ"]
  };
}

function generateDriveActivity(time, index) {
  const fileTypes = [
    'プロジェクト仕様書', 'API設計書', 'テスト計画書', '進捗レポート',
    'デザインガイド', 'ユーザーマニュアル', 'システム構成図', 'データベース設計',
    '要件定義書', 'リリースノート'
  ];
  
  const fileType = fileTypes[index % fileTypes.length];
  const fileId = 'file' + String(index).padStart(6, '0');
  
  return {
    header: "ドライブ",
    title: `${fileType}.pdf を開きました`,
    titleUrl: `https://drive.google.com/file/d/${fileId}/view`,
    time: time,
    products: ["ドライブ"],
    activityControls: ["ウェブとアプリのアクティビティ"]
  };
}

function generateGenericActivity(time, index) {
  return {
    header: "サンプルサービス",
    title: `サンプルアクティビティ ${index + 1}`,
    titleUrl: "https://example.com",
    time: time,
    products: ["Sample"],
    activityControls: ["ウェブとアプリのアクティビティ"]
  };
}

// メイン処理
async function createSampleData() {
  const outputDir = './public';
  
  let allActivities = [];
  const now = new Date();
  const products = [
    { name: '検索', gen: generateSearchActivity },
    { name: 'YouTube', gen: generateYouTubeActivity },
    { name: 'マップ', gen: generateMapsActivity },
    { name: 'Chrome', gen: generateChromeActivity },
    { name: 'Gmail', gen: generateGmailActivity },
    { name: 'Google Play ストア', gen: generatePlayStoreActivity },
    { name: 'アシスタント', gen: generateAssistantActivity },
    { name: 'Google ニュース', gen: generateNewsActivity },
    { name: 'ドライブ', gen: generateDriveActivity }
  ];

  for (const product of products) {
    let globalIndex = 0;
    for (let m = 0; m < 60; m++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
      // 80〜120件のランダムな件数
      const count = 80 + Math.floor(Math.random() * 41);
      for (let i = 0; i < count; i++) {
        const day = 1 + (i % 28);
        const hour = Math.floor(Math.random() * 24);
        const min = Math.floor(Math.random() * 60);
        const sec = Math.floor(Math.random() * 60);
        const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), day, hour, min, sec);
        const timeString = date.toISOString();
        allActivities.push(product.gen(timeString, globalIndex));
        globalIndex++;
      }
    }
  }
  
  // 時間順にソート（新しい順）
  allActivities.sort((a, b) => new Date(b.time) - new Date(a.time));
  
  // JSONファイルとして保存
  const sampleJsonPath = path.join(outputDir, 'large-sample-myactivity.json');
  fs.writeFileSync(sampleJsonPath, JSON.stringify(allActivities, null, 2));
  
  console.log(`Created sample data with ${allActivities.length} activities`);
  console.log(`Saved to: ${sampleJsonPath}`);
  
  return sampleJsonPath;
}

createSampleData().catch(console.error);