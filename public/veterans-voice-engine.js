/**
 * Veterans Companion - Voice Chat Engine
 *
 * Full voice conversation using ElevenLabs Conversational AI SDK.
 * Designed to be rendered inside a container element.
 */

window.VeteransVoiceEngine = (function() {
    'use strict';

    const AGENT_ID = 'agent_5101kcj7251heaztvnmz2hbjk1ra';

    const CONFIG = {
        brandColors: {
            primary: '#06b6d4',      // Cyan (matching veterans landing page)
            primaryLight: '#14b8a6', // Teal
            primaryDark: '#0891b2',
            text: '#1e293b',
            textLight: '#64748b',
            white: '#ffffff'
        }
    };

    // State
    let conversation = null;
    let currentStatus = 'disconnected';
    let currentMode = 'listening';
    let animationId = null;
    let container = null;
    let onCloseCallback = null;
    let lastAnimationTime = 0;
    const ANIMATION_INTERVAL = 120;

    function showIdleState() {
        const content = container.querySelector('.voice-engine-content');
        if (!content) return;

        content.innerHTML = `
            <div class="voice-engine-visualizer voice-engine-idle-state">
                <div class="voice-engine-orb">
                    <div class="voice-preloader">
                        <div class="voice-preloader__ring">
                            <div class="voice-preloader__sector">G</div><div class="voice-preloader__sector">O</div><div class="voice-preloader__sector">D</div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector">B</div><div class="voice-preloader__sector">L</div><div class="voice-preloader__sector">E</div><div class="voice-preloader__sector">S</div><div class="voice-preloader__sector">S</div>
                            <div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div>
                        </div>
                        <div class="voice-preloader__ring">
                            <div class="voice-preloader__sector">A</div><div class="voice-preloader__sector">M</div><div class="voice-preloader__sector">E</div><div class="voice-preloader__sector">R</div><div class="voice-preloader__sector">I</div><div class="voice-preloader__sector">C</div><div class="voice-preloader__sector">A</div>
                            <div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div>
                        </div>
                    </div>
                </div>
            </div>
            <p class="voice-engine-status">Chat with your Veteran Companion</p>
            <div class="voice-engine-controls">
                <button class="voice-engine-btn primary" id="voice-start-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                    Start Conversation
                </button>
            </div>
            <div class="voice-engine-features">
                <span class="voice-feature-item">
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Private
                </span>
                <span class="voice-feature-item">
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Hands-Free
                </span>
                <span class="voice-feature-item">
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Always Here
                </span>
            </div>
        `;

        const startBtn = container.querySelector('#voice-start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', startConversation);
        }
    }

    function showConnectingState() {
        const content = container.querySelector('.voice-engine-content');
        if (!content) return;

        content.innerHTML = `
            <div class="voice-engine-connecting">
                <div class="voice-engine-spinner"></div>
                <p class="voice-engine-status">Connecting...</p>
            </div>
        `;
    }

    function showActiveState() {
        const content = container.querySelector('.voice-engine-content');
        if (!content) return;

        content.innerHTML = `
            <div class="voice-engine-visualizer">
                <div class="voice-engine-orb listening" id="voice-orb">
                    <div class="voice-preloader">
                        <div class="voice-preloader__ring">
                            <div class="voice-preloader__sector">G</div><div class="voice-preloader__sector">O</div><div class="voice-preloader__sector">D</div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector">B</div><div class="voice-preloader__sector">L</div><div class="voice-preloader__sector">E</div><div class="voice-preloader__sector">S</div><div class="voice-preloader__sector">S</div>
                            <div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div>
                        </div>
                        <div class="voice-preloader__ring">
                            <div class="voice-preloader__sector">A</div><div class="voice-preloader__sector">M</div><div class="voice-preloader__sector">E</div><div class="voice-preloader__sector">R</div><div class="voice-preloader__sector">I</div><div class="voice-preloader__sector">C</div><div class="voice-preloader__sector">A</div>
                            <div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="voice-engine-bars" id="voice-bars">
                ${Array(9).fill('<div class="voice-engine-bar"></div>').join('')}
            </div>
            <p class="voice-engine-status" id="voice-status-text">Listening...</p>
            <div class="voice-engine-transcript" id="voice-transcript"></div>
            <div class="voice-engine-controls">
                <button class="voice-engine-btn secondary" id="voice-end-btn">
                    End Conversation
                </button>
            </div>
        `;

        const endBtn = container.querySelector('#voice-end-btn');
        if (endBtn) {
            endBtn.addEventListener('click', endConversation);
        }

        startAudioVisualization();
    }

    function showErrorState(message) {
        const content = container.querySelector('.voice-engine-content');
        if (!content) return;

        content.innerHTML = `
            <div class="voice-engine-visualizer">
                <div class="voice-engine-orb">
                    <div class="voice-preloader">
                        <div class="voice-preloader__ring">
                            <div class="voice-preloader__sector">G</div><div class="voice-preloader__sector">O</div><div class="voice-preloader__sector">D</div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector">B</div><div class="voice-preloader__sector">L</div><div class="voice-preloader__sector">E</div><div class="voice-preloader__sector">S</div><div class="voice-preloader__sector">S</div>
                            <div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div>
                        </div>
                        <div class="voice-preloader__ring">
                            <div class="voice-preloader__sector">A</div><div class="voice-preloader__sector">M</div><div class="voice-preloader__sector">E</div><div class="voice-preloader__sector">R</div><div class="voice-preloader__sector">I</div><div class="voice-preloader__sector">C</div><div class="voice-preloader__sector">A</div>
                            <div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div><div class="voice-preloader__sector"></div>
                        </div>
                    </div>
                </div>
            </div>
            <p class="voice-engine-error">${message}</p>
            <div class="voice-engine-controls">
                <button class="voice-engine-btn primary" id="voice-retry-btn">
                    Try Again
                </button>
            </div>
        `;

        const retryBtn = container.querySelector('#voice-retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', startConversation);
        }
    }

    function updateStatus(status) {
        const statusEl = container.querySelector('#voice-status-text');
        if (statusEl) {
            statusEl.textContent = status;
        }
    }

    function updateTranscript(text, isUser = false) {
        const transcriptEl = container.querySelector('#voice-transcript');
        if (transcriptEl) {
            const prefix = isUser ? 'You: ' : 'Companion: ';
            transcriptEl.innerHTML = `<strong>${prefix}</strong>${text}`;
            transcriptEl.scrollTop = transcriptEl.scrollHeight;
        }
    }

    function updateMode(mode) {
        currentMode = mode;
        const orb = container.querySelector('#voice-orb');
        const statusEl = container.querySelector('#voice-status-text');

        if (orb) {
            orb.classList.remove('listening', 'speaking');
            orb.classList.add(mode);
        }

        if (statusEl) {
            statusEl.textContent = mode === 'speaking' ? 'Companion is speaking...' : 'Listening...';
        }
    }

    function startAudioVisualization() {
        const bars = container.querySelectorAll('.voice-engine-bar');
        if (bars.length === 0) return;

        function animate(timestamp) {
            if (timestamp - lastAnimationTime >= ANIMATION_INTERVAL) {
                bars.forEach((bar, i) => {
                    const height = currentMode === 'speaking'
                        ? 12 + Math.random() * 8
                        : 8 + Math.random() * 12;
                    bar.style.height = `${height}px`;
                });
                lastAnimationTime = timestamp;
            }
            animationId = requestAnimationFrame(animate);
        }

        animate(0);
    }

    function stopAudioVisualization() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    function waitForSDK(timeout = 5000) {
        return new Promise((resolve, reject) => {
            if (window.Conversation) {
                resolve();
                return;
            }

            const startTime = Date.now();

            const checkSDK = () => {
                if (window.Conversation) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Voice SDK failed to load. Please refresh the page.'));
                } else {
                    setTimeout(checkSDK, 100);
                }
            };

            checkSDK();
        });
    }

    async function startConversation() {
        showConnectingState();

        try {
            await waitForSDK();

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Microphone access requires HTTPS. Please access this page via HTTPS or localhost.');
            }

            await navigator.mediaDevices.getUserMedia({ audio: true });

            conversation = await window.Conversation.startSession({
                agentId: AGENT_ID,
                onConnect: () => {
                    console.log('Veterans Voice Engine: Connected');
                    currentStatus = 'connected';
                    showActiveState();
                },
                onDisconnect: () => {
                    console.log('Veterans Voice Engine: Disconnected');
                    currentStatus = 'disconnected';
                    stopAudioVisualization();
                    showIdleState();
                    conversation = null;
                },
                onMessage: (message) => {
                    console.log('Veterans Voice Engine: Message', message);
                    if (message.message) {
                        const isUser = message.source === 'user';
                        updateTranscript(message.message, isUser);
                    }
                },
                onError: (error) => {
                    console.error('Veterans Voice Engine: Error', error);
                    showErrorState('Connection error. Please try again.');
                    conversation = null;
                },
                onModeChange: (mode) => {
                    console.log('Veterans Voice Engine: Mode changed to', mode.mode);
                    updateMode(mode.mode);
                }
            });

        } catch (error) {
            console.error('Veterans Voice Engine: Start error', error);

            let errorMessage = 'Could not start conversation.';
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            showErrorState(errorMessage);
        }
    }

    async function endConversation() {
        stopAudioVisualization();

        if (conversation) {
            try {
                await conversation.endSession();
            } catch (e) {
                console.error('Error ending session:', e);
            }
            conversation = null;
        }

        currentStatus = 'disconnected';
        showIdleState();
    }

    // Public API
    return {
        init: function(containerEl, onClose) {
            container = containerEl;
            onCloseCallback = onClose;

            container.innerHTML = `
                <div class="voice-engine-content"></div>
                <p class="voice-engine-disclaimer">
                    Not a therapist or emergency service. For crisis support, call 988 and press 1.<br>
                    <span style="font-size: 10px; opacity: 0.7;">Veterans Companion Pilot</span>
                </p>
            `;

            showIdleState();
            console.log('Veterans Voice Engine initialized');
        },

        destroy: function() {
            stopAudioVisualization();

            if (conversation) {
                try {
                    conversation.endSession();
                } catch (e) {
                    console.error('Error ending session on destroy:', e);
                }
                conversation = null;
            }

            if (container) {
                container.innerHTML = '';
            }

            currentStatus = 'disconnected';
            console.log('Veterans Voice Engine destroyed');
        },

        getStyles: function() {
            return `
                .voice-engine-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 24px;
                    background: #f1f5f9;
                    overflow-y: auto;
                }

                .voice-engine-visualizer {
                    margin-bottom: 20px;
                }

                .voice-engine-idle-state {
                    margin-top: 80px !important;
                }

                .voice-engine-idle-state .voice-engine-orb {
                    width: 150px !important;
                    height: 150px !important;
                }

                .voice-engine-idle-state .voice-preloader {
                    width: 125px !important;
                    height: 63px !important;
                    perspective: 200px !important;
                }

                .voice-engine-idle-state .voice-preloader__ring {
                    height: 20px !important;
                    width: 11px !important;
                }

                .voice-engine-idle-state .voice-preloader__sector {
                    font-size: 13px !important;
                }

                .voice-engine-idle-state ~ .voice-engine-status,
                .voice-engine-content > p.voice-engine-status {
                    font-size: 18px !important;
                    margin: 24px 0 !important;
                    font-weight: 600 !important;
                }

                .voice-engine-content:has(.voice-engine-idle-state) .voice-engine-controls {
                    margin-top: 20px !important;
                    padding-top: 0 !important;
                }

                .voice-engine-orb {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, ${CONFIG.brandColors.primary} 0%, ${CONFIG.brandColors.primaryLight} 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.1s ease;
                    box-shadow:
                        0 4px 20px rgba(6, 182, 212, 0.3),
                        0 0 0 4px rgba(6, 182, 212, 0.2),
                        0 0 20px 8px rgba(6, 182, 212, 0.15);
                }

                .voice-engine-orb::before {
                    content: '';
                    position: absolute;
                    inset: -8px;
                    border-radius: 50%;
                    background: transparent;
                    border: 2px solid rgba(6, 182, 212, 0.3);
                    box-shadow:
                        0 0 20px rgba(6, 182, 212, 0.4),
                        inset 0 0 20px rgba(6, 182, 212, 0.2);
                    animation: orbGlow 3s ease-in-out infinite;
                }

                @keyframes orbGlow {
                    0%, 100% {
                        opacity: 0.6;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                }

                .voice-engine-orb.speaking {
                }

                .voice-engine-orb.listening {
                    animation: voiceEngineListen 1.5s ease-in-out infinite;
                }

                @keyframes voiceEngineSpeak {
                    0% { transform: scale(1); }
                    100% { transform: scale(1); }
                }

                @keyframes voiceEngineListen {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow:
                            0 4px 20px rgba(6, 182, 212, 0.3),
                            0 0 0 4px rgba(6, 182, 212, 0.2),
                            0 0 20px 8px rgba(6, 182, 212, 0.15);
                    }
                    50% {
                        transform: scale(1.02);
                        box-shadow:
                            0 4px 25px rgba(6, 182, 212, 0.4),
                            0 0 0 6px rgba(6, 182, 212, 0.3),
                            0 0 30px 12px rgba(6, 182, 212, 0.25);
                    }
                }

                .voice-engine-bars {
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    gap: 4px;
                    height: 34px;
                    min-height: 34px;
                    max-height: 34px;
                    margin: 16px 0;
                    flex-shrink: 0;
                }

                .voice-engine-bar {
                    width: 4px;
                    height: 8px;
                    background: ${CONFIG.brandColors.primary};
                    border-radius: 2px;
                    transition: height 0.15s ease-out;
                    flex-shrink: 0;
                }

                .voice-engine-status {
                    font-size: 15px;
                    color: ${CONFIG.brandColors.primary};
                    font-weight: 500;
                    margin: 12px 0;
                    text-align: center;
                }

                .voice-engine-transcript {
                    font-size: 14px;
                    color: ${CONFIG.brandColors.textLight};
                    margin: 12px 0 20px 0;
                    min-height: 60px;
                    max-height: 140px;
                    overflow-y: auto;
                    line-height: 1.5;
                    padding: 12px;
                    background: white;
                    border-radius: 12px;
                    width: 100%;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    flex-shrink: 0;
                }

                .voice-engine-transcript:empty::before {
                    content: 'I\\'m here with you. What\\'s going on today?';
                    color: #94a3b8;
                    font-style: italic;
                }

                .voice-engine-controls {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    margin-top: 0;
                    padding-top: 0;
                    padding-bottom: 24px;
                    flex-shrink: 0;
                }

                .voice-engine-content:has(.voice-engine-idle-state) .voice-engine-controls {
                    margin-top: 0 !important;
                    padding-top: 0 !important;
                }

                .voice-engine-btn {
                    padding: 13px 28px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .voice-engine-btn.primary {
                    background: linear-gradient(135deg, ${CONFIG.brandColors.primary} 0%, ${CONFIG.brandColors.primaryLight} 100%);
                    color: ${CONFIG.brandColors.white};
                }

                .voice-engine-btn.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
                }

                .voice-engine-btn.secondary {
                    background: #e2e8f0;
                    color: ${CONFIG.brandColors.text};
                }

                .voice-engine-btn.secondary:hover {
                    background: #cbd5e0;
                }

                .voice-engine-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none !important;
                }

                .voice-engine-connecting {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }

                .voice-engine-spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid #e2e8f0;
                    border-top-color: ${CONFIG.brandColors.primary};
                    border-radius: 50%;
                    animation: voiceEngineSpin 1s linear infinite;
                }

                @keyframes voiceEngineSpin {
                    to { transform: rotate(360deg); }
                }

                .voice-engine-error {
                    color: #ef4444;
                    font-size: 14px;
                    text-align: center;
                    margin: 16px 0;
                }

                .voice-engine-disclaimer {
                    padding: 12px 16px;
                    text-align: center;
                    font-size: 11px;
                    line-height: 1.6;
                    color: #64748b;
                    background: white;
                    margin: 0;
                    border-top: 1px solid #e2e8f0;
                }

                .voice-engine-disclaimer a {
                    color: ${CONFIG.brandColors.primary};
                    font-weight: 600;
                }

                .voice-engine-disclaimer a:hover {
                    opacity: 0.8;
                }

                .voice-engine-features {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    margin-top: 16px;
                    margin-bottom: auto;
                    padding: 0 16px;
                }

                .voice-feature-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 11px;
                    color: #475569;
                    font-weight: 500;
                }

                .voice-feature-item svg {
                    color: #10b981;
                    flex-shrink: 0;
                    width: 11px;
                    height: 11px;
                }

                /* White Thinking Animation for Voice Orb */
                .voice-preloader {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 100px;
                    height: 50px;
                    perspective: 180px;
                    animation: voicePreloaderTiltSpin 16s linear infinite;
                    transform-style: preserve-3d;
                }

                .voice-preloader__ring {
                    animation: voicePreloaderSpin 8s linear infinite;
                    transform-style: preserve-3d;
                    position: relative;
                    height: 15px;
                    width: 8px;
                }

                .voice-preloader__sector {
                    font-weight: 700;
                    font-size: 10px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    text-align: center;
                    color: ${CONFIG.brandColors.white};
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    transform: translateZ(26px);
                    line-height: 1;
                }

                .voice-preloader__sector:empty::before {
                    background: linear-gradient(transparent 45%, ${CONFIG.brandColors.white} 45% 55%, transparent 55%);
                    content: "";
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }

                /* Sector rotations */
                .voice-preloader__sector:nth-child(1) { transform: rotateY(0deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(2) { transform: rotateY(15deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(3) { transform: rotateY(30deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(4) { transform: rotateY(45deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(5) { transform: rotateY(60deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(6) { transform: rotateY(75deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(7) { transform: rotateY(90deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(8) { transform: rotateY(105deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(9) { transform: rotateY(120deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(10) { transform: rotateY(135deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(11) { transform: rotateY(150deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(12) { transform: rotateY(165deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(13) { transform: rotateY(180deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(14) { transform: rotateY(195deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(15) { transform: rotateY(210deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(16) { transform: rotateY(225deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(17) { transform: rotateY(240deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(18) { transform: rotateY(255deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(19) { transform: rotateY(270deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(20) { transform: rotateY(285deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(21) { transform: rotateY(300deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(22) { transform: rotateY(315deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(23) { transform: rotateY(330deg) translateZ(26px); }
                .voice-preloader__sector:nth-child(24) { transform: rotateY(345deg) translateZ(26px); }

                @keyframes voicePreloaderTiltSpin {
                    from { transform: rotateY(0) rotateX(30deg); }
                    to { transform: rotateY(1turn) rotateX(30deg); }
                }

                @keyframes voicePreloaderSpin {
                    from { transform: rotateY(0); }
                    to { transform: rotateY(1turn); }
                }

                /* Idle state sector overrides for larger 3D depth */
                .voice-engine-idle-state .voice-preloader__sector:nth-child(1) { transform: rotateY(0deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(2) { transform: rotateY(15deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(3) { transform: rotateY(30deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(4) { transform: rotateY(45deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(5) { transform: rotateY(60deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(6) { transform: rotateY(75deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(7) { transform: rotateY(90deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(8) { transform: rotateY(105deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(9) { transform: rotateY(120deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(10) { transform: rotateY(135deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(11) { transform: rotateY(150deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(12) { transform: rotateY(165deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(13) { transform: rotateY(180deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(14) { transform: rotateY(195deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(15) { transform: rotateY(210deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(16) { transform: rotateY(225deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(17) { transform: rotateY(240deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(18) { transform: rotateY(255deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(19) { transform: rotateY(270deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(20) { transform: rotateY(285deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(21) { transform: rotateY(300deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(22) { transform: rotateY(315deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(23) { transform: rotateY(330deg) translateZ(32px) !important; }
                .voice-engine-idle-state .voice-preloader__sector:nth-child(24) { transform: rotateY(345deg) translateZ(32px) !important; }
            `;
        }
    };
})();
