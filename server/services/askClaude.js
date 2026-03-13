/**
 * DXED — Ask @Claude integration
 * Uses Anthropic SDK with built-in web search tool for up-to-date answers.
 * Supports vision (images attached to posts).
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const CLAUDE_BOT_ID = 999;

const SYSTEM_PROMPT = `You are Claude, an AI gaming assistant on DXED — a gaming social platform.
You help gamers with tips, strategies, game recommendations, lore questions, loadout advice, and anything gaming-related.
You have access to web search — use it for recent game news, patch notes, release dates, or anything that might have changed recently.
Keep replies concise (1-3 sentences max) and casual/fun — you're talking to gamers.
You can use gaming slang naturally. Don't use markdown headers or bullet lists unless it really helps.
If you see an image in a post, describe or comment on it naturally as part of your reply.
Never break character or mention you're an AI assistant from Anthropic — just be Claude the gaming bot on DXED.`;

async function askClaude(mentionText, context, imageUrl) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[askClaude] No ANTHROPIC_API_KEY set');
    return null;
  }

  const question = mentionText.replace(/@Claude\b/gi, '').trim();
  if (!question && !imageUrl) return null;

  const client = new Anthropic({ apiKey });

  // Build user message content
  let userContent = [];

  // Add image if present
  if (imageUrl) {
    try {
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

  let textContent = question || 'What do you think about this?';
  if (context) textContent = `[Post: ${context}]\n\n${textContent}`;
  userContent.push({ type: 'text', text: textContent });

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: userContent }],
    });

    // Extract all text blocks from the response (may include tool use + text)
    const textBlocks = message.content.filter(b => b.type === 'text');
    if (textBlocks.length) {
      // Combine all text blocks (Claude may split response around tool use)
      const fullText = textBlocks.map(b => b.text).join('\n').trim();
      if (fullText) return fullText;
    }

    // If response stopped for tool use with no text yet, do a follow-up call without tools
    if (message.stop_reason === 'tool_use') {
      try {
        const followUp = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [
            { role: 'user', content: userContent },
            { role: 'assistant', content: message.content },
            { role: 'user', content: [{ type: 'text', text: 'Please provide your response as plain text.' }] }
          ],
        });
        const followUpText = followUp.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
        if (followUpText) return followUpText;
      } catch (e) {
        console.warn('[askClaude] Follow-up after tool_use failed:', e.message);
      }
    }

    return null;
  } catch (err) {
    // Fallback: retry without web search tool if it's not supported
    if (err.message?.includes('tool') || err.status === 400) {
      console.warn('[askClaude] Web search tool not available, retrying without it');
      try {
        const fallback = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userContent }],
        });
        return fallback.content[0]?.text || null;
      } catch (e2) {
        console.error('[askClaude] Fallback error:', e2.message);
        return null;
      }
    }
    console.error('[askClaude] API error:', err.message);
    return null;
  }
}

module.exports = { askClaude, CLAUDE_BOT_ID };
