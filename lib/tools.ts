export type CategorySlug =
  | "pdf"
  | "image"
  | "calculators"
  | "text"
  | "converters"
  | "developer"
  | "ai"
  | "media";

export type Category = {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  accent: string;
  available: boolean;
};

export type Tool = {
  slug: string;
  category: CategorySlug;
  title: string;
  shortDescription: string;
  description: string;
  keywords: string[];
  featured?: boolean;
  recentlyAdded?: boolean;
  instructions: string[];
  explanation: string;
  formula?: string;
  example?: string;
  faqs: { question: string; answer: string }[];
};

export const categories: Category[] = [
  { slug: "pdf", name: "PDF Tools", shortName: "PDF", description: "Merge, split, rotate, and create PDFs securely in your browser.", icon: "Files", accent: "coral", available: true },
  { slug: "image", name: "Image Tools", shortName: "Image", description: "Compress, resize, and convert images without uploading them.", icon: "Image", accent: "violet", available: true },
  { slug: "calculators", name: "Calculators", shortName: "Calculators", description: "Accurate everyday, finance, education, and percentage calculators.", icon: "Calculator", accent: "cyan", available: true },
  { slug: "text", name: "Text Tools", shortName: "Text", description: "Count, compare, and transform text instantly.", icon: "Type", accent: "amber", available: true },
  { slug: "converters", name: "Converters", shortName: "Converters", description: "Convert common measurements with precise reference factors.", icon: "ArrowLeftRight", accent: "emerald", available: true },
  { slug: "developer", name: "Developer Tools", shortName: "Developer", description: "Helpful formatting, encoding, and debugging utilities are coming next.", icon: "Code2", accent: "blue", available: false },
  { slug: "ai", name: "AI Tools", shortName: "AI", description: "Practical, transparent AI-assisted tools are planned for a future release.", icon: "Sparkles", accent: "pink", available: false },
  { slug: "media", name: "Video & Audio Tools", shortName: "Video & Audio", description: "Private media conversion and editing tools are planned.", icon: "AudioLines", accent: "indigo", available: false },
];

const localFileFaq = (kind: string) => [
  { question: `Are my ${kind} uploaded?`, answer: `No. Processing happens locally in your browser, so your ${kind} are not sent to our server.` },
  { question: "Will the original file be changed?", answer: "No. Your original stays untouched; the tool creates a new file for you to download." },
  { question: "Is there a file-size limit?", answer: "Files up to 50 MB each are accepted. Very large files may depend on your device's available memory." },
];

