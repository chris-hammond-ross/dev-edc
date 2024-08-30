import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Modal, ModalProps } from "../../utils";
import "./ColorConverter.css";

interface ColorFormats {
	hex: string;
	rgb: string;
	hsl: string;
	cmyk: string;
}

const ColorConverter: React.FC = () => {
	const [colorInput, setColorInput] = useState<string>("");
	const [pickerColor, setPickerColor] = useState<string>("#000000");
	const [outputColors, setOutputColors] = useState<ColorFormats>({
		hex: "",
		rgb: "",
		hsl: "",
		cmyk: "",
	});
	const [previewColor, setPreviewColor] = useState<string>("");
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");

	useEffect(() => {
		convertColor(colorInput);
	}, [colorInput]);

	useEffect(() => {
		convertColor(pickerColor);
	}, [pickerColor]);

	const convertColor = (color: string) => {
		try {
			let hex = color;
			if (color.startsWith("rgb")) {
				hex = rgbToHex(color);
			} else if (color.startsWith("hsl")) {
				hex = hslToHex(color);
			} else if (!color.startsWith("#")) {
				hex = namedColorToHex(color);
			}

			const rgb = hexToRgb(hex);
			const hsl = rgbToHsl(rgb);
			const cmyk = rgbToCmyk(rgb);

			setOutputColors({
				hex,
				rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
				hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
				cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
			});
			setPreviewColor(hex);
			setPickerColor(hex);
		} catch (error) {
			console.error("Invalid color input");
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setColorInput(e.target.value);
	};

	// Color conversion helper functions
	const hexToRgb = (hex: string) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
				}
			: { r: 0, g: 0, b: 0 };
	};

	const rgbToHex = (rgb: string) => {
		const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	};

	const hslToHex = (hsl: string) => {
		const [h, s, l] = hsl.match(/\d+/g)!.map(Number);
		const rgb = hslToRgb({ h, s: s / 100, l: l / 100 });
		return rgbToHex(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
	};

	const hslToRgb = ({ h, s, l }: { h: number; s: number; l: number }) => {
		let r, g, b;

		if (s === 0) {
			r = g = b = l;
		} else {
			const hue2rgb = (p: number, q: number, t: number) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h / 360 + 1 / 3);
			g = hue2rgb(p, q, h / 360);
			b = hue2rgb(p, q, h / 360 - 1 / 3);
		}

		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255),
		};
	};

	const rgbToHsl = ({ r, g, b }: { r: number; g: number; b: number }) => {
		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		let h = 0,
			s;
		const l = (max + min) / 2;

		if (max === min) {
			h = s = 0;
		} else {
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

		return {
			h: Math.round(h * 360),
			s: Math.round(s * 100),
			l: Math.round(l * 100),
		};
	};

	const rgbToCmyk = ({ r, g, b }: { r: number; g: number; b: number }) => {
		let c = 1 - r / 255;
		let m = 1 - g / 255;
		let y = 1 - b / 255;
		let k = Math.min(c, m, y);

		c = Math.round(((c - k) / (1 - k)) * 100) || 0;
		m = Math.round(((m - k) / (1 - k)) * 100) || 0;
		y = Math.round(((y - k) / (1 - k)) * 100) || 0;
		k = Math.round(k * 100);

		return { c, m, y, k };
	};

	const namedColorToHex = (color: string): string => {
		// Create a temporary element to use the browser's color parsing
		const temp = document.createElement("div");
		temp.style.color = color;
		document.body.appendChild(temp);
		const computedColor = getComputedStyle(temp).color;
		document.body.removeChild(temp);

		// If it's a valid color, it will be in rgb format
		if (computedColor.startsWith("rgb")) {
			return rgbToHex(computedColor);
		}
		throw new Error("Invalid color name");
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
				<h2>Color Converter</h2>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						value={colorInput}
						onChange={handleInputChange}
						placeholder="Enter color - example: #ff0000, rgb(255,0,0), or hsl(0,100%,50%)"
					/>
					<div className="color-picker">
						<HexColorPicker
							color={pickerColor}
							onChange={setPickerColor}
						/>
					</div>
				</div>
				<div className="output-container">
					{Object.entries(outputColors).map(([format, value]) => (
						<div key={format} className="output-segment">
							<h3>{format.toUpperCase()}</h3>
							<div className="color-value">
								<div
									className="color-preview"
									style={{ backgroundColor: previewColor }}
								></div>
								<span>{value}</span>
							</div>
							<button onClick={() => copyToClipboard(value)}>
								Copy
							</button>
						</div>
					))}
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

export default ColorConverter;
