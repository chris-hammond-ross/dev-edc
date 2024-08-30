import React, { useState, useEffect, MouseEventHandler } from "react";
import {
	BrowserRouter as Router,
	Route,
	Link,
	Routes,
	useLocation,
} from "react-router-dom";
import { Settings } from "lucide-react";
import {
	QuickJSONGenerator,
	Base64EncoderDecoder,
	JWTDecoder,
	CodeMinifierPrettifier,
	UUIDGenerator,
	HashGenerator,
	DiffChecker,
	LoremIpsumGenerator,
	ImageToBase64Converter,
	TimestampConverter,
	TextFormatter as TextFormatterComponent,
	HtmlEntityConverter,
	DataConverter as DataConverterComponent,
	ColorConverter,
	MarkdownPreviewer,
	URLDecoder,
	LogoGenerator as LogoGeneratorComponent,
	ColorPaletteGenerator,
	SymbolCopier,
	EmojiCopier,
} from "./components";
import { Modal } from "./utils";
import { NavigationConfig, ThemeConfig } from "./components/appComponents";
import "./App.css";

interface ToolbarProps {
	onOpenSettings: MouseEventHandler;
}

const Toolbar: React.FC<ToolbarProps> = ({ onOpenSettings }) => (
	<div className="app-toolbar">
		<h1>&#123; Dev EDC &#125;</h1>
		<div className="app-toolbar-button-container">
			<Settings
				className="toolbar-icon"
				size={24}
				onClick={onOpenSettings}
			/>
		</div>
	</div>
);

// Suppress specific warning
const originalError = console.error;
console.error = (...args) => {
	if (args[0].includes("defaultProps")) return;
	originalError.call(console, ...args);
};

const Navigation: React.FC<{ items: Array<{ to: string; label: string }> }> = ({
	items,
}) => {
	const location = useLocation();

	return (
		<div className="nav-container">
			<nav className="navigation">
				{items.map((item) => (
					<Link
						key={item.to}
						to={item.to}
						className={`nav-button ${location.pathname === item.to ? "active" : ""}`}
					>
						{item.label}
					</Link>
				))}
			</nav>
			<a
				href="https://www.buymeacoffee.com/devedc"
				target="_blank"
				style={{ display: "flex", marginTop: "1rem" }}
			>
				<img
					src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
					alt="Buy Me A Coffee"
					width={"100%"}
				></img>
			</a>
		</div>
	);
};

interface HomeProps {
	onOpenSettings: MouseEventHandler;
}

