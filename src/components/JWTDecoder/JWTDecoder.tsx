import React, { useState, useRef } from "react";
import { Modal, ModalProps } from "../../utils";
import "./JWTDecoder.css";

interface DecodedJWT {
	header: string;
	payload: string;
	signature: string;
}

const JWTDecoder: React.FC = () => {
	const [input, setInput] = useState<string>("");
	const [{ header, payload, signature }, setDecodedJWT] =
		useState<DecodedJWT>({
			header: "",
			payload: "",
			signature: "",
		});
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertTheme, setAlertTheme] =
		useState<ModalProps["theme"]>("default");
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const exmapleJWT =
		"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJFeGFtcGxlIEpXVCIsImlhdCI6MTcyMTAzOTEyOCwiZXhwIjoxNzUyNTc1MTI4LCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJlbWFpbEBlbWFpbC5jb20iLCJHaXZlbk5hbWUiOiJKb2huIiwiU3VybmFtZSI6IkRvZSIsIkVtYWlsIjoiZW1haWxAZW1haWwuY29tIiwiUm9sZSI6IkNFTyJ9.lMBmYMSCZJXccskG0DQ7BmMuHmHbSk2ZZAI4IBxtPn0";

	const decodeJWT = (token: string): void => {
		try {
			const parts = token.split(".");
			if (parts.length !== 3) {
				throw new Error("Invalid JWT format");
			}

			const decodedHeader = JSON.parse(atob(parts[0]));
			const decodedPayload = JSON.parse(atob(parts[1]));

			setDecodedJWT({
				header: JSON.stringify(decodedHeader, null, 2),
				payload: JSON.stringify(decodedPayload, null, 2),
				signature: parts[2],
			});
		} catch (error: unknown) {
			setDecodedJWT({ header: "", payload: "", signature: "" });
			if (error instanceof Error) {
				setAlertMessage(`Error decoding JWT: ${error.message}`);
			} else {
				setAlertMessage("An unknown error occurred");
			}
			setAlertTheme("error");
			setIsAlertModalOpen(true);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	): void => {
		const newInput = e.target.value;
		if (!newInput) {
			setInput("");
			decodeJWT("");
		} else {
			setInput(newInput);
			decodeJWT(newInput);
		}
	};

	const loadExample = (): void => {
		setInput(exmapleJWT);
		decodeJWT(exmapleJWT);
	};

	const syntaxHighlight = (json: string): string => {
		if (!json) return "";
		json = json
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		return json
			.replace(
				/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
				function (match) {
					let cls = "json-number";
					if (/^"/.test(match)) {
						if (/:$/.test(match)) {
							cls = "json-key";
						} else {
							cls = "json-string";
						}
					} else if (/true|false/.test(match)) {
						cls = "json-boolean";
					} else if (/null/.test(match)) {
						cls = "json-null";
					}
					return '<span class="' + cls + '">' + match + "</span>";
				},
			)
			.replace(
				/\{|\}|\[|\]/g,
				(match) => `<span class="json-bracket">${match}</span>`,
			);
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
				<h2>JWT Decoder</h2>
				<div className="toolbar-button-container">
					<button onClick={() => loadExample()}>Example</button>
				</div>
			</div>
			<div className="component-container">
				<div className="input-container">
					<textarea
						spellCheck={false}
						ref={inputRef}
						value={input}
						onChange={handleInputChange}
						placeholder="Enter JWT token"
					/>
					<div className="button-container">
						<button onClick={() => copyToClipboard(input)}>
							Copy JWT
						</button>
					</div>
				</div>
				<div className="output-container jwt-output-container">
					<div className="output-segment">
						<h3>Header</h3>
						{input ? (
							<pre
								dangerouslySetInnerHTML={{
									__html: syntaxHighlight(header),
								}}
							/>
						) : (
							<div className="faux-output">
								<div className="faux-placeholder">
									Header will appear here
								</div>
							</div>
						)}
						<div className="button-container">
							<button onClick={() => copyToClipboard(header)}>
								Copy Header
							</button>
						</div>
					</div>
					<div className="output-segment">
						<h3>Payload</h3>
						{input ? (
							<pre
								dangerouslySetInnerHTML={{
									__html: syntaxHighlight(payload),
								}}
							/>
						) : (
							<div className="faux-output">
								<div className="faux-placeholder">
									Payload will appear here
								</div>
							</div>
						)}
						<div className="button-container">
							<button onClick={() => copyToClipboard(payload)}>
								Copy Payload
							</button>
						</div>
					</div>
					<div className="output-segment">
						<h3>Signature</h3>
						<textarea
							spellCheck={false}
							value={signature}
							readOnly
							placeholder="Signature will appear here"
						/>
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

export default JWTDecoder;
