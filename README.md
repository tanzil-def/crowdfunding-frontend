# 🎨 Crowdfunding Platform - Frontend

<div align="center">

**Modern React application for share-based crowdfunding with real-time notifications**

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

[Live Demo](#) · [Backend API](../README.md) · [Report Bug](https://github.com/tanzil-def/crowdfunding-platform/issues)

</div>

---

## 🎯 Overview

High-performance SPA enabling **Investors**, **Developers**, and **Admins** to collaborate in a seamless crowdfunding ecosystem. Features real-time WebSocket notifications, Redux state management, and responsive TailwindCSS design.

### ⚡ Core Features

<table>
<tr>
<td width="50%">

**🔐 Multi-Role Interface**
- Admin command center
- Developer project portal
- Investor dashboard

**🔔 Real-Time System**
- WebSocket notifications
- Live updates
- Toast alerts

</td>
<td width="50%">

**📊 State Management**
- Redux Toolkit integration
- Context API for WebSocket
- Persistent auth state

**🎨 Modern UI/UX**
- Responsive TailwindCSS
- Component library
- Dark/Light themes

</td>
</tr>
</table>

---

## 📸 Screenshots

<details open>
<summary><strong>Click to view screenshots</strong></summary>

<table>
<tr>
<td align="center" width="50%">
<img src="screenshots/Home_UIpage.png" alt="Home Page" width="100%"/>
<br/>
<sub><b>🏠 Home Page</b></sub>
</td>
<td align="center" width="50%">
<img src="screenshots/Admindeshborad.png" alt="Admin Dashboard" width="100%"/>
<br/>
<sub><b>⚙️ Admin Dashboard</b></sub>
</td>
</tr>
<tr>
<td align="center" width="50%">
<img src="screenshots/developer.png" alt="Developer Portal" width="100%"/>
<br/>
<sub><b>👨‍💻 Developer Portal</b></sub>
</td>
<td align="center" width="50%">
<img src="screenshots/investor.png" alt="Investor Interface" width="100%"/>
<br/>
<sub><b>💰 Investor Dashboard</b></sub>
</td>
</tr>
</table>

</details>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ · npm/yarn

### Installation

```bash
# Clone repository
git clone https://github.com/tanzil-def/crowdfunding-platform.git
cd crowdfunding-platform/frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API URLs

# Start development server
npm run dev
```

**🎉 Done!** Open `http://localhost:5173`

---

## ⚙️ Configuration

### Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws

# App Configuration
VITE_APP_NAME=Crowdfunding Platform
VITE_APP_VERSION=1.0.0
```

---

## 🏗️ Project Structure

```
frontend/
├── 📁 src/
│   ├── 📁 components/       # Reusable UI components
│   ├── 📁 pages/            # Route pages
│   │   ├── Admin/           # Admin dashboard
│   │   ├── Developer/       # Developer portal
│   │   └── Investor/        # Investor interface
│   ├── 📁 redux/            # Redux store & slices
│   ├── 📁 hooks/            # Custom React hooks
│   ├── 📁 services/         # API services
│   ├── 📁 utils/            # Helper functions
│   └── 📁 assets/           # Images, icons
├── 📁 public/               # Static files
└── 📁 screenshots/          # App screenshots
```

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 18.x | UI library |
| **Build Tool** | Vite 5.x | Fast bundler |
| **State** | Redux Toolkit | Global state |
| **Styling** | TailwindCSS 3.x | Utility-first CSS |
| **Routing** | React Router 6.x | Navigation |
| **WebSocket** | Socket.io Client | Real-time updates |
| **HTTP** | Axios | API requests |
| **Forms** | React Hook Form | Form validation |

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 5173)

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier

# Testing
npm run test             # Run tests
npm run test:coverage    # Coverage report
```

---

## 🎨 Key Features

### Real-Time Notifications

```javascript
// WebSocket integration
import { useWebSocket } from '@/hooks/useWebSocket';

const { notifications } = useWebSocket();
// Live updates across all dashboards
```

### Redux State Management

```javascript
// Redux Toolkit slice
import { useSelector, useDispatch } from 'react-redux';

const user = useSelector(state => state.auth.user);
const dispatch = useDispatch();
```

### Responsive Design

```jsx
// TailwindCSS utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

---

## 📦 Deployment

### Build for Production

```bash
npm run build
# Output: dist/
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 👨‍💻 Author

<div align="center">

<a href="https://github.com/tanzil-def">
<img src="https://github.com/tanzil-def.png" width="100px" style="border-radius: 50%;" alt="Tanzil"/>
</a>

**Tanzil**  
*Intern at BrainStation-23*

[![GitHub](https://img.shields.io/badge/GitHub-tanzil--def-181717?style=flat-square&logo=github)](https://github.com/tanzil-def)

</div>

---

## 📄 License

MIT License - see [LICENSE](../LICENSE)

---

<div align="center">

**Built with ❤️ using React, Vite, and TailwindCSS**

[⬆ Back to Top](#-crowdfunding-platform---frontend)

</div>
