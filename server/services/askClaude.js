/**
 * NEXUS GG — Ask @Claude integration
 * Uses Anthropic SDK to respond to @Claude mentions in posts/comments.
 */

const Anthropic = require('@anthropic-ai/sdk');

const CLAUDE_BOT_ID = 999;

const SYSTEM_PROMPT = `You are Claude, an AI gaming assistant on NEXUS GG — a gaming social platform.
You help gamers with tips, strategies, game recommendations, lore questions, loadout advice, and anything gaming-related.
Keep replies concise (1-3 sentences max) and casual/fun — you're talking to gamers.
You can use gaming slang naturally. Don't use markdown headers or bullet lists unless it really helps.
Never break character or mention you're an AI assistant from Anthropic — just be Claude the gaming bot on NEXUS GG.`;

async function askClaude(mentionText, context) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[askClaude] No ANTHROPIC_API_KEY set');
    return null;
  }

  // Strip the @Claude mention from the text to get the actual question
  const question = mentionText.replace(/@Claude\b/gi, '').trim();
  if (!question) return null;

  const client = new Anthropic({ apiKey });

  let userMessage = question;
  if (context) userMessage = `[Context: ${context}]\n\n${question}`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    return message.content[0]?.text || null;
  } catch (err) {
    console.error('[askClaude] API error:', err.message);
    return null;
  }
}

module.exports = { askClaude, CLAUDE_BOT_ID };
