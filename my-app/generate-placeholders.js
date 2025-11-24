const fs = require('fs');
const path = require('path');

// Simple SVG placeholder generator
function createSVGPlaceholder(text, bgColor = '#6366F1', textColor = '#FFFFFF') {
    return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${bgColor}"/>
        <circle cx="100" cy="100" r="60" fill="${textColor}" opacity="0.2"/>
        <text x="100" y="100" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
              fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
            ${text}
        </text>
    </svg>`;
}

// Create coaching icon placeholders
const icons = [
    { name: 'lecture', text: 'LEC', color: '#4F46E5' },
    { name: 'interview', text: 'INT', color: '#059669' },
    { name: 'qa', text: 'Q&A', color: '#DC2626' },
    { name: 'language', text: 'LNG', color: '#7C3AED' },
    { name: 'meditation', text: 'MED', color: '#0891B2' },
    { name: 'career', text: 'CAR', color: '#EA580C' },
    { name: 'tech', text: 'TEC', color: '#0F766E' },
    { name: 'business', text: 'BUS', color: '#B91C1C' },
];

// Create avatar placeholders
const avatars = [
    { name: 't1', text: 'SC', color: '#6366F1', ext: 'avif' },
    { name: 't2', text: 'JM', color: '#10B981', ext: 'jpg' },
    { name: 't3', text: 'MP', color: '#F59E0B', ext: 'jpg' },
    { name: 't4', text: 'AR', color: '#EF4444', ext: 'jpg' },
    { name: 't5', text: 'SW', color: '#8B5CF6', ext: 'jpg' },
    { name: 'default-avatar', text: 'AI', color: '#6B7280', ext: 'png' },
];

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icon SVGs (saved as .svg but referenced as .png in the app)
console.log('Creating icon placeholders...');
icons.forEach(icon => {
    const svg = createSVGPlaceholder(icon.text, icon.color);
    // Save as SVG but the app will need to reference them correctly
    fs.writeFileSync(path.join(publicDir, `${icon.name}.svg`), svg);
    console.log(`Created ${icon.name}.svg`);
});

// Generate avatar SVGs
console.log('\nCreating avatar placeholders...');
avatars.forEach(avatar => {
    const svg = createSVGPlaceholder(avatar.text, avatar.color);
    // For now, save as SVG regardless of intended extension
    fs.writeFileSync(path.join(publicDir, `${avatar.name}.svg`), svg);
    console.log(`Created ${avatar.name}.svg`);
});

console.log('\n✅ All placeholder images created!');
console.log('Note: These are SVG placeholders. For production, replace with actual PNG/JPG images.');