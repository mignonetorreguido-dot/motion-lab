const fs = require('fs');
let content = fs.readFileSync('components/training/ExerciseCard.js', 'utf8');

const regex = /\{ejercicio\.videoUrl && \([\s\S]*?<\/a>\s*\)\}/;

const replacement = `{ejercicio.videoUrl && !videoAbierto && (
  <button
    type="button"
    onClick={() => setVideoAbierto(true)}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors border border-red-500/20"
  >
    ▶ Reproducir Video
  </button>
)}`;

content = content.replace(regex, replacement);

const inlineVideo = `
        {ejercicio.videoUrl && videoAbierto && (
          <div className="mt-4">
            <VideoPlayer videoUrl={ejercicio.videoUrl} onClose={() => setVideoAbierto(false)} />
          </div>
        )}
      </div>`;

content = content.replace(/<\/div>\s*\{ejercicio\.indicacionProfe && \(/, inlineVideo + '\n\n        {ejercicio.indicacionProfe && (');

fs.writeFileSync('components/training/ExerciseCard.js', content, 'utf8');
console.log('Replaced');
