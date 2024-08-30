import React, { useState, useEffect } from "react";
import { Modal, ModalProps } from "../../utils";
import "./UUIDGenerator.css";

const UUIDGenerator: React.FC = () => {
	const [uuids, setUuids] = useState<string[]>([]);
	const [count, setCount] = useState<number>(10);
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");

	const generateUUID = (): string => {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
			/[xy]/g,
			function (c: string) {
				const r = (Math.random() * 16) | 0;
				const v = c === "x" ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			},
		);
	};

	const handleGenerate = (): void => {
		const newUuids = Array(count)
			.fill(null)
			.map(() => generateUUID());
		setUuids(newUuids);
	};

	const handleCountChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	): void => {
		const newCount = parseInt(e.target.value, 10);
		setCount(isNaN(newCount) ? 1 : Math.max(1, newCount));
	};

	const copyToClipboard = (): void => {
		const text = uuids.join("\n");
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

	useEffect(() => {
		handleGenerate();
	}, [count]);

	return (
		<>
			<div className="toolbar">
				<h2>UUID Generator</h2>
				<div className="toolbar-button-container">
					<div className="toolbar-button-lable-container">
						<label htmlFor="uuid-count">Number of UUIDs:</label>
						<input
							id="uuid-count"
							type="number"
							min="1"
							value={count}
							onChange={handleCountChange}
						/>
					</div>
				</div>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						value={uuids.join("\n")}
						readOnly
						placeholder="Output will appear here"
					/>
					<button onClick={copyToClipboard}>Copy</button>
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

export default UUIDGenerator;
