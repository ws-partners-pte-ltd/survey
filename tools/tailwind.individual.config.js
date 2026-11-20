/* individual テーマ。index.html にあった tailwind.config をここへ移した（実行時CDNは使わない） */
const path = require('path');
const cfg = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Outfit', '"Noto Sans JP"', 'sans-serif'] },
                    colors: {
                        art: {
                            bg: '#ffffff', text: '#1f2937', muted: '#6b7280',
                            border: 'rgba(26, 42, 79, 0.18)',
                            accentYellow: '#c8941f', accentPeach: '#c8714a', accentGreen: '#2a9d8f',
                        }
                    },
                    backgroundImage: { 'gradient-art': 'linear-gradient(to right, #1a2a4f, #466eb3, #2a9d8f)' }
                }
            }
        };
cfg.content = [path.join(__dirname, 'templates/individual/app.src.jsx'), path.join(__dirname, 'templates/individual/index.html')];
module.exports = cfg;
