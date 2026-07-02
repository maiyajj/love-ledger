App.register({
  id: 'cost-calc',
  title: '成本计算',
  icon: '📊',

  render(page) {
    const defaults = this._load();

    page.insertAdjacentHTML('beforeend', `
      <div class="card">
        <div class="card-title">输入参数</div>
        <div class="form-group">
          <span class="form-label">当前持仓数量</span>
          <div>
            <input class="form-input" id="cc-shares" type="number" step="any" inputmode="decimal" value="${defaults.shares}">
            <span class="form-unit">股</span>
          </div>
        </div>
        <div class="form-group">
          <span class="form-label">当前平均成本</span>
          <div>
            <input class="form-input" id="cc-cost" type="number" step="any" inputmode="decimal" value="${defaults.cost}">
            <span class="form-unit">元</span>
          </div>
        </div>
        <div class="form-group">
          <span class="form-label">目标成本</span>
          <div>
            <input class="form-input" id="cc-target" type="number" step="any" inputmode="decimal" value="${defaults.target}">
            <span class="form-unit">元</span>
          </div>
        </div>
        <div class="form-group">
          <span class="form-label">当前市价</span>
          <div>
            <input class="form-input" id="cc-price" type="number" step="any" inputmode="decimal" value="${defaults.price}">
            <span class="form-unit">元</span>
          </div>
        </div>
        <div class="error-msg" id="cc-error"></div>
      </div>

      <div class="card">
        <div class="card-title">计算结果</div>
        <div class="result-row">
          <span class="result-label">需追加金额</span>
          <span class="result-value highlight" id="cc-amount">—</span>
        </div>
        <div class="result-row">
          <span class="result-label">需追加股数</span>
          <span class="result-value" id="cc-new-shares">—</span>
        </div>
        <div class="result-row">
          <span class="result-label">追加后总市值</span>
          <span class="result-value" id="cc-total-value">—</span>
        </div>
        <div class="result-row">
          <span class="result-label">追加后总数量</span>
          <span class="result-value" id="cc-total-shares">—</span>
        </div>
        <div class="result-row">
          <span class="result-label">追加后平均成本</span>
          <span class="result-value" id="cc-new-avg">—</span>
        </div>
      </div>
    `);

    const ids = ['cc-shares', 'cc-cost', 'cc-target', 'cc-price'];
    ids.forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        this._save(page);
        this._calc(page);
      });
    });

    this._calc(page);
  },

  _calc(page) {
    const get = id => parseFloat(document.getElementById(id).value) || 0;
    const n = get('cc-shares');
    const c = get('cc-cost');
    const T = get('cc-target');
    const p = get('cc-price');
    const errEl = document.getElementById('cc-error');

    const fmt = v => v.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const set = (id, v) => { document.getElementById(id).textContent = v; };

    if (n <= 0 || c <= 0 || T <= 0 || p <= 0) {
      errEl.classList.remove('show');
      set('cc-amount', '—');
      set('cc-new-shares', '—');
      set('cc-total-value', '—');
      set('cc-total-shares', '—');
      set('cc-new-avg', '—');
      return;
    }

    if (p >= T) {
      errEl.textContent = `市价 ¥${p} ≥ 目标成本 ¥${T}，无法通过买入拉低均价`;
      errEl.classList.add('show');
      set('cc-amount', '—');
      set('cc-new-shares', '—');
      set('cc-total-value', '—');
      set('cc-total-shares', '—');
      set('cc-new-avg', '—');
      return;
    }

    errEl.classList.remove('show');
    const x = (n * (T - c)) / (1 - T / p);
    const newShares = x / p;
    const totalValue = n * c + x;
    const totalShares = n + newShares;

    set('cc-amount', `¥${fmt(x)}`);
    set('cc-new-shares', `${Math.round(newShares).toLocaleString('zh-CN')} 股`);
    set('cc-total-value', `¥${fmt(totalValue)}`);
    set('cc-total-shares', `${Math.round(totalShares).toLocaleString('zh-CN')} 股`);
    set('cc-new-avg', `¥${fmt(totalValue / totalShares)}`);
  },

  _load() {
    try {
      return JSON.parse(localStorage.getItem('cost-calc') || '{}');
    } catch { return {}; }
    return {};
  },

  _save(page) {
    const get = id => document.getElementById(id)?.value || '';
    localStorage.setItem('cost-calc', JSON.stringify({
      shares: get('cc-shares'),
      cost: get('cc-cost'),
      target: get('cc-target') || '29.8',
      price: get('cc-price')
    }));
  }
});
