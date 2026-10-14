const fs = require('fs');
let content = fs.readFileSync('components/training/WorkoutView.js', 'utf8');

const regex = /\{\(ej\.videoUrl \|\| ej\.videoRecomendacion\) && \([\s\S]*?<\/div>\s*\)\}/g;

const replacement = `{(ej.videoUrl || ej.videoRecomendacion) && (
  <div className="mt-2 flex flex-col items-start gap-1.5 w-full">
    {ej.videoUrl && videoActivoId !== ej.id && (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setVideoActivoId(ej.id); }}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold transition-colors border border-red-500/20"
      >
        ▶ Reproducir Video
      </button>
    )}
    {ej.videoUrl && videoActivoId === ej.id && (
      <div onClick={(e) => e.stopPropagation()} className="w-full">
        <VideoPlayer videoUrl={ej.videoUrl} onClose={() => setVideoActivoId(null)} />
      </div>
    )}
    {ej.videoRecomendacion && (
      <span className="text-[10px] font-medium text-slate-400 bg-slate-800/50 p-1.5 rounded-md border border-slate-700/50">
        💡 {ej.videoRecomendacion}
      </span>
    )}
  </div>
)}`;

content = content.replace(regex, replacement);
fs.writeFileSync('components/training/WorkoutView.js', content, 'utf8');
console.log('Replaced');
