/* organization テーマ。index.html にあった tailwind.config をここへ移した（実行時CDNは使わない） */
const path = require('path');
const cfg = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Outfit', '"Noto Sans JP"', 'sans-serif'] },
                    colors: {
                        art: {
                            bg: '#2b2b2b', text: '#f2f2f2', muted: '#9ca3af',
                            border: 'rgba(255, 255, 255, 0.15)',
                            accentYellow: '#e6d099', accentPeach: '#e2b8a3', accentGreen: '#a8b898',
                        }
                    },
                    backgroundImage: { 'gradient-art': 'linear-gradient(to right, #e6d099, #e2b8a3, #a8b898)' }
                }
            }
        };
cfg.content = [path.join(__dirname, 'templates/organization/app.src.jsx'), path.join(__dirname, 'templates/organization/index.html')];
module.exports = cfg;
