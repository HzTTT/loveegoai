import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import AvatarSelection from "./pages/AvatarSelection";
import Home from "./pages/Home";
import Meditation from "./pages/Meditation";
import AccountSettings from "./pages/AccountSettings";
import About from "./pages/About";
import ChatList from "./pages/ChatList";
import ChatDetail from "./pages/ChatDetail";
import Letters from "./pages/Letters";
import Profile from "./pages/Profile";
import LanguageSelection from "./pages/LanguageSelection";
import Landing from "./pages/Landing";
import Experience from "./pages/Experience";
import KoalaVideoDemo from "./pages/KoalaVideoDemo";
import TrainingLesson01 from "./pages/TrainingLesson01";
import TrainingDemo from "./pages/TrainingDemo";
import TrainingStory from "./pages/TrainingStory";
import PaywallA from "./pages/PaywallA";
import PaywallB from "./pages/PaywallB";
import PaywallC from "./pages/PaywallC";
import IntegratedDemo from "./pages/IntegratedDemo";

export const router = createBrowserRouter([
  { path: "/koala-video", Component: KoalaVideoDemo },
  { path: "/training/lesson-01", Component: TrainingLesson01 },
  { path: "/training/story", Component: TrainingStory },
  { path: "/training-demo", Component: TrainingDemo },
  { path: "/paywall-a", Component: PaywallA },
  { path: "/paywall-b", Component: PaywallB },
  { path: "/paywall-c", Component: PaywallC },
  { path: "/demo", Component: IntegratedDemo },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: SignIn },
      { path: "landing", Component: Landing },
      { path: "experience", Component: Experience },
      { path: "signup", Component: SignUp },
      { path: "language", Component: LanguageSelection },
      { path: "onboarding", Component: Onboarding },
      { path: "avatar-selection", Component: AvatarSelection },
      { path: "home", Component: Home },
      { path: "meditation", Component: Meditation },
      { path: "chat", Component: ChatDetail },
      { path: "chat/detail", Component: ChatDetail },
      { path: "chat/list", Component: ChatList },
      { path: "letters", Component: Letters },
      { path: "letters/:id", Component: Letters },
      { path: "profile", Component: Profile },
      { path: "account-settings", Component: AccountSettings },
      { path: "about", Component: About },
    ],
  },
]);
