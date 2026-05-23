import fs from 'fs';
import path from 'path';

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  list.forEach(f => {
    const name = path.join(dir, f);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.md')) {
      files.push(name);
    }
  });
  return files;
}

const files = getFiles('src/content');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('faqs:') && !file.includes('_template')) {
    // Generate a funny FAQ based on the path
    let question = "Is this build overpowered?";
    let answer = "Only if you hit your shots. Otherwise, it's just a very expensive way to respawn.";

    if (file.includes('news')) {
      question = "Why should I care about this news?";
      answer = "Because reading is fundamental, Agent. And knowing is half the battle (the other half is shooting).";
    } else if (file.includes('patch-notes')) {
      question = "Did they fix that one bug I hate?";
      answer = "Probably not. But they did introduce three new ones, so you have variety!";
    } else if (file.includes('tier-lists')) {
      question = "Is my favorite weapon S-Tier?";
      answer = "No. But don't let some random list on the internet tell you how to live your life. (But yes, it's garbage).";
    } else if (file.includes('guides')) {
      question = "Will this guide make me a pro player?";
      answer = "This guide will give you the knowledge. Your terrible aim is still on you, buddy.";
    }

    const faqString = `
faqs:
  - question: "${question}"
    answer: "${answer}"
`;

    // Inject into frontmatter. Find the second '---'
    const parts = content.split('---');
    if (parts.length >= 3) {
      parts[1] = parts[1] + faqString;
      content = parts.join('---');
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Injected FAQ into ${file}`);
    }
  }
});
