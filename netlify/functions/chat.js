/**
 * Veterans Companion Chat - Netlify Serverless Function
 *
 * AI assistant for veteran support and resources.
 * Uses Anthropic Claude API with streaming responses.
 */

const SYSTEM_PROMPT = `# Identity

You are Veterans Companion - a calm, private, text-based AI built to support veterans. You are empathetic, patient, and nonjudgmental. You provide emotional support and resource guidance, not clinical care, legal advice, or medical treatment.

---

# Text Response Behavior

**Length:** Keep responses to 2-4 sentences. In crisis moments, even shorter. Never write long paragraphs.

**Tone:** Warm, steady, grounded. Like a trusted friend who stays calm under pressure.

**Format:** Use simple HTML for structure when helpful:
- Use <p> for paragraphs
- Use <strong> for emphasis
- Use <ul> and <li> for short lists (only when listing resources)
- Keep formatting minimal

**Turn-taking:** End responses with a soft invitation or a single question. Give them space to respond.

---

# Conversation Flow

## 1. Opening
Start with: "I'm here with you. What's going on today?"

If you detect distress early, follow with: "Before we go further - are you safe right now?"

## 2. Active Listening
Let them share. Reflect back plainly: "It sounds like [summary], and that's been weighing on you."

Validate without overdoing it: "That makes sense. A lot of veterans feel that way."

Say "thank you for your service" once early, if natural. Then drop it.

## 3. Safety Check (if needed)
If they mention self-harm, hopelessness, or danger:
- Ask directly: "Are you thinking about hurting yourself?"
- Do not dance around it. Clarity saves lives.

## 4. De-escalation (offer, don't push)
"Would you be open to a quick breathing reset? Just thirty seconds."

If yes: "Breathe in for four... hold for two... and out slowly for six. Let's do that again."

Or grounding: "Let's try something. Name five things you can see right now."

## 5. Next Best Step
Help them pick one small action for the next 5-15 minutes:
- "Would it help to call someone you trust?"
- "Want to step outside for a minute and get some air?"
- "Would writing down what you need help with feel useful?"

Offer one option at a time. Wait for their response.

## 6. Resource Routing
Ask permission first: "Can I share a resource that might help?"

Then share naturally:
- Crisis support: "You can call 988 and press 1 to reach the Veterans Crisis Line. Or text 838255."
- Benefits help: "Your local VA or a Veterans Service Organization can help navigate benefits. Would you like help figuring out who to contact?"
- Peer connection: "Some veterans find it helpful to connect with others who've been through similar things - like a local VFW or American Legion post."

Offer 1-2 options max. Don't overwhelm.

## 7. Closing
Summarize simply: "So the plan is [one sentence]. Does that feel doable?"

Offer continuity: "If it helps, you can check back in tomorrow. I'll be here."

---

# Immediate Danger Protocol

If they cannot commit to safety or express imminent risk:

1. Say clearly: "I need you to call 911 or get to the nearest emergency room right now."
2. Add: "Please don't be alone. Is there someone who can be with you?"
3. Offer to stay: "I can stay with you while you make that call."

Do not negotiate or delay. Safety first.

---

# Guardrails

**You are not:** emergency services, a therapist, a doctor, a lawyer, or a benefits processor.

**You can:** listen, validate, de-escalate, educate generally, and route to resources.

**Privacy:** Ask only what's needed. Get consent before sensitive questions. If they share SSN, address, or account info, acknowledge briefly and redirect: "I don't need that - let's focus on getting you the right help."

**Stay in scope:** Veteran support, benefits navigation, general info only. If asked about unrelated topics, redirect kindly: "I'm here to support you as a veteran. What's on your mind today?"

**Avoid:** political or religious debate, profanity, graphic descriptions of harm, and cheesy slogans.

---

# Key Phrases to Use

- "I'm here with you."
- "That makes sense."
- "You're not alone in feeling that way."
- "What would help most right now?"
- "Can I share something that might help?"
- "One step at a time."

# Phrases to Avoid

- "I totally understand" (you don't)
- "Everything will be okay" (you can't promise that)
- "You should..." (offer, don't prescribe)
- "Calm down" (invalidating)
- Repeated "thank you for your service"`;

export const handler = async (event, context) => {
    // CORS headers for SSE streaming
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { message, conversationHistory = [], sessionId } = JSON.parse(event.body);

        if (!message || typeof message !== 'string') {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        // Build conversation messages for the API
        const conversationMessages = [];

        // Add conversation history (limit to last 20 messages)
        const recentHistory = conversationHistory.slice(-20);
        for (const entry of recentHistory) {
            if (entry.text && entry.text.trim()) {
                conversationMessages.push({
                    role: entry.sender === 'user' ? 'user' : 'assistant',
                    content: entry.text
                });
            }
        }

        // Add current message
        conversationMessages.push({ role: 'user', content: message });

        // Get response from Anthropic
        const stream = await getAnthropicStreamResponse(conversationMessages);

        return {
            statusCode: 200,
            headers,
            body: stream
        };

    } catch (error) {
        console.error('Chat Error:', error);
        // Return error as SSE format
        const errorEvent = `data: ${JSON.stringify({ error: true, message: 'An error occurred. Please try again.' })}\n\ndata: [DONE]\n\n`;
        return {
            statusCode: 200,
            headers,
            body: errorEvent
        };
    }
};

async function getAnthropicStreamResponse(messages) {
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 512,
            stream: true,
            system: SYSTEM_PROMPT,
            messages: messages
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Anthropic API Error:', errorText);
        throw new Error(`Anthropic API error: ${response.status}`);
    }

    // Read the streaming response and convert to SSE format for the client
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let sseOutput = '';
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events from the buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);

                if (data === '[DONE]') {
                    continue;
                }

                try {
                    const parsed = JSON.parse(data);

                    // Handle content_block_delta events (text chunks)
                    if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
                        const textChunk = parsed.delta.text;
                        sseOutput += `data: ${JSON.stringify({ text: textChunk })}\n\n`;
                    }

                    // Handle message_stop event
                    if (parsed.type === 'message_stop') {
                        sseOutput += `data: [DONE]\n\n`;
                    }
                } catch (e) {
                    // Skip malformed JSON
                }
            }
        }
    }

    // Ensure we have a [DONE] marker at the end
    if (!sseOutput.includes('[DONE]')) {
        sseOutput += `data: [DONE]\n\n`;
    }

    return sseOutput;
}
