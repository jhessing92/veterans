/**
 * Veterans Companion - Text Chat Engine
 *
 * Text-based chat using Claude API with streaming responses.
 * Designed to be rendered inside a container element.
 */

window.VeteransTextEngine = (function() {
    'use strict';

    const CONFIG = {
        brandColors: {
            primary: '#06b6d4',
            primaryLight: '#14b8a6',
            text: '#1e293b',
            textLight: '#64748b',
            white: '#ffffff'
        },
        chatEndpoint: '/.netlify/functions/chat'
    };

    // State
    let container = null;
    let onCloseCallback = null;
    let conversationHistory = [];
    let isStreaming = false;
    let sessionId = null;

    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function renderChat() {
        const content = container.querySelector('.text-engine-content');
        if (!content) return;

        content.innerHTML = `
            <div class="text-engine-messages" id="text-messages">
                <div class="text-engine-welcome">
                    <div class="text-engine-welcome-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <p>I'm here with you. What's going on today?</p>
                </div>
            </div>
            <div class="text-engine-input-container">
                <textarea
                    class="text-engine-input"
                    id="text-input"
                    placeholder="Type your message..."
                    rows="1"
                ></textarea>
                <button class="text-engine-send-btn" id="text-send-btn" disabled>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        `;

        // Set up event listeners
        const input = container.querySelector('#text-input');
        const sendBtn = container.querySelector('#text-send-btn');

        if (input) {
            input.addEventListener('input', () => {
                // Auto-resize textarea
                input.style.height = 'auto';
                input.style.height = Math.min(input.scrollHeight, 120) + 'px';

                // Enable/disable send button
                sendBtn.disabled = !input.value.trim() || isStreaming;
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.value.trim() && !isStreaming) {
                        sendMessage(input.value.trim());
                    }
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                if (input.value.trim() && !isStreaming) {
                    sendMessage(input.value.trim());
                }
            });
        }
    }

    function addMessage(text, isUser = false) {
        const messagesContainer = container.querySelector('#text-messages');
        if (!messagesContainer) return;

        // Remove welcome message if it exists
        const welcome = messagesContainer.querySelector('.text-engine-welcome');
        if (welcome) {
            welcome.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `text-engine-message ${isUser ? 'user' : 'assistant'}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'text-engine-message-content';
        contentDiv.innerHTML = isUser ? escapeHtml(text) : text;

        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        return contentDiv;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function sendMessage(text) {
        if (isStreaming) return;

        const input = container.querySelector('#text-input');
        const sendBtn = container.querySelector('#text-send-btn');

        // Clear input
        if (input) {
            input.value = '';
            input.style.height = 'auto';
        }
        if (sendBtn) {
            sendBtn.disabled = true;
        }

        // Add user message
        addMessage(text, true);
        conversationHistory.push({ sender: 'user', text: text });

        // Add assistant message placeholder
        const assistantContent = addMessage('', false);

        // Show typing indicator
        assistantContent.innerHTML = '<span class="text-engine-typing"><span></span><span></span><span></span></span>';

        isStreaming = true;

        try {
            const response = await fetch(CONFIG.chatEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    conversationHistory: conversationHistory.slice(-20),
                    sessionId: sessionId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            // Process SSE stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);

                        if (data === '[DONE]') {
                            continue;
                        }

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.text) {
                                fullResponse += parsed.text;
                                assistantContent.innerHTML = fullResponse;

                                // Scroll to bottom
                                const messagesContainer = container.querySelector('#text-messages');
                                if (messagesContainer) {
                                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                                }
                            }
                            if (parsed.error) {
                                throw new Error(parsed.message || 'An error occurred');
                            }
                        } catch (e) {
                            // Skip malformed JSON
                        }
                    }
                }
            }

            // Save to history
            conversationHistory.push({ sender: 'assistant', text: fullResponse });

        } catch (error) {
            console.error('Text Engine: Error', error);
            assistantContent.innerHTML = '<span style="color: #ef4444;">Sorry, I had trouble responding. Please try again.</span>';
        } finally {
            isStreaming = false;
            if (sendBtn && input) {
                sendBtn.disabled = !input.value.trim();
            }
        }
    }

    // Public API
    return {
        init: function(containerEl, onClose) {
            container = containerEl;
            onCloseCallback = onClose;
            sessionId = generateSessionId();
            conversationHistory = [];

            container.innerHTML = `
                <div class="text-engine-content"></div>
                <p class="text-engine-disclaimer">
                    Not a therapist or emergency service. For crisis support, call 988 and press 1.<br>
                    <span style="font-size: 10px; opacity: 0.7;">Veterans Companion Pilot</span>
                </p>
            `;

            renderChat();
            console.log('Veterans Text Engine initialized');
        },

        destroy: function() {
            conversationHistory = [];
            isStreaming = false;

            if (container) {
                container.innerHTML = '';
            }

            console.log('Veterans Text Engine destroyed');
        },

        sendMessage: function(text) {
            if (text && !isStreaming) {
                sendMessage(text);
            }
        },

        getStyles: function() {
            return `
                .text-engine-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: #f1f5f9;
                    overflow: hidden;
                }

                .text-engine-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .text-engine-welcome {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 40px 20px;
                    color: ${CONFIG.brandColors.textLight};
                }

                .text-engine-welcome-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, ${CONFIG.brandColors.primary} 0%, ${CONFIG.brandColors.primaryLight} 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                    color: white;
                }

                .text-engine-welcome p {
                    font-size: 15px;
                    margin: 0;
                    line-height: 1.5;
                }

                .text-engine-message {
                    display: flex;
                    max-width: 85%;
                }

                .text-engine-message.user {
                    align-self: flex-end;
                }

                .text-engine-message.assistant {
                    align-self: flex-start;
                }

                .text-engine-message-content {
                    padding: 10px 14px;
                    border-radius: 16px;
                    font-size: 14px;
                    line-height: 1.5;
                    word-wrap: break-word;
                }

                .text-engine-message.user .text-engine-message-content {
                    background: linear-gradient(135deg, ${CONFIG.brandColors.primary} 0%, ${CONFIG.brandColors.primaryLight} 100%);
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                .text-engine-message.assistant .text-engine-message-content {
                    background: white;
                    color: ${CONFIG.brandColors.text};
                    border-bottom-left-radius: 4px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .text-engine-message-content p {
                    margin: 0 0 8px 0;
                }

                .text-engine-message-content p:last-child {
                    margin-bottom: 0;
                }

                .text-engine-message-content ul,
                .text-engine-message-content ol {
                    margin: 8px 0;
                    padding-left: 20px;
                }

                .text-engine-message-content li {
                    margin: 4px 0;
                }

                .text-engine-message-content strong {
                    font-weight: 600;
                }

                .text-engine-message-content a {
                    color: ${CONFIG.brandColors.primary};
                    text-decoration: underline;
                }

                .text-engine-typing {
                    display: flex;
                    gap: 4px;
                    padding: 4px 0;
                }

                .text-engine-typing span {
                    width: 8px;
                    height: 8px;
                    background: ${CONFIG.brandColors.textLight};
                    border-radius: 50%;
                    animation: textEngineTyping 1.4s infinite ease-in-out both;
                }

                .text-engine-typing span:nth-child(1) {
                    animation-delay: -0.32s;
                }

                .text-engine-typing span:nth-child(2) {
                    animation-delay: -0.16s;
                }

                @keyframes textEngineTyping {
                    0%, 80%, 100% {
                        transform: scale(0.6);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .text-engine-input-container {
                    display: flex;
                    align-items: flex-end;
                    gap: 8px;
                    padding: 12px 16px;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                }

                .text-engine-input {
                    flex: 1;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    padding: 10px 16px;
                    font-size: 14px;
                    font-family: inherit;
                    resize: none;
                    outline: none;
                    max-height: 120px;
                    line-height: 1.4;
                }

                .text-engine-input:focus {
                    border-color: ${CONFIG.brandColors.primary};
                    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
                }

                .text-engine-input::placeholder {
                    color: #94a3b8;
                }

                .text-engine-send-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    background: linear-gradient(135deg, ${CONFIG.brandColors.primary} 0%, ${CONFIG.brandColors.primaryLight} 100%);
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }

                .text-engine-send-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
                }

                .text-engine-send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .text-engine-disclaimer {
                    padding: 12px 16px;
                    text-align: center;
                    font-size: 11px;
                    line-height: 1.6;
                    color: #64748b;
                    background: white;
                    margin: 0;
                    border-top: 1px solid #e2e8f0;
                }

                /* Mobile adjustments */
                @media (max-width: 639px) {
                    .text-engine-messages {
                        padding: 12px;
                    }

                    .text-engine-message {
                        max-width: 90%;
                    }

                    .text-engine-message-content {
                        padding: 8px 12px;
                        font-size: 13px;
                    }

                    .text-engine-input-container {
                        padding: 10px 12px;
                    }

                    .text-engine-input {
                        padding: 8px 14px;
                        font-size: 13px;
                    }

                    .text-engine-send-btn {
                        width: 36px;
                        height: 36px;
                    }

                    .text-engine-send-btn svg {
                        width: 18px;
                        height: 18px;
                    }

                    .text-engine-disclaimer {
                        padding: 10px 12px;
                        font-size: 10px;
                    }

                    .text-engine-welcome {
                        padding: 30px 16px;
                    }

                    .text-engine-welcome-icon {
                        width: 56px;
                        height: 56px;
                    }

                    .text-engine-welcome-icon svg {
                        width: 28px;
                        height: 28px;
                    }
                }
            `;
        }
    };
})();
