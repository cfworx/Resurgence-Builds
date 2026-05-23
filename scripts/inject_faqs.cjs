const fs = require('fs');
const path = require('path');

const directories = [
    path.join(__dirname, '..', 'src', 'content', 'builds'),
    path.join(__dirname, '..', 'src', 'content', 'guides')
];

for (const dir of directories) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        if (content.includes('faqs:')) {
            console.log(`Skipping ${file} (already has FAQs)`);
            continue;
        }

        const parts = content.split('---');
        if (parts.length < 3) continue; // Invalid frontmatter
        
        let frontmatter = parts[1];
        const body = parts.slice(2).join('---');

        // Extract metadata for keywords
        const titleMatch = frontmatter.match(/title:\s*"(.*?)"/);
        const specMatch = frontmatter.match(/specialization:\s*"(.*?)"/);
        const styleMatch = frontmatter.match(/playstyle:\s*"(.*?)"/);
        const categoryMatch = frontmatter.match(/category:\s*"(.*?)"/);
        
        const title = titleMatch ? titleMatch[1] : "Build";
        const spec = specMatch ? specMatch[1] : (categoryMatch ? categoryMatch[1] : "Agent");
        const style = styleMatch ? styleMatch[1] : "loadout";
        
        const faqBlock = `
faqs:
  - question: "Is the ${title} actually the best ${spec} setup in Division Resurgence?"
    answer: "If you have the reflexes of a caffeinated teenager, yes. If you're a middle-aged gamer playing on a greasy phone screen, it's still top-tier, but you're probably going to die occasionally. Focus on positioning and let your ${spec} skills do the heavy lifting."
  - question: "Can I run this ${style} loadout in the Dark Zone?"
    answer: "You can run whatever you want in the DZ, but don't come crying to me when a rogue squad vaporizes you at extraction. Just remember to check your corners, because taking this into the wrong neighborhood means you'll be respawning before you can even complain about lag."
  - question: "Why should I spend my hard-earned credits optimizing this?"
    answer: "Because you can't take your credits to the grave. Grinding for the perfect gear is the entire point of The Division Resurgence. Min-max your stats, hit your breakpoints, and stop walking around with unoptimized trash in your holsters."`;

        // Inject FAQ block before the closing ---
        frontmatter = frontmatter.trimEnd() + faqBlock + '\n';
        
        fs.writeFileSync(filePath, `---${frontmatter}---${body}`);
        console.log(`Added funny FAQs to ${file}`);
    }
}

console.log('Finished injecting FAQs.');
