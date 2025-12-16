/**
 * Vetted - Chat Widget Controller
 *
 * Main widget that manages mode switching between:
 * - Voice Mode: Uses VeteransVoiceEngine (voice chat with ElevenLabs Agent)
 * - Text Mode: Uses VeteransTextEngine (text chat with Claude)
 *
 * Each mode has its own independent session.
 */

(function() {
    'use strict';

    // State
    let isOpen = false;
    let currentMode = 'voice'; // 'text' or 'voice' - default to voice chat
    let stylesInjected = false;

    // Inject all styles (widget + engines)
    function injectStyles() {
        if (stylesInjected) return;

        const styles = document.createElement('style');
        styles.id = 'veterans-chat-styles';
        styles.textContent = `
            /* ======================
               Widget Container
               ====================== */
            #veterans-chat-widget {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }

            /* ======================
               Toggle Button
               ====================== */
            .veterans-widget-button {
                width: 76px;
                height: 76px;
                border-radius: 50%;
                background: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%);
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s, box-shadow 0.2s;
                animation: veteransWidgetPulse 3.5s ease-in-out infinite;
            }

            @keyframes veteransWidgetPulse {
                0%, 100% {
                    transform: translateY(0);
                    box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
                }
                50% {
                    transform: translateY(-6px);
                    box-shadow: 0 10px 35px rgba(6, 182, 212, 0.5);
                }
            }

            .veterans-widget-button:hover {
                animation: none;
                transform: scale(1.08);
                box-shadow: 0 8px 32px rgba(6, 182, 212, 0.6);
            }

            .veterans-widget-button svg {
                width: 34px;
                height: 34px;
                fill: none;
                stroke: white;
                stroke-width: 2;
            }

            /* ======================
               Chat Window
               ====================== */
            .veterans-chat-window {
                position: relative;
                width: 420px;
                height: 680px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: veteransChatSlideIn 0.3s ease-out;
            }

            @keyframes veteransChatSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            /* ======================
               Header
               ====================== */
            .veterans-chat-header {
                padding: 16px;
                background: #020617;
                color: white;
                border-bottom: 1px solid rgba(51, 65, 85, 0.5);
            }

            .veterans-chat-header-top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
            }

            .veterans-chat-header-info h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .veterans-chat-header-info p {
                margin: 4px 0 0 0;
                font-size: 11px;
                opacity: 0.9;
            }

            .veterans-chat-close-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }

            .veterans-chat-close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .veterans-chat-close-btn svg {
                width: 18px;
                height: 18px;
                stroke: white;
                stroke-width: 2;
                fill: none;
            }

            /* ======================
               Mode Toggle
               ====================== */
            .veterans-chat-mode-toggle {
                display: flex;
                background: rgba(51, 65, 85, 0.5);
                border-radius: 8px;
                padding: 3px;
                border: 1px solid rgba(51, 65, 85, 0.5);
            }

            .veterans-chat-mode-btn {
                flex: 1;
                padding: 8px 12px;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                background: transparent;
                color: rgba(255, 255, 255, 0.6);
            }

            .veterans-chat-mode-btn.active {
                background: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%);
                color: white;
                box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);
            }

            .veterans-chat-mode-btn:not(.active):hover {
                color: white;
                background: rgba(51, 65, 85, 0.5);
            }

            .veterans-chat-mode-btn svg {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }

            /* ======================
               Content Container
               ====================== */
            .veterans-chat-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            /* ======================
               Bottom Close Button
               ====================== */
            .veterans-chat-bottom-close {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%);
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s, box-shadow 0.2s;
                z-index: 100000;
            }

            .veterans-chat-bottom-close:hover {
                transform: scale(1.08);
                box-shadow: 0 8px 32px rgba(6, 182, 212, 0.6);
            }

            .veterans-chat-bottom-close svg {
                width: 26px;
                height: 26px;
                stroke: white;
                stroke-width: 2;
                fill: none;
            }

            /* ======================
               Mobile Responsive
               ====================== */
            @media (max-width: 639px) {
                #veterans-chat-widget {
                    position: fixed !important;
                    bottom: 16px !important;
                    right: 16px !important;
                    left: auto !important;
                    top: auto !important;
                    z-index: 99999 !important;
                }

                #veterans-chat-widget:has(.veterans-chat-window) {
                    bottom: auto !important;
                    top: 80px !important;
                    right: 10px !important;
                    left: 10px !important;
                }

                .veterans-chat-window {
                    width: calc(100vw - 20px) !important;
                    max-width: 445px !important;
                    height: calc(100vh - 160px) !important;
                    max-height: 600px !important;
                    min-height: 450px !important;
                    position: relative !important;
                }

                .veterans-widget-button {
                    width: 52px !important;
                    height: 52px !important;
                }

                .veterans-widget-button svg {
                    width: 24px !important;
                    height: 24px !important;
                }

                /* Header - compact */
                .veterans-chat-header {
                    padding: 12px !important;
                }

                .veterans-chat-header-top {
                    margin-bottom: 10px !important;
                }

                .veterans-chat-header-info h3 {
                    font-size: 15px !important;
                    gap: 5px !important;
                }

                .veterans-chat-header-info h3 svg {
                    width: 12px !important;
                    height: 12px !important;
                }

                .veterans-chat-header-info p {
                    font-size: 10px !important;
                    margin-top: 3px !important;
                }

                .veterans-chat-close-btn {
                    width: 30px !important;
                    height: 30px !important;
                    border-radius: 6px !important;
                    flex-shrink: 0 !important;
                }

                .veterans-chat-close-btn svg {
                    width: 16px !important;
                    height: 16px !important;
                }

                /* Mode toggle */
                .veterans-chat-mode-toggle {
                    padding: 3px !important;
                    border-radius: 6px !important;
                }

                .veterans-chat-mode-btn {
                    padding: 7px 12px !important;
                    font-size: 11px !important;
                    gap: 5px !important;
                    border-radius: 5px !important;
                }

                .veterans-chat-mode-btn svg {
                    width: 12px !important;
                    height: 12px !important;
                }

                /* Bottom close button */
                .veterans-chat-bottom-close {
                    width: 52px !important;
                    height: 52px !important;
                    bottom: 16px !important;
                    right: 16px !important;
                }

                .veterans-chat-bottom-close svg {
                    width: 24px !important;
                    height: 24px !important;
                }

                /* Voice engine mobile overrides */
                .voice-engine-content {
                    padding: 16px !important;
                }

                .voice-engine-idle-state {
                    margin-top: 30px !important;
                }

                .voice-engine-idle-state .voice-engine-orb,
                .voice-engine-orb {
                    width: 110px !important;
                    height: 110px !important;
                }

                .voice-engine-idle-state .voice-preloader,
                .voice-preloader {
                    width: 90px !important;
                    height: 45px !important;
                    perspective: 150px !important;
                }

                .voice-engine-idle-state .voice-preloader__ring,
                .voice-preloader__ring {
                    height: 14px !important;
                    width: 8px !important;
                }

                .voice-engine-idle-state .voice-preloader__sector,
                .voice-preloader__sector {
                    font-size: 10px !important;
                }

                .voice-engine-idle-state ~ .voice-engine-status,
                .voice-engine-content > p.voice-engine-status,
                .voice-engine-status {
                    font-size: 15px !important;
                    margin: 16px 0 !important;
                }

                .voice-engine-btn {
                    padding: 12px 22px !important;
                    font-size: 13px !important;
                    border-radius: 8px !important;
                }

                .voice-engine-btn svg {
                    width: 18px !important;
                    height: 18px !important;
                }

                .voice-engine-controls {
                    padding-bottom: 16px !important;
                    margin-top: 12px !important;
                }

                .voice-engine-features {
                    gap: 12px !important;
                    margin-top: 12px !important;
                }

                .voice-feature-item {
                    font-size: 10px !important;
                }

                .voice-feature-item svg {
                    width: 10px !important;
                    height: 10px !important;
                }

                .voice-engine-disclaimer,
                .text-engine-disclaimer {
                    padding: 10px 12px !important;
                    font-size: 10px !important;
                }

                .voice-engine-visualizer {
                    margin-bottom: 12px !important;
                }

                .voice-engine-bars {
                    height: 28px !important;
                    min-height: 28px !important;
                    max-height: 28px !important;
                    margin: 10px 0 !important;
                }

                .voice-engine-transcript {
                    min-height: 50px !important;
                    max-height: 100px !important;
                    margin: 10px 0 16px 0 !important;
                    padding: 10px !important;
                    font-size: 13px !important;
                }
            }

            /* ======================
               Text Engine Styles
               ====================== */
            ${window.VeteransTextEngine ? window.VeteransTextEngine.getStyles() : ''}

            /* ======================
               Voice Engine Styles
               ====================== */
            ${window.VeteransVoiceEngine ? window.VeteransVoiceEngine.getStyles() : ''}
        `;

        document.head.appendChild(styles);
        stylesInjected = true;
    }

    // Render toggle button (closed state)
    function renderToggleButton() {
        return `
            <button class="veterans-widget-button" id="veterans-chat-toggle-btn" title="Talk to Vetted">
                <svg viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
            </button>
        `;
    }

    // Render chat window (open state)
    function renderChatWindow() {
        return `
            <div class="veterans-chat-window">
                <!-- Header -->
                <div class="veterans-chat-header">
                    <div class="veterans-chat-header-top">
                        <div class="veterans-chat-header-info">
                            <h3>
                                Vetted
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                                </svg>
                            </h3>
                            <p>Private support, always available</p>
                        </div>
                        <button class="veterans-chat-close-btn" id="veterans-chat-close-btn">
                            <svg viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Mode Toggle -->
                    <div class="veterans-chat-mode-toggle">
                        <button class="veterans-chat-mode-btn ${currentMode === 'voice' ? 'active' : ''}" id="veterans-voice-mode-btn">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                            </svg>
                            Hands-Free
                        </button>
                        <button class="veterans-chat-mode-btn ${currentMode === 'text' ? 'active' : ''}" id="veterans-text-mode-btn">
                            <svg viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                            </svg>
                            Text Chat
                        </button>
                    </div>
                </div>

                <!-- Content Container (engines render here) -->
                <div class="veterans-chat-content" id="veterans-chat-content"></div>
            </div>

            <!-- Bottom Close Button (outside chat window) -->
            <button class="veterans-chat-bottom-close" id="veterans-chat-bottom-close-btn" title="Close">
                <svg viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
        `;
    }

    // Initialize the current engine
    function initCurrentEngine() {
        const contentContainer = document.getElementById('veterans-chat-content');
        if (!contentContainer) {
            console.error('Content container not found!');
            return;
        }

        console.log('Initializing engine for mode:', currentMode);

        // Destroy any existing engine
        if (window.VeteransTextEngine) {
            window.VeteransTextEngine.destroy();
        }
        if (window.VeteransVoiceEngine) {
            window.VeteransVoiceEngine.destroy();
        }

        // Initialize the appropriate engine
        if (currentMode === 'text') {
            console.log('Loading TEXT engine...');
            if (window.VeteransTextEngine) {
                window.VeteransTextEngine.init(contentContainer, closeWidget);
            } else {
                contentContainer.innerHTML = '<p style="padding: 20px; text-align: center; color: #64748b;">Text engine not loaded. Please refresh the page.</p>';
            }
        } else {
            console.log('Loading VOICE engine...');
            if (window.VeteransVoiceEngine) {
                window.VeteransVoiceEngine.init(contentContainer, closeWidget);
            } else {
                contentContainer.innerHTML = '<p style="padding: 20px; text-align: center; color: #64748b;">Voice engine not loaded. Please refresh the page.</p>';
            }
        }
    }

    // Switch mode
    function switchMode(newMode) {
        if (newMode === currentMode) return;

        currentMode = newMode;

        // Update button states
        const textBtn = document.getElementById('veterans-text-mode-btn');
        const voiceBtn = document.getElementById('veterans-voice-mode-btn');

        if (textBtn && voiceBtn) {
            textBtn.classList.toggle('active', currentMode === 'text');
            voiceBtn.classList.toggle('active', currentMode === 'voice');
        }

        // Re-initialize the engine
        initCurrentEngine();
    }

    // Attach event listeners
    function attachEventListeners() {
        const closeBtn = document.getElementById('veterans-chat-close-btn');
        const bottomCloseBtn = document.getElementById('veterans-chat-bottom-close-btn');
        const textModeBtn = document.getElementById('veterans-text-mode-btn');
        const voiceModeBtn = document.getElementById('veterans-voice-mode-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', closeWidget);
        }

        if (bottomCloseBtn) {
            bottomCloseBtn.addEventListener('click', closeWidget);
        }

        if (textModeBtn) {
            textModeBtn.addEventListener('click', () => switchMode('text'));
        }

        if (voiceModeBtn) {
            voiceModeBtn.addEventListener('click', () => switchMode('voice'));
        }
    }

    // Open widget
    function openWidget(prefilledMessage = null) {
        // If there's a prefilled message, switch to text mode
        if (prefilledMessage) {
            currentMode = 'text';
            console.log('Opening widget in TEXT mode (prefilled message)');
        } else {
            // Explicitly ensure we're in voice mode when opening normally
            currentMode = 'voice';
            console.log('Opening widget in VOICE mode (default)');
        }

        console.log('Current mode before render:', currentMode);
        isOpen = true;
        render();

        // If there's a prefilled message, send it after the engine initializes
        if (prefilledMessage) {
            setTimeout(() => {
                if (window.VeteransTextEngine && window.VeteransTextEngine.sendMessage) {
                    console.log('Auto-sending message:', prefilledMessage);
                    window.VeteransTextEngine.sendMessage(prefilledMessage);
                }
            }, 800);
        }
    }

    // Close widget
    function closeWidget() {
        // Destroy engines before closing
        if (window.VeteransTextEngine) {
            window.VeteransTextEngine.destroy();
        }
        if (window.VeteransVoiceEngine) {
            window.VeteransVoiceEngine.destroy();
        }

        isOpen = false;
        render();
    }

    // Main render function
    function render() {
        const container = document.getElementById('veterans-chat-widget');
        if (!container) return;

        if (isOpen) {
            container.innerHTML = renderChatWindow();
            attachEventListeners();
            initCurrentEngine();
        } else {
            container.innerHTML = renderToggleButton();
            const toggleBtn = document.getElementById('veterans-chat-toggle-btn');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => openWidget());
            }
        }
    }

    // Initialize
    function init() {
        console.log('Veterans Chat Widget initializing...');

        // Create widget container if it doesn't exist
        if (!document.getElementById('veterans-chat-widget')) {
            const widgetContainer = document.createElement('div');
            widgetContainer.id = 'veterans-chat-widget';
            document.body.appendChild(widgetContainer);
        }

        injectStyles();
        render();

        // Listen for custom open chat event
        window.addEventListener('openVeteransChat', (event) => {
            const message = event.detail?.message || null;
            openWidget(message);
        });

        console.log('Veterans Chat Widget initialized');
    }

    // Wait for DOM and engines to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for programmatic control
    window.VeteransChatWidget = {
        open: openWidget,
        close: closeWidget,
        toggle: function() {
            if (isOpen) {
                closeWidget();
            } else {
                openWidget();
            }
        },
        setMode: switchMode
    };

})();
