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
  console.log(`Aggregated ${projectContext.length} characters of lore and context.`);

  // 2. Prompt Ox Alpha for a complete, production-grade web reader
  const prompt = `
You are an expert front-end engineer and UI/UX designer.
Analyze the following chapters, lore, and world-building data:

${projectContext}

TASK:
Generate a complete, fully featured, production-ready single-page web reader application (index.html).
Requirements:
1. Modern dark aesthetic (clean typography, sleek reading modes, customizable font size/themes, responsive sidebar for chapter navigation).
2. Embed the complete lore archive and all chapters cleanly into structured JavaScript state.
3. Clean vanilla HTML5, CSS3, and JavaScript bundled entirely inside one single file.
4. Include search/filter capability across chapters and lore entries.
5. Return ONLY the raw valid HTML code starting with <!DOCTYPE html> and ending with </html>. Do not include markdown backticks or explanations.
`;

  console.log('Sending request to stealth/ox-alpha on OpenRouter...');

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
    }),
  });

  const data = await response.json();
  if (!data.choices || !data.choices[0]) {
    console.error('API Error:', JSON.stringify(data));
    process.exit(1);
  }

  let htmlOutput = data.choices[0].message.content.trim();

  // Strip accidental markdown formatting
  if (htmlOutput.startsWith('```html')) {
    htmlOutput = htmlOutput.replace(/^```html/, '').replace(/```$/, '').trim();
  } else if (htmlOutput.startsWith('```')) {
    htmlOutput = htmlOutput.replace(/^```/, '').replace(/```$/, '').trim();
  }

  fs.writeFileSync('index.html', htmlOutput, 'utf8');
  console.log('index.html successfully generated and written to disk.');
}

buildSite().catch((err) => {
  console.error(err);
  process.exit(1);
});
