1. Create a layer function with amplify
2. Go to the newly created layer's directory and delete everything inside
3. Clone this repo inside that directory
4. Execute `setup.sh <my-package>` with your package name
5. To automatically build your layer before it is pushed to AWS:
   - Go to your amplify root directory
   - Create a package.json (if absent)
   - under `scripts` add the following entry:
  `"amplify:your-layer-name": "cd ./amplify/backend/function/your-layer-name && npm run build && cd -",`
