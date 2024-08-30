import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal, ModalProps } from "../../utils";
import "./LogoGenerator.css";

const LogoGenerator: React.FC = () => {
	const [companyName, setCompanyName] = useState<string>("");
	const [generatedSvg, setGeneratedSvg] = useState<string>("");
	const [fontSize, setFontSize] = useState<number>(24);
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");
	const [backgroundColor, setBackgroundColor] = useState<string>("");
	const [shapeColor, setShapeColor] = useState<string>("");
	const svgRef = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		const bgColor = getComputedStyle(document.documentElement)
			.getPropertyValue("--color-main-bg")
			.trim();
		setBackgroundColor(bgColor);
	}, []);

	const generateContrastingColor = (bgColor: string): string => {
		const rgb = parseInt(bgColor.slice(1), 16);
		const r = (rgb >> 16) & 0xff;
		const g = (rgb >> 8) & 0xff;
		const b = (rgb >> 0) & 0xff;
		const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		return luma < 128 ? "#FFFFFF" : "#000000";
	};

	const generateRandomColor = (): string => {
		const color =
			"#" +
			Math.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, "0");
		return generateContrastingColor(backgroundColor) === "#FFFFFF"
			? color
			: invertColor(color);
	};

	const invertColor = (hex: string): string => {
		return (
			"#" +
			(Number(`0x1${hex.slice(1)}`) ^ 0xffffff)
				.toString(16)
				.substr(1)
				.toUpperCase()
		);
	};

	const generateDummyName = (): string => {
		const prefixes = [
			"Tech",
			"Inno",
			"Digi",
			"Cyber",
			"Smart",
			"Quantum",
			"Nexus",
			"Synergy",
			"Fusion",
			"Nova",
		];
		const suffixes = [
			"Corp",
			"Systems",
			"Solutions",
			"Hub",
			"Labs",
			"Dynamics",
			"Logics",
			"Networks",
			"Forge",
			"Pulse",
		];
		return (
			prefixes[Math.floor(Math.random() * prefixes.length)] +
			suffixes[Math.floor(Math.random() * suffixes.length)]
		);
	};

	/*const generateComplexShape = (): string => {
		setShapeColor(generateRandomColor());
		const shapes = [
			`<polygon points="100,0 200,100 100,200 0,100" fill="${shapeColor}" />`,
			`<path d="M100 0 L200 100 L100 200 L0 100 Z" fill="${shapeColor}" />`,
			`<circle cx="100" cy="100" r="100" fill="${shapeColor}" />`,
			`<ellipse cx="100" cy="100" rx="100" ry="75" fill="${shapeColor}" />`,
			`<rect x="0" y="0" width="200" height="200" rx="40" ry="40" fill="${shapeColor}" />`,
			`<path d="M100 0 Q200 0 200 100 Q200 200 100 200 Q0 200 0 100 Q0 0 100 0 Z" fill="${shapeColor}" />`,
		];
		return shapes[Math.floor(Math.random() * shapes.length)];
	};*/

	const generateComplexShape = (): string => {
		const primaryColor = generateRandomColor();
		const secondaryColor = generateRandomColor();
		const tertiaryColor = generateRandomColor();
		setShapeColor(primaryColor);

		const coinFlip: boolean =
			[1, 2][Math.floor(Math.random() * 2)] % 2 === 0 ? true : false;

		if (coinFlip) {
			const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
			const shapes = [
				// Abstract curved shape with gradient
				`<defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" /><stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" /></linearGradient></defs><path d="M20,50 Q50,0 100,50 T180,50 Q200,80 180,110 Q160,180 100,150 Q40,180 20,110 Q0,80 20,50 Z" fill="url(#${gradientId})" /><path d="M70,80 Q100,20 130,80 T160,110 Q130,150 100,130 Q70,150 40,110 Q70,80 100,100 Z" fill="${tertiaryColor}" fill-opacity="0.6" />`,
				// Overlapping circles with gradient
				`<defs><radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" /><stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" /></radialGradient></defs><circle cx="75" cy="75" r="75" fill="url(#${gradientId})" /><circle cx="125" cy="125" r="75" fill="${tertiaryColor}" fill-opacity="0.7" />`,
				// Hexagonal pattern
				`<defs><pattern id="hexPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><polygon points="20,0 40,10 40,30 20,40 0,30 0,10" fill="${primaryColor}" /></pattern></defs><rect x="0" y="0" width="200" height="200" fill="url(#hexPattern)" /><circle cx="100" cy="100" r="60" fill="${secondaryColor}" fill-opacity="0.8" />`,
				// Diamond pattern
				`<defs><radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" /><stop offset="100%" style="stop-color:${tertiaryColor};stop-opacity:1" /></radialGradient></defs><polygon points="100,0 200,100 100,200 0,100" fill="url(#${gradientId})" />`,
			];
			return shapes[Math.floor(Math.random() * shapes.length)];
		} else {
			// Generate random shape here
			const centerX = 100;
			const centerY = 100;
			const radius = 75;
			const numPoints = 6; // Fixed number of points for consistency
			const points: { x: number; y: number }[] = [];

			for (let i = 0; i < numPoints; i++) {
				const angle = (i / numPoints) * Math.PI * 2;
				const variationAngle = angle + (Math.random() - 0.5) * 0.2; // Slight angle variation
				const variationRadius = radius * (0.8 + Math.random() * 0.4); // Radius variation
				const x = centerX + Math.cos(variationAngle) * variationRadius;
				const y = centerY + Math.sin(variationAngle) * variationRadius;
				points.push({ x, y });
			}

			let d = `M ${points[0].x} ${points[0].y}`;

			for (let i = 0; i < points.length; i++) {
				const current = points[i];
				const next = points[(i + 1) % points.length];
				const midX = (current.x + next.x) / 2;
				const midY = (current.y + next.y) / 2;

				// Calculate control points for a smoother curve
				const dx = next.x - current.x;
				const dy = next.y - current.y;
				const len = Math.sqrt(dx * dx + dy * dy);
				const normalX = -dy / len;
				const normalY = dx / len;
				const controlLen = len * 0.4;

				const controlX = midX + normalX * controlLen;
				const controlY = midY + normalY * controlLen;

				d += ` Q ${controlX} ${controlY}, ${next.x} ${next.y}`;
			}

			d += " Z"; // Close the path

			const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
			return `<defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" /><stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" /></linearGradient></defs><path d="M100 0 Q200 0 200 100 Q200 200 100 200 Q0 200 0 100 Q0 0 100 0 Z" fill="${tertiaryColor}" /><path d="${d}" fill="url(#${gradientId})" stroke="${tertiaryColor}" stroke-width="2" />`;
		}
	};

	const generateFontFamily = (): string => {
		const fonts = [
			"Arial",
			"Verdana",
			"Helvetica",
			"Georgia",
			"Palatino",
			"Garamond",
			"Bookman",
			"Candara",
			"Arial Black",
			"Impact",
		];
		return fonts[Math.floor(Math.random() * fonts.length)];
	};

	const generateLogo = (): void => {
		const name = companyName || generateDummyName();
		const shape = generateComplexShape();
		const textColor = generateContrastingColor(shapeColor);
		const fontFamily = generateFontFamily();

		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><path id="textPath" d="M0,100 H200" /></defs>${shape}<text dy="1" fill="${textColor}" font-family="${fontFamily}" font-size="${fontSize}"><textPath href="#textPath" startOffset="50%" text-anchor="middle">${name}</textPath></text></svg>`;

		setGeneratedSvg(svg);
	};

	useEffect(() => {
		if (svgRef.current && generatedSvg) {
			const svgElement = svgRef.current;
			const textElement = svgElement.querySelector("text");
			const shapeElement: SVGAElement | null =
				svgElement.querySelector("#logoShape");

			if (textElement && shapeElement) {
				const shapeBBox = shapeElement.getBBox();
				const textBBox = textElement.getBBox();

				// Center the text vertically
				const centerY = shapeBBox.y + shapeBBox.height / 2;
				textElement.setAttribute("y", centerY.toString());

				// Adjust text size if it's too wide
				if (textBBox.width > shapeBBox.width * 0.9) {
					const scale = (shapeBBox.width * 0.9) / textBBox.width;
					textElement.setAttribute(
						"font-size",
						`${parseFloat(textElement.getAttribute("font-size") || "24") * scale}`,
					);
				}
			}
		}
	}, [generatedSvg]);

	const updateFontSize = (newSize: number): void => {
		setFontSize(newSize);
		if (generatedSvg) {
			const updatedSvg = generatedSvg.replace(
				/font-size="[^"]*"/,
				`font-size="${newSize}"`,
			);
			setGeneratedSvg(updatedSvg);
		}
	};

	const downloadImage = useCallback(
		(format: "svg" | "png" | "jpg"): void => {
			if (format === "svg") {
				const blob = new Blob([generatedSvg], {
					type: "image/svg+xml",
				});
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = "generated_logo.svg";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
			} else {
				const svgBlob = new Blob([generatedSvg], {
					type: "image/svg+xml",
				});
				const url = URL.createObjectURL(svgBlob);
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement("canvas");
					canvas.width = img.width;
					canvas.height = img.height;
					const ctx = canvas.getContext("2d");
					if (ctx) {
						ctx.drawImage(img, 0, 0);
						canvas.toBlob(
							(blob) => {
								if (blob) {
									const url = URL.createObjectURL(blob);
									const link = document.createElement("a");
									link.href = url;
									link.download = `generated_logo.${format}`;
									document.body.appendChild(link);
									link.click();
									document.body.removeChild(link);
									URL.revokeObjectURL(url);
								}
							},
							`image/${format}`,
							format === "jpg" ? 0.92 : undefined,
						);
					}
					URL.revokeObjectURL(url);
				};
				img.src = url;
			}
		},
		[generatedSvg],
	);

	const copyToClipboard = (text: string): void => {
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
				<h2>Dummy Logo Generator</h2>
				<div style={{ display: "flex", gap: "1.2rem" }}>
					<div className="toolbar-button-lable-container">
						<label htmlFor="font-size">Font Size:</label>
						<input
							id="font-size"
							type="number"
							value={fontSize}
							onChange={(e) =>
								updateFontSize(Number(e.target.value))
							}
							min="1"
							max="100"
							step="1"
						/>
					</div>
					<div className="toolbar-button-container">
						<button onClick={generateLogo}>Generate</button>
					</div>
				</div>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						value={companyName}
						onChange={(e) => setCompanyName(e.target.value)}
						placeholder="Enter company name (optional)"
					/>
				</div>
				<div className="output-container">
					<div className="output-segment">
						<h3>Logo Preview</h3>
						{generatedSvg ? (
							<div
								className="logo-preview"
								dangerouslySetInnerHTML={{
									__html: generatedSvg,
								}}
							/>
						) : (
							<div className="faux-output">
								<div className="faux-placeholder">
									Logo will appear here
								</div>
							</div>
						)}
						<div className="button-container">
							<button
								onClick={() => downloadImage("svg")}
								disabled={!generatedSvg}
							>
								Download SVG
							</button>
							<button
								onClick={() => downloadImage("png")}
								disabled={!generatedSvg}
							>
								Download PNG
							</button>
							<button
								onClick={() => downloadImage("jpg")}
								disabled={!generatedSvg}
							>
								Download JPG
							</button>
						</div>
					</div>
					<div className="output-segment">
						<h3>SVG Code</h3>
						<textarea
							spellCheck={false}
							value={generatedSvg}
							readOnly
							placeholder="Generated SVG code will appear here"
						/>
						<button
							onClick={() => copyToClipboard(generatedSvg)}
							disabled={!generatedSvg}
						>
							Copy SVG
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

export default LogoGenerator;
