import React, { useState, useEffect } from "react";
import { Modal, ModalProps } from "../../utils";
import "./HtmlEntityConverter.css";

const HtmlEntityConverter: React.FC = () => {
	const [inputText, setInputText] = useState<string>("");
	const [encodedText, setEncodedText] = useState<string>("");
	const [decodedText, setDecodedText] = useState<string>("");
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");

	useEffect(() => {
		encodeAndDecodeText(inputText);
	}, [inputText]);

	const encodeAndDecodeText = (text: string): void => {
		// Encoding
		const encoded = text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");

		setEncodedText(encoded);

		// Decoding
		const decoded = text
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#039;/g, "'")
			.replace(/&#39;/g, "'");

		setDecodedText(decoded);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		setInputText(e.target.value);
	};

	const formatInput = (): void => {
		if (inputText) {
			const noExcessWhitespace = inputText
				.split("\n")
				.map((line) => line.replace(/\s+/g, " ").trim())
				.join("\n")
				.trim();

			setInputText(noExcessWhitespace);
		}
	};

	const showExample = (): void => {
		const htmlExampleString = `<!DOCTYPE html>
<html>
<body>

<h1>Hello World</h1>
<p>This is a paragraph</p>
<div class="example-class">This is an element with a class</div>

</body>
</html>
		`;
		setInputText(htmlExampleString);
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
				<h2>HTML Entity Encoder/Decoder</h2>
				<div className="toolbar-button-container">
					<button onClick={() => showExample()}>Example</button>
				</div>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						value={inputText}
						onChange={handleInputChange}
						placeholder="Enter your text"
					/>
					<div className="button-container">
						<button onClick={() => formatInput()}>
							Format Input
						</button>
						<button onClick={() => setInputText("")}>Clear</button>
					</div>
				</div>
				<div className="output-container">
					<div className="output-segment">
						<h3>Encoded HTML Entities</h3>
						<textarea
							spellCheck={false}
							value={encodedText}
							readOnly
							placeholder="Encoded text will appear here"
						/>
						<button
							onClick={() => copyToClipboard(encodedText)}
							disabled={!encodedText}
						>
							Copy
						</button>
					</div>
					<div className="output-segment">
						<h3>Decoded Text</h3>
						<textarea
							spellCheck={false}
							value={decodedText}
							readOnly
							placeholder="Decoded text will appear here"
						/>
						<button
							onClick={() => copyToClipboard(decodedText)}
							disabled={!decodedText}
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

export default HtmlEntityConverter;
