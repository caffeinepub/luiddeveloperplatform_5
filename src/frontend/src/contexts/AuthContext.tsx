import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "user";

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface Rating {
  reviewer: string;
  score: number;
  comment: string;
}

export type ProductCategory =
  | "Discord Bots"
  | "Automation Scripts"
  | "AI Tools"
  | "APIs";

export interface Product {
  id: number;
  name: string;
  description: string;
  version: string;
  price: number;
  subscriptionPrice: number;
  category: ProductCategory;
  ratings: Rating[];
}

export type OrderType = "Purchase" | "Subscription";
export type OrderStatus = "Active" | "Cancelled" | "Expired";

export interface Order {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  type: OrderType;
  date: Date;
  status: OrderStatus;
  amount: number;
}

export interface License {
  id: number;
  userId: number;
  orderId: number;
  productId: number;
  productName: string;
  key: string;
  type: OrderType;
  issuedAt: Date;
  expiresAt: Date | null;
  status: "Active" | "Expired";
}

interface RegisteredUser {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  joinedAt: Date;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "DiscordGuard Bot",
    description:
      "Advanced moderation bot with spam filters, anti-raid and detailed logs. Protect your Discord server with intelligent auto-moderation, custom rule sets, and comprehensive audit logging. Supports multiple languages and custom responses.",
    version: "2.4.1",
    price: 49.99,
    subscriptionPrice: 9.99,
    category: "Discord Bots",
    ratings: [
      { reviewer: "DevMaster", score: 5, comment: "Excellent bot!" },
      { reviewer: "ServerAdmin", score: 4, comment: "Works perfectly" },
    ],
  },
  {
    id: 2,
    name: "MusicMaster Bot",
    description:
      "Premium music bot with Spotify, YouTube, SoundCloud support, unlimited queues. Crystal-clear audio, seamless playlist management, DJ mode, equalizer settings, and 24/7 uptime guarantee for uninterrupted music sessions.",
    version: "3.1.0",
    price: 29.99,
    subscriptionPrice: 5.99,
    category: "Discord Bots",
    ratings: [
      { reviewer: "MusicLover", score: 5, comment: "Best music bot!" },
      { reviewer: "DJPro", score: 5, comment: "Incredible quality" },
    ],
  },
  {
    id: 3,
    name: "AutoPost Pro",
    description:
      "Automate posts across multiple platforms with intelligent scheduling. Schedule content for Twitter, LinkedIn, Instagram, and Facebook simultaneously. AI-powered optimal timing, analytics dashboard, and bulk upload support.",
    version: "1.8.3",
    price: 79.99,
    subscriptionPrice: 14.99,
    category: "Automation Scripts",
    ratings: [
      { reviewer: "MarketingGuru", score: 5, comment: "Saved hours!" },
      { reviewer: "SocialManager", score: 4, comment: "Very useful" },
    ],
  },
  {
    id: 4,
    name: "DataScraper Elite",
    description:
      "Collect and organize data from any website with CSV, JSON export. Advanced proxy rotation, JavaScript rendering, CAPTCHA bypass, and scheduled scraping jobs. Export to multiple formats with real-time monitoring.",
    version: "4.2.0",
    price: 99.99,
    subscriptionPrice: 19.99,
    category: "Automation Scripts",
    ratings: [
      {
        reviewer: "DataAnalyst",
        score: 5,
        comment: "Powerful and reliable",
      },
      {
        reviewer: "ResearchPro",
        score: 4,
        comment: "Exactly what I needed",
      },
    ],
  },
  {
    id: 5,
    name: "ContentAI Writer",
    description:
      "Generate professional content with AI for blogs, social media, email marketing. GPT-4 powered with custom brand voice training, SEO optimization, plagiarism check, and 50+ content templates for every business need.",
    version: "2.0.1",
    price: 149.99,
    subscriptionPrice: 29.99,
    category: "AI Tools",
    ratings: [
      {
        reviewer: "Blogger2024",
        score: 5,
        comment: "Revolutionized my production!",
      },
      {
        reviewer: "ContentCreator",
        score: 5,
        comment: "Very precise AI",
      },
    ],
  },
  {
    id: 6,
    name: "ImageGen Studio",
    description:
      "Create professional images with AI for marketing, UI/UX, branding. Generate logos, banners, social media graphics, and product mockups. Supports batch generation, style transfer, background removal, and commercial licensing.",
    version: "1.5.2",
    price: 199.99,
    subscriptionPrice: 39.99,
    category: "AI Tools",
    ratings: [
      { reviewer: "Designer", score: 5, comment: "Impressive quality" },
      { reviewer: "UIDevPro", score: 4, comment: "Very versatile" },
    ],
  },
  {
    id: 7,
    name: "PaymentGateway API",
    description:
      "Complete payment processing API with multi-currency support. Accept cards, crypto, PIX, and 40+ payment methods worldwide. PCI DSS compliant, sub-100ms response time, fraud detection, and webhook notifications.",
    version: "3.0.0",
    price: 249.99,
    subscriptionPrice: 49.99,
    category: "APIs",
    ratings: [
      {
        reviewer: "FinTechDev",
        score: 5,
        comment: "Easy and secure integration",
      },
      {
        reviewer: "StartupCTO",
        score: 5,
        comment: "Essential for e-commerce",
      },
    ],
  },
  {
    id: 8,
    name: "WeatherData API",
    description:
      "Access real-time weather data from any location with 7-day forecasts. 50,000+ weather stations, historical data since 2000, severe weather alerts, air quality index, UV index, and detailed hourly breakdowns.",
    version: "2.1.0",
    price: 59.99,
    subscriptionPrice: 11.99,
    category: "APIs",
    ratings: [
      {
        reviewer: "AppDeveloper",
        score: 4,
        comment: "Accurate data, fast API",
      },
      {
        reviewer: "MeteoFan",
        score: 5,
        comment: "Best weather API available",
      },
    ],
  },
];

