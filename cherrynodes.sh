npm install
npm run build
echo -e '#!/usr/bin/env node\nrequire("./dist/cli.js");' > cherrynodes
chmod +x cherrynodes
