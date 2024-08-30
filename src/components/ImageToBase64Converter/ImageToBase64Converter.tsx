import React, { useState, useRef } from "react";
import { Modal, ModalProps } from "../../utils";
import "./ImageToBase64Converter.css";

interface DimensionTypes {
	width: number;
	height: number;
}

const ImageToBase64Converter: React.FC = () => {
	const [base64String, setBase64String] = useState<string>("");
	const [fileName, setFileName] = useState<string>("");
	const [imagePreview, setImagePreview] = useState<string>("");
	const [fileSize, setFileSize] = useState<number>(0);
	const [imageDimensions, setImageDimensions] = useState<DimensionTypes>({
		width: 0,
		height: 0,
	});
	const [error, setError] = useState<string>("");
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const allowedTypes = [
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
		"image/svg+xml",
		"image/bmp",
	];
	const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

	const handleFileChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const file = event.target.files![0];
		if (file) {
			processFile(file);
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLInputElement>): void => {
		event.preventDefault();
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file) {
			processFile(file);
		}
	};

	const processFile = (file: File): void => {
		setError("");
		if (!allowedTypes.includes(file.type)) {
			setError(
				"Unsupported file type - Please use JPG, PNG, GIF, WebP, SVG, or BMP",
			);
			return;
		}
		if (file.size > maxFileSize) {
			setError("File is too large - Maximum size is 5MB");
			return;
		}
		setFileName(file.name);
		setFileSize(file.size);
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			const result = e.target?.result;
			if (typeof result === "string") {
				setBase64String(result);
				setImagePreview(result);
				getImageDimensions(result);
			} else {
				setError("Failed to read file as base64 string");
			}
		};
		reader.readAsDataURL(file);
	};

	const getImageDimensions = (dataUrl: string): void => {
		const img = new Image();
		img.onload = () => {
			setImageDimensions({ width: img.width, height: img.height });
		};
		img.src = dataUrl;
	};

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
				<h2>Image to Base64 Converter</h2>
			</div>
			<div className="component-container">
				<div className="drop-zone-container">
					<div
						className="drop-zone"
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onClick={() => fileInputRef.current!.click()}
					>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							accept="image/*"
							style={{ display: "none" }}
						/>
						{imagePreview ? (
							<img
								src={imagePreview}
								alt="Preview"
								className="image-preview"
							/>
						) : (
							<div className="drop-zone-input-text-container">
								<h3>Click or drag image here</h3>
								{/*<svg
									className="image-icon"
									viewBox="0 0 24 24"
									width="48"
									height="48"
								>
									<path
										fill="currentColor"
										d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
									/>
								</svg>*/}
								{error && (
									<p className="error-message">{error}</p>
								)}
							</div>
						)}
					</div>
				</div>
				<div className="output-container">
					<div className="output-segment image-to-base-info-section">
						<h3>Image Information</h3>
						{fileName && (
							<div className="info-section-content">
								<span className="info-section-label">
									File:{" "}
									<span className="info-section-value">
										{fileName}
									</span>
								</span>
								<span className="info-section-label">
									File Size:{" "}
									<span className="info-section-value">
										{(fileSize / 1024).toFixed(2)} KB
									</span>
								</span>
								<span className="info-section-label">
									Encoded Size:{" "}
									<span className="info-section-value">
										{" "}
										{(
											(base64String.length * 0.75) /
											1024
										).toFixed(2)}{" "}
										KB
									</span>
								</span>
								<span className="info-section-label">
									Dimensions:{" "}
									<span className="info-section-value">
										{imageDimensions.width} x{" "}
										{imageDimensions.height}
									</span>
								</span>
							</div>
						)}
						{!fileName && (
							<div className="info-section-content">
								<span className="info-section-placeholder">
									File:
								</span>
								<span className="info-section-placeholder">
									File Size:
								</span>
								<span className="info-section-placeholder">
									Encoded Size:
								</span>
								<span className="info-section-placeholder">
									Dimensions:
								</span>
							</div>
						)}
					</div>
					<div className="output-segment">
						<h3>HTML Image Element</h3>
						<textarea
							spellCheck={false}
							value={
								base64String
									? `<img src="${base64String}" alt="Base64 Image">`
									: ""
							}
							readOnly
							placeholder="HTML image element will appear here"
						/>
						<button
							onClick={() =>
								copyToClipboard(
									`<img src="${base64String}" alt="Base64 Image">`,
								)
							}
							disabled={!base64String}
						>
							Copy HTML
						</button>
					</div>
					<div className="output-segment">
						<h3>CSS Background Image</h3>
						<textarea
							value={
								base64String
									? `background-image: url(${base64String});`
									: ""
							}
							readOnly
							placeholder="CSS background-image will appear here"
						/>
						<button
							onClick={() =>
								copyToClipboard(
									`background-image: url(${base64String});`,
								)
							}
							disabled={!base64String}
						>
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

export default ImageToBase64Converter;
