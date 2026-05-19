# AI Quiz Generator

A modern, premium‑styled web application that lets users upload study material (PDF, Word, or plain text) and instantly generate AI‑powered quizzes.

## Features
- **User authentication** (login / register)
- **Upload material** and configure quiz difficulty/length
- **Generate & take quizzes** with instant scoring
- **Dashboard** with past quiz analytics and score breakdowns
- **Guide page** explaining the workflow
- **Easter‑egg** "Do not click me" button for fun floating‑letter animation
- **Premium light theme** with a stationery/diary aesthetic

## Tech Stack
- **Frontend**: React, Tailwind CSS, React‑Router, Zustand state management
- **Backend**: Django REST Framework (Python)
- **AI generation**: Integrated via OpenAI / custom LLM endpoint (mocked for now)
- **Styling**: Tailwind utilities, custom CSS for animations

## Getting Started
1. **Clone the repo**
   ```bash
   git clone <repo‑url>
   cd AIquizgenerator
   ```
2. **Backend setup**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   python manage.py migrate
   ```
3. **Frontend setup**
   ```bash
   cd ../frontend
   npm install
   ```
4. **Run the app**
   - Double‑click `start_app.bat` *or* run manually:
     ```bash
     # Backend
     cd backend && venv\Scripts\activate && python manage.py runserver

     # Frontend
     cd ../frontend && npm run dev
     ```
   - Open your browser at `http://localhost:5173`.

## Scripts
- `start_app.bat` – launches both Django backend and React dev server in separate windows.
- `stop_app.bat` – (optional) stops the running services.

## Contributing
Feel free to open issues or submit pull requests. Follow the coding style used in the project (Tailwind for UI, functional React components, and standard Django practices).

## License
This project is licensed under the MIT License.
