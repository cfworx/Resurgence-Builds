const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function(filePath) {
    if (filePath.endsWith('.md') || filePath.endsWith('.astro') || filePath.endsWith('.json')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Match chest, Chest, CHEST but not if followed by -high
        let newContent = content.replace(/\bchest\b(?!\s*-high)/gi, 'Body Armor');
        
        // Also fix "Body Armor piece body armor talent" -> "Body Armor talent" just in case we made that mess earlier
        newContent = newContent.replace(/Body Armor piece body armor/gi, 'Body Armor');
        newContent = newContent.replace(/Body Armor piece Body Armor/gi, 'Body Armor');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated ' + filePath);
        }
    }
});
