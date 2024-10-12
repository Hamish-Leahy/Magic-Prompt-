# Magic Prompt App

This is a React application that uses AI to improve prompts and facilitate chat-based interactions.

## Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```
4. Run `npm start` to start the development server
5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Deployment

This app is set up to be easily deployed on Cloudflare Pages. Follow these steps:

1. Push your code to a GitHub repository
2. Sign up for a Cloudflare account and go to the Pages section
3. Connect your GitHub repository
4. Set the build command to `npm run build`
5. Set the build output directory to `build`
6. Add your OpenAI API key as an environment variable named `REACT_APP_OPENAI_API_KEY`
7. Deploy!

## Features

- Prompt improvement using AI
- Chat-based interface for follow-up questions
- Responsive design using Tailwind CSS

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
