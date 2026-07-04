/**
 * 新規サーベイ案件フォルダを生成する（GitHub Pages 構成）。
 *
 * 構成: <service>/<country>/<company>/<year>/{index.html, app.js, config.js}
 *   service = organization（組織最適化サーベイ） | individual（強み解放サーベイ）
 *
 * 使い方（リポジトリ直下で実行）:
 *   node tools/new-engagement.js \
 *     --service organization --country indonesia --company acme --year 2026 \
 *     --company-name "PT ACME Indonesia"
 *
 * 生成後: git add -A && git commit -m "..." && git push  でGitHub Pagesに公開。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');               // リポジトリ直下
const TPL  = path.join(__dirname, 'templates');         // tools/templates/<service>

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const COUNTRY_CODE = { indonesia:'ID', thailand:'TH', vietnam:'VN', singapore:'SG', malaysia:'MY', japan:'JP', philippines:'PH' };
const SERVICES = {
  organization: { kind: 'Organizational', slug: 'ORG' },   // 組織最適化サーベイ
  individual:   { kind: 'Individual',     slug: 'IND' },    // 強み解放サーベイ
};

const service     = (arg('service') || '').toLowerCase();
const country     = (arg('country') || '').toLowerCase();
const company     = (arg('company') || '').toLowerCase();
const year        = arg('year') || String(new Date().getFullYear());
const companyName = arg('company-name') || arg('company') || '';

if (!SERVICES[service] || !country || !company || !companyName) {
  console.error('必須: --service organization|individual --country --company --company-name [--year]');
  process.exit(1);
}
const cc = COUNTRY_CODE[country];
if (!cc) { console.error('未対応の国: ' + country + '（' + Object.keys(COUNTRY_CODE).join('/') + '）'); process.exit(1); }

const srcDir  = path.join(TPL, service);
const destDir = path.join(ROOT, service, country, company, year);
if (fs.existsSync(destDir)) { console.error('既に存在します: ' + path.relative(ROOT, destDir)); process.exit(1); }
fs.mkdirSync(destDir, { recursive: true });

const slug = s => s.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
// PROJECT_ID は「年度を含めない」。同一サービス×企業の回答を、年度をまたいで同じスプレッドシートに
// 蓄積し経年比較できるようにするため（年度はフォルダ／URLでのみ分ける）。
const projectId = `${SERVICES[service].slug}_${slug(company)}_${cc}`;
const KIND = SERVICES[service].kind;

// 共通エンジン（index.html / app.js）はテンプレからそのままコピー
fs.copyFileSync(path.join(srcDir, 'index.html'), path.join(destDir, 'index.html'));
fs.copyFileSync(path.join(srcDir, 'app.js'),     path.join(destDir, 'app.js'));

// config.js はテンプレを読み、PROJECT_ID / SURVEY_KIND / COMPANY を差し替え
let cfg = fs.readFileSync(path.join(srcDir, 'config.js'), 'utf8');
cfg = cfg.replace(/PROJECT_ID:\s*"[^"]*"/, `PROJECT_ID: "${projectId}"`);
if (/SURVEY_KIND:\s*"/.test(cfg)) cfg = cfg.replace(/SURVEY_KIND:\s*"[^"]*"/, `SURVEY_KIND: "${KIND}"`);
else cfg = cfg.replace(/(PROJECT_ID:\s*"[^"]*",)/, `$1\n    SURVEY_KIND: "${KIND}",`);
if (/COMPANY:\s*"/.test(cfg)) cfg = cfg.replace(/COMPANY:\s*"[^"]*"/, `COMPANY: "${companyName}"`);
else cfg = cfg.replace(/(PROJECT_ID:\s*"[^"]*",)/, `$1\n    COMPANY: "${companyName}",`);
fs.writeFileSync(path.join(destDir, 'config.js'), cfg);

const url = `https://survey.ws-partners.com.sg/${service}/${country}/${company}/${year}/`;
console.log('✅ 生成しました');
console.log('  サービス   : ' + service + '（' + (service === 'organization' ? '組織最適化' : '強み解放') + 'サーベイ）');
console.log('  フォルダ   : ' + path.relative(ROOT, destDir).replace(/\\/g, '/') + '/');
console.log('  公開URL    : ' + url);
console.log('  PROJECT_ID : ' + projectId + '（年度を含めない＝経年で同一スプレッドシートに蓄積）');
console.log('  社名       : ' + companyName);
console.log('  → 公開     : git add -A && git commit -m "add ' + service + '/' + country + '/' + company + '/' + year + '" && git push');
