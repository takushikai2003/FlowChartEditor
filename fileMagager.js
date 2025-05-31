export function saveFile() {
  const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'flowchart.json';
  a.click();
}

export function loadFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state = JSON.parse(reader.result);
    [...canvas.querySelectorAll('.node')].forEach(e => e.remove());
    state.nodes.forEach(n => {
      const div = document.createElement('div');
      div.className = 'node ' + n.type;
      div.dataset.id = n.id;
      div.dataset.type = n.type;
      div.style.left = n.x + 'px';
      div.style.top = n.y + 'px';
      if (n.type === 'decision') {
        const span = document.createElement('span');
        span.textContent = n.label;
        div.appendChild(span);
      } else {
        div.textContent = n.label;
      }
      canvas.appendChild(div);
      bindNodeEvents(div);
    });
    renderLines();
  };
  reader.readAsText(file);
}