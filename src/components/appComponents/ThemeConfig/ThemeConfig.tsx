import React, { useState, useEffect } from "react";
import { Wheel, ColorResult } from "@uiw/react-color";
//import { ShadeSlider } from "@uiw/react-color";
import { HsvaColor, hsvaToHex, hexToHsva } from "@uiw/color-convert";
import "./ThemeConfig.css";

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

const firstColorGroup: (keyof ThemeColors)[] = [
	"toolbar-bg",
	"nav-bg",
	"nav-main",
	"nav-secondary",
	"nav-tertiary",
	"text-tertiary",
];

const secondColorGroup: (keyof ThemeColors)[] = [
	"text-main",
	"text-secondary",
	"text-muted",
	"main-bg",
	"secondary-bg",
	"tertiary-bg",
	"content-main-bg",
	"content-secondary-bg",
	"content-tertiary-bg",
];

interface ThemeConfigProps {
	currentTheme: ThemeColors;
	onThemeChange: (theme: ThemeColors) => void;
}

const ThemeConfig: React.FC<ThemeConfigProps> = ({
	currentTheme,
	onThemeChange,
}) => {
	const [tempTheme, setTempTheme] = useState<ThemeColors>(currentTheme);
	const [firstHsva, setFirstHsva] = useState<HsvaColor>(
		hexToHsva(currentTheme["toolbar-bg"]),
	);
	const [secondHsva, setSecondHsva] = useState<HsvaColor>(
		hexToHsva(currentTheme["main-bg"]),
	);

	useEffect(() => {
		// Update CSS variables when tempTheme changes
		Object.entries(tempTheme).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--color-${key}`, value);
		});
		// Notify parent component of the theme change
		onThemeChange(tempTheme);
	}, [tempTheme, onThemeChange]);

	useEffect(() => {
		// Function to add class to modal overlay
		const addClassToModalOverlay = () => {
			const modalOverlay = document.querySelector(".modal-overlay");
			if (modalOverlay) {
				modalOverlay.classList.add("hide-modal-overlay");
			}
		};

		// Add class when component mounts
		addClassToModalOverlay();

		// Remove class when component unmounts
		return () => {
			const modalOverlay = document.querySelector(".modal-overlay");
			if (modalOverlay) {
				modalOverlay.classList.remove("hide-modal-overlay");
			}
		};
	}, []);

	const handleColorChange =
		(colorKey: keyof ThemeColors) =>
		(e: React.ChangeEvent<HTMLInputElement>): void => {
			const newColor = e.target.value;
			setTempTheme((prevTheme) => ({
				...prevTheme,
				[colorKey]: newColor,
			}));
			if (firstColorGroup.includes(colorKey)) {
				setFirstHsva(hexToHsva(newColor));
			} else if (secondColorGroup.includes(colorKey)) {
				setSecondHsva(hexToHsva(newColor));
			}
		};

	const handleFirstWheelChange = (color: ColorResult) => {
		setFirstHsva(color.hsva);
		const newHex = color.hex;
		updateColorGroup(firstColorGroup, newHex);
	};

	const handleSecondWheelChange = (color: ColorResult) => {
		setSecondHsva(color.hsva);
		const newHex = color.hex;
		updateColorGroup(secondColorGroup, newHex);
	};

	/*const handleFirstShadeChange = (newShade: { v: number }) => {
		const newHsva = { ...firstHsva, ...newShade };
		setFirstHsva(newHsva);
		const newHex = hsvaToHex(newHsva);
		updateColorGroup(firstColorGroup, newHex);
	};

	const handleSecondShadeChange = (newShade: { v: number }) => {
		const newHsva = { ...secondHsva, ...newShade };
		setSecondHsva(newHsva);
		const newHex = hsvaToHex(newHsva);
		updateColorGroup(secondColorGroup, newHex);
	};*/

	const updateColorGroup = (
		colorGroup: (keyof ThemeColors)[],
		baseColor: string,
	) => {
		const baseHsv = hexToHsva(baseColor);
		setTempTheme((prevTheme) => {
			const newTheme = { ...prevTheme };
			colorGroup.forEach((key) => {
				const currentHsv = hexToHsva(prevTheme[key]);
				const newHsv = {
					h: baseHsv.h,
					s: baseHsv.s,
					v: currentHsv.v,
					a: currentHsv.a,
				};
				newTheme[key] = hsvaToHex(newHsv);
			});
			return newTheme;
		});
	};

	const handleResetToDefault = () => {
		setTempTheme(defaultTheme);
		setFirstHsva(hexToHsva(defaultTheme["toolbar-bg"]));
		setSecondHsva(hexToHsva(defaultTheme["main-bg"]));
	};

	const handleExport = () => {
		const dataStr =
			"data:text/json;charset=utf-8," +
			encodeURIComponent(JSON.stringify(tempTheme));
		const downloadAnchorNode = document.createElement("a");
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", "theme_config.json");
		document.body.appendChild(downloadAnchorNode);
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	};

	const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const importedTheme = JSON.parse(
						e.target?.result as string,
					) as ThemeColors;
					setTempTheme(importedTheme);
					setFirstHsva(hexToHsva(importedTheme["toolbar-bg"]));
					setSecondHsva(hexToHsva(importedTheme["main-bg"]));
				} catch (error) {
					console.error("Error parsing imported theme:", error);
					alert("Invalid theme file");
				}
			};
			reader.readAsText(file);
		}
	};

	return (
		<div className="theme-config-container">
			<div className="modal-content-header">
				<h3>Customize Theme</h3>
				<div className="modal-actions-container">
					<button onClick={handleResetToDefault}>
						Reset to Default
					</button>
					<button onClick={handleExport}>Export Theme</button>
					<input
						type="file"
						accept=".json"
						onChange={handleImport}
						style={{ display: "none" }}
						id="import-theme"
					/>
					<label htmlFor="import-theme" className="button">
						Import Theme
					</label>
				</div>
			</div>

			<div className="theme-config-content">
				<div className="theme-item-container">
					{Object.entries(tempTheme).map(([key, value]) => (
						<div className="theme-item" key={key}>
							<label htmlFor={key}>
								{key.charAt(0).toUpperCase() +
									key
										.slice(1)
										.replace(/-/g, " ")
										.replace("bg", "background")}
								:
							</label>
							<input
								type="color"
								id={key}
								value={value}
								onChange={handleColorChange(
									key as keyof ThemeColors,
								)}
							/>
						</div>
					))}
				</div>
				<div className="color-wheels-container">
					<div className="color-wheel-container">
						<p>Adjust accent colors</p>
						<div className="color-select-container">
							<Wheel
								color={firstHsva}
								onChange={handleFirstWheelChange}
								width={230}
								height={230}
							/>
							{/*<ShadeSlider
								hsva={firstHsva}
								onChange={handleFirstShadeChange}
							/>*/}
						</div>
					</div>
					<div className="color-wheel-container">
						<p>Adjust standard colors</p>
						<div className="color-select-container">
							<Wheel
								color={secondHsva}
								onChange={handleSecondWheelChange}
								width={230}
								height={230}
							/>
							{/*<ShadeSlider
								hsva={secondHsva}
								onChange={handleSecondShadeChange}
							/>*/}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ThemeConfig;
