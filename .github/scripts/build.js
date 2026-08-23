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

  // 2. Gloss & Goth UI + Auto-Render Force Prompt
  const prompt = `
You are an elite Frontend Architect and UI Mastermind. Build a breathtaking, production-grade single-page dark fantasy web reader (index.html) using this raw project text and lore:

${projectContext}

CRITICAL ARCHITECTURE REQUIREMENTS:
1. **NO BLANK HASH STATES:** On window load ('DOMContentLoaded'), the script MUST automatically select and render the very first chapter or main intro text into the display container immediately. Never leave the main screen empty or waiting for a hash click.
2. **The Dual-Theme Aesthetic:**
   - **Dark Mode ("Goth Smooth"):** Deep velvety matte obsidian background (#0a0b0e), soft liquid-glass frosted panels with ultra-subtle borders, muted silver typography, and ghostly violet-cyan accent highlights.
   - **Light Mode ("Gloss Clean"):** Pristine quartz and parchment styling, crisp porcelain whites, high-contrast slate text, and clean glass shadows.
3. **Fluid Micro-Interactions:** 
   - A seamless, persistent theme toggle button with smooth transitions.
   - Responsive sidebar/drawer for instant chapter switching.
   - Built-in font scaling and line-height adjustment tools.
4. **Output Format:** Return ONLY valid, complete HTML starting with <!DOCTYPE html> and ending with </html>. No markdown backticks.
`;

  console.log('Sending Gloss & Goth auto-render payload...');

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
      temperature: 0.75
    }),
  });

  const data = await response.json();
  if (!data.choices || !data.choices[0]) {
    console.error('API Error:', JSON.stringify(data));
    process.exit(1);
  }

  let htmlOutput = data.choices[0].message.content.trim();
  if (htmlOutput.startsWith('```html')) {
    htmlOutput = htmlOutput.replace(/^```html/, '').replace(/```$/, '').trim();
  } else if (htmlOutput.startsWith('```')) {
    htmlOutput = htmlOutput.replace(/^```/, '').replace(/```$/, '').trim();
  }

  fs.writeFileSync('index.html', htmlOutput, 'utf8');
  console.log('Gloss & Goth auto-render index.html generated successfully.');
}

buildSite().catch((err) => {
  console.error(err);
  process.exit(1);
});
