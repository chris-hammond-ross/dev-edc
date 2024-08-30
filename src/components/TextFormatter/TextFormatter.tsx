import React, { useState, useEffect } from "react";
import { Modal, ModalProps } from "../../utils";
import "./TextFormatter.css";

interface FormattedTextType {
	noExcessWhitespace: string;
	noLineBreaks: string;
}

const TextFormatter: React.FC = () => {
	const [inputText, setInputText] = useState<string>("");
	const [formattedTexts, setFormattedTexts] = useState<FormattedTextType>({
		noExcessWhitespace: "",
		noLineBreaks: "",
	});
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");

	useEffect(() => {
		formatText(inputText);
	}, [inputText]);

	const formatText = (text: string): void => {
		// Remove excess whitespace while keeping line breaks
		const noExcessWhitespace = text
			.split("\n")
			.map((line) => line.replace(/\s+/g, " ").trim())
			.join("\n")
			.trim();

		// Remove all line breaks
		const noLineBreaks = text
			.replace(/[\r\n]+/g, " ")
			.replace(/\s+/g, " ")
			.trim();

		setFormattedTexts({
			noExcessWhitespace,
			noLineBreaks,
		});
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		setInputText(e.target.value);
	};

	const clearInput = (): void => {
		setInputText("");
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
				<h2>Text Formatter</h2>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						value={inputText}
						onChange={handleInputChange}
						placeholder="Enter your text"
					/>
					<button onClick={() => clearInput()}>Clear</button>
				</div>
				<div className="output-container">
					<div className="output-segment">
						<h3>No Excess Whitespace</h3>
						<textarea
							spellCheck={false}
							value={formattedTexts.noExcessWhitespace}
							readOnly
							placeholder="Formatted text will appear here"
						/>
						<button
							onClick={() =>
								copyToClipboard(
									formattedTexts.noExcessWhitespace,
								)
							}
							disabled={!formattedTexts.noExcessWhitespace}
						>
							Copy
						</button>
					</div>
					<div className="output-segment">
						<h3>No Line Breaks</h3>
						<textarea
							spellCheck={false}
							value={formattedTexts.noLineBreaks}
							readOnly
							placeholder="Formatted text will appear here"
						/>
						<button
							onClick={() =>
								copyToClipboard(formattedTexts.noLineBreaks)
							}
							disabled={!formattedTexts.noLineBreaks}
						>
							Copy
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

export default TextFormatter;