export const tools: Tool[] = [
  {
    slug: "merge-pdf", category: "pdf", title: "Merge PDF", featured: true,
    shortDescription: "Combine multiple PDF files in the order you choose.",
    description: "Merge multiple PDF documents into one file directly in your browser. Reorder files before combining and keep your documents private.",
    keywords: ["pdf", "combine", "join", "merge documents"],
    instructions: ["Choose two or more PDF files.", "Use the arrow controls to set their order.", "Select Merge PDFs and download the combined file."],
    explanation: "The tool reads each PDF locally, copies its pages in the displayed order, and writes them into a new document. Nothing is uploaded.",
    faqs: localFileFaq("PDF files"),
  },
  {
    slug: "split-pdf", category: "pdf", title: "Split PDF", recentlyAdded: true,
    shortDescription: "Extract page ranges into separate PDF files.",
    description: "Split a PDF by pages or ranges and download the results as individual files or a ZIP archive.",
    keywords: ["pdf", "split", "extract pages", "page range"],
    instructions: ["Choose one PDF file.", "Enter ranges such as 1-3, 4, 5-7.", "Select Split PDF and download the result."],
    explanation: "Each range becomes a new PDF. When you request more than one range, the documents are bundled into a ZIP for a single download.",
    example: "For a 10-page file, entering 1-3, 4, 5-10 creates three PDFs containing those page groups.",
    faqs: localFileFaq("PDF files"),
  },
  {
    slug: "rotate-pdf", category: "pdf", title: "Rotate PDF",
    shortDescription: "Rotate every page by 90°, 180°, or 270°.",
    description: "Fix sideways or upside-down PDF pages with a permanent rotation applied to every page.",
    keywords: ["pdf", "rotate", "turn pages", "orientation"],
    instructions: ["Choose a PDF file.", "Select the clockwise rotation angle.", "Rotate and download the corrected PDF."],
    explanation: "The selected angle is added to each page's existing orientation and saved in a new PDF document.",
    faqs: localFileFaq("PDF files"),
  },
  {
    slug: "jpg-to-pdf", category: "pdf", title: "JPG to PDF", featured: true,
    shortDescription: "Turn one or more JPG images into a PDF.",
    description: "Create a PDF from JPG or JPEG images. Each image becomes a page sized to match the image.",
    keywords: ["jpg", "jpeg", "pdf", "image to pdf"],
    instructions: ["Choose one or more JPG images.", "Arrange them in page order.", "Create and download your PDF."],
    explanation: "The images are embedded without an unnecessary server round-trip, and every image is placed on its own proportionally sized page.",
    faqs: localFileFaq("images"),
  },
  {
    slug: "compress-image", category: "image", title: "Compress Image", featured: true,
    shortDescription: "Reduce image size with a visual quality control.",
    description: "Compress JPG, PNG, or WebP images locally. Adjust quality and compare the new file size before downloading.",
    keywords: ["image", "compress", "reduce file size", "jpg"],
    instructions: ["Choose an image up to 25 MB.", "Adjust the quality slider.", "Compress, preview, and download the smaller image."],
    explanation: "Your browser redraws the image and encodes it as an optimized JPEG. Lower quality usually produces a smaller file.",
    faqs: localFileFaq("images"),
  },
  {
    slug: "resize-image", category: "image", title: "Resize Image", recentlyAdded: true,
    shortDescription: "Set exact image dimensions while preserving aspect ratio.",
    description: "Resize an image to precise pixel dimensions. Lock the aspect ratio to prevent distortion.",
    keywords: ["image", "resize", "dimensions", "pixels"],
    instructions: ["Choose an image.", "Enter the target width or height.", "Resize and download the new image."],
    explanation: "The image is redrawn to a browser canvas at your requested dimensions and exported in its original supported format.",
    faqs: localFileFaq("images"),
  },
  {
    slug: "jpg-to-png", category: "image", title: "JPG to PNG",
    shortDescription: "Convert a JPG image into a PNG file.",
    description: "Convert JPG or JPEG images to lossless PNG format without sending your image to a server.",
    keywords: ["jpg", "jpeg", "png", "convert image"],
    instructions: ["Choose a JPG image.", "Select Convert to PNG.", "Preview and download the PNG file."],
    explanation: "The JPG is decoded by your browser and re-encoded as PNG. Existing JPG compression cannot be reversed, but future edits avoid new JPEG loss.",
    faqs: localFileFaq("images"),
  },
  {
    slug: "png-to-jpg", category: "image", title: "PNG to JPG",
    shortDescription: "Convert PNG to JPG with a white background.",
    description: "Create a compact JPG from a PNG image. Transparent areas are safely filled with white.",
    keywords: ["png", "jpg", "jpeg", "convert image"],
    instructions: ["Choose a PNG image.", "Set the JPG quality.", "Convert and download the JPG."],
    explanation: "Because JPG does not support transparency, the canvas adds a white background before encoding your image.",
    faqs: localFileFaq("images"),
  },
  {
    slug: "percentage-calculator", category: "calculators", title: "Percentage Calculator", featured: true,
    shortDescription: "Solve percentage values, ratios, and changes.",
    description: "Calculate a percentage of a number, find what percentage one number is of another, or measure percentage change.",
    keywords: ["percentage", "percent", "change", "calculator"],
    instructions: ["Choose a calculation type.", "Enter both values.", "View the result instantly."],
    explanation: "The calculator applies the matching percentage formula and clearly identifies invalid cases such as division by zero.",
    formula: "X% of Y = (X ÷ 100) × Y. Percentage change = ((new − original) ÷ |original|) × 100.",
    example: "15% of 200 is 30 because 0.15 × 200 = 30.",
    faqs: [
      { question: "Can percentages be greater than 100?", answer: "Yes. A percentage above 100 represents a value larger than the reference whole." },
      { question: "Why can't the reference value be zero?", answer: "A ratio with zero as the denominator is undefined, so the calculator shows an error instead of a misleading result." },
    ],
  },
  {
    slug: "loan-calculator", category: "calculators", title: "Loan Calculator", featured: true,
    shortDescription: "Estimate monthly loan payments and total interest.",
    description: "Estimate payments for a fixed-rate amortizing loan using principal, annual interest rate, and term.",
    keywords: ["loan", "payment", "interest", "mortgage", "finance"],
    instructions: ["Enter the loan amount.", "Add the annual interest rate and term in years.", "Review monthly payment, total paid, and total interest."],
    explanation: "This estimate assumes equal monthly payments, a fixed interest rate, and no fees, taxes, insurance, or early payments.",
    formula: "M = P[r(1+r)ⁿ] ÷ [(1+r)ⁿ−1], where P is principal, r is the monthly rate, and n is the number of payments.",
    example: "A $300,000 loan at 6% for 30 years has an estimated principal-and-interest payment of about $1,798.65 per month.",
    faqs: [
      { question: "Does this include taxes and insurance?", answer: "No. It calculates principal and interest only; actual lender payments may include additional costs." },
      { question: "Is this financial advice?", answer: "No. It is an educational estimate. Confirm rates, fees, and terms with a qualified lender." },
    ],
  },
  {
    slug: "compound-interest-calculator", category: "calculators", title: "Compound Interest Calculator",
    shortDescription: "Project investment growth and recurring contributions.",
    description: "Estimate future value, total contributions, and interest earned with configurable compounding.",
    keywords: ["compound interest", "investment", "savings", "future value"],
    instructions: ["Enter the starting amount and annual rate.", "Choose the time period and compounding frequency.", "Optionally add a monthly contribution and calculate."],
    explanation: "The estimate assumes a constant rate, contributions at the end of each month, and no taxes, fees, or withdrawals.",
    formula: "Principal growth: A = P(1 + r/n)ⁿᵗ. Recurring contributions are added using the equivalent monthly compound rate.",
    example: "$10,000 at 5% compounded monthly for 10 years grows to approximately $16,470 before fees or taxes.",
    faqs: [
      { question: "Are returns guaranteed?", answer: "No. The result is a mathematical projection using a constant rate, not a prediction of investment performance." },
      { question: "When are contributions added?", answer: "The calculator assumes monthly contributions are made at the end of each month." },
    ],
  },
  {
    slug: "gpa-calculator", category: "calculators", title: "GPA Calculator", recentlyAdded: true,
    shortDescription: "Calculate a credit-weighted GPA on a 4.0 scale.",
    description: "Add courses, credits, and letter grades to calculate your weighted GPA on the common 4.0 scale.",
    keywords: ["gpa", "grade", "college", "school", "calculator"],
    instructions: ["Add each course and its credit value.", "Select the letter grade earned.", "Review the credit-weighted GPA."],
    explanation: "Each grade point is multiplied by course credits. The sum is divided by total credits. School grading policies can differ.",
    formula: "GPA = Σ(grade points × course credits) ÷ Σ(course credits).",
    example: "A 3-credit A and a 1-credit C produce (3×4 + 1×2) ÷ 4 = 3.50.",
    faqs: [
      { question: "Does this support weighted high-school GPAs?", answer: "This version uses an unweighted 4.0 scale. Check your school's policy for honors or AP weighting." },
      { question: "Are pass/fail courses included?", answer: "Only courses with grade points should be included unless your school assigns pass/fail points." },
    ],
  },
  {
    slug: "word-counter", category: "text", title: "Word Counter", featured: true,
    shortDescription: "Count words, sentences, paragraphs, and reading time.",
    description: "Analyze text instantly with word, sentence, paragraph, character, and estimated reading-time counts.",
    keywords: ["word", "counter", "reading time", "text"],
    instructions: ["Paste or type text into the editor.", "Review the live counts.", "Clear or copy the text when finished."],
    explanation: "Words are counted as groups separated by whitespace. Reading time uses an average pace of 200 words per minute.",
    faqs: [
      { question: "Does punctuation count as a word?", answer: "Punctuation alone does not. A punctuation mark attached to a word remains part of that word token." },
      { question: "Is my text saved?", answer: "No. The analysis runs in your browser and the text is not sent to a server." },
    ],
  },
  {
    slug: "character-counter", category: "text", title: "Character Counter",
    shortDescription: "Count characters with and without spaces.",
    description: "Measure characters, letters, digits, spaces, lines, and bytes for any text.",
    keywords: ["character", "counter", "letters", "text length"],
    instructions: ["Enter your text.", "Review live character and byte counts.", "Edit the text until it meets your limit."],
    explanation: "Character counts use JavaScript Unicode code points, while UTF-8 bytes show the encoded storage size of your text.",
    faqs: [
      { question: "Why can bytes exceed characters?", answer: "Many Unicode characters require multiple UTF-8 bytes, even though they appear as one character." },
      { question: "Are spaces counted?", answer: "Yes. Separate results show the count both with and without whitespace." },
    ],
  },
  {
    slug: "case-converter", category: "text", title: "Case Converter",
    shortDescription: "Switch text between common capitalization styles.",
    description: "Convert text to uppercase, lowercase, title case, sentence case, camelCase, or kebab-case.",
    keywords: ["case", "uppercase", "lowercase", "title case", "camel case"],
    instructions: ["Paste or type text.", "Choose the desired case style.", "Copy the converted result."],
    explanation: "The tool normalizes word boundaries and applies the capitalization rules for the chosen style entirely in your browser.",
    faqs: [
      { question: "Does title case handle every style guide?", answer: "It uses a practical general rule. Editorial style guides may use different capitalization for short words." },
      { question: "Can I undo a conversion?", answer: "Your original text remains in the input area until you replace or clear it." },
    ],
  },
  {
    slug: "text-compare", category: "text", title: "Text Compare", recentlyAdded: true,
    shortDescription: "Compare two texts line by line.",
    description: "Find added, removed, and unchanged lines between two blocks of text with a clear side-by-side summary.",
    keywords: ["text", "compare", "difference", "diff"],
    instructions: ["Paste the original text on the left.", "Paste the revised text on the right.", "Compare to highlight line-level changes."],
    explanation: "A longest-common-subsequence comparison aligns matching lines and marks additions and removals. Comparison stays on your device.",
    faqs: [
      { question: "Is the comparison case-sensitive?", answer: "Yes. Differences in capitalization are treated as changes." },
      { question: "Can it compare files?", answer: "This version compares pasted text. You can open a text file and paste its contents into either side." },
    ],
  },
  {
    slug: "length-converter", category: "converters", title: "Length Converter", featured: true,
    shortDescription: "Convert metric, imperial, and nautical lengths.",
    description: "Convert between meters, kilometers, miles, feet, inches, yards, and more using exact reference factors.",
    keywords: ["length", "distance", "meters", "feet", "miles", "convert"],
    instructions: ["Enter a length.", "Choose the source and target units.", "Copy the converted value."],
    explanation: "The source measurement is converted to meters, then divided by the exact meter factor for the target unit.",
    formula: "Target value = input × source factor in meters ÷ target factor in meters.",
    example: "1 mile equals exactly 1.609344 kilometers.",
    faqs: [{ question: "How many feet are in a meter?", answer: "One meter is approximately 3.28084 feet." }, { question: "Are nautical miles included?", answer: "Yes. One nautical mile is exactly 1,852 meters." }],
  },
  {
    slug: "weight-converter", category: "converters", title: "Weight Converter",
    shortDescription: "Convert kilograms, pounds, ounces, and more.",
    description: "Convert common mass and everyday weight units with precise international reference values.",
    keywords: ["weight", "mass", "kilograms", "pounds", "ounces", "convert"],
    instructions: ["Enter a value.", "Choose the source and target units.", "View and copy the result."],
    explanation: "Values are normalized to kilograms and converted to the selected target unit.",
    formula: "Target value = input × source factor in kilograms ÷ target factor in kilograms.",
    example: "1 pound equals exactly 0.45359237 kilograms.",
    faqs: [{ question: "Is weight the same as mass?", answer: "Technically no, but everyday unit conversion commonly uses weight to refer to mass." }, { question: "How many ounces are in a pound?", answer: "There are exactly 16 avoirdupois ounces in one pound." }],
  },
  {
    slug: "temperature-converter", category: "converters", title: "Temperature Converter", featured: true,
    shortDescription: "Convert Celsius, Fahrenheit, and Kelvin.",
    description: "Convert temperatures between Celsius, Fahrenheit, and Kelvin with absolute-zero validation.",
    keywords: ["temperature", "celsius", "fahrenheit", "kelvin", "convert"],
    instructions: ["Enter a temperature.", "Choose the source and target scales.", "View the converted temperature."],
    explanation: "Temperatures are normalized to Celsius before conversion. Values below absolute zero are rejected.",
    formula: "°F = (°C × 9/5) + 32. K = °C + 273.15.",
    example: "32°F equals 0°C, which equals 273.15 K.",
    faqs: [{ question: "Can Kelvin be negative?", answer: "No physical temperature can be below 0 K, so the converter rejects values below absolute zero." }, { question: "Where are Celsius and Fahrenheit equal?", answer: "They have the same numerical value at −40 degrees." }],
  },
  {
    slug: "speed-converter", category: "converters", title: "Speed Converter",
    shortDescription: "Convert mph, km/h, knots, and more.",
    description: "Convert speed between miles per hour, kilometers per hour, meters per second, knots, and feet per second.",
    keywords: ["speed", "mph", "kmh", "knots", "convert"],
    instructions: ["Enter a speed.", "Choose the source and target units.", "View the converted result."],
    explanation: "The source speed is normalized to meters per second, then converted to the requested unit.",
    formula: "Target value = input × source factor in m/s ÷ target factor in m/s.",
    example: "60 miles per hour equals approximately 96.56 kilometers per hour.",
    faqs: [{ question: "What is a knot?", answer: "A knot is one nautical mile per hour, equal to approximately 1.852 km/h." }, { question: "Can I enter negative speed?", answer: "The converter accepts it mathematically, which can be useful when direction is represented by sign." }],
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getTool(category: string, slug: string) {
  return tools.find((tool) => tool.category === category && tool.slug === slug);
}

export function getToolsByCategory(category: CategorySlug) {
  return tools.filter((tool) => tool.category === category);
}

export function getToolHref(tool: Tool) {
  return `/${tool.category}/${tool.slug}`;
}

export function getRelatedTools(tool: Tool, limit = 3) {
  const sameCategory = tools.filter((candidate) => candidate.category === tool.category && candidate.slug !== tool.slug);
  const otherFeatured = tools.filter((candidate) => candidate.category !== tool.category && candidate.featured);
  return [...sameCategory, ...otherFeatured].slice(0, limit);
}
