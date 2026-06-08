// utils/format.js
// 格式化工具

function formatMoney(fen) {
  if (!fen && fen !== 0) return '¥0.00';
  const yuan = (fen / 100).toFixed(2);
  return '¥' + yuan;
}

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatPercent(value) {
  if (value == null) return '--';
  return value + '%';
}

module.exports = { formatMoney, formatDate, formatPercent };
