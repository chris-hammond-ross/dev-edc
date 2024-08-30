import React, { useState, useEffect } from "react";
import { Modal, ModalProps } from "../../utils";
import "./URLDecoder.css";

const URLDecoder: React.FC = () => {
	const [inputText, setInputText] = useState<string>("");
	const [outputText, setOutputText] = useState<string>("");
	const [isEncoding, setIsEncoding] = useState<boolean>(false);
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");

	useEffect(() => {
		processURL(inputText);
	}, [inputText, isEncoding]);

	const processURL = (text: string): void => {
		if (isEncoding) {
			try {
				const encoded = encodeURIComponent(text);
				setOutputText(encoded);
			} catch (error) {
				setOutputText("Invalid input for encoding");
			}
		} else {
			try {
				const decoded = decodeURIComponent(text.replace(/\+/g, " "));
				setOutputText(decoded);
			} catch (error) {
				setOutputText("Invalid URL encoding");
			}
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		setInputText(e.target.value);
	};

	const showExample = (): void => {
		if (isEncoding) {
			setInputText(
				"https://example.com/path?name=John Doe&age=30&city=New York",
			);
		} else {
			setInputText(
				"https://example.com/path?name=John%20Doe&age=30&city=New%20York",
			);
		}
	};

	const toggleMode = (): void => {
		setIsEncoding(!isEncoding);
		setInputText("");
		setOutputText("");
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
				<h2>URL Encoder/Decoder</h2>
				<div className="toolbar-button-container">
					<button onClick={toggleMode}>
						Switch to {isEncoding ? "Decoding" : "Encoding"}
					</button>
					<button onClick={showExample}>Example</button>
				</div>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						value={inputText}
						onChange={handleInputChange}
						placeholder={`Enter ${isEncoding ? "URL to encode" : "encoded URL"}`}
					/>
					<div className="button-container">
						<button onClick={() => setInputText("")}>Clear</button>
					</div>
				</div>
				<div className="output-container">
					<textarea
						spellCheck={false}
						value={outputText}
						readOnly
						placeholder={`${isEncoding ? "Encoded" : "Decoded"} URL will appear here`}
					/>
					<button
						onClick={() => copyToClipboard(outputText)}
						disabled={!outputText}
					>
						Copy
					</button>
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

export default URLDecoder;
