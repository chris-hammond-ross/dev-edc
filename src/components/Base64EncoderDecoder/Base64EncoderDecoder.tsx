import React, { useState, useRef } from "react";
import { Modal, ModalProps } from "../../utils";
import "./Base64EncoderDecoder.css";

const Base64EncoderDecoder: React.FC = () => {
	const [input, setInput] = useState<string>("");
	const [output, setOutput] = useState<string>("");
	const [mode, setMode] = useState<"encode" | "decode">("encode");
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const outputRef = useRef<HTMLTextAreaElement>(null);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		setInput(e.target.value);
		updateOutput(e.target.value);
	};

	const updateOutput = (newInput: string): void => {
		if (mode === "encode") {
			setOutput(btoa(newInput));
		} else {
			try {
				setOutput(atob(newInput));
			} catch (error) {
				setOutput("Invalid Base64 input");
			}
		}
	};

	const toggleMode = (): void => {
		const newMode = mode === "encode" ? "decode" : "encode";
		setMode(newMode);
		updateOutput(input);
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
				<h2>Base64 {mode === "encode" ? "Encoder" : "Decoder"}</h2>
				<div className="toolbar-button-container">
					<button className="mode-toggle" onClick={toggleMode}>
						Switch to {mode === "encode" ? "Decode" : "Encode"}
					</button>
				</div>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						ref={inputRef}
						value={input}
						onChange={handleInputChange}
						placeholder={
							mode === "encode"
								? "Enter text to encode"
								: "Enter Base64 to decode"
						}
					/>
					<div className="button-container">
						<button onClick={() => copyToClipboard(input)}>
							Copy Input
						</button>
					</div>
				</div>
				<div className="output-container">
					<textarea
						spellCheck={false}
						ref={outputRef}
						value={output}
						readOnly
						placeholder="Output will appear here"
					/>
					<div className="button-container">
						<button onClick={() => copyToClipboard(output)}>
							Copy Output
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

export default Base64EncoderDecoder;
