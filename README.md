# LearnLingo

LearnLingo is a web application for finding and booking online language tutors.

The application allows users to browse teachers, filter them by language, level of knowledge, and price, add teachers to favorites, register and log in, and book a trial lesson.

The project was implemented as a React pet project based on a provided [Figma design](https://www.figma.com/file/dewf5jVviSTuWMMyU3d8Mc/%D0%9F%D0%B5%D1%82-%D0%BF%D1%80%D0%BE%D1%94%D0%BA%D1%82-%D0%B4%D0%BB%D1%8F-%D0%9A%D0%A6?type=design&node-id=0-1&mode=design&t=jCmjSs9PeOjObYSc-0) and [technical specification](https://docs.google.com/document/d/1ZB_MFgnnJj7t7OXtv5hESSwY6xRgVoACZKzgZczWc3Y/edit?tab=t.0).

## Live Demo:

`https://languagelearningapp-eta.vercel.app`

## Repository

`https://github.com/YshTi/language_learning_app`

## Main Features

- Home page with project introduction and statistics
- Teachers page with tutor cards
- Filtering by:
  - language
  - level of knowledge
  - price
- Pagination with "Load more"
- Teacher details with:
  - languages
  - experience
  - lesson information
  - conditions
  - reviews
  - rating
  - price
- Favorites functionality
- Private Favorites page for authorized users
- Registration and login with Firebase Authentication
- Persistent favorites using Firebase Realtime Database
- Trial lesson booking form
- Trial lesson requests stored in Firebase Realtime Database
- Form validation using React Hook Form and Yup
- Toast notifications for successful and failed actions
- Loading indicators for asynchronous operations
- Responsive modal windows
- React Router navigation
- Route-level lazy loading
- Vendor bundle code splitting
- SPA routing support for Vercel deployment

## Technologies

The project was built using:

- React
- TypeScript
- Vite
- React Router
- Firebase Authentication
- Firebase Realtime Database
- React Hook Form
- Yup
- React Hot Toast
- React Icons
- CSS Modules
- ESLint
- Prettier
- Vercel

## Design

The application was developed according to the provided [Figma design](https://www.figma.com/file/dewf5jVviSTuWMMyU3d8Mc/%D0%9F%D0%B5%D1%82-%D0%BF%D1%80%D0%BE%D1%94%D0%BA%D1%82-%D0%B4%D0%BB%D1%8F-%D0%9A%D0%A6?type=design&node-id=0-1&mode=design&t=jCmjSs9PeOjObYSc-0).

The layout includes:

- Home page
- Teachers page
- Login modal
- Registration modal
- Trial lesson booking modal
- Teacher cards
- Filters
- Pagination

The original design was adapted with a custom color palette while preserving the overall structure and UI logic of the provided mockup.

## Technical Specification

**The project was implemented according to the following main requirements:**

### Home Page

The Home page contains:

- application advantages
- introductory content
- call-to-action button leading to the Teachers page
- statistical information about teachers, lessons, students, and languages

### Teachers Page

The Teachers page displays a list of language teachers.

Initially, 4 teacher cards are displayed.

The "Load more" button requests the next portion of 4 teachers from Firebase Realtime Database.

Users can filter teachers by:

- language
- level of knowledge
- price per hour

Each teacher card contains:

- teacher avatar
- name and surname
- spoken languages
- knowledge levels
- rating
- reviews
- lesson price
- number of completed lessons
- lesson information
- conditions
- experience

The "Read more" button expands additional information and reviews.

### Authentication

Firebase Authentication is used for user registration and login.

The application supports:

- registration
- login
- logout
- current user state
- persistent authentication

Registration and login forms are implemented inside modal windows.

Modal windows can be closed using:

- close button
- backdrop click
- Escape key

### Favorites

Authorized users can add and remove teachers from favorites.

Favorites are stored in Firebase Realtime Database and remain available after page refresh.

Unauthorized users receive a notification when attempting to add a teacher to favorites.

The Favorites page is intended for authorized users and displays only favorite teachers.

### Trial Lesson Booking

After expanding a teacher card, the user can open the "Book trial lesson" form.

The booking form contains:

- language
- main reason for learning
- full name
- email
- phone number

If a language filter is active, that language is automatically selected.

If no language filter is active, the user can select one of the languages taught by the selected teacher.

Submitted booking requests are stored in Firebase Realtime Database.

### Form Validation

Forms are implemented using:

- React Hook Form
- Yup

All required fields are validated.

Validation errors are displayed next to the corresponding fields.

### Notifications

React Hot Toast is used for notifications such as:

- successful login
- failed login
- successful registration
- failed registration
- teacher added to favorites
- teacher removed from favorites
- unauthorized favorite attempt
- successful trial lesson booking
- failed booking submission

### Loading States

Custom loaders are displayed during asynchronous operations, including:

- loading teachers
- loading favorites
- loading additional teachers
- login
- registration
- booking submission

### Routing

React Router is used for navigation between:

- `/`
- `/teachers`
- `/favorites`

The application is configured as a Single Page Application for Vercel deployment.

### Performance

The application uses:

- lazy loading for pages
- route-level code splitting
- vendor bundle splitting
- optimized WebP assets

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── book-trial/
│   ├── buttons/
│   ├── container/
│   ├── filter-select/
│   ├── filters/
│   ├── header/
│   ├── load-more/
│   ├── loader/
│   ├── login/
│   ├── logo/
│   ├── modal/
|   ├── private-route/
│   ├── register/
│   ├── teacher-card/
│   └── teacher-catalog/
├── context/
├── firebase/
├── pages/
│   ├── FavoritesPage/
│   ├── HomePage/
│   └── TeachersPage/
├── types/
├── utils/
├── App.tsx
├── index.css
└── main.tsx
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/YshTi/language_learning_app.git
```

2. Go to the project directory:

```bash
cd language_learning_app
```

3. Install dependencies:

```bash
npm install
```

4. Create a .env file in the root of the project.
   You can use .env.example as a template:

```bash
cp .env.example .env
```

Then add your Firebase configuration values to .env.

5. Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```bash
http://localhost:5173
```

## Available Scripts

Start the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Check formatting with Prettier:

```bash
npm run format:check
```

Format the project automatically:

```bash
npm run format
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

The application is deployed with Vercel.

A vercel.json rewrite rule is included so React Router routes work correctly after direct navigation or page refresh.

# Author

[Tetiana Yushkevych](https://github.com/YshTi/)
