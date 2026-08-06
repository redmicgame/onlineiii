const fs = require('fs');

let mag = fs.readFileSync('components/CreateMagazineInterviewView.tsx', 'utf8');
if (!mag.includes("</main>")) {
    mag = mag.trim();
    if (mag.endsWith("Publish Interview")) {
        mag += "\n                    </button>\n                </div>\n            </main>\n        </div>\n    );\n};\nexport default CreateMagazineInterviewView;\n";
        fs.writeFileSync('components/CreateMagazineInterviewView.tsx', mag);
    }
}

let tv = fs.readFileSync('components/CreateTvInterviewView.tsx', 'utf8');
if (!tv.includes("</main>")) {
    tv = tv.trim();
    if (tv.endsWith("Broadcast Interview")) {
        tv += "\n                    </button>\n                </div>\n            </main>\n        </div>\n    );\n};\nexport default CreateTvInterviewView;\n";
        fs.writeFileSync('components/CreateTvInterviewView.tsx', tv);
    }
}
