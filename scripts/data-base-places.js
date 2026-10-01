import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getBasePlaces() {
  const mapHtmlPath = path.resolve(__dirname, '../map.html');
  const html = fs.readFileSync(mapHtmlPath, 'utf8');
  const lines = html.split('\n');
  let inPlaces = false;
  const placeLines = [];

  for (const line of lines) {
    if (line.includes('const ALL_INDIA_FAMOUS_PLACES = [')) {
      inPlaces = true;
      continue;
    }
    if (inPlaces && line.includes('const REGION_STATE_MAP = {')) {
      inPlaces = false;
      break;
    }
    if (inPlaces) {
      placeLines.push(line);
    }
  }

  const rawArrayStr = '[' + placeLines.join('\n').replace(/;\s*$/, '');
  // Evaluated in module context
  const fn = new Function('return ' + rawArrayStr);
  return fn();
}
