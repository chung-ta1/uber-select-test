import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Sample data - Countries
const countries = [
  { label: 'United States', value: 'US', subLabel: 'North America' },
  { label: 'Canada', value: 'CA', subLabel: 'North America' },
  { label: 'Mexico', value: 'MX', subLabel: 'North America' },
  { label: 'United Kingdom', value: 'UK', subLabel: 'Europe' },
  { label: 'Germany', value: 'DE', subLabel: 'Europe' },
  { label: 'France', value: 'FR', subLabel: 'Europe' },
  { label: 'Spain', value: 'ES', subLabel: 'Europe' },
  { label: 'Italy', value: 'IT', subLabel: 'Europe' },
  { label: 'Netherlands', value: 'NL', subLabel: 'Europe' },
  { label: 'Belgium', value: 'BE', subLabel: 'Europe' },
  { label: 'Switzerland', value: 'CH', subLabel: 'Europe' },
  { label: 'Austria', value: 'AT', subLabel: 'Europe' },
  { label: 'Japan', value: 'JP', subLabel: 'Asia' },
  { label: 'China', value: 'CN', subLabel: 'Asia' },
  { label: 'South Korea', value: 'KR', subLabel: 'Asia' },
  { label: 'India', value: 'IN', subLabel: 'Asia' },
  { label: 'Australia', value: 'AU', subLabel: 'Oceania' },
  { label: 'New Zealand', value: 'NZ', subLabel: 'Oceania' },
  { label: 'Brazil', value: 'BR', subLabel: 'South America' },
  { label: 'Argentina', value: 'AR', subLabel: 'South America' },
];

// Sample data - Car brands with images
const carBrands = [
  { label: 'Toyota', value: 'toyota', image: 'https://www.carlogos.org/car-logos/toyota-logo.png', subLabel: 'Japanese' },
  { label: 'Honda', value: 'honda', image: 'https://www.carlogos.org/car-logos/honda-logo.png', subLabel: 'Japanese' },
  { label: 'Ford', value: 'ford', image: 'https://www.carlogos.org/car-logos/ford-logo.png', subLabel: 'American' },
  { label: 'Chevrolet', value: 'chevrolet', image: 'https://www.carlogos.org/car-logos/chevrolet-logo.png', subLabel: 'American' },
  { label: 'BMW', value: 'bmw', image: 'https://www.carlogos.org/car-logos/bmw-logo.png', subLabel: 'German' },
  { label: 'Mercedes-Benz', value: 'mercedes', image: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png', subLabel: 'German' },
  { label: 'Audi', value: 'audi', image: 'https://www.carlogos.org/car-logos/audi-logo.png', subLabel: 'German' },
  { label: 'Volkswagen', value: 'volkswagen', image: 'https://www.carlogos.org/car-logos/volkswagen-logo.png', subLabel: 'German' },
  { label: 'Porsche', value: 'porsche', image: 'https://www.carlogos.org/car-logos/porsche-logo.png', subLabel: 'German' },
  { label: 'Ferrari', value: 'ferrari', image: 'https://www.carlogos.org/car-logos/ferrari-logo.png', subLabel: 'Italian' },
  { label: 'Lamborghini', value: 'lamborghini', image: 'https://www.carlogos.org/car-logos/lamborghini-logo.png', subLabel: 'Italian' },
  { label: 'Hyundai', value: 'hyundai', image: 'https://www.carlogos.org/car-logos/hyundai-logo.png', subLabel: 'Korean' },
  { label: 'Kia', value: 'kia', image: 'https://www.carlogos.org/car-logos/kia-logo.png', subLabel: 'Korean' },
  { label: 'Nissan', value: 'nissan', image: 'https://www.carlogos.org/car-logos/nissan-logo.png', subLabel: 'Japanese' },
  { label: 'Mazda', value: 'mazda', image: 'https://www.carlogos.org/car-logos/mazda-logo.png', subLabel: 'Japanese' },
];

// Sample data - Skills/Tags
const skills = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'React', value: 'react' },
  { label: 'Vue.js', value: 'vuejs' },
  { label: 'Angular', value: 'angular' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'PHP', value: 'php' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'SQL', value: 'sql' },
  { label: 'GraphQL', value: 'graphql' },
  { label: 'Docker', value: 'docker' },
  { label: 'Kubernetes', value: 'kubernetes' },
];

const PAGE_SIZE = 10;

function filterAndPaginate(data, search, page) {
  const filtered = search
    ? data.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const options = filtered.slice(startIndex, endIndex);
  const hasMore = endIndex < filtered.length;

  return { options, hasMore, total: filtered.length };
}

// API Endpoints
app.get('/api/countries', (req, res) => {
  const { search = '', page = 1 } = req.query;
  const result = filterAndPaginate(countries, search, parseInt(page));

  // Simulate network delay
  setTimeout(() => {
    res.json(result);
  }, 300);
});

app.get('/api/car-brands', (req, res) => {
  const { search = '', page = 1 } = req.query;
  const result = filterAndPaginate(carBrands, search, parseInt(page));

  setTimeout(() => {
    res.json(result);
  }, 300);
});

app.get('/api/skills', (req, res) => {
  const { search = '', page = 1 } = req.query;
  const result = filterAndPaginate(skills, search, parseInt(page));

  setTimeout(() => {
    res.json(result);
  }, 300);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /api/countries?search=&page=1');
  console.log('  GET /api/car-brands?search=&page=1');
  console.log('  GET /api/skills?search=&page=1');
});
