// ===== 好评生成器核心逻辑 =====

(function() {
  'use strict';

  // 当前状态
  let currentPlatform = 'gaode';
  let currentReview = '';
  let counter = 0;
  let qrcodeInstance = null;

  // 维度配置
  const DIMENSIONS = [
    { key: '效果好',     tag: '#入户效果好', label: '效果好' },
    { key: '价格实惠',   tag: '#价格实惠',   label: '价格实惠' },
    { key: '质量过硬',   tag: '#质量过硬',   label: '质量过硬' },
    { key: '款式好看',   tag: '#款式好看',   label: '款式好看' },
    { key: '服务热情',   tag: '#服务热情',   label: '服务热情' },
    { key: '送货快',     tag: '#送货快',     label: '送货快' },
    { key: '安装专业',   tag: '#安装专业',   label: '安装专业' },
    { key: '店铺环境好', tag: '#店铺环境好', label: '店铺环境好' },
    { key: '品牌信誉',   tag: '#品牌信誉',   label: '品牌信誉' },
    { key: '售后无忧',   tag: '#售后无忧',   label: '售后无忧' },
    { key: '自建卖场',   tag: '#自建卖场',   label: '自建卖场优势' },
    { key: '交通便利',   tag: '#交通便利',   label: '交通便利' },
    { key: '品类齐全',   tag: '#品类齐全',   label: '品类齐全' },
    { key: '性价比高',   tag: '#性价比高',   label: '性价比高' },
    { key: '回头客',     tag: '#回头客',     label: '回头客' },
    { key: '老店口碑',   tag: '#老店口碑',   label: '老店口碑' },
    { key: '朋友推荐',   tag: '#朋友推荐',   label: '朋友推荐' }
  ];

  // 平台切换
  function initPlatformBtns() {
    document.querySelectorAll('.platform-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPlatform = btn.dataset.platform;
      });
    });
  }

  // 随机取一条
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // 随机洗牌
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 判断一个字符串末尾是否有标点
  function endsWithPunctuation(str) {
    const lastChar = str.trim().slice(-1);
    return /[，。！？；：、,.!?;:]/.test(lastChar);
  }

  // 确保句子有句末标点（句号/感叹号）
  function ensureEndPunctuation(str) {
    const s = str.trim();
    if (!s) return s;
    const lastChar = s.slice(-1);
    if (/[。！？!?]/.test(lastChar)) return s;
    // 随机选句号或感叹号
    return s + (Math.random() < 0.7 ? '。' : '！');
  }

  // 确保句子有连接标点（逗号，用于句间衔接）
  function ensureComma(str) {
    const s = str.trim();
    if (!s) return s;
    const lastChar = s.slice(-1);
    if (/[，,；;]/.test(lastChar)) return s;
    return s + '，';
  }

  // 加权随机选维度：入户效果权重高，安装权重低
  function pickWeightedDimensions() {
    // 权重配置：入户效果(效果好)权重5，安装权重1，其余权重2
    const weights = {
      '效果好': 5,
      '安装专业': 1,
      '价格实惠': 2, '质量过硬': 2, '款式好看': 2, '服务热情': 2,
      '送货快': 2, '店铺环境好': 2, '品牌信誉': 2, '售后无忧': 2,
      '自建卖场': 2, '交通便利': 2, '品类齐全': 2, '性价比高': 2,
      '回头客': 2, '老店口碑': 2, '朋友推荐': 2
    };

    // 加权随机抽取1-2个维度（70%选2个，30%选1个）
    const count = Math.random() < 0.7 ? 2 : 1;
    const allKeys = DIMENSIONS.map(d => d.key);
    const picked = [];

    for (let i = 0; i < count; i++) {
      // 计算剩余维度的总权重
      const remaining = allKeys.filter(k => !picked.includes(k));
      const totalWeight = remaining.reduce((sum, k) => sum + weights[k], 0);

      // 加权随机选一个
      let rand = Math.random() * totalWeight;
      let chosen = remaining[0];
      for (const k of remaining) {
        rand -= weights[k];
        if (rand <= 0) { chosen = k; break; }
      }
      picked.push(chosen);
    }
    return picked;
  }

  // 生成好评
  function generateReview() {
    const dims = pickWeightedDimensions();

    // 组合好评：开头 + 维度评价 + (安装评价，低概率) + 结尾
    const opening = pickRandom(REVIEW_DATA.openings);
    const dimParts = dims.map(d => pickRandom(REVIEW_DATA.dimensions[d]));

    // 安装评价：仅15%概率出现，且最多一句
    const includeInstall = Math.random() < 0.15;
    const installPart = includeInstall ? pickRandom(REVIEW_DATA.installations) : '';

    const closing = pickRandom(REVIEW_DATA.closings);

    // 组合全文，确保逻辑连贯和标点正确
    let parts = [];

    // 开头：自然引出，逗号衔接
    let op = opening.trim();
    op = ensureComma(op);
    parts.push(op);

    // 维度评价段落
    // 第一段维度：以逗号衔接（后面还有内容），或句号结束
    let d1 = dimParts[0].trim();
    if (dimParts.length > 1 || installPart) {
      d1 = ensureComma(d1);
    } else {
      d1 = ensureEndPunctuation(d1);
    }
    parts.push(d1);

    // 第二段维度（如果有）：逗号衔接或句号结束
    if (dimParts.length > 1) {
      let d2 = dimParts[1].trim();
      if (installPart) {
        d2 = ensureComma(d2);
      } else {
        d2 = ensureEndPunctuation(d2);
      }
      parts.push(d2);
    }

    // 安装评价（如果有）：逗号衔接到结尾
    if (installPart) {
      let ip = installPart.trim();
      ip = ensureComma(ip);
      parts.push(ip);
    }

    // 结尾：以句末标点收束
    let cl = closing.trim();
    cl = ensureEndPunctuation(cl);
    parts.push(cl);

    // 拼接全文
    currentReview = parts.filter(p => p && p.trim()).join('');

    // 生成维度标签用于结果卡片显示
    const tags = dims.map(d => DIMENSIONS.find(dd => dd.key === d).tag);

    // 显示结果
    showResult(currentPlatform, dims, tags, currentReview);
    updateQRCode(currentReview);
    counter++;
    document.getElementById('counter').textContent = counter;
  }

  // 显示结果卡片
  function showResult(platform, dims, tags, content) {
    const card = document.getElementById('result-card');
    card.style.display = 'block';

    const platformNames = { douyin: '抖音', gaode: '高德地图' };
    const platformIcons = { douyin: '\u{1F3B5}', gaode: '\u{1F5FA}' };

    document.getElementById('result-platform').textContent =
      platformIcons[platform] + ' ' + platformNames[platform];

    const dimLabels = dims.map(d => DIMENSIONS.find(dd => dd.key === d).label);
    document.getElementById('result-dimension').textContent = dimLabels.join(' + ');

    document.getElementById('result-content').textContent = content;

    // 滚动到结果卡片
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // 更新二维码
  function updateQRCode(text) {
    const section = document.getElementById('qrcode-section');
    section.style.display = 'block';

    const wrap = document.getElementById('qrcode-wrap');
    wrap.innerHTML = '';

    qrcodeInstance = new QRCode(wrap, {
      text: text,
      width: 160,
      height: 160,
      colorDark: '#8B2500',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.L
    });
  }

  // 复制
  function copyReview() {
    if (!currentReview) return;
    navigator.clipboard.writeText(currentReview).then(() => {
      showToast('已复制到剪贴板！');
    }).catch(() => {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = currentReview;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('已复制到剪贴板！');
    });
  }

  // Toast 提示
  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // 初始化
  function init() {
    initPlatformBtns();

    document.getElementById('btn-generate').addEventListener('click', generateReview);
    document.getElementById('btn-copy').addEventListener('click', copyReview);
    document.getElementById('btn-change').addEventListener('click', generateReview);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