const Home: React.FC<HomeProps> = ({ onOpenSettings }) => (
	<div className="content">
		<div className="component-container">
			<div className="home-page">
				<h1>Welcome to Dev EDC</h1>
				<p>
					Dev EDC is your Everyday carry for software development.
				</p>
				<p>
					Before building Dev EDC, while working at my day job, I
					would constantly find myself opening up a new tab in my
					browser, and Googling <i>url decoder</i>, clicking on the
					first result and pasting in the query I was debugging, or
					Googling <i>whitespace remover</i>, or{" "}
					<i>online diff checker</i> during the course of the day.
				</p>
				<p>
					I came to realise I was forever visiting the same four or
					five websites to perform the sames tasks over and over, and
					I thought I should build something that hosts all of these
					common tools in one location, so I can have one tab always
					open ready to quickly perform a task.
				</p>
				<h2>What Dev EDC Offers:</h2>
				<ul>
					<li>
						<strong>Versatility:</strong> A wide range of tools to
						choose from, catering for different types of developers.
					</li>
					<li>
						<strong>Efficiency:</strong> Access all your frequently
						used tools in one place.
					</li>
					<li>
						<strong>Customization:</strong> Tailor Dev EDC to your
						needs. Adjust themes, reorder tools, and save your
						preferences locally or export them for use across
						devices.
					</li>
					<li>
						<strong>Front end only:</strong> Dev EDC is a static web
						app, allowing users to access tools without the need for
						an internet connection.
					</li>
				</ul>
				<p>
					Explore our tools, customize the theme to you liking, hide any
					tools from the navigation bar to don't require, rearrange the
					tools, and please reach out to hello@devedc.com.
				</p>
				<div className="cta-container">
					<Link to="/quick-json" className="cta-button">
						Try JSON Generator
					</Link>
					<button onClick={onOpenSettings} className="cta-button">
						Customize Dev EDC
					</button>
				</div>
			</div>
		</div>
	</div>
);
const QuickJSON: React.FC = () => (
	<div className="content">
		<QuickJSONGenerator />
	</div>
);
const Base64: React.FC = () => (
	<div className="content">
		<Base64EncoderDecoder />
	</div>
);
const JWT: React.FC = () => (
	<div className="content">
		<JWTDecoder />
	</div>
);
const Regex: React.FC = () => (
	<div className="content">
		<h2>Regular Expression Tester</h2>
		<p>Tool content coming soon...</p>
	</div>
);
const Minifier: React.FC = () => (
	<div className="content">
		<CodeMinifierPrettifier />
	</div>
);
const Markdown: React.FC = () => (
	<div className="content">
		<MarkdownPreviewer />
	</div>
);
const ColorPicker: React.FC = () => (
	<div className="content">
		<ColorConverter />
	</div>
);
const ColorPalette: React.FC = () => (
	<div className="content">
		<ColorPaletteGenerator />
	</div>
);
const UUID: React.FC = () => (
	<div className="content">
		<UUIDGenerator />
	</div>
);
const Hash: React.FC = () => (
	<div className="content">
		<HashGenerator />
	</div>
);
const SQLFormatter: React.FC = () => (
	<div className="content">
		<h2>SQL Formatter</h2>
		<p>Tool content coming soon...</p>
	</div>
);
const DiffCheck: React.FC = () => (
	<div className="content">
		<DiffChecker />
	</div>
);
const HTMLEntity: React.FC = () => (
	<div className="content">
		<HtmlEntityConverter />
	</div>
);
const DataConverter: React.FC = () => (
	<div className="content">
		<DataConverterComponent />
	</div>
);
const CronGenerator: React.FC = () => (
	<div className="content">
		<h2>Cron Expression Generator/Explainer</h2>
		<p>Tool content coming soon...</p>
	</div>
);
const LoremIpsum: React.FC = () => (
	<div className="content">
		<LoremIpsumGenerator />
	</div>
);
const ImageBase64: React.FC = () => (
	<div className="content">
		<ImageToBase64Converter />
	</div>
);
const Timestamp: React.FC = () => (
	<div className="content">
		<TimestampConverter />
	</div>
);
const TextFormatter: React.FC = () => (
	<div className="content">
		<TextFormatterComponent />
	</div>
);
const URLDecoderEncoder: React.FC = () => (
	<div className="content">
		<URLDecoder />
	</div>
);
const LogoGenerator: React.FC = () => (
	<div className="content">
		<LogoGeneratorComponent />
	</div>
);
const SymbolCopy: React.FC = () => (
	<div className="content">
		<SymbolCopier />
	</div>
);
const EmojiCopy: React.FC = () => (
	<div className="content">
		<EmojiCopier />
	</div>
);

interface NavItem {
	to: string;
	label: string;
	id: string;
	hidden: boolean;
}

interface ThemeColors {
	"toolbar-bg": string;
	"nav-bg": string;
	"nav-main": string;
	"nav-secondary": string;
	"nav-tertiary": string;
	"text-main": string;
	"text-secondary": string;
	"text-tertiary": string;
	"text-muted": string;
	"main-bg": string;
	"secondary-bg": string;
	"tertiary-bg": string;
	"content-main-bg": string;
	"content-secondary-bg": string;
	"content-tertiary-bg": string;
}

const defaultTheme: ThemeColors = {
	"toolbar-bg": "#5d6d97",
	"nav-bg": "#424f6f",
	"nav-main": "#262c3d",
	"nav-secondary": "#0f4c8f",
	"nav-tertiary": "#5672c3",
	"text-main": "#ffffff",
	"text-secondary": "#d4d4d4",
	"text-tertiary": "#9cdcfe",
	"text-muted": "#757575",
	"main-bg": "#1a1a1a",
	"secondary-bg": "#232323",
	"tertiary-bg": "#515151",
	"content-main-bg": "#353535",
	"content-secondary-bg": "#434343",
	"content-tertiary-bg": "#676767",
};

