# ElectroBliz Event Website

A beautiful, animated React website for the ElectroBliz college event with registration functionality, dynamic form categories, and data export capabilities.

## 🚀 Features

### ✨ Design & Animation
- **Neon Effects**: Glowing text and button animations
- **Floating Background**: Animated geometric shapes and particles
- **Gradient Backgrounds**: Dynamic color transitions
- **Smooth Transitions**: CSS animations and React transitions
- **Responsive Design**: Mobile-first approach with tablet and desktop support

### 📝 Registration System
- **Multi-step Form**: Progressive form with smooth transitions
- **Category Selection**: Tech, Non-Tech, and Workshop categories
- **Dynamic Fields**: Event selection based on chosen category
- **Real-time Validation**: Form validation with smooth error animations
- **Data Persistence**: Form data maintained across steps

### 🎯 Event Management
- **Event Showcase**: Beautiful event cards with filtering
- **Category Filtering**: Filter events by type
- **Event Details**: Comprehensive event information
- **Registration Integration**: Direct registration from event pages

### 📊 Admin Dashboard
- **Registration Management**: View all registrations in a table
- **Search Functionality**: Search through registrations
- **Data Export**: Export to Excel and CSV formats
- **Statistics**: Real-time registration statistics
- **Event Analytics**: Export event participation data

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Styled Components
- **Animations**: CSS Keyframes + Framer Motion
- **Routing**: React Router DOM
- **Database**: Firebase Firestore (configured)
- **Export**: SheetJS (xlsx) library
- **Build Tool**: Create React App

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd electrobliz-ece
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** (Optional)
   - Update `src/utils/firebase.ts` with your Firebase configuration
   - Enable Firestore in your Firebase console

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎨 Pages & Components

### Pages
- **Landing Page** (`/`): Hero section with animated background
- **Registration** (`/register`): Multi-step registration form
- **Events** (`/events`): Event showcase with filtering
- **About** (`/about`): Information about ElectroBliz
- **Admin Dashboard** (`/admin`): Registration management

### Key Components
- `Navigation`: Responsive navigation with mobile menu
- `CategorySelection`: Animated category selection cards
- `PersonalInfo`: Form with real-time validation
- `EventSelection`: Dynamic event selection based on category
- `ReviewAndSubmit`: Final review and submission
- `AdminDashboard`: Registration management and export

## 🎯 Registration Flow

1. **Category Selection**: Choose between Tech, Non-Tech, or Workshop events
2. **Personal Information**: Fill in personal details with validation
3. **Event Selection**: Select specific events based on category
4. **Review & Submit**: Review all information and submit registration

## 📊 Data Export

The admin dashboard provides multiple export options:
- **Excel Export**: Complete registration data in Excel format
- **CSV Export**: Registration data in CSV format
- **Event Statistics**: Event participation analytics

## 🎨 Customization

### Colors
The website uses a consistent color scheme:
- Primary: `#00d4ff` (Cyan)
- Secondary: `#ff00ff` (Magenta)
- Background: Dark gradient from `#0c0c0c` to `#16213e`
- Text: White with various opacity levels

### Animations
- Floating shapes with different durations
- Gradient text animations
- Hover effects with transform and glow
- Smooth page transitions

## 📱 Responsive Design

- **Mobile**: Optimized for screens 320px and above
- **Tablet**: Enhanced layout for medium screens
- **Desktop**: Full-featured experience for large screens

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database
3. Update the configuration in `src/utils/firebase.ts`
4. Set up security rules for your Firestore

### Environment Variables
Create a `.env` file for sensitive configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, please contact the development team.

---

**ElectroBliz 2024** - Where Innovation Meets Excellence! ⚡