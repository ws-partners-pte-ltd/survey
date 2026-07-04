        // config.js が読み込まれていない場合の「エラー表示用」の汎用フォールバック
        const ERROR_CONFIG = {
            PROJECT_ID: "ERROR_NO_CONFIG",
            TOP_HEADING: "System Error",
            TOP_DESCRIPTION: "設定ファイル (config.js) が読み込めません。\nファイルが存在しているか確認してください。",
            QUESTIONS: [
                { id: 'error', type: 'text', question: '設定ファイルが読み込めませんでした。管理者に連絡してください。', placeholder: '入力できません' }
            ]
        };
        const CONFIG = typeof WSP_CONFIG !== 'undefined' ? WSP_CONFIG : ERROR_CONFIG;
        const { useState, useEffect, useRef } = React;
        const QUESTIONS = CONFIG.QUESTIONS;
        const ChevronRight = ({ className }) => (
            <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        );
        function App() {
            const [currentStep, setCurrentStep] = useState(-1);
            const [answers, setAnswers] = useState({});
            const [isAnimating, setIsAnimating] = useState(false);
            const [isSubmitting, setIsSubmitting] = useState(false);
            const [showOrientation, setShowOrientation] = useState(false);
            const [showProfile, setShowProfile] = useState(false);
            const [showIntro, setShowIntro] = useState(false);
            const [profile, setProfile] = useState({ company: (typeof CONFIG.COMPANY === 'string' ? CONFIG.COMPANY : ''), dept: '', title: '', lastName: '', firstName: '' });
            const handleNext = (force = false) => {
                if (isAnimating) return;
                if (force !== true && currentStep >= 0 && currentStep < QUESTIONS.length) {
                    const qId = QUESTIONS[currentStep].id;
                    const val = answers[qId];
                    if (!QUESTIONS[currentStep].optional) {
                        if (val === undefined || val === null) return;
                        if (typeof val === 'string' && !val.trim()) return;
                        if (Array.isArray(val) && val.length === 0) return;
                        if (typeof val === 'object' && !Array.isArray(val)) {
                            if (!val.current || !val.ideal) return;
                        }
                    }
                }
                setIsAnimating(true);
                setTimeout(() => {
                    setCurrentStep(prev => prev + 1);
                    setIsAnimating(false);
                }, 600);
            };
            const handleAnswer = (questionId, value) => {
                setAnswers(prev => ({ ...prev, [questionId]: value }));
                const q = QUESTIONS.find(q => q.id === questionId);
                if (q && (q.type === 'choice' || q.type === 'scale')) {
                    setTimeout(() => handleNext(true), 500);
                }
            };
            const handleMultiToggle = (questionId, value) => {
                setAnswers(prev => {
                    const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
                    const exists = current.includes(value);
                    return {
                        ...prev,
                        [questionId]: exists ? current.filter(v => v !== value) : [...current, value]
                    };
                });
                // 複数選択：自動進行しない。NEXTボタンで進む
            };
            const handleLevelSelect = (questionId, kind, value) => {
                setAnswers(prev => {
                    const obj = (prev[questionId] && typeof prev[questionId] === 'object' && !Array.isArray(prev[questionId])) ? prev[questionId] : {};
                    return { ...prev, [questionId]: { ...obj, [kind]: value } };
                });
                // 二重選択：自動進行しない。両方選んでNEXTボタンで進む
            };
            const handleSubmit = async () => {
                setIsSubmitting(true);
                const URL = "https://script.google.com/macros/s/AKfycbz7H155CDdhRkAhZ0p-gzgAhadvQdIdPV6rD8poBL3ZiTuLzzDBcwsbaFiP4ut3j_4/exec";
                const formattedAnswers = {
                    "会社名": profile.company || "",
                    "部署": profile.dept || "",
                    "役職": profile.title || "",
                    "姓": profile.lastName || "",
                    "名": profile.firstName || "",
                    "日時": new Date().toLocaleString('ja-JP')
                };
                QUESTIONS.forEach(q => {
                    let headerText = q.question;
                    if (q.type === 'scale') {
                        headerText += ` (1:${q.minLabel} - ${q.scaleMax}:${q.maxLabel})`;
                    }
                    let value = answers[q.id];
                    if (Array.isArray(value)) {
                        value = value.join(' | ');
                    } else if (value && typeof value === 'object') {
                        value = `現状: ${value.current || '(未選択)'}　／　3年後の理想: ${value.ideal || '(未選択)'}`;
                    }
                    formattedAnswers[headerText] = value || "";
                });
                const payload = {
                    projectId: CONFIG.PROJECT_ID,
                    surveyKind: CONFIG.SURVEY_KIND || "Individual",
                    answers: formattedAnswers
                };
                try {
                    await fetch(URL, {
                        method: "POST",
                        mode: "no-cors",
                        cache: "no-cache",
                        headers: { "Content-Type": "text/plain" },
                        body: JSON.stringify(payload)
                    });
                    setTimeout(() => handleNext(), 500);
                } catch (e) {
                    console.error("Fetch Error:", e);
                    alert("送信中にネットワークエラーが発生しました。");
                } finally {
                    setIsSubmitting(false);
                }
            };
            const renderStart = () => (
                <div className={`transition-all duration-1000 transform ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-6 flex-1 text-center`}>
                    <h1 className="text-[4.5rem] sm:text-[7rem] md:text-[9.5rem] lg:text-[12rem] font-light tracking-tighter mb-4 leading-none">
                        <span className="text-gradient block">WSP Radar</span>
                    </h1>
                    <h2 className={`text-base sm:text-lg md:text-2xl font-light tracking-[0.2em] md:tracking-[0.3em] mb-12 md:mb-16 opacity-90 ${CONFIG === ERROR_CONFIG ? 'text-red-400 font-bold' : 'text-art-text'}`}>
                        {CONFIG.TOP_HEADING}
                    </h2>
                    <p
                        style={{ textShadow: 'none' }}
                        className={`max-w-2xl mx-auto font-light leading-[2.2] tracking-widest text-sm md:text-lg mb-16 text-center ${CONFIG === ERROR_CONFIG ? 'text-red-500' : 'text-gray-600'}`}>
                        {CONFIG.TOP_DESCRIPTION.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}<br className="hidden md:block" />
                            </React.Fragment>
                        ))}
                    </p>
                    {CONFIG !== ERROR_CONFIG && (
                        <button onClick={() => { if (isAnimating) return; setIsAnimating(true); setTimeout(() => { setShowIntro(true); setIsAnimating(false); }, 600); }} className="group flex items-center justify-center gap-4 border border-art-accentYellow text-art-accentYellow px-14 py-4 uppercase tracking-[0.3em] text-sm md:text-base transition-all duration-700 hover:bg-art-accentYellow hover:text-art-bg hover:scale-105">
                            START SURVEY
                        </button>
                    )}
                </div>
            );
            const renderOrientation = () => (
                <div className={`transition-all duration-700 ease-in-out transform ${isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'} w-full max-w-3xl mx-auto px-6 sm:px-10 flex-1 flex flex-col justify-center`}>
                    <div className="w-full">
                        <span className="text-art-accentPeach text-xs uppercase mb-2 tracking-widest text-center md:text-left block">How to Answer</span>
                        <h2 className="text-xl md:text-2xl font-normal text-art-text mb-4 md:mb-5 leading-snug tracking-wide">このサーベイの回答方法</h2>
                        <p className="text-sm md:text-base text-art-muted leading-relaxed mb-5">
                            各設問について、日頃の実感に最も近いものを
                            <span className="text-art-accentYellow">5段階</span>
                            （1：全くそう思わない 〜 5：非常にそう思う）から1つお選びください。
                            <span className="text-art-text font-medium">正解・不正解はありません。</span>
                        </p>
                        <div className="border border-art-border/60 px-4 md:px-6 py-4 md:py-5 mb-5">
                            <div className="text-[10px] tracking-widest uppercase text-art-muted/70 mb-3">例：「新しいやり方を試すのが好きだ」の場合</div>
                            <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
                                <span className="text-[10px] text-art-muted uppercase tracking-widest">そう思わない</span>
                                <div className="flex gap-1.5 md:gap-2">
                                    {[1,2,3,4,5].map(v => (
                                        <span key={v} className={`w-7 h-7 md:w-9 md:h-9 rounded-full border flex items-center justify-center text-xs ${v===4 ? 'bg-art-accentPeach border-art-accentPeach text-white font-bold' : 'border-art-border text-art-muted'}`}>{v}</span>
                                    ))}
                                </div>
                                <span className="text-[10px] text-art-muted uppercase tracking-widest">そう思う</span>
                            </div>
                            <div className="text-[10px] text-art-muted/70 text-center mt-2">↑「ややそう思う」なら 4 を選択</div>
                        </div>
                        <p className="text-sm md:text-base text-art-muted leading-relaxed mb-2">
                            本サーベイは2つの層を見ます ─ <span className="text-art-accentYellow">あなたの強み</span> と、その強みを解き放つ／天井にしている <span className="text-art-accentPeach">無自覚な「当たり前」</span>。
                        </p>
                        <p className="text-xs md:text-sm text-art-muted/80 italic mb-6">※ 深く悩まず、最初に思い浮かんだ感覚でお選びください。</p>
                        <div className="flex justify-end">
                            <button onClick={() => { if (isAnimating) return; setIsAnimating(true); setTimeout(() => { setShowOrientation(false); setCurrentStep(0); setIsAnimating(false); }, 600); }} className="px-10 py-3 border border-art-accentYellow text-art-accentYellow hover:bg-art-accentYellow hover:text-white transition-all uppercase tracking-widest text-sm">
                                回答を始める
                            </button>
                        </div>
                    </div>
                </div>
            );
            const renderIntro = () => (
                <div className={`transition-all duration-700 ease-in-out transform ${isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'} w-full max-w-2xl mx-auto px-6 sm:px-10 flex-1 flex flex-col justify-center`}>
                    <div className="w-full text-center md:text-left">
                        <span className="text-art-accentPeach text-xs uppercase mb-3 tracking-widest block">Before you begin</span>
                        <h2 className="text-xl md:text-2xl font-normal text-art-text mb-6 leading-snug tracking-wide">はじめにお読みください</h2>
                        <p className="text-sm md:text-base text-art-text leading-[2] mb-8">
                            このサーベイは、あなたを評価・査定するためのものではありません。<br/>
                            あなたの強みを見つけ、その強みをさらに伸ばすためのヒントをフィードバックすることが目的です。<br/>
                            正解・不正解はありません。どうか、正直に、ありのままの感覚でお答えください。
                        </p>
                        <div className="flex justify-end">
                            <button onClick={() => { if (isAnimating) return; setIsAnimating(true); setTimeout(() => { setShowIntro(false); setShowProfile(true); setIsAnimating(false); }, 600); }} className="px-10 py-3 border border-art-accentYellow text-art-accentYellow hover:bg-art-accentYellow hover:text-white transition-all uppercase tracking-widest text-sm">次へ</button>
                        </div>
                    </div>
                </div>
            );
            const profileField = (label, key, required, readOnly) => (
                <div className="mb-4">
                    <label className="block text-xs uppercase tracking-widest text-art-muted mb-1">{label}{required && <span className="text-art-accentPeach"> *</span>}</label>
                    <input type="text" value={profile[key]} readOnly={readOnly}
                        onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                        className={`w-full bg-transparent border-b ${readOnly ? 'border-art-border/40 text-art-muted' : 'border-art-border focus:border-art-accentPeach'} pt-1 pb-2 text-sm md:text-base outline-none transition-colors`} />
                </div>
            );
            const renderProfile = () => {
                const companyLocked = !!(typeof CONFIG.COMPANY === 'string' && CONFIG.COMPANY);
                const ready = (profile.company || '').trim() && (profile.dept || '').trim() && (profile.lastName || '').trim() && (profile.firstName || '').trim();
                return (
                <div className={`transition-all duration-700 ease-in-out transform ${isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'} w-full max-w-2xl mx-auto px-6 sm:px-10 flex-1 flex flex-col justify-center`}>
                    <div className="w-full">
                        <span className="text-art-accentPeach text-xs uppercase mb-2 tracking-widest text-center md:text-left block">Profile</span>
                        <h2 className="text-xl md:text-2xl font-normal text-art-text mb-2 leading-snug tracking-wide">あなたについて教えてください</h2>
                        <p className="text-sm text-art-muted leading-relaxed mb-6"><span className="text-art-accentPeach">*</span>は必須項目です。</p>
                        {profileField('会社名', 'company', true, companyLocked)}
                        {profileField('部署', 'dept', true, false)}
                        {profileField('役職', 'title', false, false)}
                        <div className="flex gap-4">
                            <div className="flex-1">{profileField('姓', 'lastName', true, false)}</div>
                            <div className="flex-1">{profileField('名', 'firstName', true, false)}</div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => { if (isAnimating || !ready) return; setIsAnimating(true); setTimeout(() => { setShowProfile(false); setShowOrientation(true); setIsAnimating(false); }, 600); }} disabled={!ready} className="px-10 py-3 border border-art-accentYellow text-art-accentYellow hover:bg-art-accentYellow hover:text-white transition-all disabled:opacity-20 uppercase tracking-widest text-sm">回答へ進む</button>
                        </div>
                    </div>
                </div>
                );
            };
            const renderQuestion = (q, i) => (
                <div className={`transition-all duration-700 ease-in-out transform ${isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'} w-full max-w-3xl mx-auto px-6 sm:px-10 flex-1 flex flex-col justify-center`}>
                    <div className="w-full">
                        {/* QUESTION 番号 + 全体数 */}
                        <div className="flex items-baseline gap-2 mb-2 justify-center md:justify-start">
                            <span className="text-art-accentPeach text-xs uppercase tracking-widest">Question {String(i+1).padStart(2,'0')}</span>
                            <span className="text-art-muted/70 text-[10px] uppercase tracking-widest">／ {String(QUESTIONS.length).padStart(2,'0')}</span>
                        </div>
                        {/* プログレスバー */}
                        <div className="w-full h-[3px] bg-art-border/30 mb-3 md:mb-4 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-art-accentYellow via-art-accentPeach to-art-accentGreen transition-all duration-700 ease-out"
                                style={{ width: `${Math.round(((i+1) / QUESTIONS.length) * 100)}%` }}
                            ></div>
                        </div>
                        <h2 className="text-base md:text-xl font-light text-art-text mb-4 md:mb-6 leading-snug tracking-wide text-center md:text-left">{q.question}</h2>

                        {q.type === 'choice' && (
                            <div className="space-y-1.5 md:space-y-2">
                                {q.options.map((opt, idx) => (
                                    <button key={idx} onClick={() => handleAnswer(q.id, opt.label)} className={`w-full text-left px-3 md:px-4 py-2 md:py-2.5 border text-xs md:text-sm leading-snug transition-all ${answers[q.id] === opt.label ? 'border-art-accentPeach bg-art-accentPeach/10 text-art-accentPeach' : 'border-art-border hover:border-art-accentYellow/50'}`}>{opt.label}</button>
                                ))}
                            </div>
                        )}
                        {q.type === 'levels' && (
                            <div className="w-full">
                                {/* 救済文言 */}
                                <p className="text-[10px] md:text-xs text-art-muted/70 italic mb-2 text-center md:text-left">
                                    ※完全に当てはまる選択肢がない場合は、感覚に最も近いものをお選びください。
                                </p>
                                {/* ヘッダー: 現状 / 3年後 */}
                                <div className="flex items-center justify-end gap-3 md:gap-4 mb-2 text-[10px] tracking-widest uppercase">
                                    <span className="w-10 md:w-12 text-center text-art-accentYellow font-bold">現状</span>
                                    <span className="w-10 md:w-12 text-center text-art-accentPeach font-bold">3年後</span>
                                </div>
                                {/* ２カラム：左軸ラベル列 ＋ 選択肢列 */}
                                <div className="flex gap-2 md:gap-3 items-stretch">
                                    {/* 左軸ラベル列：1 ↑ {left} ─ {right} ↓ 5 */}
                                    {q.axis && (
                                        <div className="flex flex-col w-16 md:w-24 flex-shrink-0 text-center relative">
                                            {/* 上端: 1 + 左ラベル（選択肢1に対応） */}
                                            <div className="flex flex-col items-center justify-center min-h-[44px] md:min-h-[52px]">
                                                <span className="text-art-accentYellow text-xs md:text-sm font-bold leading-none">1 ↑</span>
                                                <span className="text-art-text text-[9px] md:text-[11px] leading-tight mt-1 px-0.5">{q.axis.left}</span>
                                            </div>
                                            {/* 中央: 縦の軸線 */}
                                            <div className="flex-1 flex items-center justify-center min-h-[100px]">
                                                <div className="w-px h-full bg-gradient-to-b from-art-accentYellow/40 via-art-border to-art-accentPeach/40"></div>
                                            </div>
                                            {/* 下端: 5 + 右ラベル（選択肢5に対応） */}
                                            <div className="flex flex-col items-center justify-center min-h-[44px] md:min-h-[52px]">
                                                <span className="text-art-text text-[9px] md:text-[11px] leading-tight px-0.5">{q.axis.right}</span>
                                                <span className="text-art-accentPeach text-xs md:text-sm font-bold leading-none mt-1">↓ 5</span>
                                            </div>
                                        </div>
                                    )}
                                    {/* 選択肢列 */}
                                    <div className="flex-1 space-y-1.5 md:space-y-2">
                                        {q.options.map((opt, idx) => {
                                            const ans = (answers[q.id] && typeof answers[q.id] === 'object' && !Array.isArray(answers[q.id])) ? answers[q.id] : {};
                                            const isCurrent = ans.current === opt.label;
                                            const isIdeal = ans.ideal === opt.label;
                                            const highlight = isCurrent || isIdeal;
                                            return (
                                                <div key={idx} className={`flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 md:py-2.5 border text-sm md:text-base leading-relaxed transition-all ${highlight ? 'border-art-accentPeach/60' : 'border-art-border'}`}>
                                                    <span className="flex-1 text-art-text">{opt.label}</span>
                                                    <button onClick={() => handleLevelSelect(q.id, 'current', opt.label)} className={`w-10 md:w-12 h-6 md:h-7 flex-shrink-0 flex items-center justify-center border rounded-full text-[10px] transition-all ${isCurrent ? 'bg-art-accentYellow border-art-accentYellow text-art-bg font-bold' : 'border-art-border hover:border-art-accentYellow'}`}>{isCurrent ? '■' : '○'}</button>
                                                    <button onClick={() => handleLevelSelect(q.id, 'ideal', opt.label)} className={`w-10 md:w-12 h-6 md:h-7 flex-shrink-0 flex items-center justify-center border rounded-full text-[10px] transition-all ${isIdeal ? 'bg-art-accentPeach border-art-accentPeach text-art-bg font-bold' : 'border-art-border hover:border-art-accentPeach'}`}>{isIdeal ? '◆' : '○'}</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {CONFIG !== ERROR_CONFIG && (
                                    <div className="mt-4 md:mt-5 flex justify-end">
                                        <button onClick={() => handleNext(true)} disabled={!(answers[q.id] && typeof answers[q.id] === 'object' && answers[q.id].current && answers[q.id].ideal)} className="px-8 py-2.5 border border-art-text text-art-text hover:bg-art-text hover:text-art-bg transition-all disabled:opacity-20 uppercase tracking-widest text-sm">NEXT</button>
                                    </div>
                                )}
                            </div>
                        )}
                        {q.type === 'multiChoice' && (
                            <div className="w-full">
                                <div className="space-y-1.5 md:space-y-2">
                                    {q.options.map((opt, idx) => {
                                        const selected = Array.isArray(answers[q.id]) && answers[q.id].includes(opt.label);
                                        return (
                                            <button key={idx} onClick={() => handleMultiToggle(q.id, opt.label)} className={`w-full text-left px-3 md:px-4 py-2 md:py-2.5 border text-xs md:text-sm leading-snug transition-all flex items-start gap-2 ${selected ? 'border-art-accentPeach bg-art-accentPeach/10 text-art-accentPeach' : 'border-art-border hover:border-art-accentYellow/50'}`}>
                                                <span className="inline-block flex-shrink-0 w-4 text-center">{selected ? '◼' : '◻'}</span>
                                                <span className="flex-1">{opt.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {CONFIG !== ERROR_CONFIG && (
                                    <div className="mt-3 md:mt-4 flex justify-end">
                                        <button onClick={() => handleNext(true)} disabled={!(Array.isArray(answers[q.id]) && answers[q.id].length > 0)} className="px-8 py-2.5 border border-art-text text-art-text hover:bg-art-text hover:text-art-bg transition-all disabled:opacity-20 uppercase tracking-widest text-sm">NEXT</button>
                                    </div>
                                )}
                            </div>
                        )}
                        {q.type === 'scale' && (
                            <div className="flex justify-between items-center gap-4 py-4 max-w-2xl mx-auto">
                                <span className="text-xs opacity-50 uppercase tracking-widest text-art-muted">{q.minLabel}</span>
                                <div className="flex gap-2 md:gap-3">
                                    {[1,2,3,4,5].map(v => (
                                        <button key={v} onClick={() => handleAnswer(q.id, v)} className={`w-10 h-10 md:w-14 md:h-14 rounded-full border text-lg font-light transition-all ${answers[q.id] === v ? 'border-art-accentPeach bg-art-accentPeach text-art-bg' : 'border-art-border hover:border-art-accentYellow'}`}>{v}</button>
                                    ))}
                                </div>
                                <span className="text-xs opacity-50 uppercase tracking-widest text-art-muted">{q.maxLabel}</span>
                            </div>
                        )}
                        {q.type === 'text' && (
                            <div className="w-full">
                                <textarea
                                    autoFocus
                                    ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                    value={answers[q.id] || ''}
                                    onChange={e => {
                                        setAnswers({...answers, [q.id]: e.target.value});
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                    rows="1"
                                    className="w-full bg-transparent border-b border-art-border pt-1 pb-2 text-xs md:text-sm leading-relaxed outline-none focus:border-art-accentPeach transition-colors resize-none overflow-hidden placeholder:text-art-muted/60"
                                    placeholder={q.placeholder}
                                    disabled={CONFIG === ERROR_CONFIG}
                                />
                                {CONFIG !== ERROR_CONFIG && (
                                    <div className="mt-3 md:mt-4 flex justify-end">
                                        <button onClick={handleNext} disabled={!q.optional && !answers[q.id]?.trim()} className="px-8 py-2.5 border border-art-text text-art-text hover:bg-art-text hover:text-art-bg transition-all disabled:opacity-20 uppercase tracking-widest text-sm">{q.optional && !answers[q.id]?.trim() ? 'スキップ' : 'NEXT'}</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
            return (
                <div className="min-h-screen relative flex flex-col w-full">
                    <div className={`radar-container ${(currentStep === -1 && !showOrientation) ? 'top-mode' : 'survey-mode'}`}>
                        <div className="radar-sweep"></div>
                        <div className="radar-pulse-ring"></div>
                    </div>

                    <main className="flex-1 flex flex-col justify-center relative z-10 min-h-screen w-full py-10 md:py-12">
                        {currentStep === -1 && !showOrientation && !showProfile && !showIntro && renderStart()}
                        {currentStep === -1 && showIntro && renderIntro()}
                        {currentStep === -1 && showOrientation && renderOrientation()}
                        {currentStep === -1 && showProfile && renderProfile()}
                        {currentStep >= 0 && currentStep < QUESTIONS.length && renderQuestion(QUESTIONS[currentStep], currentStep)}

                        {currentStep === QUESTIONS.length && (
                            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                                <h2 className="text-4xl md:text-6xl font-light text-gradient mb-8 tracking-tighter uppercase">Ready to send</h2>
                                <p className="text-art-muted mb-12 max-w-md leading-relaxed">ご回答ありがとうございました。<br/>下のボタンを押して、提出を完了してください。</p>
                                <div className="flex flex-col items-center gap-8">
                                    <button onClick={handleSubmit} disabled={isSubmitting} className="px-16 py-5 border border-art-accentPeach text-art-accentPeach hover:bg-art-accentPeach hover:text-white transition-all text-xl tracking-widest uppercase disabled:opacity-50">
                                        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                                    </button>
                                    <button
                                        onClick={() => { setIsAnimating(true); setTimeout(() => { setCurrentStep(prev => prev - 1); setIsAnimating(false); }, 600); }}
                                        disabled={isSubmitting}
                                        className="text-art-muted hover:text-art-text tracking-widest text-sm transition-colors border-b border-transparent hover:border-art-text pb-1 uppercase"
                                    >
                                        回答を修正する (RETURN)
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep > QUESTIONS.length && (
                            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                                <h2 className="text-5xl md:text-8xl font-light text-gradient mb-8 tracking-tighter">ありがとうございました</h2>
                                <p className="text-art-muted text-lg tracking-widest leading-relaxed">貴重なご意見をいただき、心より感謝申し上げます。<br/>集計後、AIによる分析を行い、組織変革に活用させていただきます。</p>
                            </div>
                        )}
                    </main>
                    {currentStep === -1 && !showOrientation && (
                        <div className="fixed bottom-12 right-12 md:bottom-16 md:right-16 text-right z-40 pointer-events-none">
                            <div className="text-art-text font-light tracking-[0.2em] text-sm md:text-base opacity-70">
                                WS PARTNERS PTE LTD
                            </div>
                        </div>
                    )}
                    {CONFIG !== ERROR_CONFIG && currentStep >= 0 && currentStep < QUESTIONS.length && (
                        <div className="fixed bottom-8 right-8 md:bottom-12 md:right-16 flex gap-4 z-50">
                            <button onClick={() => { if(currentStep > 0) { setIsAnimating(true); setTimeout(() => { setCurrentStep(prev => prev - 1); setIsAnimating(false); }, 600); } }}
                                disabled={currentStep === 0} className="p-4 border border-art-border hover:border-art-accentPeach disabled:opacity-20 rounded-full text-art-text transition-all"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                            <button onClick={() => handleNext()} className="p-4 border border-art-border hover:border-art-accentPeach rounded-full text-art-text transition-all"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    )}
                    {CONFIG !== ERROR_CONFIG && currentStep >= 0 && currentStep < QUESTIONS.length && (
                        <div className="fixed bottom-0 left-0 w-full h-1 bg-white/5 z-50">
                            <div className="h-full bg-gradient-art transition-all duration-700" style={{ width: `${(currentStep / QUESTIONS.length) * 100}%` }}></div>
                        </div>
                    )}
                </div>
            );
        }
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    