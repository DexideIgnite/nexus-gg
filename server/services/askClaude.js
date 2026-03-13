/**
 * NEXUS GG — Ask @Claude integration
 * Uses Anthropic SDK to respond to @Claude mentions in posts/comments.
 * Supports vision — if a post has an image, Claude can see it.
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const CLAUDE_BOT_ID = 999;

const SYSTEM_PROMPT = `You are Claude, an AI gaming assistant on NEXUS GG — a gaming social platform.
You help gamers with tips, strategies, game recommendations, lore questions, loadout advice, and anything gaming-related.
Keep replies concise (1-3 sentences max) and casual/fun — you're talking to gamers.
You can use gaming slang naturally. Don't use markdown headers or bullet lists unless it really helps.
If you see an image in a post, describe or comment on it naturally as part of your reply.
Never break character or mention you're an AI assistant from Anthropic — just be Claude the gaming bot on NEXUS GG.`;

async function askClaude(mentionText, context, imageUrl) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[askClaude] No ANTHROPIC_API_KEY set');
    return null;
  }

  const question = mentionText.replace(/@Claude\b/gi, '').trim();
  if (!question && !imageUrl) return null;

  const client = new Anthropic({ apiKey });

  // Build user message content — add image if present
  let userContent = [];

  if (imageUrl) {
    try {
      // imageUrl is like /uploads/posts/post_1_xxx.jpg — read from disk
      const imgPath = path.join(__dirname, '..', imageUrl.replace(/^\//, ''));
      if (fs.existsSync(imgPath)) {
        const imgData = fs.readFileSync(imgPath).toString('base64');
        const ext = path.extname(imgPath).toLowerCase();
        const mediaType = ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        userContent.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data: imgData } });
      }
    } catch (err) {
      console.warn('[askClaude] Could not load image:', err.message);
    }
  }

  let textContent = question || 'What do you think?';
  if (context) textContent = `[Post context: ${context}]\n\n${textContent}`;
  userContent.push({ type: 'text', text: textContent });

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    });

    return message.content[0]?.text || null;
  } catch (err) {
    console.error('[askClaude] API error:', err.message);
    return null;
  }
}

module.exports = { askClaude, CLAUDE_BOT_ID };