const App: React.FC = () => {
	const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
	const [navItems, setNavItems] = useState<NavItem[]>([
		{ to: "/", label: "Home", id: "home", hidden: false },
		{
			to: "/quick-json",
			label: "Quick JSON",
			id: "quick-json",
			hidden: false,
		},
		{
			to: "/base64",
			label: "Base64 Encoder/Decoder",
			id: "base64",
			hidden: false,
		},
		{ to: "/jwt", label: "JWT Decoder", id: "jwt", hidden: false },
		{
			to: "/minifier",
			label: "Code Minifier",
			id: "minifier",
			hidden: false,
		},
		{ to: "/uuid", label: "UUID Generator", id: "uuid", hidden: false },
		{ to: "/hash", label: "Hash Generator", id: "hash", hidden: false },
		{ to: "/diff", label: "Diff Checker", id: "diff", hidden: false },
		{
			to: "/lorem-ipsum",
			label: "Lorem Ipsum",
			id: "lorem-ipsum",
			hidden: false,
		},
		{
			to: "/image-base64",
			label: "Image to Base64",
			id: "image-base64",
			hidden: false,
		},
		{
			to: "/timestamp",
			label: "Timestamp Converter",
			id: "timestamp",
			hidden: false,
		},
		{
			to: "/text-formatter",
			label: "Whitespace/Linebreak Formatter",
			id: "text-formatter",
			hidden: false,
		},
		{
			to: "/html-entity",
			label: "HTML Entity Encoder/Decoder",
			id: "html-entity",
			hidden: false,
		},
		{
			to: "/data-converter",
			label: "Data Converter JSON/YAML/CSV",
			id: "data-converter",
			hidden: false,
		},
		{
			to: "/color-converter",
			label: "Color Converter",
			id: "color-converter",
			hidden: false,
		},
		{
			to: "/markdown",
			label: "Markdown Preview",
			id: "markdown",
			hidden: false,
		},
		{
			to: "/url-decoder",
			label: "URL Decoder/Encoder",
			id: "url-decoder",
			hidden: false,
		},
		{
			to: "/logo-generator",
			label: "Logo Generator",
			id: "logo-generator",
			hidden: false,
		},
		{
			to: "/color-palette",
			label: "Color Palette Generator",
			id: "color-palette",
			hidden: false,
		},
		{ to: "/symbol", label: "Symbol Copier", id: "symbol-copy", hidden: false },
		{ to: "/emoji", label: "Emoji Copier", id: "emoji-copy", hidden: false },
		/*{ to: "/regex", label: "Regular Expression Tester", id: "regex", hidden: false, },
		{ to: "/cron", label: "Cron Expression Generator", id: "cron", hidden: false, },
		{ to: "/sql-formatter", label: "SQL Formatter", id: "sql-formatter", hidden: false, },*/
	]);
	const [tempNavItems, setTempNavItems] = useState<NavItem[]>(navItems);
	const [savedTheme, setSavedTheme] = useState<ThemeColors>(() => {
		const stored = localStorage.getItem("userTheme");
		return stored ? JSON.parse(stored) : defaultTheme;
	});
	const [tempTheme, setTempTheme] = useState<ThemeColors>(savedTheme);

	useEffect(() => {
		const savedNavItems = localStorage.getItem("navItems");
		if (savedNavItems) {
			const parsedNavItems = JSON.parse(savedNavItems);
			setNavItems(parsedNavItems);
			setTempNavItems(parsedNavItems);
		}
	}, []);

	useEffect(() => {
		Object.entries(savedTheme).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--color-${key}`, value);
		});
		console.log("theme changed 1");
	}, [savedTheme]);

	const openSettings = (): void => {
		setTempTheme(savedTheme); // Reset tempTheme to saved theme when opening settings
		setIsSettingsOpen(true);
	};

	const handleCloseSettings = (): void => {
		setIsSettingsOpen(false);
		setTempTheme(savedTheme);
		Object.entries(savedTheme).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--color-${key}`, value);
		});
		console.log("theme changed 2");
		setTempNavItems(navItems);
	};

	const handleSaveSettings = (): void => {
		setSavedTheme(tempTheme);
		localStorage.setItem("userTheme", JSON.stringify(tempTheme));
		setNavItems(tempNavItems);
		localStorage.setItem("navItems", JSON.stringify(tempNavItems));
		setIsSettingsOpen(false);
	};

	const handleThemeChange = (newTheme: ThemeColors): void => {
		if (isSettingsOpen) {
			setTempTheme(newTheme);
			// Apply the new theme temporarily while the modal is open
			Object.entries(newTheme).forEach(([key, value]) => {
				document.documentElement.style.setProperty(
					`--color-${key}`,
					value,
				);
			});
			console.log("theme changed 3");
		}
	};

	const handleTempNavItemsChange = (updatedNavItems: NavItem[]): void => {
		setTempNavItems(updatedNavItems);
	};

	const settingsTabs = [
		{
			id: "navigation",
			label: "Navigation",
			content: (
				<NavigationConfig
					navItems={tempNavItems}
					onSaveSettings={handleTempNavItemsChange}
				/>
			),
		},
		{
			id: "appearance",
			label: "Appearance",
			content: (
				<ThemeConfig
					currentTheme={tempTheme}
					onThemeChange={handleThemeChange}
				/>
			),
		},
		// Add more tabs as needed
	];

	return (
		<Router>
			<div className="app-container">
				<Toolbar onOpenSettings={openSettings} />
				<div className="main-container">
					<Navigation
						items={navItems.filter((item) => !item.hidden)}
					/>
					<main>
						<Routes>
							<Route
								path="/"
								element={<Home onOpenSettings={openSettings} />}
							/>
							<Route path="/quick-json" element={<QuickJSON />} />
							<Route path="/base64" element={<Base64 />} />
							<Route path="/jwt" element={<JWT />} />
							<Route path="/regex" element={<Regex />} />
							<Route path="/minifier" element={<Minifier />} />
							<Route path="/markdown" element={<Markdown />} />
							<Route path="/color" element={<ColorPicker />} />
							<Route path="/uuid" element={<UUID />} />
							<Route path="/hash" element={<Hash />} />
							<Route
								path="/url-decoder"
								element={<URLDecoderEncoder />}
							/>
							<Route
								path="/data-converter"
								element={<DataConverter />}
							/>
							<Route
								path="/sql-formatter"
								element={<SQLFormatter />}
							/>
							<Route path="/diff" element={<DiffCheck />} />
							<Route
								path="/html-entity"
								element={<HTMLEntity />}
							/>
							<Route path="/cron" element={<CronGenerator />} />
							<Route
								path="/lorem-ipsum"
								element={<LoremIpsum />}
							/>
							<Route
								path="/image-base64"
								element={<ImageBase64 />}
							/>
							<Route path="/timestamp" element={<Timestamp />} />
							<Route
								path="/text-formatter"
								element={<TextFormatter />}
							/>
							<Route
								path="/color-converter"
								element={<ColorPicker />}
							/>
							<Route path="/markdown" element={<Markdown />} />
							<Route
								path="/logo-generator"
								element={<LogoGenerator />}
							/>
							<Route
								path="/color-palette"
								element={<ColorPalette />}
							/>
							<Route
								path="/symbol"
								element={<SymbolCopy />}
							/>
							<Route
								path="/emoji"
								element={<EmojiCopy />}
							/>
						</Routes>
					</main>
				</div>
				<Modal
					isOpen={isSettingsOpen}
					onClose={handleCloseSettings}
					size="large"
					type="settings"
					title="Settings"
					footerActionLabel="Save Changes"
					onFooterAction={handleSaveSettings}
					tabs={settingsTabs}
				>
					<NavigationConfig
						navItems={tempNavItems}
						onSaveSettings={handleTempNavItemsChange}
					/>
				</Modal>
			</div>
		</Router>
	);
};

export default App;