const INITIAL_USERS: RegisteredUser[] = [
  {
    id: 1,
    username: "SidneiCosta00",
    password: "Nikebolado@4",
    role: "admin",
    joinedAt: new Date("2024-01-01"),
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  sessionToken: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  licenses: License[];
  purchaseProduct: (productId: number, type: OrderType) => void;
  allUsers: RegisteredUser[];
  nextOrderId: React.MutableRefObject<number>;
  nextLicenseId: React.MutableRefObject<number>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

function generateLicenseKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segment = () =>
    Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
  return `LUID-${segment()}-${segment()}-${segment()}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loginTime, setLoginTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredUsers, setRegisteredUsers] =
    useState<RegisteredUser[]>(INITIAL_USERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);

  const orderIdRef = React.useRef(1);
  const licenseIdRef = React.useRef(1);

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 400));
      try {
        // Check session freshness
        if (loginTime) {
          const elapsed = Date.now() - loginTime.getTime();
          const hours24 = 24 * 60 * 60 * 1000;
          if (elapsed > hours24) {
            setUser(null);
            setSessionToken(null);
            setLoginTime(null);
          }
        }

        const found = registeredUsers.find(
          (u) => u.username === username && u.password === password,
        );
        if (!found) {
          throw new Error("Invalid username or password");
        }

        const token = `token-${found.id}-${Date.now()}`;
        setUser({ id: found.id, username: found.username, role: found.role });
        setSessionToken(token);
        setLoginTime(new Date());
      } finally {
        setIsLoading(false);
      }
    },
    [registeredUsers, loginTime],
  );

  const register = useCallback(
    async (username: string, password: string): Promise<void> => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 400));
      try {
        const exists = registeredUsers.find((u) => u.username === username);
        if (exists) {
          throw new Error("Username already taken");
        }

        const newId = registeredUsers.length + 1;
        const newUser: RegisteredUser = {
          id: newId,
          username,
          password,
          role: "user",
          joinedAt: new Date(),
        };
        setRegisteredUsers((prev) => [...prev, newUser]);

        const token = `token-${newId}-${Date.now()}`;
        setUser({ id: newId, username, role: "user" });
        setSessionToken(token);
        setLoginTime(new Date());
      } finally {
        setIsLoading(false);
      }
    },
    [registeredUsers],
  );

  const logout = useCallback(() => {
    setUser(null);
    setSessionToken(null);
    setLoginTime(null);
  }, []);

  const purchaseProduct = useCallback(
    (productId: number, type: OrderType) => {
      if (!user) return;

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const orderId = orderIdRef.current++;
      const licenseId = licenseIdRef.current++;

      const now = new Date();
      const expiresAt =
        type === "Subscription"
          ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          : null;

      const newOrder: Order = {
        id: orderId,
        userId: user.id,
        productId,
        productName: product.name,
        type,
        date: now,
        status: "Active",
        amount: type === "Purchase" ? product.price : product.subscriptionPrice,
      };

      const newLicense: License = {
        id: licenseId,
        userId: user.id,
        orderId,
        productId,
        productName: product.name,
        key: generateLicenseKey(),
        type,
        issuedAt: now,
        expiresAt,
        status: "Active",
      };

      setOrders((prev) => [...prev, newOrder]);
      setLicenses((prev) => [...prev, newLicense]);
    },
    [user, products],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      sessionToken,
      isLoading,
      login,
      register,
      logout,
      products,
      setProducts,
      orders,
      licenses,
      purchaseProduct,
      allUsers: registeredUsers,
      nextOrderId: orderIdRef,
      nextLicenseId: licenseIdRef,
    }),
    [
      user,
      sessionToken,
      isLoading,
      login,
      register,
      logout,
      products,
      orders,
      licenses,
      purchaseProduct,
      registeredUsers,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
