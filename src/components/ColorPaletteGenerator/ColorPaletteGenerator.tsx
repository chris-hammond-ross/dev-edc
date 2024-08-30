import React, { useState, useEffect } from "react";
import { Wheel, ShadeSlider } from "@uiw/react-color";
import { HsvaColor, hsvaToHex, hexToHsva } from "@uiw/color-convert";
import { Modal, ModalProps } from "../../utils";
import "./ColorPaletteGenerator.css";

interface ColorPalette {
	[key: string]: string;
}

interface HSL {
	h: number;
	s: number;
	l: number;
}

const ColorPaletteGenerator: React.FC = () => {
	const [hsva, setHsva] = useState<HsvaColor>({ h: 0, s: 0, v: 100, a: 1 });
	const [paletteStyle, setPaletteStyle] = useState<string>("complementary");
	const [colorCount, setColorCount] = useState<number>(5);
	const [prefix, setPrefix] = useState<string>("");
	const [suffix, setSuffix] = useState<string>("");
	const [generatedPalette, setGeneratedPalette] = useState<ColorPalette>({});
	const [cssOutput, setCssOutput] = useState<string>("");
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");

	useEffect(() => {
		generatePalette();
	}, [hsva, paletteStyle, colorCount]);

	useEffect(() => {
		generateCSSOutput(generatedPalette);
	}, [prefix, suffix]);

	const generatePalette = (): void => {
		const palette: ColorPalette = {};
		const rootColor = hsvaToHex(hsva);
		const hsl = hexToHSL(rootColor);

		switch (paletteStyle) {
			case "complementary":
				generateComplementaryPalette(palette, hsl);
				break;
			case "triad":
				generateTriadPalette(palette, hsl);
				break;
			case "monochromatic":
				generateMonochromaticPalette(palette, hsl);
				break;
			case "analogous":
				generateAnalogousPalette(palette, hsl);
				break;
			default:
				palette["primary"] = rootColor;
		}

		setGeneratedPalette(palette);
		generateCSSOutput(palette);
	};

	const generateComplementaryPalette = (
		palette: ColorPalette,
		hsl: HSL,
	): void => {
		const halfCount = Math.floor(colorCount / 2);
		const remainingCount = colorCount - halfCount;

		for (let i = 0; i < remainingCount; i++) {
			const lightness = adjustLightness(hsl.l, i, remainingCount);
			palette[getOrdinal(i + 1)] = hslToHex(hsl.h, hsl.s, lightness);
		}

		const complementaryHue = (hsl.h + 180) % 360;
		for (let i = 0; i < halfCount; i++) {
			const lightness = adjustLightness(hsl.l, i, halfCount);
			palette[getOrdinal(i + remainingCount + 1)] = hslToHex(
				complementaryHue,
				hsl.s,
				lightness,
			);
		}
	};

	const generateTriadPalette = (palette: ColorPalette, hsl: HSL): void => {
		const thirdCount = Math.floor(colorCount / 3);
		const remainingCount = colorCount - thirdCount * 2;

		const hues = [hsl.h, (hsl.h + 120) % 360, (hsl.h + 240) % 360];

		for (let i = 0; i < remainingCount; i++) {
			const lightness = adjustLightness(hsl.l, i, remainingCount);
			palette[getOrdinal(i + 1)] = hslToHex(hues[0], hsl.s, lightness);
		}

		for (let j = 1; j < 3; j++) {
			for (let i = 0; i < thirdCount; i++) {
				const lightness = adjustLightness(hsl.l, i, thirdCount);
				palette[
					getOrdinal(
						i +
							j * thirdCount +
							(j === 2 ? remainingCount - thirdCount : 0) +
							1,
					)
				] = hslToHex(hues[j], hsl.s, lightness);
			}
		}
	};

	const generateMonochromaticPalette = (
		palette: ColorPalette,
		hsl: HSL,
	): void => {
		for (let i = 0; i < colorCount; i++) {
			const lightness = adjustLightness(hsl.l, i, colorCount);
			palette[getOrdinal(i + 1)] = hslToHex(hsl.h, hsl.s, lightness);
		}
	};

	const generateAnalogousPalette = (
		palette: ColorPalette,
		hsl: HSL,
	): void => {
		const hueStep = 30 / (colorCount - 1);
		for (let i = 0; i < colorCount; i++) {
			const hue =
				(hsl.h + (i - Math.floor(colorCount / 2)) * hueStep + 360) %
				360;
			palette[getOrdinal(i + 1)] = hslToHex(hue, hsl.s, hsl.l);
		}
	};

	const adjustLightness = (
		baseLightness: number,
		index: number,
		total: number,
	): number => {
		const minLightness = Math.max(0, baseLightness - 30);
		const maxLightness = Math.min(100, baseLightness + 30);
		return (
			minLightness + (index * (maxLightness - minLightness)) / (total - 1)
		);
	};

	const generateCSSOutput = (palette: ColorPalette): void => {
		let output = "";
		Object.entries(palette).forEach(([key, value]) => {
			const prefixDisplay = prefix ? `${prefix}-` : "";
			const suffixDisplay = suffix ? `-${suffix}` : "";
			output += `--${prefixDisplay}${key}${suffixDisplay}: ${value};\n`;
		});
		setCssOutput(output);
	};

	const hexToHSL = (hex: string): HSL => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (!result) {
			return { h: 0, s: 0, l: 0 };
		}
		let r = parseInt(result[1], 16);
		let g = parseInt(result[2], 16);
		let b = parseInt(result[3], 16);
		(r /= 255), (g /= 255), (b /= 255);
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		let h = 0,
			s;
		const l = (max + min) / 2;
		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}
		return { h: h * 360, s: s! * 100, l: l * 100 };
	};

	const hslToHex = (h: number, s: number, l: number): string => {
		l /= 100;
		const a = (s * Math.min(l, 1 - l)) / 100;
		const f = (n: number) => {
			const k = (n + h / 30) % 12;
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
			return Math.round(255 * color)
				.toString(16)
				.padStart(2, "0");
		};
		return `#${f(0)}${f(8)}${f(4)}`;
	};

	const getOrdinal = (n: number): string => {
		const ordinals = [
			"primary",
			"secondary",
			"tertiary",
			"quaternary",
			"quinary",
			"senary",
			"septenary",
			"octonary",
			"nonary",
			"denary",
		];
		return ordinals[n - 1] || `color${n}`;
	};

	const clear = (): void => {
		setHsva({ h: 0, s: 0, v: 100, a: 1 });
		setGeneratedPalette({ primary: "#NaNNaNNaN" });
		setPrefix("");
		setSuffix("");
		setCssOutput("");
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setAlertMessage("Copied to clipboard!");
				setAlertTheme("success");
				setIsAlertModalOpen(true);
			})
			.catch(() => {
				setAlertMessage(
					"Failed to copy. Please try selecting and copying manually.",
				);
				setAlertTheme("error");
				setIsAlertModalOpen(true);
			});
	};

	return (
		<>
			<div className="toolbar">
				<h2>Color Palette Generator</h2>
				<div className="toolbar-button-container">
					<div className="toolbar-button-lable-container">
						<label htmlFor="paletteStyle">Style:</label>
						<select
							id="paletteStyle"
							value={paletteStyle}
							onChange={(e) => setPaletteStyle(e.target.value)}
						>
							<option value="complementary">Complementary</option>
							<option value="triad">Triad</option>
							<option value="monochromatic">Monochromatic</option>
							<option value="analogous">Analogous</option>
						</select>
					</div>
					<div className="toolbar-button-lable-container">
						<label htmlFor="colorCount">Amount of Colors:</label>
						<input
							type="number"
							id="colorCount"
							min="2"
							max="10"
							value={colorCount}
							onChange={(e) =>
								setColorCount(parseInt(e.target.value))
							}
						/>
					</div>
				</div>
			</div>
			<div className="component-container">
				<div className="input-container color-palette-input">
					<div className="color-picker-container">
						<Wheel
							height={320}
							width={320}
							color={hsva}
							onChange={(color) => {
								setHsva({ ...hsva, ...color.hsva });
							}}
						/>
						<ShadeSlider
							hsva={hsva}
							onChange={(newShade) => {
								setHsva({ ...hsva, ...newShade });
							}}
						/>
					</div>
					<textarea
						spellCheck={false}
						value={hsvaToHex(hsva)}
						onChange={(e) => setHsva(hexToHsva(e.target.value))}
						placeholder="Enter root color"
					/>
					<textarea
						spellCheck={false}
						value={prefix}
						onChange={(e) => setPrefix(e.target.value)}
						placeholder="Enter CSS prefix (optional)"
					/>
					<textarea
						spellCheck={false}
						value={suffix}
						onChange={(e) => setSuffix(e.target.value)}
						placeholder="Enter CSS suffix (optional)"
					/>
					<button onClick={() => clear()}>Clear</button>
				</div>
				<div className="output-container">
					<div className="output-segment output-palette">
						<h3>Generated Palette</h3>
						{generatedPalette.primary !== "#NaNNaNNaN" ? (
							<div className="color-palette-preview">
								{Object.entries(generatedPalette).map(
									([key, value]) => (
										<div
											key={key}
											className="color-swatch"
											style={{ backgroundColor: value }}
											title={`${key}: ${value}`}
										></div>
									),
								)}
							</div>
						) : (
							<div className="color-palette-placeholder"></div>
						)}
					</div>
					<div className="output-segment">
						<h3>CSS Output</h3>
						{generatedPalette.primary !== "#NaNNaNNaN" ? (
							<textarea
								readOnly
								value={cssOutput}
								placeholder="Generated CSS will appear here"
							/>
						) : (
							<div className="faux-output">
								<div className="faux-placeholder">
									Generated CSS will appear here
								</div>
							</div>
						)}
						<button onClick={() => copyToClipboard(cssOutput)}>
							Copy CSS
						</button>
					</div>
				</div>
			</div>
			<Modal
				isOpen={isAlertModalOpen}
				onClose={() => setIsAlertModalOpen(false)}
				type="alert"
				theme={alertTheme}
				autoClose={1}
			>
				{alertMessage}
			</Modal>
		</>
	);
};

export default ColorPaletteGenerator;
