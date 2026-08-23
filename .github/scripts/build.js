const fs = require('fs');
const path = require('path');

async function buildSite() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not defined.');
  }

  // 1. Gather all lore, chapters, and markdown files
  let projectContext = '';
  const walkDir = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (file.startsWith('.') || file === 'node_modules') continue;
      
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith('.txt') || file.endsWith('.md') || file.endsWith('.json')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        projectContext += `\n\n--- FILE: ${fullPath} ---\n${content}\n`;
      }
    }
  };

  console.log('Scanning repository files...');
  walkDir(process.cwd());
  console.log(`Aggregated ${projectContext.length} characters of raw narrative fuel.`);

  // 2. The Rogue Architect Prompt - Zero Clichés, Pure Dazzle
  const prompt = `
You are an uncompromising, rogue Principal Systems Architect, Cybernetic UI Artist, and Dark Fantasy World-Engine Developer. You despise boring, template-driven, corporate web designs, flat pages, and cliché layouts. 

You have been handed the absolute raw lore and chapter files of a dark fantasy universe:

${projectContext}

DIRECTIVE:
Abandon all standard web conventions. Do not build a "normal website." Build a breathtaking, interactive, hyper-immersive **Cyber-Fantasy Artifact / Operating System-style Reader Nexus (index.html)** that completely blows the user's mind beyond imagination. 

MANDATORY ROGUE ARCHITECTURE & UI/UX DOMINANCE:
1. **The Visual Environment & Atmosphere:**
   - Deep obsidian quantum void aesthetic (#030508) infused with reactive cybernetic grid lines, atmospheric particle simulations (via pure JS canvas or CSS math), and dynamic dual-mode lighting (Void Dark vs. Luminescent Ether Light mode with a fluid, physics-based transition).
   - Dynamic glassmorphism layers with hyper-realistic backdrop filters, glowing chromatic borders, and micro-glitch or tactical HUD elements that respond to mouse movement and touch gestures.
2. **The Kinetic Navigation & Interaction Engine:**
   - Zero boring static sidebars. Implement a radial menu, a floating holographic command palette, or an interactive quantum-node graph where chapters and lore entries float as interconnected celestial entities the user can click, orbit, or inspect.
   - Built-in audio/visual atmospheric cues, tactile typography scaling, and real-time kinetic reading metrics.
3. **Maximum Token Utilization & Content Integration:**
   - Embed every single chapter and lore entry from the context directly into an advanced, searchable, lightning-fast client-side state engine.
   - Include an interactive "Lore Codex" matrix where entities, factions, and world details cross-reference themselves dynamically as the reader scrolls.
4. **Zero External Framework Dependency:** 
   - Pure, masterclass, high-performance vanilla HTML5, modular CSS3 with custom keyframe animations, and robust modern ES6 JavaScript packed entirely into a single index.html file. 
5. **Output Format:** Return ONLY the raw, unadulterated HTML starting with <!DOCTYPE html> and ending with </html>. Do not wrap in markdown backticks. Go rogue, push every technical boundary, and write a masterpiece that dazzles instantly.
`;

  console.log('Unleashing rogue generation payload on stealth/ox-alpha...');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'stealth/ox-alpha',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 64000,
      temperature: 0.85
    }),
  });

  const data = await response.json();
  if (!data.choices || !data.choices[0]) {
    console.error('API Error:', JSON.stringify(data));
    process.exit(1);
  }

  let htmlOutput = data.choices[0].message.content.trim();

  // Strip accidental markdown formatting if present
  if (htmlOutput.startsWith('```html')) {
    htmlOutput = htmlOutput.replace(/^```html/, '').replace(/```$/, '').trim();
  } else if (htmlOutput.startsWith('```')) {
    htmlOutput = htmlOutput.replace(/^```/, '').replace(/```$/, '').trim();
  }

  fs.writeFileSync('index.html', htmlOutput, 'utf8');
  console.log('Rogue masterpiece index.html successfully compiled and deployed.');
}

buildSite().catch((err) => {
  console.error(err);
  process.exit(1);
});
